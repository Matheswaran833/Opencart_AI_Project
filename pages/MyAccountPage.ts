import { Page, Locator } from '@playwright/test';
import { LogoutPage } from './LogoutPage';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly hdgMyAccount: Locator;
    private readonly lnkLogout: Locator;
    private readonly lnkEditAccount: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.hdgMyAccount = page.getByRole('heading', { name: 'My Account', level: 2 });
        this.lnkLogout = page.locator('#column-right .list-group').getByRole('link', { name: 'Logout' });
        this.lnkEditAccount = page.getByRole('link', { name: 'Edit your account information' });
    }

    /**
     * Verifies the My Account page is displayed
     * @returns Promise<boolean> - true if the My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            return await this.hdgMyAccount.isVisible();
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the Edit Account link is available
     * @returns Promise<boolean> - true if the Edit your account information link is visible
     */
    async isEditAccountLinkExists(): Promise<boolean> {
        try {
            return await this.lnkEditAccount.isVisible();
        } catch (error) {
            console.log(`Error checking Edit Account link: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Logout link to navigate to the logout confirmation page
     * @returns Promise<LogoutPage> - Instance of the logout page
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.lnkLogout.click();
        await this.page.waitForURL('**/index.php?route=account/logout');
        return new LogoutPage(this.page);
    }

    /**
     * Verifies the Logout navigation option is available
     * @returns Promise<boolean> - true if the Logout link is visible
     */
    async isLogoutOptionExists(): Promise<boolean> {
        try {
            return await this.lnkLogout.isVisible();
        } catch (error) {
            console.log(`Error checking Logout option: ${error}`);
            return false;
        }
    }
}
