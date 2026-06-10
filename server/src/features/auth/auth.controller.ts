/**
 * @module features/auth/auth.controller
 * @description Express request handlers for authentication endpoints.
 * Sets HttpOnly cookies for JWT tokens.
 */

import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, refreshTokens, getUserProfile } from './auth.service';
import { env } from '../../config/environment';

/** Cookie options for secure token storage */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? ('none' as const) : ('lax' as const),
  path: '/',
};

/**
 * POST /api/auth/register
 * Register a new user and set auth cookies.
 */
export async function handleRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password } = req.body;
    const result = await registerUser(name, email, password);

    // Set HttpOnly cookies
    res.cookie('accessToken', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      data: { user: result.user },
      message: 'Account created successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Authenticate user and set auth cookies.
 */
export async function handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    res.cookie('accessToken', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: { user: result.user },
      message: 'Logged in successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 * Clear auth cookies.
 */
export function handleLogout(_req: Request, res: Response): void {
  res.clearCookie('accessToken', COOKIE_OPTIONS);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    data: null,
    message: 'Logged out successfully.',
  });
}

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token from cookies.
 */
export async function handleRefresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.['refreshToken'];
    if (!token) {
      res.status(401).json({ success: false, message: 'No refresh token provided.' });
      return;
    }

    const result = await refreshTokens(token);

    res.cookie('accessToken', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: null,
      message: 'Token refreshed successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Get authenticated user profile.
 */
export async function handleGetProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getUserProfile(req.user!.userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}
