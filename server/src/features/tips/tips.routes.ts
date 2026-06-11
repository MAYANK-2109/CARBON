/**
 * @module features/tips/tips.routes
 * @description Express router for reduction tips endpoints.
 * Tips are static data — served with a 5-minute public Cache-Control header.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { optionalAuth } from '../../middleware/auth.middleware';
import { handleGetTips, handleGetPersonalizedTips } from './tips.controller';

const router = Router();

/** Cache static tips for 5 minutes in browsers/CDN */
function cacheControl(_req: Request, res: Response, next: NextFunction): void {
  res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  next();
}

/** GET /api/tips — All tips (publicly accessible) */
router.get('/', cacheControl, handleGetTips);

/** GET /api/tips/personalized — Personalized tips */
router.get('/personalized', optionalAuth, handleGetPersonalizedTips);

export default router;
