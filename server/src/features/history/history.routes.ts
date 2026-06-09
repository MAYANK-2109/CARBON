/**
 * @module features/history/history.routes
 * @description Express router for emission history endpoints.
 * All routes require authentication.
 */

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { handleGetHistory, handleGetSummary, handleGetTrends } from './history.controller';

const router = Router();

// All history routes require authentication
router.use(requireAuth);

/** GET /api/history — Paginated emission history */
router.get('/', handleGetHistory);

/** GET /api/history/summary — Aggregated emission summary */
router.get('/summary', handleGetSummary);

/** GET /api/history/trends — Monthly emission trends */
router.get('/trends', handleGetTrends);

export default router;
