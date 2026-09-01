/**
 * Helper utility class with common helpers for Playwright tests.
 */
export class Helper {
    /**
     * Removes all characters from the input except digits and the decimal point,
     * then converts the result to a number.
     */
    static convertPriceToNumber(price: string): number {
        return parseFloat(price.replace(/[^0-9.]/g, ''));
    }

    /**
     * Returns fixed product details for use in tests.
     */
    static getProductDetails() {
        return {
            productName: 'MacBook',
            productQuantity: '1',
            totalPrice: '$602.00',
        };
    }

    /**
     * Returns fixed login details for use in tests.
     */
    static getLoginDetails() {
        return {
            email: 'madhu123@test.com',
            password: 'test123',
        };
    }

    /**
     * Returns fixed FakeStore API login credentials.
     */
    static getFakeStoreLoginDetails() {
        return {
            username: 'mor_2314',
            password: '83r5^_',
        };
    }

    /**
     * Returns fixed FakeStore API test data (IDs, limits, date range, category).
     */
    static getFakeStoreTestData() {
        return {
            productId: 1,
            productLimit: 3,
            productCategory: 'electronics',
            userId: 1,
            userLimit: 2,
            cartId: 1,
            cartLimit: 3,
            cartUserId: 1,
            startDate: '2019-12-10',
            endDate: '2020-10-10',
        };
    }
}
