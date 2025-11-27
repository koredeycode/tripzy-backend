import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../../app';
import { env } from '../../config/env';
import { query } from '../../db';

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
};

describe('User Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /api/users/:id', () => {
    it('should update user profile if authorized', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);

      (query as jest.Mock).mockResolvedValueOnce({ // Update query
        rows: [{ id: userId, first_name: 'Updated', last_name: 'Name', email: 'test@example.com' }],
      });

      const res = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Updated', last_name: 'Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.first_name).toBe('Updated');
    });

    it('should return 403 if updating another user', async () => {
      const userId = 'user-123';
      const otherUserId = 'user-456';
      const token = generateToken(userId);

      const res = await request(app)
        .put(`/api/users/${otherUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Updated' });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/users/:id/rides', () => {
    it('should get user rides if authorized', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);

      (query as jest.Mock).mockResolvedValueOnce({ // Get rides query
        rows: [{ ride_id: 'ride-1', origin_address: 'A', destination_address: 'B' }],
      });

      const res = await request(app)
        .get(`/api/users/${userId}/rides`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });
});
