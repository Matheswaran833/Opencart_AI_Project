/**
 * Test Case: User Registration Flow - validates successful customer registration
 * in the OpenCart frontend.
 *
 * Tags: @master @sanity @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Register
 * 3) Verify the registration page is displayed
 * 4) Generate a unique customer email
 * 5) Enter valid values for the registration form
 * 6) Accept the Privacy Policy
 * 7) Submit the registration form
 * 8) Verify the account-created confirmation message
 * 9) Verify the new account is available through account navigation
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User Registration Flow @master @sanity @web', async ({ homePage, registerPage, accountSuccessPage, myAccountPage }) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail();
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword();

    await test.step('1) Navigate to the registration page', async () => {
        await homePage.clickRegister();
    });

    await test.step('2) Verify the registration page is displayed', async () => {
        const isRegisterPageExists = await registerPage.isRegisterPageExists();
        expect(isRegisterPageExists).toBeTruthy();
    });

    await test.step('3) Complete the registration form with valid values', async () => {
        await registerPage.completeRegistration({ firstName, lastName, email, telephone, password });
    });

    await test.step('4) Verify the account-created confirmation message', async () => {
        const isAccountCreated = await accountSuccessPage.isAccountCreatedMessageExists();
        expect(isAccountCreated).toBeTruthy();
    });

    await test.step('5) Verify the new account is available through account navigation', async () => {
        await accountSuccessPage.clickContinue();
        const isMyAccountExists = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountExists).toBeTruthy();
        const isLogoutOptionExists = await myAccountPage.isLogoutOptionExists();
        expect(isLogoutOptionExists).toBeTruthy();
    });

    console.log('✅ ✔️ User registration completed successfully!');
});
