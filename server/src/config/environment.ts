/**
 * @module config/environment
 * @description Centralized environment configuration with validation.
 * Loads environment variables from .env and exports typed config object.
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

/** Application environment configuration */
export const env = {
  /** Server port */
  PORT: parseInt(process.env['PORT'] || '5000', 10),

  /** Node environment */
  NODE_ENV: process.env['NODE_ENV'] || 'development',

  /** MongoDB connection URI */
  MONGODB_URI: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/carbon-footprint',

  /** JWT access token secret */
  JWT_SECRET: process.env['JWT_SECRET'] || 'dev-jwt-secret-change-in-production',

  /** JWT refresh token secret */
  JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'] || 'dev-refresh-secret-change-in-production',

  /** JWT access token expiry */
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '15m',

  /** JWT refresh token expiry */
  JWT_REFRESH_EXPIRES_IN: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d',

  /** AES-256 encryption key for PII (hex string) */
  ENCRYPTION_KEY: process.env['ENCRYPTION_KEY'] || 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',

  /** Allowed CORS origin */
  CORS_ORIGIN: process.env['CORS_ORIGIN'] || 'http://localhost:5173',

  /** Gemini API Key for AI Assistant */
  GEMINI_API_KEY: process.env['GEMINI_API_KEY'] || '',

  /** Whether we're in production */
  get isProduction() {
    return this.NODE_ENV === 'production';
  },
} as const;
