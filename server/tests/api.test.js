// import request from 'supertest';
// import mongoose from 'mongoose';
// import { describe, test, expect, afterAll } from '@jest/globals';
// import { app, server } from '../server.js';

// // describe('TechMart API Tests', () => {
// //   afterAll(async () => {
// //     // Clean up handles
// //     await mongoose.connection.close();
// //     await new Promise((resolve) => server.close(resolve));
// //   });

// afterAll(async () => {
//   if (mongoose.connection.readyState !== 0) {
//     await mongoose.connection.close();
//   }

//   if (server) {
//     await new Promise(resolve => server.close(resolve));
//   }
// });


// test('GET / should return server status', async () => {
//   const res = await request(app).get('/');
//   expect(res.status).toBe(200);
//   expect(res.text).toContain('TechMart API is running...');
// });

// test('GET /api/nonexistent should return 404', async () => {
//   const res = await request(app).get('/api/nonexistent');
//   expect(res.status).toBe(404);
//   expect(res.body.message).toContain('Not Found');
// });



import request from 'supertest';
import mongoose from 'mongoose';
import { describe, test, expect, afterAll } from '@jest/globals';
import { app, server } from '../server.js';
import Product from '../models/Product.js';

describe('TechMart API Tests', () => {

  afterAll(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }

      if (server) {
        await new Promise((resolve) => server.close(resolve));
      }
    } catch (err) {
      console.error(err);
    }
  });

  test('GET / should return server status', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toContain('TechMart API is running...');
  });

  test('GET /api/nonexistent should return 404', async () => {
    const res = await request(app).get('/api/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('Not Found');
  });

  test('Product model should reject negative stock quantity', async () => {
    const product = new Product({
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      brand: 'Test Brand',
      price: 100,
      stock: -5,
      image: '/images/sample.jpg',
    });

    let error = null;
    try {
      await product.validate();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.stock.message).toBe('Stock quantity cannot be negative');
  });

  test('Product model should reject decimal stock quantity', async () => {
    const product = new Product({
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      brand: 'Test Brand',
      price: 100,
      stock: 12.5,
      image: '/images/sample.jpg',
    });

    let error = null;
    try {
      await product.validate();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.stock.message).toBe('Stock quantity must be an integer');
  });

});
