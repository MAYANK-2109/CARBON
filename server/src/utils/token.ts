/**
 * @module utils/token
 * @description JWT token generation and verification utilities.
 * Generates access tokens (short-lived) and refresh tokens (long-lived).
 */

import jwt from 'jsonwebtoken';
import { env } from '../config/environment';

/** Payload embedded in JWT tokens */
export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Generate a short-lived access token.
 * @param payload - User data to embed in the token
 * @returns Signed JWT access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

/**
 * Generate a long-lived refresh token.
 * @param payload - User data to embed in the token
 * @returns Signed JWT refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
}

/**
 * Verify and decode an access token.
 * @param token - JWT access token string
 * @returns Decoded payload or null if invalid
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Verify and decode a refresh token.
 * @param token - JWT refresh token string
 * @returns Decoded payload or null if invalid
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
