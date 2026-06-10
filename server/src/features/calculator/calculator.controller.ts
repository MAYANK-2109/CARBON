/**
 * @module features/calculator/calculator.controller
 * @description Request handlers for carbon calculation endpoints.
 * Results are cached and optionally persisted to user history.
 */

import { Request, Response, NextFunction } from 'express';
import { calculateTravel, calculateEnergy, calculateDiet } from './calculator.service';
import { cache, getCacheKey } from '../../config/cache';
import { Emission } from '../../models/Emission.model';
import type { CalculationResult, EmissionBreakdown } from '@carbon/shared';

/**
 * POST /api/calculate/travel
 * Calculate travel carbon emissions.
 */
export async function handleCalculateTravel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cacheKey = getCacheKey('calc:travel', req.body);
    let result = cache.get<CalculationResult>(cacheKey);

    if (!result) {
      result = calculateTravel(req.body);
      cache.set(cacheKey, result);
    }

    // Persist to history if user is authenticated
    if (req.user) {
      await persistEmission(req.user.userId, result);
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/calculate/energy
 * Calculate energy carbon emissions.
 */
export async function handleCalculateEnergy(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cacheKey = getCacheKey('calc:energy', req.body);
    let result = cache.get<CalculationResult>(cacheKey);

    if (!result) {
      result = calculateEnergy(req.body);
      cache.set(cacheKey, result);
    }

    if (req.user) {
      await persistEmission(req.user.userId, result);
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/calculate/diet
 * Calculate diet carbon emissions.
 */
export async function handleCalculateDiet(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cacheKey = getCacheKey('calc:diet', req.body);
    let result = cache.get<CalculationResult>(cacheKey);

    if (!result) {
      result = calculateDiet(req.body);
      cache.set(cacheKey, result);
    }

    if (req.user) {
      await persistEmission(req.user.userId, result);
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * Persist calculation results to the Emission collection for history tracking.
 * Creates one record per breakdown item to enable granular analysis.
 * @param userId - Authenticated user's database ID
 * @param result - The full calculation result with breakdown items
 * @throws {MongoServerError} if the database write fails
 */
async function persistEmission(userId: string, result: CalculationResult): Promise<void> {
  const records = result.breakdown.map((item: EmissionBreakdown) => ({
    userId,
    category: result.category,
    subcategory: item.subcategory,
    inputValue: item.co2eKg,
    inputUnit: 'kg CO₂e',
    co2eKg: item.co2eKg,
  }));

  // Bulk insert for efficiency
  await Emission.insertMany(records);
}
