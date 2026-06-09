/**
 * @module middleware/auth
 * @description JWT authentication middleware.
 * Extracts tokens from HttpOnly cookies and attaches user payload to request.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/token';

/** Extend Express Request to include authenticated user */
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware that requires a valid JWT access token in cookies.
 * Rejects requests without valid authentication.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.['accessToken'] as string | undefined;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
    });
    return;
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Optional auth middleware — attaches user if token exists but doesn't reject.
 * Useful for endpoints that work differently for authenticated vs anonymous users.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.['accessToken'] as string | undefined;

  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}
