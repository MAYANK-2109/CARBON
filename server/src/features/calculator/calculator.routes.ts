/**
 * @module features/calculator/calculator.routes
 * @description Express router for carbon calculation endpoints.
 */

import { Router } from 'express';
import { TravelInputSchema, EnergyInputSchema, DietInputSchema } from '@carbon/shared';
import { validate } from '../../middleware/validate.middleware';
import { optionalAuth } from '../../middleware/auth.middleware';
import { calculatorLimiter } from '../../middleware/rate-limiter.middleware';
import {
  handleCalculateTravel,
  handleCalculateEnergy,
  handleCalculateDiet,
} from './calculator.controller';

const router = Router();

// Apply calculator-specific rate limiting
router.use(calculatorLimiter);

// Apply optional auth — calculations work for both anonymous and logged-in users
router.use(optionalAuth);

/** POST /api/calculate/travel — Calculate travel emissions */
router.post('/travel', validate(TravelInputSchema), handleCalculateTravel);

/** POST /api/calculate/energy — Calculate energy emissions */
router.post('/energy', validate(EnergyInputSchema), handleCalculateEnergy);

/** POST /api/calculate/diet — Calculate diet emissions */
router.post('/diet', validate(DietInputSchema), handleCalculateDiet);

export default router;
