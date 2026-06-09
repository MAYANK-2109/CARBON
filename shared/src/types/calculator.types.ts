/**
 * @module @carbon/shared/types/calculator
 * @description Calculator input/output type definitions and Zod validation schemas.
 */

import { z } from 'zod';

// ─── Travel ──────────────────────────────────────────────

/** Supported vehicle / transport types */
export const VehicleTypes = ['car', 'flight', 'train', 'bus', 'bicycle', 'walking'] as const;
export type VehicleType = typeof VehicleTypes[number];

/** Supported fuel types for cars */
export const FuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'] as const;
export type FuelType = typeof FuelTypes[number];

/** Supported flight distance tiers */
export const FlightTypes = ['domestic', 'shortHaul', 'longHaul'] as const;
export type FlightType = typeof FlightTypes[number];

/** Zod schema for travel calculation input */
export const TravelInputSchema = z.object({
  vehicleType: z.enum(VehicleTypes),
  fuelType: z.enum(FuelTypes).optional(),
  flightType: z.enum(FlightTypes).optional(),
  distanceKm: z
    .number()
    .min(0, 'Distance must be non-negative')
    .max(50000, 'Distance seems unreasonably large'),
  frequency: z.enum(['one-time', 'daily', 'weekly', 'monthly']).default('one-time'),
});

export type TravelInput = z.infer<typeof TravelInputSchema>;

// ─── Energy ──────────────────────────────────────────────

/** Zod schema for energy calculation input */
export const EnergyInputSchema = z.object({
  electricityKwh: z
    .number()
    .min(0, 'Electricity usage must be non-negative')
    .max(100000, 'Value seems unreasonably large')
    .default(0),
  naturalGasM3: z
    .number()
    .min(0, 'Gas usage must be non-negative')
    .max(50000, 'Value seems unreasonably large')
    .default(0),
  heatingOilLitres: z
    .number()
    .min(0, 'Oil usage must be non-negative')
    .max(50000, 'Value seems unreasonably large')
    .default(0),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('monthly'),
});

export type EnergyInput = z.infer<typeof EnergyInputSchema>;

// ─── Diet ────────────────────────────────────────────────

/** Supported food categories */
export const FoodCategories = [
  'beef', 'lamb', 'pork', 'chicken', 'fish',
  'dairy', 'eggs', 'vegetables', 'fruits', 'grains', 'legumes',
] as const;
export type FoodCategory = typeof FoodCategories[number];

/** Individual food consumption entry */
const FoodEntrySchema = z.object({
  category: z.enum(FoodCategories),
  kgPerWeek: z
    .number()
    .min(0, 'Consumption must be non-negative')
    .max(100, 'Value seems unreasonably large'),
});

/** Zod schema for diet calculation input */
export const DietInputSchema = z.object({
  items: z.array(FoodEntrySchema).min(1, 'At least one food item is required'),
});

export type DietInput = z.infer<typeof DietInputSchema>;
export type FoodEntry = z.infer<typeof FoodEntrySchema>;

// ─── Calculation Result ──────────────────────────────────

/** Breakdown of CO₂e by subcategory */
export interface EmissionBreakdown {
  subcategory: string;
  co2eKg: number;
  percentage: number;
}

/** Full calculation result returned by the API */
export interface CalculationResult {
  category: 'travel' | 'energy' | 'diet';
  totalCo2eKg: number;
  annualizedCo2eKg: number;
  breakdown: EmissionBreakdown[];
  equivalents: {
    treesNeeded: number;
    drivingKm: number;
    flightsLondon2NY: number;
  };
  calculatedAt: string;
}
