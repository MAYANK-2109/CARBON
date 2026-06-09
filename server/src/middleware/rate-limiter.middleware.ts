/**
 * @module middleware/rate-limiter
 * @description Rate limiting middleware to prevent abuse.
 * Provides different limits for general API, auth, and calculator routes.
 */

import rateLimit from 'express-rate-limit';

/** General API rate limiter — 100 requests per 15 minutes per IP */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again in a few minutes.',
  },
});

/** Auth route rate limiter — 10 requests per 15 minutes (brute force protection) */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

/** Calculator route rate limiter — 30 requests per 15 minutes */
export const calculatorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Calculation rate limit reached. Please slow down.',
  },
});
