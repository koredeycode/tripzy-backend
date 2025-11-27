import { Redis } from 'ioredis';

// Use a separate env var for Redis if available, otherwise default to localhost
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisConnection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
});
