/**
 * Test Case: FakeStore API - Users (GET / CRUD)
 *
 * Tags: @master @sanity @api
 *
 * Steps:
 * 1) GET all users -> non-empty array
 * 2) GET user by id -> id matches
 * 3) GET users with limit -> exact count
 * 4) GET users sorted asc/desc -> id ordering
 * 5) POST create user -> 201
 * 6) PUT update user -> 200 + updated values
 * 7) DELETE user -> 200
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';
import dotenv from 'dotenv';

dotenv.config();

test.describe('FakeStore Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? Helper.getFakeStoreTestData().userId);
    const USER_LIMIT = Number(process.env.LIMIT ?? Helper.getFakeStoreTestData().userLimit);

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All Users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response must be an array').toBeTruthy();
        expect(responseBody.length, 'Users array must not be empty').toBeGreaterThan(0);

        console.log(`✅ All users returned (${responseBody.length} users)`);
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const user = await response.json();

        expect(user.id, `User id must match requested id ${USER_ID}`).toBe(USER_ID);

        console.log(`✅ User ${USER_ID} returned with matching id`);
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with Limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(USER_LIMIT))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response must be an array').toBeTruthy();
        expect(responseBody.length, `Expected ${USER_LIMIT} users but got ${responseBody.length}`).toBe(USER_LIMIT);

        console.log(`✅ Users limit returned exactly ${USER_LIMIT} items`);
    });

    // ---------------------------------------------------------
    // GET - Users Sorted (Ascending / Descending)
    // ---------------------------------------------------------

    test('GET - Users Sorted Ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((user: { id: number }) => user.id);

        const sortedIds = [...ids].sort((a, b) => a - b);
        expect(ids, 'User ids must be in ascending order').toEqual(sortedIds);

        console.log('✅ Users sorted ascending by id');
    });

    test('GET - Users Sorted Descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((user: { id: number }) => user.id);

        const sortedIds = [...ids].sort((a, b) => b - a);
        expect(ids, 'User ids must be in descending order').toEqual(sortedIds);

        console.log('✅ Users sorted descending by id');
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status(), `Expected 201 but got ${response.status()}`).toBe(201);

        const created = await response.json();

        // FakeStore always returns { id: 1 } for user creation
        expect(created.id, 'Created user must return an id').toBeDefined();

        console.log(`✅ User created with returned id ${created.id}`);
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update User @master @regression @api', async ({ request }) => {

        const updatedPayload = RandomDataUtil.generateUserUpdatePayload();

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(USER_ID))}`, {
            data: updatedPayload,
        });

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const updated = await response.json();

        // FakeStore echoes the submitted payload for user updates
        expect(updated.username, 'Updated user must reflect the new username').toBe(updatedPayload.username);
        expect(updated.email, 'Updated user must reflect the new email').toBe(updatedPayload.email);
        expect(updated.name.firstname, 'Updated user must reflect the new first name').toBe(updatedPayload.name.firstname);

        console.log(`✅ User ${USER_ID} updated with new values`);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete User @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(USER_ID))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        console.log(`✅ User ${USER_ID} deleted successfully`);
    });
});
