/**
 * Test Case: FakeStore API - JSON Schema Validation (Product / User / Cart)
 *
 * Tags: @master @regression @api
 *
 * Steps:
 * 1) GET product by id -> validate against product_api_schema.json
 * 2) GET user by id -> validate against user_api_schema.json
 * 3) GET cart by id -> validate against cart_api_schema.json
 */

import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import { Helper } from '../../utils/helper';
import dotenv from 'dotenv';

dotenv.config();

const ajv = new Ajv({ allErrors: true, strict: false });

test.describe('FakeStore JSON Schema Validation Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? Helper.getFakeStoreTestData().productId);
    const USER_ID = Number(process.env.USER_ID ?? Helper.getFakeStoreTestData().userId);
    const CART_ID = Number(process.env.CART_ID ?? Helper.getFakeStoreTestData().cartId);

    // ---------------------------------------------------------
    // Product Schema
    // ---------------------------------------------------------

    test('Schema - Product Response @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const product = await response.json();

        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');

        const validate = ajv.compile(schema);
        const isValid = validate(product);

        expect(isValid, `Product response does not match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();

        console.log('✅ Product response matches the product schema');
    });

    // ---------------------------------------------------------
    // User Schema
    // ---------------------------------------------------------

    test('Schema - User Response @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const user = await response.json();

        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');

        const validate = ajv.compile(schema);
        const isValid = validate(user);

        expect(isValid, `User response does not match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();

        console.log('✅ User response matches the user schema');
    });

    // ---------------------------------------------------------
    // Cart Schema
    // ---------------------------------------------------------

    test('Schema - Cart Response @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const cart = await response.json();

        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');

        const validate = ajv.compile(schema);
        const isValid = validate(cart);

        expect(isValid, `Cart response does not match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();

        console.log('✅ Cart response matches the cart schema');
    });
});
