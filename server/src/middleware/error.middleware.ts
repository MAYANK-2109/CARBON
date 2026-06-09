/**
 * @module middleware/error
 * @description Global error handling middleware.
 * Catches all unhandled errors and returns consistent JSON responses.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/environment';

/** Custom application error with status code */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware.
 * Handles Zod validation errors, AppErrors, and unexpected errors.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors → 400
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'A record with this information already exists.',
    });
    return;
  }

  // Unexpected errors — hide details in production
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: env.isProduction
      ? 'An unexpected error occurred. Please try again later.'
      : err.message,
  });
}
