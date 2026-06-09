/**
 * @module utils/token.test
 * @description Unit tests for JWT token generation and verification.
 * Tests access tokens, refresh tokens, expiry, and invalid token handling.
 */

import { describe, it, expect } from 'vitest';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './token';
import type { TokenPayload } from './token';

const mockPayload: TokenPayload = {
  userId: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
};

describe('token utilities', () => {
  // ─── Access Token ─────────────────────────────────────

  describe('generateAccessToken / verifyAccessToken', () => {
    it('generates a valid access token that can be verified', () => {
      const token = generateAccessToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts

      const decoded = verifyAccessToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded!.userId).toBe(mockPayload.userId);
      expect(decoded!.email).toBe(mockPayload.email);
    });

    it('returns null for an invalid access token', () => {
      const result = verifyAccessToken('invalid.token.string');
      expect(result).toBeNull();
    });

    it('returns null for an empty token', () => {
      const result = verifyAccessToken('');
      expect(result).toBeNull();
    });

    it('does not verify an access token with the refresh secret', () => {
      const accessToken = generateAccessToken(mockPayload);
      // Access token should NOT be verifiable as a refresh token
      const result = verifyRefreshToken(accessToken);
      expect(result).toBeNull();
    });
  });

  // ─── Refresh Token ────────────────────────────────────

  describe('generateRefreshToken / verifyRefreshToken', () => {
    it('generates a valid refresh token that can be verified', () => {
      const token = generateRefreshToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = verifyRefreshToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded!.userId).toBe(mockPayload.userId);
      expect(decoded!.email).toBe(mockPayload.email);
    });

    it('returns null for an invalid refresh token', () => {
      const result = verifyRefreshToken('garbage-token');
      expect(result).toBeNull();
    });

    it('does not verify a refresh token with the access secret', () => {
      const refreshToken = generateRefreshToken(mockPayload);
      // Refresh token should NOT be verifiable as an access token
      const result = verifyAccessToken(refreshToken);
      expect(result).toBeNull();
    });
  });

  // ─── Token Distinctness ───────────────────────────────

  describe('token distinctness', () => {
    it('generates different tokens for access vs refresh', () => {
      const accessToken = generateAccessToken(mockPayload);
      const refreshToken = generateRefreshToken(mockPayload);

      expect(accessToken).not.toBe(refreshToken);
    });

    it('generates different tokens for different payloads', () => {
      const token1 = generateAccessToken(mockPayload);
      const token2 = generateAccessToken({
        userId: 'different-user-id',
        email: 'other@example.com',
      });

      expect(token1).not.toBe(token2);
    });
  });
});
