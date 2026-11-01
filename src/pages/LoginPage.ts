import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators defined cleanly within the page object
    private usernameInput = () => this.healing.locator('#invalid-username-input', 'input[name="username"]');
    private passwordInput = () => this.healing.locator('#invalid-password-input', 'input[name="password"]');
    private loginButton = () => this.healing.locator('#broken-login-btn', 'input.button[value="Log In"]');

    async navigateToLogin() {
        await this.page.goto('http://127.0.0.1:8081/parabank/index.htm');
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