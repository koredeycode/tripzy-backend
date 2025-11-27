import argon2 from 'argon2';
import request from 'supertest';
import app from '../../app';
import { query } from '../../db';

// Mock the db module
jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('Auth Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user and return a token', async () => {
      (query as jest.Mock).mockResolvedValueOnce({ rows: [] }); // Check user exists
      (query as jest.Mock).mockResolvedValueOnce({ // Insert user
        rows: [{ id: 'user-123', first_name: 'John', last_name: 'Doe', email: 'john@example.com' }],
      });

      const res = await request(app).post('/api/auth/signup').send({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id', 'user-123');
    });

    it('should return 400 if user already exists', async () => {
      (query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 'existing' }] }); // Check user exists

      const res = await request(app).post('/api/auth/signup').send({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400); // Or whatever error code your app returns for existing user, likely 400 or 500 depending on error handling
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and return token', async () => {
      const hashedPassword = await argon2.hash('password123');
      (query as jest.Mock).mockResolvedValueOnce({ // Find user
        rows: [{ id: 'user-123', email: 'john@example.com', password_hash: hashedPassword }],
      });
      (query as jest.Mock).mockResolvedValueOnce({ rows: [] }); // Check driver

      const res = await request(app).post('/api/auth/login').send({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.is_driver).toBe(false);
    });

    it('should return 400 for invalid credentials', async () => {
      (query as jest.Mock).mockResolvedValueOnce({ rows: [] }); // User not found

      const res = await request(app).post('/api/auth/login').send({
        email: 'john@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(400); // Or 500 if error handling catches it differently
    });
  });
});
