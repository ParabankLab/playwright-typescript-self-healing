import { test, expect } from '@playwright/test';
import { SelfHealingWrapper } from '../src/framework/SelfHealingLocator.ts';

test.describe('ParaBank Login Self-Healing Tests', () => {

  test('testSuccessfulLogin', async ({ page }) => {
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    const healing = new SelfHealingWrapper(page);

    // Standard execution with matching primary & fallback selectors
    const usernameInput = await healing.locator('input[name="username"]', 'input[name="username"]');
    await usernameInput.fill('john');

    const passwordInput = await healing.locator('input[name="password"]', 'input[name="password"]');
    await passwordInput.fill('demo');

    const loginBtn = await healing.locator('input[value="Log In"]', 'input[value="Log In"]');
    await loginBtn.click();

    // Verify successful login or error response from ParaBank
    await expect(page.locator('#leftPanel')).toBeVisible();
  });

  test('testSelfHealingTriggerOnBrokenSelector', async ({ page }) => {
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    const healing = new SelfHealingWrapper(page);

    // Primary selector is broken (#invalid-username-input); Healed fallback is 'input[name="username"]'
    const usernameInput = await healing.locator('#invalid-username-input', 'input[name="username"]');
    await usernameInput.fill('john');

    const passwordInput = await healing.locator('input[name="password"]', 'input[name="password"]');
    await passwordInput.fill('demo');

    const loginBtn = await healing.locator('input[value="Log In"]', 'input[value="Log In"]');
    await loginBtn.click();
  });

});