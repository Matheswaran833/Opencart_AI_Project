/**
 * Test Case: Logout Flow - validates that a logged-in customer can log out
 * and no longer access authenticated account options.
 *
 * Tags: @master @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Login
 * 3) Log in with valid customer credentials
 * 4) Verify authentication succeeds (My Account page)
 * 5) Click the Logout option
 * 6) Verify the logout confirmation page is displayed
 * 7) Click Continue
 * 8) Verify redirect to the home page
 * 9) Verify authenticated account options are no longer available
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';

test('Logout Flow @master @regression @web', async ({ page, homePage, loginPage, myAccountPage, logoutPage }) => {
    const email = process.env.APP_EMAIL || '';
    const password = process.env.APP_PASSWORD || '';

    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickLogin();
    });

    await test.step('2) Log in with valid credentials', async () => {
        await loginPage.login(email, password);
    });

    await test.step('3) Verify authentication succeeds', async () => {
        const isMyAccountExists = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountExists).toBeTruthy();
    });

    await test.step('4) Navigate to the account logout option', async () => {
        const isLogoutOptionExists = await myAccountPage.isLogoutOptionExists();
        expect(isLogoutOptionExists).toBeTruthy();
        await myAccountPage.clickLogout();
    });

    await test.step('5) Verify the logout confirmation page is displayed', async () => {
        const isLogoutPageExists = await logoutPage.isLogoutPageExists();
        expect(isLogoutPageExists).toBeTruthy();
    });

    await test.step('6) Click Continue to return to the home page', async () => {
        await logoutPage.clickContinue();
    });

    await test.step('7) Verify the redirect to the home page', async () => {
        await expect(page).toHaveURL(/route=common\/home/);
    });

    await test.step('8) Verify authenticated account options are no longer available', async () => {
        const isHomePageExists = await homePage.isHomePageExists();
        expect(isHomePageExists).toBeTruthy();
        const isMyAccountHeadingVisible = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountHeadingVisible, 'My Account dashboard should not be visible after logout').toBeFalsy();
    });

    console.log('✅ ✔️ Logout completed successfully!');
});
