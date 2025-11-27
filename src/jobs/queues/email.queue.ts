import { Queue } from 'bullmq';
import { redisConnection } from '../../config/redis';

export const emailQueue = new Queue('email', {
  connection: redisConnection,
});

export const addEmailJob = async (name: string, data: any) => {
  return emailQueue.add(name, data);
};
