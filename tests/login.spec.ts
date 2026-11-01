// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test.describe('ParaBank Login Self-Healing Tests', () => {
  
  test('testSelfHealingTriggerOnBrokenSelector', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('john', 'demo');

    // Use a precise locator to avoid matching the error banner h1
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
  });

});