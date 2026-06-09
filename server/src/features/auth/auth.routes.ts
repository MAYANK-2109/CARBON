/**
 * @module features/auth/auth.routes
 * @description Express router for authentication endpoints.
 */

import { Router } from 'express';
import { RegisterSchema, LoginSchema } from '@carbon/shared';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { authLimiter } from '../../middleware/rate-limiter.middleware';
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleRefresh,
  handleGetProfile,
} from './auth.controller';

const router = Router();

// Apply stricter rate limiting to auth routes
router.use(authLimiter);

/** POST /api/auth/register — Create a new account */
router.post('/register', validate(RegisterSchema), handleRegister);

/** POST /api/auth/login — Sign in with credentials */
router.post('/login', validate(LoginSchema), handleLogin);

/** POST /api/auth/logout — Sign out and clear cookies */
router.post('/logout', handleLogout);

/** POST /api/auth/refresh — Refresh access token */
router.post('/refresh', handleRefresh);

/** GET /api/auth/me — Get authenticated user profile */
router.get('/me', requireAuth, handleGetProfile);

export default router;
