/**
 * @module middleware/error.test
 * @description Unit tests for the global error handler middleware.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZodError, z } from 'zod';
import { AppError, errorHandler } from './error.middleware';
import type { Request, Response, NextFunction } from 'express';

vi.mock('../config/environment', () => ({
  env: {
    isProduction: false,
    NODE_ENV: 'test',
  },
}));

// ─── Helpers ─────────────────────────────────────────────

function createMockResponse() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

const mockReq = {} as Request;
const mockNext = vi.fn() as NextFunction;

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error during tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('handles ZodError with 400 status and field details', () => {
    const schema = z.object({ email: z.string().email() });
    let zodError: ZodError;
    try {
      schema.parse({ email: 'invalid' });
      throw new Error('Should not reach here');
    } catch (e) {
      zodError = e as ZodError;
    }

    const res = createMockResponse();
    errorHandler(zodError!, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        errors: expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
        ]),
      })
    );
  });

  it('handles AppError with custom status code', () => {
    const error = new AppError(409, 'Email already exists.');
    const res = createMockResponse();

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email already exists.',
    });
  });

  it('handles AppError 404', () => {
    const error = new AppError(404, 'Not found');
    const res = createMockResponse();

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('handles generic Error with 500 status (dev mode shows message)', () => {
    const error = new Error('Something went wrong');
    const res = createMockResponse();

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Something went wrong' })
    );
  });

  it('handles MongoServerError duplicate key (code 11000) with 409 status', () => {
    const error = Object.assign(new Error('E11000 duplicate key error'), {
      name: 'MongoServerError',
      code: 11000,
    });
    const res = createMockResponse();

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'A record with this information already exists.',
    });
  });

  it('hides error details in production mode with 500 status', async () => {
    // Re-mock env as production for this test only
    const { env } = await import('../config/environment');
    (env as any).isProduction = true;

    const error = new Error('Secret internal error');
    const res = createMockResponse();

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    });

    // Restore
    (env as any).isProduction = false;
  });
});

describe('AppError', () => {
  it('creates an error with status code and message', () => {
    const err = new AppError(422, 'Unprocessable');

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(422);
    expect(err.message).toBe('Unprocessable');
    expect(err.isOperational).toBe(true);
    expect(err.name).toBe('AppError');
  });

  it('supports non-operational (programmer) errors', () => {
    const err = new AppError(500, 'Internal', false);

    expect(err.isOperational).toBe(false);
  });
});
