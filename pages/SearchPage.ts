import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchPage {
    private readonly page: Page;

    // Locators
    private readonly hdgSearch: Locator;
    private readonly lstProducts: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.hdgSearch = page.getByRole('heading', { name: /^Search/ });
        this.lstProducts = page.locator('.product-layout .product-thumb');
    }

    /**
     * Verifies the search results page is displayed
     * @returns Promise<boolean> - true if the Search heading is visible
     */
    async isSearchPageExists(): Promise<boolean> {
        try {
            return await this.hdgSearch.isVisible();
        } catch (error) {
            console.log(`Error checking search page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the search results contain at least one product
     * @returns Promise<boolean> - true if at least one product thumbnail is visible
     */
    async hasProductResults(): Promise<boolean> {
        try {
            const count = await this.lstProducts.count();
            return count > 0;
        } catch (error) {
            console.log(`Error checking product results: ${error}`);
            return false;
        }
    }

    /**
     * Verifies a product with the given name appears in the search results
     * @param productName - Product name to look for
     * @returns Promise<boolean> - true if a matching product link is visible
     */
    async isProductDisplayed(productName: string): Promise<boolean> {
        try {
            return await this.lstProducts
                .getByRole('link', { name: productName, exact: true })
                .first()
                .isVisible();
        } catch (error) {
            console.log(`Error checking product in results: ${error}`);
            return false;
        }
    }

    /**
     * Returns the name of the first product in the search results
     * @returns Promise<string> - the displayed product name
     */
    async getFirstProductName(): Promise<string> {
        const firstProduct = this.lstProducts.first();
        const productName = await firstProduct.getByRole('heading').getByRole('link').textContent();
        return productName?.trim() || '';
    }

    /**
     * Opens the details page of the product with the given name
     * @param productName - Product name to open
     * @returns Promise<ProductPage> - Instance of the product details page
     */
    async openProduct(productName: string): Promise<ProductPage> {
        try {
            await this.lstProducts.getByRole('link', { name: productName, exact: true }).first().click();
            await this.page.waitForURL(/route=product\/product/);
            return new ProductPage(this.page);
        } catch (error) {
            console.log(`Error opening product: ${error}`);
            throw error;
        }
    }
}
