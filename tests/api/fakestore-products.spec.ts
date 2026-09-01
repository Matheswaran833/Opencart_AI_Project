/**
 * Test Case: FakeStore API - Products (GET / CRUD)
 *
 * Tags: @master @sanity @api
 *
 * Steps:
 * 1) GET all products -> non-empty array with expected fields
 * 2) GET product by id -> id matches
 * 3) GET products with limit -> exact count
 * 4) GET products sorted asc/desc -> id ordering
 * 5) GET categories -> non-empty array
 * 6) GET products by category -> all match category
 * 7) POST create product -> 201 + id
 * 8) PUT update product -> 200 + updated values
 * 9) DELETE product -> 200
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';
import dotenv from 'dotenv';

dotenv.config();

test.describe('FakeStore Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? Helper.getFakeStoreTestData().productId);
    const PRODUCT_LIMIT = Number(process.env.LIMIT ?? Helper.getFakeStoreTestData().productLimit);
    const PRODUCT_CATEGORY = Helper.getFakeStoreTestData().productCategory;

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response must be an array').toBeTruthy();
        expect(responseBody.length, 'Products array must not be empty').toBeGreaterThan(0);

        for (const product of responseBody) {
            expect(product.id, 'Product must have an id').toBeDefined();
            expect(typeof product.id, 'Product id must be a number').toBe('number');
            expect(product.title, 'Product must have a title').toBeDefined();
            expect(typeof product.title, 'Product title must be a string').toBe('string');
            expect(product.price, 'Product must have a price').toBeDefined();
            expect(typeof product.price, 'Product price must be a number').toBe('number');
            expect(product.category, 'Product must have a category').toBeDefined();
            expect(typeof product.category, 'Product category must be a string').toBe('string');
            expect(product.image, 'Product must have an image').toBeDefined();
            expect(typeof product.image, 'Product image must be a string').toBe('string');
        }

        console.log('✅ All products returned with valid structure');
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const product = await response.json();

        expect(product.id, `Product id must match requested id ${PRODUCT_ID}`).toBe(PRODUCT_ID);
        expect(product.title, 'Product must have a title').toBeDefined();
        expect(product.price, 'Product must have a price').toBeDefined();
        expect(product.category, 'Product must have a category').toBeDefined();
        expect(product.image, 'Product must have an image').toBeDefined();

        console.log(`✅ Product ${PRODUCT_ID} returned with matching id`);
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with Limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(PRODUCT_LIMIT))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response must be an array').toBeTruthy();
        expect(responseBody.length, `Expected ${PRODUCT_LIMIT} products but got ${responseBody.length}`).toBe(PRODUCT_LIMIT);

        console.log(`✅ Products limit returned exactly ${PRODUCT_LIMIT} items`);
    });

    // ---------------------------------------------------------
    // GET - Products Sorted (Ascending / Descending)
    // ---------------------------------------------------------

    test('GET - Products Sorted Ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((product: { id: number }) => product.id);

        const sortedIds = [...ids].sort((a, b) => a - b);
        expect(ids, 'Product ids must be in ascending order').toEqual(sortedIds);

        console.log('✅ Products sorted ascending by id');
    });

    test('GET - Products Sorted Descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((product: { id: number }) => product.id);

        const sortedIds = [...ids].sort((a, b) => b - a);
        expect(ids, 'Product ids must be in descending order').toEqual(sortedIds);

        console.log('✅ Products sorted descending by id');
    });

    // ---------------------------------------------------------
    // GET - All Product Categories
    // ---------------------------------------------------------

    test('GET - All Product Categories @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const categories = await response.json();

        expect(Array.isArray(categories), 'Categories must be an array').toBeTruthy();
        expect(categories.length, 'Category list must not be empty').toBeGreaterThan(0);
        for (const category of categories) {
            expect(typeof category, 'Each category must be a string').toBe('string');
        }

        console.log(`✅ Categories returned: ${categories.join(', ')}`);
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by Category @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', PRODUCT_CATEGORY)}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Products must be an array').toBeTruthy();
        expect(products.length, 'Products for the category must not be empty').toBeGreaterThan(0);

        for (const product of products) {
            expect(product.category, `Product ${product.id} must belong to category '${PRODUCT_CATEGORY}'`).toBe(PRODUCT_CATEGORY);
        }

        console.log(`✅ All returned products belong to '${PRODUCT_CATEGORY}'`);
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status(), `Expected 201 but got ${response.status()}`).toBe(201);

        const created = await response.json();

        expect(created.id, 'Created product must return an id').toBeDefined();
        expect(created.title, 'Created product must echo the submitted title').toBe(payload.title);
        expect(created.price, 'Created product must echo the submitted price').toBe(payload.price);

        console.log(`✅ Product created with id ${created.id}`);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update Product @master @regression @api', async ({ request }) => {

        const updatedPayload = RandomDataUtil.generateUpdatedProductPayload();

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`, {
            data: updatedPayload,
        });

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        const updated = await response.json();

        expect(updated.id, `Updated product id must match requested id ${PRODUCT_ID}`).toBe(PRODUCT_ID);
        expect(updated.title, 'Updated product must reflect the new title').toBe(updatedPayload.title);
        expect(updated.price, 'Updated product must reflect the new price').toBe(updatedPayload.price);

        console.log(`✅ Product ${PRODUCT_ID} updated with new values`);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status(), `Expected 200 but got ${response.status()}`).toBe(200);

        // FakeStore returns the deleted product as the response body
        const deleted = await response.json();
        expect(deleted.id, 'Deleted product response should include the product id').toBe(PRODUCT_ID);

        console.log(`✅ Product ${PRODUCT_ID} deleted successfully`);
    });
});
