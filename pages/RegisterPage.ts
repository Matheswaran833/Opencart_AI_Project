import { Page, Locator } from '@playwright/test';
import { AccountSuccessPage } from './AccountSuccessPage';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtConfirmPassword: Locator;
    private readonly chkAgree: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtConfirmPassword = page.locator('#input-confirm');
        this.chkAgree = page.locator('input[name="agree"]');
        this.btnContinue = page.getByRole('button', { name: 'Continue', exact: true });
    }

    /**
     * Fills the First Name field
     * @param firstName - First name value to enter
     */
    async setFirstName(firstName: string): Promise<void> {
        await this.txtFirstName.fill(firstName);
    }

    /**
     * Fills the Last Name field
     * @param lastName - Last name value to enter
     */
    async setLastName(lastName: string): Promise<void> {
        await this.txtLastName.fill(lastName);
    }

    /**
     * Fills the E-Mail field
     * @param email - Email value to enter
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Fills the Telephone field
     * @param telephone - Telephone value to enter
     */
    async setTelephone(telephone: string): Promise<void> {
        await this.txtTelephone.fill(telephone);
    }

    /**
     * Fills the Password field
     * @param password - Password value to enter
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Fills the Password Confirm field
     * @param confirmPassword - Confirmation password value to enter
     */
    async setConfirmPassword(confirmPassword: string): Promise<void> {
        await this.txtConfirmPassword.fill(confirmPassword);
    }

    /**
     * Checks the Privacy Policy agreement checkbox
     */
    async checkPrivacyPolicy(): Promise<void> {
        await this.chkAgree.check();
    }

    /**
     * Submits the registration form
     * @returns Promise<AccountSuccessPage> - Instance of the account success page
     */
    async clickContinue(): Promise<AccountSuccessPage> {
        await this.btnContinue.click();
        return new AccountSuccessPage(this.page);
    }

    /**
     * Completes the full customer registration form with the provided user data
     * @param userData - Object containing first name, last name, email, telephone, and password
     */
    async completeRegistration(userData: {
        firstName: string;
        lastName: string;
        email: string;
        telephone: string;
        password: string;
    }): Promise<AccountSuccessPage> {
        try {
            await this.setFirstName(userData.firstName);
            await this.setLastName(userData.lastName);
            await this.setEmail(userData.email);
            await this.setTelephone(userData.telephone);
            await this.setPassword(userData.password);
            await this.setConfirmPassword(userData.password);
            await this.checkPrivacyPolicy();
            return await this.clickContinue();
        } catch (error) {
            console.log(`Error completing registration: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the registration page is displayed
     * @returns Promise<boolean> - true if the First Name field is visible
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            return await this.txtFirstName.isVisible();
        } catch (error) {
            console.log(`Error checking registration page: ${error}`);
            return false;
        }
    }
}
