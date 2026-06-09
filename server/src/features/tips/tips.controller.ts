/**
 * @module features/tips/tips.controller
 * @description Request handlers for carbon reduction tips.
 */

import { Request, Response } from 'express';
import { TIPS_DATABASE } from './tips.data';
import type { ReductionTip } from '@carbon/shared';

/** Tips with generated IDs */
const tipsWithIds: ReductionTip[] = TIPS_DATABASE.map((tip, index) => ({
  ...tip,
  id: `tip-${String(index + 1).padStart(3, '0')}`,
}));

/**
 * GET /api/tips
 * Get all tips, optionally filtered by category.
 * Query params: category, limit
 */
export function handleGetTips(req: Request, res: Response): void {
  const { category, limit: limitStr } = req.query;
  let filtered = tipsWithIds;

  if (category && typeof category === 'string') {
    filtered = filtered.filter((tip) => tip.category === category);
  }

  const limit = limitStr ? parseInt(limitStr as string, 10) : filtered.length;
  const result = filtered.slice(0, limit);

  res.status(200).json({ success: true, data: result });
}

/**
 * GET /api/tips/personalized
 * Get personalized tips based on user's highest-emission category.
 * Falls back to general high-impact tips if no history exists.
 */
export function handleGetPersonalizedTips(req: Request, res: Response): void {
  // For now, return top 5 tips by impact level and savings
  const sorted = [...tipsWithIds].sort((a, b) => {
    const levelOrder: Record<'high' | 'medium' | 'low', number> = { high: 3, medium: 2, low: 1 };
    const levelDiff = levelOrder[b.impactLevel] - levelOrder[a.impactLevel];
    if (levelDiff !== 0) return levelDiff;
    return b.estimatedSavingsKgPerYear - a.estimatedSavingsKgPerYear;
  });

  res.status(200).json({
    success: true,
    data: sorted.slice(0, 5),
  });
}
