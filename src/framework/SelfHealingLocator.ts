import process from 'node:process';
import { Page, Locator } from '@playwright/test';
import * as allure from 'allure-js-commons';

export class SelfHealingWrapper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Attempts to locate an element using a primary selector. If it fails or times out,
   * it falls back to the healed selector, logs it, and enforces CI governance if enabled.
   */
  async locator(primarySelector: string, healedSelector: string, timeout = 3000): Promise<Locator> {
    const primaryLoc = this.page.locator(primarySelector);

    try {
      // Quick check if primary locator is visible/attached within the timeout window
      await primaryLoc.waitFor({ state: 'attached', timeout });
      return primaryLoc;
    } catch (error) {
      console.warn(`\x1b[33m[Self-Healing] Primary locator '${primarySelector}' failed. Attempting fallback...\x1b[0m`);

      const healedLoc = this.page.locator(healedSelector);
      
      try {
        await healedLoc.waitFor({ state: 'attached', timeout: 2000 });
        
        const warningMessage = `⚠️ [Self-Healing Warning] Faulty locator '${primarySelector}' was successfully replaced with '${healedSelector}' (<200ms DOM Resolution)`;
        console.warn(`\x1b[33m${warningMessage}\x1b[0m`);

        // Attach details to Allure report
        allure.attachment("Self-Healing Metadata", warningMessage, "text/plain");

        // Enforce Strict Governance in CI
        if (process.env.CI === 'true') {
          const governanceError = 
            `🚨 [Self-Healing Governance Failure] Test passed functionally via fallback, but failed governance rules.\n` +
            `  • Failed Locator (Broken): ${primarySelector}\n` +
            `  • Correct Locator (Healed): ${healedSelector}`;
          
          throw new Error(governanceError);
        }

        return healedLoc;
      } catch (healingError) {
        throw new Error(`Both primary locator ('${primarySelector}') and healed locator ('${healedSelector}') failed to resolve.`);
      }
    }
  }
}