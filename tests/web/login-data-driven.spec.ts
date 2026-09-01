/**
 * Test Case: Login Flow (Data Driven using External File) - validates OpenCart
 * customer login against test data loaded from an external data file, with one
 * independent test generated per data row.
 *
 * Tags: @master @regression @datadriven @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Login
 * 3) Enter the email and password from the data row (blank/whitespace values leave fields empty)
 * 4) Submit the login form
 * 5) Validate the result based on the expected value
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';
import * as path from 'path';

// External test data - switch to the .csv or .xlsx file to use that data source
const LOGIN_DATA_FILE = path.join(__dirname, '..', '..', 'testdata', 'opencart_logindata.json');
const EXPECTED_WARNING = 'Warning: No match for E-Mail Address and/or Password.';

type LoginDataRow = {
    testName: string;
    email: string;
    password: string;
    expected: string;
};

const loginData: LoginDataRow[] = DataProvider.readJson(LOGIN_DATA_FILE);

for (const row of loginData) {
    test(`Login - ${row.testName} (${row.email || 'blank'} / ${row.password || 'blank'}) @master @regression @datadriven @web`, async ({ page, homePage, loginPage, myAccountPage }) => {
        await test.step('1) Navigate to the login page', async () => {
            await homePage.clickLogin();
        });

        await test.step('2) Submit the login form with the data row values', async () => {
            await loginPage.submitLoginAllowBlank(row.email, row.password);
        });

        if (row.expected === 'success') {
            await test.step('3) Verify the login is successful and the My Account page is displayed', async () => {
                await expect(page).toHaveURL(/route=account\/account/);
                const isMyAccountExists = await myAccountPage.isMyAccountPageExists();
                expect(isMyAccountExists, 'My Account page should be displayed after a successful login').toBeTruthy();
            });
        } else {
            await test.step('3) Verify the login is unsuccessful and the warning message is displayed', async () => {
                const isWarningDisplayed = await loginPage.isWarningDisplayed();
                expect(isWarningDisplayed, 'A warning alert should be displayed for a failed login').toBeTruthy();
                const warningMessage = await loginPage.getWarningMessage();
                expect(warningMessage).toContain(EXPECTED_WARNING);
            });
        }

        console.log(`✅ ✔️ Login data-driven scenario "${row.testName}" (expected: ${row.expected}) completed successfully!`);
    });
}
