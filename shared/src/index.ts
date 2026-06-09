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
} from './types/auth.types';

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
} from './types/calculator.types';

export type {
  EmissionCategory,
  EmissionRecord,
  EmissionSummary,
  TrendDataPoint,
  MonthlyTrend,
  PaginatedHistory,
} from './types/emission.types';

export type {
  ApiResponse,
  ApiError,
  TipImpactLevel,
  ReductionTip,
} from './types/api.types';

// ─── Zod Schemas ─────────────────────────────────────────
export {
  RegisterSchema,
  LoginSchema,
} from './types/auth.types';

export {
  TravelInputSchema,
  EnergyInputSchema,
  DietInputSchema,
  VehicleTypes,
  FuelTypes,
  FlightTypes,
  FoodCategories,
} from './types/calculator.types';

// ─── Constants ───────────────────────────────────────────
export {
  TRAVEL_FACTORS,
  ENERGY_FACTORS,
  DIET_FACTORS,
  CO2E_EQUIVALENTS,
  FREQUENCY_MULTIPLIERS,
} from './constants/emission-factors';
