/**
 * Test Case: FakeStore API - Carts (GET / CRUD)
 *
 * Tags: @master @sanity @api
 *
 * Steps:
 * 1) GET all carts -> non-empty array
 * 2) GET cart by id -> id matches
 * 3) GET carts by date range -> all within range
 * 4) GET user cart -> all belong to user
 * 5) GET carts with limit -> exact count
 * 6) GET carts sorted asc/desc -> id ordering
 * 7) POST create cart -> 201 + id
 * 8) PUT update cart -> 200 + changed quantity
 * 9) DELETE cart -> 200
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';
import dotenv from 'dotenv';

dotenv.config();

test.describe('FakeStore Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = Number(process.env.CART_ID ?? Helper.getFakeStoreTestData().cartId);
    const CART_LIMIT = Number(process.env.LIMIT ?? Helper.getFakeStoreTestData().cartLimit);
    const CART_USER_ID = Number(process.env.USER_ID ?? Helper.getFakeStoreTestData().cartUserId);
    const START_DATE = process.env.START_DATE || Helper.getFakeStoreTestData().startDate;
    const END_DATE = process.env.END_DATE || Helper.getFakeStoreTestData().endDate;

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response must be an array').toBeTruthy();
        expect(responseBody.length, 'Carts array must not be empty').toBeGreaterThan(0);

        console.log(`✅ All carts returned (${responseBody.length} carts)`);
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const cart = await response.json();

        expect(cart.id, `Cart id must match requested id ${CART_ID}`).toBe(CART_ID);

        console.log(`✅ Cart ${CART_ID} returned with matching id`);
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by Date Range @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_BY_DATE_RANGE.replace('{startdate}', START_DATE).replace('{enddate}', END_DATE)}`;

        const response = await request.get(url);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Carts must be an array').toBeTruthy();

        const start = new Date(START_DATE).getTime();
        const end = new Date(END_DATE).getTime();

        for (const cart of carts) {
            const cartDate = new Date(cart.date).getTime();
            expect(cartDate >= start && cartDate <= end,
                `Cart ${cart.id} date ${cart.date} must be within ${START_DATE} and ${END_DATE}`).toBeTruthy();
        }

        console.log(`✅ All ${carts.length} carts fall within the requested date range`);
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - User Cart @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(CART_USER_ID))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response must be an array').toBeTruthy();

        for (const cart of carts) {
            expect(cart.userId, `Cart ${cart.id} must belong to user ${CART_USER_ID}`).toBe(CART_USER_ID);
        }

        console.log(`✅ All returned carts belong to user ${CART_USER_ID}`);
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with Limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(CART_LIMIT))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response must be an array').toBeTruthy();
        expect(responseBody.length, `Expected ${CART_LIMIT} carts but got ${responseBody.length}`).toBe(CART_LIMIT);

        console.log(`✅ Carts limit returned exactly ${CART_LIMIT} items`);
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted (Ascending / Descending)
    // ---------------------------------------------------------

    test('GET - Carts Sorted Ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((cart: { id: number }) => cart.id);

        const sortedIds = [...ids].sort((a, b) => a - b);
        expect(ids, 'Cart ids must be in ascending order').toEqual(sortedIds);

        console.log('✅ Carts sorted ascending by id');
    });

    test('GET - Carts Sorted Descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((cart: { id: number }) => cart.id);

        const sortedIds = [...ids].sort((a, b) => b - a);
        expect(ids, 'Cart ids must be in descending order').toEqual(sortedIds);

        console.log('✅ Carts sorted descending by id');
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateCartPayload(CART_USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status(), `Expected 201 but got ${response.status()}`).toBe(201);

        const created = await response.json();

        expect(created.id, 'Created cart must return an id').toBeDefined();
        expect(created.userId, 'Created cart must echo the submitted userId').toBe(payload.userId);
        expect(created.products, 'Created cart must echo the submitted products').toEqual(payload.products);

        console.log(`✅ Cart created with id ${created.id}`);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {

        const updatedPayload = RandomDataUtil.generateUpdatedCartPayload(CART_USER_ID);

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`, {
            data: updatedPayload,
        });

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const updated = await response.json();

        expect(updated.id, `Updated cart id must match requested id ${CART_ID}`).toBe(CART_ID);
        expect(updated.products, 'Updated cart must reflect the new products').toEqual(updatedPayload.products);

        console.log(`✅ Cart ${CART_ID} updated with new product quantities`);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        console.log(`✅ Cart ${CART_ID} deleted successfully`);
    });
});
