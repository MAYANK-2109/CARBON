/**
 * @module features/history/history.controller
 * @description Request handlers for emission history endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { getHistory, getSummary, getMonthlyTrends } from './history.service';
import type { EmissionCategory } from '@carbon/shared';

/**
 * GET /api/history
 * Get paginated emission history for the authenticated user.
 * Query params: page, limit, category
 */
export async function handleGetHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = Math.min(parseInt(req.query['limit'] as string) || 20, 100);
    const category = req.query['category'] as EmissionCategory | undefined;

    const result = await getHistory(req.user!.userId, page, limit, category);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/history/summary
 * Get aggregated emission summary for a time period.
 * Query params: start, end (ISO date strings)
 */
export async function handleGetSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startDate = req.query['start']
      ? new Date(req.query['start'] as string)
      : startOfMonth;
    const endDate = req.query['end']
      ? new Date(req.query['end'] as string)
      : now;

    const result = await getSummary(req.user!.userId, startDate, endDate);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/history/trends
 * Get monthly emission trends for the last N months.
 * Query params: months (default 6)
 */
export async function handleGetTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const months = Math.min(parseInt(req.query['months'] as string) || 6, 24);
    const result = await getMonthlyTrends(req.user!.userId, months);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
