/**
 * @module config/environment
 * @description Centralized environment configuration with Zod validation.
 * Crashes on startup with a clear message if any required variable is missing or malformed.
 */

import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ENCRYPTION_KEY: z.string().length(64, 'ENCRYPTION_KEY must be exactly 64 hex characters'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  GEMINI_API_KEY: z.string().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n❌ Invalid Environment Configuration:\n');
  parsed.error.errors.forEach((e) => {
    console.error(`  • ${e.path.join('.')}: ${e.message}`);
  });
  console.error('\nCheck your .env file against .env.example and try again.\n');
  process.exit(1);
}

const _env = parsed.data;

/** Application environment configuration */
export const env = {
  ..._env,
  get isProduction() {
    return _env.NODE_ENV === 'production';
  },
} as const;
