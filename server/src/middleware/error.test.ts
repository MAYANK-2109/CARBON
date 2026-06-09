/**
 * @module middleware/error.test
 * @description Unit tests for the global error handler middleware.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZodError, z } from 'zod';
import { AppError, errorHandler } from './error.middleware';
import type { Request, Response, NextFunction } from 'express';

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

  it('handles generic Error with 500 status', () => {
    const error = new Error('Something went wrong');
    const res = createMockResponse();

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
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
