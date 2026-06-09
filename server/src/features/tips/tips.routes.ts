/**
 * @module features/tips/tips.routes
 * @description Express router for reduction tips endpoints.
 */

import { Router } from 'express';
import { optionalAuth } from '../../middleware/auth.middleware';
import { handleGetTips, handleGetPersonalizedTips } from './tips.controller';

const router = Router();

/** GET /api/tips — All tips (publicly accessible) */
router.get('/', handleGetTips);

/** GET /api/tips/personalized — Personalized tips */
router.get('/personalized', optionalAuth, handleGetPersonalizedTips);

export default router;
