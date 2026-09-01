import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly hdgReturningCustomer: Locator;
    private readonly alertWarning: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtEmail = page.locator('#input-email');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.getByRole('button', { name: 'Login' });
        this.hdgReturningCustomer = page.getByRole('heading', { name: 'Returning Customer' });
        this.alertWarning = page.locator('.alert-danger');
    }

    /**
     * Fills the E-Mail Address field
     * @param email - Email value to enter
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Fills the E-Mail Address field only when the value is not blank
     * @param email - Email value to enter; blank/whitespace values leave the field empty
     */
    async setEmailIfNotBlank(email: string): Promise<void> {
        if (email && email.trim() !== '') {
            await this.txtEmail.fill(email);
        }
    }

    /**
     * Fills the Password field
     * @param password - Password value to enter
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Fills the Password field only when the value is not blank
     * @param password - Password value to enter; blank/whitespace values leave the field empty
     */
    async setPasswordIfNotBlank(password: string): Promise<void> {
        if (password && password.trim() !== '') {
            await this.txtPassword.fill(password);
        }
    }

    /**
     * Submits the login form
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async clickLogin(): Promise<MyAccountPage> {
        await this.btnLogin.click();
        await this.page.waitForURL('**/index.php?route=account/account');
        return new MyAccountPage(this.page);
    }

    /**
     * Logs in with the provided credentials
     * @param email - Customer email
     * @param password - Customer password
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async login(email: string, password: string): Promise<MyAccountPage> {
        try {
            await this.setEmail(email);
            await this.setPassword(password);
            return await this.clickLogin();
        } catch (error) {
            console.log(`Error logging in: ${error}`);
            throw error;
        }
    }

    /**
     * Submits the login form with invalid credentials
     * @returns Promise<void> - the page stays on the login page with a warning
     */
    async submitInvalidLogin(): Promise<void> {
        await this.btnLogin.click();
    }

    /**
     * Logs in with the provided credentials, leaving blank/whitespace fields empty,
     * and does not wait for a successful redirect.
     * @param email - Customer email; blank/whitespace values leave the field empty
     * @param password - Customer password; blank/whitespace values leave the field empty
     */
    async submitLoginAllowBlank(email: string, password: string): Promise<void> {
        try {
            await this.setEmailIfNotBlank(email);
            await this.setPasswordIfNotBlank(password);
            await this.btnLogin.click();
        } catch (error) {
            console.log(`Error submitting login: ${error}`);
            throw error;
        }
    }

    /**
     * Logs in with invalid credentials and verifies authentication is rejected
     * @param email - Invalid customer email
     * @param password - Invalid customer password
     * @returns Promise<boolean> - true if the warning alert is displayed
     */
    async loginWithInvalidCredentials(email: string, password: string): Promise<boolean> {
        try {
            await this.setEmail(email);
            await this.setPassword(password);
            await this.submitInvalidLogin();
            return await this.isWarningDisplayed();
        } catch (error) {
            console.log(`Error logging in with invalid credentials: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the login warning alert is displayed
     * @returns Promise<boolean> - true if the warning alert is visible
     */
    async isWarningDisplayed(): Promise<boolean> {
        try {
            return await this.alertWarning.isVisible();
        } catch (error) {
            console.log(`Error checking login warning: ${error}`);
            return false;
        }
    }

    /**
     * Returns the text of the login warning alert
     * @returns Promise<string> - the warning message text
     */
    async getWarningMessage(): Promise<string> {
        return (await this.alertWarning.textContent()) || '';
    }

    /**
     * Verifies the login page is displayed
     * @returns Promise<boolean> - true if the Returning Customer heading is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.hdgReturningCustomer.isVisible();
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }
}
