/**
 * Test Case: FakeStore API - Authentication (Successful + Invalid Login)
 *
 * Tags: @master @sanity @api
 *
 * Steps:
 * 1) POST /auth/login with valid credentials -> expect 201 + non-empty token
 * 2) POST /auth/login with invalid credentials -> expect 401 + exact error message
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';
import dotenv from 'dotenv';

dotenv.config();

test.describe('FakeStore Authentication API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const { username, password } = Helper.getFakeStoreLoginDetails();

    // ---------------------------------------------------------
    // POST - Login
    // ---------------------------------------------------------

    test('POST - Successful Login @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username, password },
        });

        // Verify the login request succeeds with status 201
        expect(response.status(), `Expected 201 but got ${response.status()} for valid login`).toBe(201);

        const responseBody = await response.json();

        // Verify the response provides a non-empty authentication token
        expect(responseBody.token, 'Login response must contain a token field').toBeDefined();
        expect(typeof responseBody.token, 'Token must be a string').toBe('string');
        expect(responseBody.token.length, 'Token must not be empty').toBeGreaterThan(0);

        console.log('✅ Successful login returned a non-empty token');
    });

    test('POST - Invalid Login @master @regression @api', async ({ request }) => {

        const invalidPayload = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: invalidPayload,
        });

        // Verify the login request is rejected with status 401
        expect(response.status(), `Expected 401 but got ${response.status()} for invalid login`).toBe(401);

        const responseBody = await response.text();

        // Verify the exact authentication error message (FakeStore returns plain text)
        expect(responseBody, 'Invalid login should return the exact error message').toContain('username or password is incorrect');

        console.log('✅ Invalid login rejected with the expected error message');
    });
});
