import { Page, Locator } from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { SearchPage } from './SearchPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly lnkMyAccount: Locator;
    private readonly lnkRegister: Locator;
    private readonly lnkLogin: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lnkMyAccount = page.locator('#top-links').getByRole('link', { name: 'My Account' });
        this.lnkRegister = page.locator('#top-links .dropdown-menu').getByRole('link', { name: 'Register' });
        this.lnkLogin = page.locator('#top-links .dropdown-menu').getByRole('link', { name: 'Login' });
        this.txtSearch = page.locator('#search input[name="search"]');
        this.btnSearch = page.locator('#search .input-group-btn button');
    }

    /**
     * Opens the My Account dropdown and clicks the Register link
     * @returns Promise<RegisterPage> - Instance of the registration page
     */
    async clickRegister(): Promise<RegisterPage> {
        try {
            await this.lnkMyAccount.click();
            await this.lnkRegister.click();
            await this.page.waitForURL('**/index.php?route=account/register');
            return new RegisterPage(this.page);
        } catch (error) {
            console.log(`Error navigating to the registration page: ${error}`);
            throw error;
        }
    }

    /**
     * Opens the My Account dropdown and clicks the Login link
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async clickLogin(): Promise<LoginPage> {
        try {
            await this.lnkMyAccount.click();
            await this.lnkLogin.click();
            await this.page.waitForURL('**/index.php?route=account/login');
            return new LoginPage(this.page);
        } catch (error) {
            console.log(`Error navigating to the login page: ${error}`);
            throw error;
        }
    }

    /**
     * Searches for a product using the header search field
     * @param productName - Product name to search for
     * @returns Promise<SearchPage> - Instance of the search results page
     */
    async searchProduct(productName: string): Promise<SearchPage> {
        try {
            await this.txtSearch.fill(productName);
            await this.btnSearch.click();
            await this.page.waitForURL('**/index.php?route=product/search&search=**');
            return new SearchPage(this.page);
        } catch (error) {
            console.log(`Error searching for product: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the home page is displayed
     * @returns Promise<boolean> - true if the My Account link is visible
     */
    async isHomePageExists(): Promise<boolean> {
        try {
            return await this.lnkMyAccount.isVisible();
        } catch (error) {
            console.log(`Error checking home page: ${error}`);
            return false;
        }
    }
}
