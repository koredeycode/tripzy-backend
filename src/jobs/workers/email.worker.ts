import { Worker } from 'bullmq';
import { sendEmail } from '../../config/email';
import { redisConnection } from '../../config/redis';

export const emailWorker = new Worker(
  'email',
  async (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    const { to, subject, text, html } = job.data;

    try {
      await sendEmail(to, subject, text, html);
      console.log(`Email sent for job ${job.id}`);
    } catch (error) {
      console.error(`Failed to send email for job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
  }
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed with ${err.message}`);
});
