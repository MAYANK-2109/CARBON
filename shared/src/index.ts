/**
 * @module @carbon/shared
 * @description Barrel export for all shared types, schemas, and constants.
 */

// ─── Types ───────────────────────────────────────────────
export type {
  RegisterInput,
  LoginInput,
  UserProfile,
  AuthResponse,
} from './types/auth.types.js';

export type {
  VehicleType,
  FuelType,
  FlightType,
  TravelInput,
  EnergyInput,
  DietInput,
  FoodEntry,
  FoodCategory,
  EmissionBreakdown,
  CalculationResult,
} from './types/calculator.types.js';

export type {
  EmissionCategory,
  EmissionRecord,
  EmissionSummary,
  TrendDataPoint,
  MonthlyTrend,
  PaginatedHistory,
} from './types/emission.types.js';

export type {
  ApiResponse,
  ApiError,
  TipImpactLevel,
  ReductionTip,
} from './types/api.types.js';

// ─── Zod Schemas ─────────────────────────────────────────
export {
  RegisterSchema,
  LoginSchema,
} from './types/auth.types.js';

export {
  TravelInputSchema,
  EnergyInputSchema,
  DietInputSchema,
  VehicleTypes,
  FuelTypes,
  FlightTypes,
  FoodCategories,
} from './types/calculator.types.js';

// ─── Constants ───────────────────────────────────────────
export {
  TRAVEL_FACTORS,
  ENERGY_FACTORS,
  DIET_FACTORS,
  CO2E_EQUIVALENTS,
  FREQUENCY_MULTIPLIERS,
} from './constants/emission-factors.js';