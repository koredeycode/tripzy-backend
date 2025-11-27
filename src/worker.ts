import dotenv from 'dotenv';
dotenv.config();

import './jobs/workers/email.worker';

console.log('🚀 Worker started and listening for jobs...');
