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

describe('Ride Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/rides', () => {
    it('should create a ride if authorized', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);

      (query as jest.Mock).mockResolvedValueOnce({ // Create ride query
        rows: [{ ride_id: 'ride-1', user_id: userId, origin_address: 'A' }],
      });

      const res = await request(app)
        .post('/api/rides')
        .set('Authorization', `Bearer ${token}`)
        .send({
          origin_address: 'A',
          destination_address: 'B',
          origin_latitude: 1,
          origin_longitude: 1,
          destination_latitude: 2,
          destination_longitude: 2,
          ride_time: 100,
          fare_price: 50,
          payment_status: 'pending',
          driver_id: 'driver-1',
          user_id: 'should-be-ignored', // Should be overwritten by token userId
        });

      expect(res.status).toBe(201);
      expect(res.body.data.user_id).toBe(userId);
    });

    it('should return 401 if not authorized', async () => {
      const res = await request(app)
        .post('/api/rides')
        .send({ origin_address: 'A' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/rides/:id', () => {
    it('should get ride if user is the creator', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);
      const rideId = 'ride-1';

      // Mock getRide query (called by authorizeRideAccess middleware AND controller)
      // Middleware calls getRide
      (query as jest.Mock).mockResolvedValueOnce({
        rows: [{ ride_id: rideId, user_id: userId, driver_id: 'driver-1' }],
      });
      // Controller calls getRide
      (query as jest.Mock).mockResolvedValueOnce({
        rows: [{ ride_id: rideId, user_id: userId, driver_id: 'driver-1' }],
      });

      const res = await request(app)
        .get(`/api/rides/${rideId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.ride_id).toBe(rideId);
    });

    it('should return 403 if user is not the creator', async () => {
      const userId = 'user-123';
      const otherUserId = 'user-456';
      const token = generateToken(userId);
      const rideId = 'ride-1';

      // Middleware calls getRide
      (query as jest.Mock).mockResolvedValueOnce({
        rows: [{ ride_id: rideId, user_id: otherUserId, driver_id: 'driver-1' }],
      });

      const res = await request(app)
        .get(`/api/rides/${rideId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });
});
