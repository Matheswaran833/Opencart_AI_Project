/**
 * Test Case: FakeStore API - End-to-End CRUD Workflows (Product / User / Cart)
 *
 * Tags: @master @end-to-end @api
 *
 * Steps:
 * 1) Product workflow: create -> update -> delete using the returned product id
 * 2) User workflow: create -> update -> delete using the returned user id
 * 3) Cart workflow: create -> update -> delete using the returned cart id
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';
import dotenv from 'dotenv';

dotenv.config();

test.describe.serial('FakeStore CRUD Workflow API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_USER_ID = Number(process.env.USER_ID ?? Helper.getFakeStoreTestData().cartUserId);

    // ---------------------------------------------------------
    // Product CRUD Workflow
    // ---------------------------------------------------------

    test('Workflow - Product Create, Update, Delete @master @end-to-end @api', async ({ request }) => {

        // 1) Create a product
        const createPayload = RandomDataUtil.generateProductPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: createPayload });

        expect(createResponse.status(), `Expected 201 but got ${createResponse.status()}`).toBe(201);

        const createdProduct = await createResponse.json();

        expect(createdProduct.id, 'Created product must return an id').toBeDefined();

        const productId = createdProduct.id;

        // 2) Update the same product
        const updatePayload = RandomDataUtil.generateUpdatedProductPayload();

        const updateResponse = await request.put(`${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`, {
            data: updatePayload,
        });

        expect(updateResponse.status(), `Expected 200 but got ${updateResponse.status()}`).toBe(200);

        const updatedProduct = await updateResponse.json();

        expect(updatedProduct.id, 'Updated product id must match the created id').toBe(productId);
        expect(updatedProduct.title, 'Updated product must reflect the new title').toBe(updatePayload.title);

        // 3) Delete the same product
        const deleteResponse = await request.delete(`${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`);

        expect(deleteResponse.status(), `Expected 200 but got ${deleteResponse.status()}`).toBe(200);

        console.log(`✅ Product workflow completed (id ${productId})`);
    });

    // ---------------------------------------------------------
    // User CRUD Workflow
    // ---------------------------------------------------------

    test('Workflow - User Create, Update, Delete @master @end-to-end @api', async ({ request }) => {

        // 1) Create a user
        const createPayload = RandomDataUtil.generateUserPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: createPayload });

        expect(createResponse.status(), `Expected 201 but got ${createResponse.status()}`).toBe(201);

        const createdUser = await createResponse.json();

        expect(createdUser.id, 'Created user must return an id').toBeDefined();

        // FakeStore always returns { id: 1 } for user creation, so use the
        // configured USER_ID from .env for update/delete chaining.
        const userId = Number(process.env.USER_ID ?? Helper.getFakeStoreTestData().userId);

        // 2) Update the same user
        const updatePayload = RandomDataUtil.generateUserUpdatePayload();

        const updateResponse = await request.put(`${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`, {
            data: updatePayload,
        });

        expect(updateResponse.status(), `Expected 200 but got ${updateResponse.status()}`).toBe(200);

        const updatedUser = await updateResponse.json();

        expect(updatedUser.username, 'Updated user must reflect the new username').toBe(updatePayload.username);
        expect(updatedUser.email, 'Updated user must reflect the new email').toBe(updatePayload.email);

        // 3) Delete the same user
        const deleteResponse = await request.delete(`${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`);

        expect(deleteResponse.status(), `Expected 200 but got ${deleteResponse.status()}`).toBe(200);

        console.log(`✅ User workflow completed (id ${userId})`);
    });

    // ---------------------------------------------------------
    // Cart CRUD Workflow
    // ---------------------------------------------------------

    test('Workflow - Cart Create, Update, Delete @master @end-to-end @api', async ({ request }) => {

        // 1) Create a cart
        const createPayload = RandomDataUtil.generateCartPayload(CART_USER_ID);

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: createPayload });

        expect(createResponse.status(), `Expected 201 but got ${createResponse.status()}`).toBe(201);

        const createdCart = await createResponse.json();

        expect(createdCart.id, 'Created cart must return an id').toBeDefined();
        expect(createdCart.userId, 'Created cart must echo the submitted userId').toBe(CART_USER_ID);

        const cartId = createdCart.id;

        // 2) Update the same cart (change at least one product quantity)
        const updatePayload = RandomDataUtil.generateUpdatedCartPayload(CART_USER_ID);

        const updateResponse = await request.put(`${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`, {
            data: updatePayload,
        });

        expect(updateResponse.status(), `Expected 200 but got ${updateResponse.status()}`).toBe(200);

        const updatedCart = await updateResponse.json();

        expect(updatedCart.id, 'Updated cart id must match the created id').toBe(cartId);
        expect(updatedCart.products, 'Updated cart must reflect the new products').toEqual(updatePayload.products);

        // 3) Delete the same cart
        const deleteResponse = await request.delete(`${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`);

        expect(deleteResponse.status(), `Expected 200 but got ${deleteResponse.status()}`).toBe(200);

        console.log(`✅ Cart workflow completed (id ${cartId})`);
    });
});
