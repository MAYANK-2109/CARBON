/**
 * @module middleware/auth.test
 * @description Unit tests for JWT authentication middleware.
 * Tests requireAuth and optionalAuth for all token states.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { requireAuth, optionalAuth } from './auth.middleware';
import * as tokenUtils from '../utils/token';

// ─── Helpers ─────────────────────────────────────────────

function createMockReqRes(cookies: Record<string, string> = {}) {
  const req = { cookies } as unknown as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

const validPayload = { userId: 'user-123', email: 'test@example.com' };

// ─── requireAuth ──────────────────────────────────────────

describe('requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls next and attaches user when token is valid', () => {
    const { req, res, next } = createMockReqRes({ accessToken: 'valid-token' });
    vi.spyOn(tokenUtils, 'verifyAccessToken').mockReturnValue(validPayload);

    requireAuth(req, res, next);

    expect(tokenUtils.verifyAccessToken).toHaveBeenCalledWith('valid-token');
    expect(req.user).toEqual(validPayload);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('responds 401 when no accessToken cookie is present', () => {
    const { req, res, next } = createMockReqRes({}); // no token

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authentication required. Please log in.',
    });
    expect(next).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it('responds 401 when token is invalid or expired', () => {
    const { req, res, next } = createMockReqRes({ accessToken: 'invalid-or-expired' });
    vi.spyOn(tokenUtils, 'verifyAccessToken').mockReturnValue(null);

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
    expect(next).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });
});

// ─── optionalAuth ─────────────────────────────────────────

describe('optionalAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('attaches user and calls next when token is valid', () => {
    const { req, res, next } = createMockReqRes({ accessToken: 'valid-token' });
    vi.spyOn(tokenUtils, 'verifyAccessToken').mockReturnValue(validPayload);

    optionalAuth(req, res, next);

    expect(req.user).toEqual(validPayload);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('still calls next (without user) when no token is present', () => {
    const { req, res, next } = createMockReqRes({});

    optionalAuth(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('still calls next (without user) when token is invalid', () => {
    const { req, res, next } = createMockReqRes({ accessToken: 'bad-token' });
    vi.spyOn(tokenUtils, 'verifyAccessToken').mockReturnValue(null);

    optionalAuth(req, res, next);

    // Invalid token — user not attached, but request continues
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('does not reject requests even without a token', () => {
    const { req, res, next } = createMockReqRes({});

    expect(() => optionalAuth(req, res, next)).not.toThrow();
    expect(next).toHaveBeenCalled();
  });
});
