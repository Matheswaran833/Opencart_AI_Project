import { Page, Locator } from '@playwright/test';

export class ShoppingCartPage {
    private readonly page: Page;

    // Locators
    private readonly hdgShoppingCart: Locator;
    private readonly lstCartRows: Locator;
    private readonly lstTotals: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.hdgShoppingCart = page.getByRole('heading', { name: 'Shopping Cart', level: 1 });
        this.lstCartRows = page.locator('#content .table-responsive tbody tr');
        this.lstTotals = page.locator('#content .table-bordered tr');
    }

    /**
     * Verifies the shopping cart page is displayed
     * @returns Promise<boolean> - true if the Shopping Cart heading is visible
     */
    async isShoppingCartPageExists(): Promise<boolean> {
        try {
            return await this.hdgShoppingCart.isVisible();
        } catch (error) {
            console.log(`Error checking shopping cart page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the given product appears in the cart
     * @param productName - Product name to look for
     * @returns Promise<boolean> - true if a cart row with the product link is visible
     */
    async isProductInCart(productName: string): Promise<boolean> {
        try {
            return await this.lstCartRows
                .getByRole('link', { name: productName, exact: true })
                .first()
                .isVisible();
        } catch (error) {
            console.log(`Error checking product in cart: ${error}`);
            return false;
        }
    }

    /**
     * Returns the quantity shown for the given product in the cart
     * @param productName - Product name to look for
     * @returns Promise<string> - the displayed quantity value
     */
    async getProductQuantity(productName: string): Promise<string> {
        const productRow = this.getProductRow(productName);
        const quantityInput = productRow.locator('input[name^="quantity"]');
        return (await quantityInput.inputValue()) || '';
    }

    /**
     * Returns the unit price shown for the given product in the cart
     * @param productName - Product name to look for
     * @returns Promise<string> - the displayed unit price
     */
    async getProductPrice(productName: string): Promise<string> {
        const productRow = this.getProductRow(productName);
        return (await productRow.locator('td').nth(4).textContent())?.trim() || '';
    }

    /**
     * Returns the line total shown for the given product in the cart
     * @param productName - Product name to look for
     * @returns Promise<string> - the displayed line total
     */
    async getProductLineTotal(productName: string): Promise<string> {
        const productRow = this.getProductRow(productName);
        return (await productRow.locator('td').nth(5).textContent())?.trim() || '';
    }

    /**
     * Returns the grand total value displayed in the cart totals table
     * @returns Promise<string> - the displayed total value
     */
    async getCartTotal(): Promise<string> {
        const totalRow = this.lstTotals.filter({ hasText: 'Total:' });
        return (await totalRow.locator('td').nth(1).textContent())?.trim() || '';
    }

    /**
     * Returns the cart row containing the given product
     * @param productName - Product name to look for
     * @returns Locator - the cart row locator
     */
    private getProductRow(productName: string): Locator {
        return this.lstCartRows.filter({
            has: this.page.getByRole('link', { name: productName, exact: true }),
        });
    }
}
