import { describe, it, expect, jest } from '@jest/globals';
import { request, userResponse, prefix } from './setup';
import { UserModel } from '../src/models/user-model';

describe('Authentication Tests', () => {
  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`, // Unique email
        password: 'password123',
        gender: 'male'
      };

      const res = await request.post(`${prefix}auth/register`).send(userData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('email', userData.email);
      expect(res.body.data).toHaveProperty('name', userData.name);
    });

    it('should fail registration with existing email', async () => {
      const userData = {
        name: 'Test User',
        email: `existing-${Date.now()}@example.com`,
        password: 'password123',
        gender: 'male'
      };

      // Register first user
      await request.post(`${prefix}auth/register`).send(userData);

      // Try to register with same email
      const res = await request.post(`${prefix}auth/register`).send(userData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email already in use');
    });

    it('should fail registration with invalid data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123', // too short
        gender: 'invalid'
      };

      const res = await request.post(`${prefix}auth/register`).send(invalidData);

      expect(res.status).toBe(500); // Your API returns 500 for validation errors
      expect(res.body.success).toBe(false);
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Create a test user
      await request.post(`${prefix}auth/register`).send({
        name: 'Admin User',
        email: `admin-${Date.now()}@test.com`,
        password: 'password123',
        gender: 'male'
      });
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'admin@test.com',
        password: 'password123'
      };

      const res = await request.post(`${prefix}auth/login`).send(loginData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
      
      // Store token for other tests
      userResponse.adminToken = res.body.data.token;
    });

    it('should fail login with non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'password123'
      };

      const res = await request.post(`${prefix}auth/login`).send(loginData);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should fail login with wrong password', async () => {
      const loginData = {
        email: 'admin@test.com',
        password: 'wrongpassword'
      };

      const res = await request.post(`${prefix}auth/login`).send(loginData);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should fail login with missing credentials', async () => {
      const res = await request.post(`${prefix}auth/login`).send({});

      expect(res.status).toBe(500); // Your API returns 500 for missing data
      expect(res.body.success).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const res = await request.get(`${prefix}auth/logout`);

      expect(res.status).toBe(200);
      expect(res.text).toContain('Logged out');
    });
  });

  describe('Database Error Handling', () => {
    it('should handle database errors during registration', async () => {
      jest.spyOn(UserModel, 'create').mockRejectedValue(new Error('Database error'));

      const userData = {
        name: 'Error User',
        email: `error-${Date.now()}@test.com`,
        password: 'password123',
        gender: 'male'
      };

      const res = await request.post(`${prefix}auth/register`).send(userData);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });

    it('should handle database errors during login', async () => {
      jest.spyOn(UserModel, 'findOne').mockRejectedValue(new Error('Database error'));

      const loginData = {
        email: 'error@test.com',
        password: 'password123'
      };

      const res = await request.post(`${prefix}auth/login`).send(loginData);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });
}); 