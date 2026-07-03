import request from 'supertest';
import mongoose from 'mongoose';
import { describe, test, expect, afterAll } from '@jest/globals';
import { app, server } from '../server.js';

// describe('TechMart API Tests', () => {
//   afterAll(async () => {
//     // Clean up handles
//     await mongoose.connection.close();
//     await new Promise((resolve) => server.close(resolve));
//   });

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  if (server) {
    await new Promise(resolve => server.close(resolve));
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
});
