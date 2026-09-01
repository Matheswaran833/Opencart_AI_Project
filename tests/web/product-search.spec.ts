/**
 * Test Case: Product Search Flow - validates that searching for a known product
 * returns the expected product in the search results.
 *
 * Tags: @master @sanity @web
 *
 * Steps:
 * 1) Open the application
 * 2) Enter a valid known product name in the header search field
 * 3) Submit the search
 * 4) Verify the search results page is displayed
 * 5) Verify the expected product appears in the results
 * 6) Verify the displayed product name matches the search criteria
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';

test('Product Search Flow @master @sanity @web', async ({ page, homePage, searchPage }) => {
    const productName = process.env.PRODUCT_NAME || 'MacBook';

    await test.step('1) Search for a known product', async () => {
        await homePage.searchProduct(productName);
    });

    await test.step('2) Verify the search results page is displayed', async () => {
        const isSearchPageExists = await searchPage.isSearchPageExists();
        expect(isSearchPageExists).toBeTruthy();
        await expect(page).toHaveURL(/route=product\/search&search=/);
    });

    await test.step('3) Verify the expected product appears in the results', async () => {
        const hasProductResults = await searchPage.hasProductResults();
        expect(hasProductResults).toBeTruthy();
        const isProductDisplayed = await searchPage.isProductDisplayed(productName);
        expect(isProductDisplayed, `Product '${productName}' should appear in the search results`).toBeTruthy();
    });

    await test.step('4) Verify the displayed product name matches the search criteria', async () => {
        const firstProductName = await searchPage.getFirstProductName();
        expect(firstProductName).toContain(productName);
    });

    console.log('✅ ✔️ Product search completed successfully!');
});
