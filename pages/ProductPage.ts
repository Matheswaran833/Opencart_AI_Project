import { Page, Locator } from '@playwright/test';
import { ShoppingCartPage } from './ShoppingCartPage';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly hdgProductName: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly alertSuccess: Locator;
    private readonly lnkShoppingCart: Locator;
    private readonly hdgPrice: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.hdgProductName = page.locator('#content h1');
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.alertSuccess = page.locator('.alert-success');
        this.lnkShoppingCart = page.locator('#top-links').getByRole('link', { name: 'Shopping Cart' });
        this.hdgPrice = page.getByRole('heading', { name: /^\$/ });
    }

    /**
     * Verifies the product details page is displayed
     * @returns Promise<boolean> - true if the product name heading is visible
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            return await this.hdgProductName.isVisible();
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }

    /**
     * Sets the product quantity in the quantity input
     * @param quantity - Quantity to enter
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button and returns to the same product page
     * @returns Promise<ProductPage> - Instance of the product page
     */
    async clickAddToCart(): Promise<ProductPage> {
        await this.btnAddToCart.click();
        return this;
    }

    /**
     * Verifies the product-added success message is displayed
     * @returns Promise<boolean> - true if the success alert is visible
     */
    async isAddToCartSuccessDisplayed(): Promise<boolean> {
        try {
            return await this.alertSuccess.isVisible();
        } catch (error) {
            console.log(`Error checking add-to-cart success message: ${error}`);
            return false;
        }
    }

    /**
     * Returns the text of the add-to-cart success message
     * @returns Promise<string> - the success message text
     */
    async getSuccessMessage(): Promise<string> {
        return (await this.alertSuccess.textContent()) || '';
    }

    /**
     * Returns the unit price of the product displayed on the details page
     * @returns Promise<string> - the displayed unit price
     */
    async getProductPrice(): Promise<string> {
        return (await this.hdgPrice.textContent())?.trim() || '';
    }

    /**
     * Returns the locator for the add-to-cart success message
     * @returns Locator - the success alert locator
     */
    getSuccessAlert(): Locator {
        return this.alertSuccess;
    }

    /**
     * Opens the shopping cart page from the top links
     * @returns Promise<ShoppingCartPage> - Instance of the shopping cart page
     */
    async openShoppingCart(): Promise<ShoppingCartPage> {
        await this.lnkShoppingCart.click();
        await this.page.waitForURL('**/index.php?route=checkout/cart');
        return new ShoppingCartPage(this.page);
    }
}
