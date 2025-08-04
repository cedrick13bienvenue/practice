#!/usr/bin/env node

import { startEmailWorker } from '../services/email-worker';
import { connectDB } from '../config/db';
import { redisClient } from '../config/redis';

console.log('🚀 Starting Email Worker...');

async function main() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Test Redis connection
    await redisClient.ping();
    console.log('✅ Redis connected');

    // Start email worker
    await startEmailWorker();
  } catch (error) {
    console.error('❌ Failed to start email worker:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down email worker...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down email worker...');
  process.exit(0);
});

// Start the worker
main().catch((error) => {
  console.error('❌ Email worker failed:', error);
  process.exit(1);
}); 