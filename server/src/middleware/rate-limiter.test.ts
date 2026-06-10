/**
 * @module middleware/rate-limiter.test
 * @description Unit tests for rate-limiter middleware exports.
 * Verifies that all three limiters are valid Express middleware functions.
 */

import { describe, it, expect } from 'vitest';
import { generalLimiter, authLimiter, calculatorLimiter } from './rate-limiter.middleware';

describe('Rate Limiter Middleware', () => {
  it('generalLimiter is a callable middleware function', () => {
    expect(typeof generalLimiter).toBe('function');
    // express-rate-limit returns a function with 3 or 4 params
    expect(generalLimiter.length).toBeGreaterThanOrEqual(2);
  });

  it('authLimiter is a callable middleware function', () => {
    expect(typeof authLimiter).toBe('function');
    expect(authLimiter.length).toBeGreaterThanOrEqual(2);
  });

  it('calculatorLimiter is a callable middleware function', () => {
    expect(typeof calculatorLimiter).toBe('function');
    expect(calculatorLimiter.length).toBeGreaterThanOrEqual(2);
  });
});
