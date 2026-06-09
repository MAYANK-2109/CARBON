/**
 * @module config/database
 * @description MongoDB connection manager using Mongoose.
 * Handles connection, disconnection, and error logging.
 */

import mongoose from 'mongoose';
import { env } from './environment';

/**
 * Connect to MongoDB with retry logic.
 * Uses the MONGODB_URI from environment configuration.
 */
export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });
}

/**
 * Gracefully disconnect from MongoDB.
 */
export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB disconnected gracefully');
}
