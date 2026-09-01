/**
 * Test Case: Add Product to Cart - validates adding a known product to the
 * shopping cart with a requested quantity.
 *
 * Tags: @master @sanity @web
 *
 * Steps:
 * 1) Open the application
 * 2) Search for a valid known product
 * 3) Open the product details page
 * 4) Verify the product details are displayed
 * 5) Set the required quantity
 * 6) Click Add to Cart
 * 7) Verify the product-added success/confirmation message
 * 8) Open the shopping cart
 * 9) Verify the selected product is present
 * 10) Verify the displayed quantity matches the requested quantity
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';

test('Add Product to Cart @master @sanity @web', async ({ homePage, searchPage, productPage, shoppingCartPage }) => {
    const productName = process.env.PRODUCT_NAME || 'MacBook';
    const quantity = process.env.PRODUCT_QUANTITY || '1';

    await test.step('1) Search for a known product', async () => {
        await homePage.searchProduct(productName);
    });

    await test.step('2) Open the product details page', async () => {
        await searchPage.openProduct(productName);
    });

    await test.step('3) Verify the product details are displayed', async () => {
        const isProductPageExists = await productPage.isProductPageExists();
        expect(isProductPageExists).toBeTruthy();
    });

    await test.step('4) Set the required quantity', async () => {
        await productPage.setQuantity(quantity);
    });

    await test.step('5) Click Add to Cart', async () => {
        await productPage.clickAddToCart();
    });

    await test.step('6) Verify the product-added success/confirmation message', async () => {
        await expect(productPage.getSuccessAlert()).toBeVisible();
        const successMessage = await productPage.getSuccessMessage();
        expect(successMessage).toContain(`Success: You have added ${productName}`);
        const isAddToCartSuccessDisplayed = await productPage.isAddToCartSuccessDisplayed();
        expect(isAddToCartSuccessDisplayed).toBeTruthy();
    });

    await test.step('7) Open the shopping cart', async () => {
        await productPage.openShoppingCart();
    });

    await test.step('8) Verify the selected product is present in the cart', async () => {
        const isShoppingCartPageExists = await shoppingCartPage.isShoppingCartPageExists();
        expect(isShoppingCartPageExists).toBeTruthy();
        const isProductInCart = await shoppingCartPage.isProductInCart(productName);
        expect(isProductInCart, `Product '${productName}' should be present in the cart`).toBeTruthy();
    });

    await test.step('9) Verify the displayed quantity matches the requested quantity', async () => {
        const displayedQuantity = await shoppingCartPage.getProductQuantity(productName);
        expect(displayedQuantity).toBe(quantity);
    });

    console.log('✅ ✔️ Add product to cart completed successfully!');
});
