import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class AccountSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly hdgSuccess: Locator;
    private readonly lnkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.hdgSuccess = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
        this.lnkContinue = page.getByRole('link', { name: 'Continue', exact: true });
    }

    /**
     * Clicks the Continue link to navigate to the My Account page
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async clickContinue(): Promise<MyAccountPage> {
        await this.lnkContinue.click();
        return new MyAccountPage(this.page);
    }

    /**
     * Verifies the account-created success message is displayed
     * @returns Promise<boolean> - true if the success heading is visible
     */
    async isAccountCreatedMessageExists(): Promise<boolean> {
        try {
            return await this.hdgSuccess.isVisible();
        } catch (error) {
            console.log(`Error checking success message: ${error}`);
            return false;
        }
    }
}
