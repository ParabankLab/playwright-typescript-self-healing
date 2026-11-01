import process from 'node:process';
import { Page, Locator } from '@playwright/test';
import * as allure from 'allure-js-commons';

export class SelfHealingWrapper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async locator(primarySelector: string, timeout = 3000): Promise<Locator> {
    const primaryLoc = this.page.locator(primarySelector);

    try {
      await primaryLoc.waitFor({ state: 'attached', timeout });
      return primaryLoc;
    } catch (error) {
      console.warn(`\x1b[33m[Self-Healing] Primary locator '${primarySelector}' failed. Crawling live DOM...\x1b[0m`);

      // 1. Crawl the live DOM dynamically and generate the correct selector on the fly
      const discoveryResult = await this.discoverAndGenerateSelector(primarySelector);

      if (discoveryResult) {
        const { locator: healedLoc, healedSelector } = discoveryResult;
        
        const warningMessage = 
          `⚠️ [Self-Healing Warning] Faulty locator '${primarySelector}' was dynamically replaced with '${healedSelector}' (Live DOM Crawl)`;
        
        console.warn(`\x1b[33m${warningMessage}\x1b[0m`);

        allure.attachment("Self-Healing Metadata", warningMessage, "text/plain");

        if (process.env.CI) {
          throw new Error(
            `🚨 [Self-Healing Governance Failure] Test passed via live DOM discovery, but failed governance rules.\n` +
            `  • Failed Locator (Broken): ${primarySelector}\n` +
            `  • Correct Locator (Healed): ${healedSelector}`
          );
        }

        return healedLoc;
      }

      throw new Error(`Primary locator ('${primarySelector}') failed and no matching element could be discovered in the DOM.`);
    }
  }

  /**
   * Crawls the live browser DOM, matches semantic intent, and builds the healed selector programmatically.
   */
  private async discoverAndGenerateSelector(failedSelector: string): Promise<{ locator: Locator; healedSelector: string } | null> {
    const cleanSelector = failedSelector.replace(/[#.\-_]/g, ' ').toLowerCase();
    const words = cleanSelector.split(/\s+/).filter(Boolean);
    
    const noiseWords = new Set(['invalid', 'broken', 'input', 'btn', 'button', 'field', 'txt', 'element']);
    const meaningfulWords = words.filter(w => !noiseWords.has(w));
    
    const keyword = meaningfulWords[meaningfulWords.length - 1] || words[0];

    if (!keyword) return null;

    console.log(`\x1b[36m[Self-Healing Engine] Extracted keyword '${keyword}'. Inspecting live DOM elements...\x1b[0m`);

    // Execute script inside the browser context with normalized string matching and submit button awareness
    const matchedElementData = await this.page.evaluate((kw) => {
      const elements = Array.from(document.querySelectorAll('input, button, textarea, select'));
      const normalizedKw = kw.replace(/[\s\-_]/g, '').toLowerCase();

      for (const el of elements) {
        const id = el.getAttribute('id') || '';
        const name = el.getAttribute('name') || '';
        const placeholder = el.getAttribute('placeholder') || '';
        const value = el.getAttribute('value') || '';
        const ariaLabel = el.getAttribute('aria-label') || '';
        const type = el.getAttribute('type') || '';
        const tag = el.tagName.toLowerCase();

        // Normalize attributes by stripping spaces/hyphens for robust matching (e.g. "Log In" matches "login")
        const attributesToTest = [id, name, placeholder, value, ariaLabel, type];
        const matches = attributesToTest.some(attr => {
          const normalizedAttr = attr.replace(/[\s\-_]/g, '').toLowerCase();
          return normalizedAttr.includes(normalizedKw);
        });

        // Heuristic fallback for action buttons if the keyword implies login/submit
        const isSubmitButton = type === 'submit' || tag === 'button' || el.classList.contains('button');
        const isLoginKeyword = ['login', 'signin', 'submit', 'log'].includes(normalizedKw);

        const isVisible = (el as HTMLElement).offsetParent !== null;

        if ((matches || (isLoginKeyword && isSubmitButton)) && isVisible) {
          let selector = tag;
          if (name) selector += `[name="${name}"]`;
          else if (type === 'submit') selector += `[type="submit"]`;
          else if (value) selector += `[value="${value}"]`;
          else if (id) selector += `#${id}`;
          else if (el.className) selector += `.${el.className.trim().split(/\s+/)[0]}`;

          return { selector };
        }
      }
      return null;
    }, keyword);

    if (!matchedElementData || !matchedElementData.selector) {
      return null;
    }

    const healedSelector = matchedElementData.selector;
    const healedLoc = this.page.locator(healedSelector);

    return {
      locator: healedLoc,
      healedSelector
    };
  }
}