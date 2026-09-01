/**
 * Test Case: End-to-End Shopping Flow - validates the complete customer
 * shopping journey from registration through re-login, product search,
 * cart addition, and cart validation.
 *
 * Tags: @master @end-to-end @web
 *
 * Steps:
 * 1) Open the application
 * 2) Register a new customer using dynamically generated unique data
 * 3) Verify successful registration
 * 4) Log out
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Search for a known product
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the correct product
 * 12) Verify the quantity
 * 13) Verify the product price
 * 14) Verify the applicable cart total
 * 15) Verify the complete journey finishes without errors
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-End Shopping Flow @master @end-to-end @web', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    myAccountPage,
    logoutPage,
    loginPage,
    searchPage,
    productPage,
    shoppingCartPage,
}) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail();
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword();
    const productName = process.env.PRODUCT_NAME || 'MacBook';
    const quantity = process.env.PRODUCT_QUANTITY || '1';

    await test.step('1) Register a new customer with unique data', async () => {
        await homePage.clickRegister();
        const isRegisterPageExists = await registerPage.isRegisterPageExists();
        expect(isRegisterPageExists).toBeTruthy();
        await registerPage.completeRegistration({ firstName, lastName, email, telephone, password });
    });

    await test.step('2) Verify successful registration', async () => {
        const isAccountCreated = await accountSuccessPage.isAccountCreatedMessageExists();
        expect(isAccountCreated).toBeTruthy();
        await accountSuccessPage.clickContinue();
        const isMyAccountExists = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountExists).toBeTruthy();
    });

    await test.step('3) Log out', async () => {
        await myAccountPage.clickLogout();
        const isLogoutPageExists = await logoutPage.isLogoutPageExists();
        expect(isLogoutPageExists).toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step('4) Log in again with the newly created credentials', async () => {
        await homePage.clickLogin();
        await loginPage.login(email, password);
        const isMyAccountExists = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountExists).toBeTruthy();
    });

    await test.step('5) Search for a known product', async () => {
        await homePage.searchProduct(productName);
        const isSearchPageExists = await searchPage.isSearchPageExists();
        expect(isSearchPageExists).toBeTruthy();
    });

    await test.step('6) Open the product details page', async () => {
        await searchPage.openProduct(productName);
        const isProductPageExists = await productPage.isProductPageExists();
        expect(isProductPageExists).toBeTruthy();
        const productPrice = await productPage.getProductPrice();
        expect(productPrice).toContain('$');
    });

    await test.step('7) Add the product to the cart', async () => {
        await productPage.setQuantity(quantity);
        await productPage.clickAddToCart();
        await expect(productPage.getSuccessAlert()).toBeVisible();
        const successMessage = await productPage.getSuccessMessage();
        expect(successMessage).toContain(`Success: You have added ${productName}`);
    });

    await test.step('8) Open the shopping cart', async () => {
        await productPage.openShoppingCart();
        const isShoppingCartPageExists = await shoppingCartPage.isShoppingCartPageExists();
        expect(isShoppingCartPageExists).toBeTruthy();
    });

    await test.step('9) Verify the correct product is present', async () => {
        const isProductInCart = await shoppingCartPage.isProductInCart(productName);
        expect(isProductInCart, `Product '${productName}' should be present in the cart`).toBeTruthy();
    });

    await test.step('10) Verify the quantity matches the requested quantity', async () => {
        const displayedQuantity = await shoppingCartPage.getProductQuantity(productName);
        expect(displayedQuantity).toBe(quantity);
    });

    await test.step('11) Verify the product price and line total', async () => {
        const unitPrice = await shoppingCartPage.getProductPrice(productName);
        const lineTotal = await shoppingCartPage.getProductLineTotal(productName);
        const expectedLineTotal = Helper.convertPriceToNumber(unitPrice) * Number(quantity);
        expect(unitPrice).toContain('$');
        expect(Helper.convertPriceToNumber(lineTotal)).toBe(expectedLineTotal);
    });

    await test.step('12) Verify the applicable cart total', async () => {
        const cartTotal = await shoppingCartPage.getCartTotal();
        expect(Helper.convertPriceToNumber(cartTotal)).toBeGreaterThan(0);
    });

    console.log('✅ ✔️ End-to-end shopping flow completed successfully!');
});
