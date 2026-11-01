import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private usernameInput = () => this.healing.locator('#invalid-username-input');
  private passwordInput = () => this.healing.locator('#invalid-password-input');
  private loginButton = () => this.healing.locator('#broken-login-btn');

  async navigateToLogin() {
    // Ensure the full absolute URL is used so it doesn't hang
    await this.page.goto('https://parabank.parasoft.com/parabank/index.htm', { 
      waitUntil: 'domcontentloaded' 
    });
  }

  async login(user: string, pass: string) {
    const usernameField = await this.usernameInput();
    await usernameField.fill(user);

    const passwordField = await this.passwordInput();
    await passwordField.fill(pass);

    const btn = await this.loginButton();
    await btn.click();
  }
}