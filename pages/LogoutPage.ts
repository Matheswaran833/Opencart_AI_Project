import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly hdgLogout: Locator;
    private readonly lnkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.hdgLogout = page.getByRole('heading', { name: 'Account Logout' });
        this.lnkContinue = page.getByRole('link', { name: 'Continue', exact: true });
    }

    /**
     * Clicks the Continue link to return to the home page
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickContinue(): Promise<HomePage> {
        await this.lnkContinue.click();
        await this.page.waitForURL('**/index.php?route=common/home');
        return new HomePage(this.page);
    }

    /**
     * Verifies the logout confirmation page is displayed
     * @returns Promise<boolean> - true if the Account Logout heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            return await this.hdgLogout.isVisible();
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }
}
