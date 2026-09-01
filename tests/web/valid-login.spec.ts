/**
 * Test Case: Valid Login Flow - validates successful customer login in the
 * OpenCart frontend.
 *
 * Tags: @master @sanity @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Login
 * 3) Verify the login page is displayed
 * 4) Enter valid customer credentials from the configured test data
 * 5) Submit the login form
 * 6) Verify successful authentication and redirect to My Account
 * 7) Verify the account dashboard and authenticated navigation are visible
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';

test('Valid Login Flow @master @sanity @web', async ({ page, homePage, loginPage, myAccountPage }) => {
    const email = process.env.APP_EMAIL || '';
    const password = process.env.APP_PASSWORD || '';

    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickLogin();
    });

    await test.step('2) Verify the login page is displayed', async () => {
        const isLoginPageExists = await loginPage.isLoginPageExists();
        expect(isLoginPageExists).toBeTruthy();
    });

    await test.step('3) Submit the login form with valid credentials', async () => {
        await loginPage.login(email, password);
    });

    await test.step('4) Verify the user is redirected to the My Account section', async () => {
        await expect(page).toHaveURL(/route=account\/account/);
    });

    await test.step('5) Verify the account dashboard and authenticated navigation are visible', async () => {
        const isMyAccountExists = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountExists).toBeTruthy();
        const isEditAccountLinkExists = await myAccountPage.isEditAccountLinkExists();
        expect(isEditAccountLinkExists).toBeTruthy();
        const isLogoutOptionExists = await myAccountPage.isLogoutOptionExists();
        expect(isLogoutOptionExists).toBeTruthy();
    });

    console.log('✅ ✔️ Valid login completed successfully!');
});
