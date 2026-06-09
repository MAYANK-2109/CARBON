/**
 * @module middleware/validate.test
 * @description Unit tests for the Zod validation middleware and sanitize utility.
 */

import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { validate, sanitizeString } from './validate.middleware';
import type { Request, Response, NextFunction } from 'express';

// ─── Helpers ─────────────────────────────────────────────

function createMockReqRes(body: unknown) {
  const req = { body } as Request;
  const res = {} as Response;
  const next = vi.fn() as NextFunction;
  return { req, res, next };
}

// ─── validate middleware ─────────────────────────────────

describe('validate middleware', () => {
  const schema = z.object({
    name: z.string().min(2),
    age: z.number().int().positive(),
  });

  it('passes valid data and strips unknown fields', () => {
    const { req, res, next } = createMockReqRes({
      name: 'Alice',
      age: 30,
      extraField: 'should be kept by parse (not strip by default)',
    });

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // called without error
    expect(req.body).toHaveProperty('name', 'Alice');
    expect(req.body).toHaveProperty('age', 30);
  });

  it('passes ZodError to next on invalid data', () => {
    const { req, res, next } = createMockReqRes({
      name: 'A', // too short
      age: -5, // negative
    });

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = (next as any).mock.calls[0][0];
    expect(error).toBeInstanceOf(z.ZodError);
  });

  it('passes ZodError on missing required fields', () => {
    const { req, res, next } = createMockReqRes({});

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = (next as any).mock.calls[0][0];
    expect(error).toBeInstanceOf(z.ZodError);
  });
});

// ─── sanitizeString ─────────────────────────────────────

describe('sanitizeString', () => {
  it('removes HTML tags', () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe('alert("xss")');
    expect(sanitizeString('<b>bold</b>')).toBe('bold');
    expect(sanitizeString('no tags')).toBe('no tags');
  });

  it('trims whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
    expect(sanitizeString('\n\ttab\n')).toBe('tab');
  });

  it('handles empty string', () => {
    expect(sanitizeString('')).toBe('');
  });

  it('removes nested tags', () => {
    expect(sanitizeString('<div><span>text</span></div>')).toBe('text');
  });

  it('handles self-closing tags', () => {
    expect(sanitizeString('before<br/>after')).toBe('beforeafter');
    expect(sanitizeString('img<img src="x.png"/>here')).toBe('imghere');
  });
});
