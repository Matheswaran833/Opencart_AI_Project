/**
 * Test Case: Invalid Login Flow - validates that login with invalid customer
 * credentials is rejected with the expected warning message.
 *
 * Tags: @master @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Login
 * 3) Verify the login page is displayed
 * 4) Enter invalid customer credentials
 * 5) Submit the login form
 * 6) Verify authentication fails with the expected warning message
 * 7) Verify the customer is not authenticated (stays on the login page)
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';

const INVALID_EMAIL = 'invalid@example.com';
const INVALID_PASSWORD = 'invalidpassword';
const EXPECTED_WARNING = 'Warning: No match for E-Mail Address and/or Password.';

test('Invalid Login Flow @master @regression @web', async ({ page, homePage, loginPage }) => {
    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickLogin();
    });

    await test.step('2) Verify the login page is displayed', async () => {
        const isLoginPageExists = await loginPage.isLoginPageExists();
        expect(isLoginPageExists).toBeTruthy();
    });

    await test.step('3) Submit the login form with invalid credentials', async () => {
        const isWarningDisplayed = await loginPage.loginWithInvalidCredentials(INVALID_EMAIL, INVALID_PASSWORD);
        expect(isWarningDisplayed, 'A warning alert should be displayed for invalid login').toBeTruthy();
    });

    await test.step('4) Verify the expected warning message is shown', async () => {
        const warningMessage = await loginPage.getWarningMessage();
        expect(warningMessage).toContain(EXPECTED_WARNING);
    });

    await test.step('5) Verify the customer is not authenticated', async () => {
        await expect(page).toHaveURL(/route=account\/login/);
        const isLoginPageStillVisible = await loginPage.isLoginPageExists();
        expect(isLoginPageStillVisible).toBeTruthy();
    });

    console.log('✅ ✔️ Invalid login rejected with the expected warning message!');
});
