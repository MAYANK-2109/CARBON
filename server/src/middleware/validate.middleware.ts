/**
 * @module middleware/validate
 * @description Zod-based request validation middleware.
 * Validates request body against a Zod schema and strips unknown fields.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Creates middleware that validates req.body against the provided Zod schema.
 * On success, replaces req.body with the parsed (sanitized) data.
 * On failure, passes the ZodError to the error handler.
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Sanitize a string by stripping HTML tags to prevent XSS.
 * @param input - Raw user input string
 * @returns Sanitized string with HTML tags removed
 */
export function sanitizeString(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}
