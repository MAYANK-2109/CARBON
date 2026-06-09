/**
 * @module features/calculator/calculator.service
 * @description Pure calculation logic for carbon emissions.
 * All calculations use authoritative emission factors from shared constants.
 */

import {
  TRAVEL_FACTORS,
  ENERGY_FACTORS,
  DIET_FACTORS,
  CO2E_EQUIVALENTS,
  FREQUENCY_MULTIPLIERS,
} from '@carbon/shared';
import type {
  TravelInput,
  EnergyInput,
  DietInput,
  CalculationResult,
  EmissionBreakdown,
} from '@carbon/shared';

/**
 * Calculate CO₂e emissions for a travel activity.
 * @param input - Travel calculation parameters
 * @returns Full calculation result with breakdown and equivalents
 */
export function calculateTravel(input: TravelInput): CalculationResult {
  const { vehicleType, distanceKm, frequency } = input;
  let co2eKg = 0;
  let subcategory: string = vehicleType;

  switch (vehicleType) {
    case 'car': {
      const fuelType = input.fuelType || 'petrol';
      co2eKg = distanceKm * TRAVEL_FACTORS.car[fuelType];
      subcategory = `car (${fuelType})`;
      break;
    }
    case 'flight': {
      const flightType = input.flightType || 'shortHaul';
      co2eKg = distanceKm * TRAVEL_FACTORS.flight[flightType];
      subcategory = `flight (${flightType})`;
      break;
    }
    case 'train':
    case 'bus':
    case 'bicycle':
    case 'walking':
      co2eKg = distanceKm * TRAVEL_FACTORS[vehicleType];
      break;
  }

  const multiplier = FREQUENCY_MULTIPLIERS[frequency];
  const annualized = co2eKg * multiplier;

  const breakdown: EmissionBreakdown[] = [
    { subcategory, co2eKg, percentage: 100 },
  ];

  return {
    category: 'travel',
    totalCo2eKg: roundTo(co2eKg, 2),
    annualizedCo2eKg: roundTo(annualized, 2),
    breakdown,
    equivalents: computeEquivalents(annualized),
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate CO₂e emissions for energy usage.
 * @param input - Energy calculation parameters
 * @returns Full calculation result with breakdown and equivalents
 */
export function calculateEnergy(input: EnergyInput): CalculationResult {
  const { electricityKwh, naturalGasM3, heatingOilLitres, period } = input;

  const electricityCo2e = electricityKwh * ENERGY_FACTORS.electricity;
  const gasCo2e = naturalGasM3 * ENERGY_FACTORS.naturalGas;
  const oilCo2e = heatingOilLitres * ENERGY_FACTORS.heatingOil;
  const total = electricityCo2e + gasCo2e + oilCo2e;

  const multiplier = FREQUENCY_MULTIPLIERS[period];
  const annualized = total * multiplier;

  const breakdown: EmissionBreakdown[] = [];
  if (electricityCo2e > 0) {
    breakdown.push({
      subcategory: 'electricity',
      co2eKg: roundTo(electricityCo2e, 2),
      percentage: total > 0 ? roundTo((electricityCo2e / total) * 100, 1) : 0,
    });
  }
  if (gasCo2e > 0) {
    breakdown.push({
      subcategory: 'natural gas',
      co2eKg: roundTo(gasCo2e, 2),
      percentage: total > 0 ? roundTo((gasCo2e / total) * 100, 1) : 0,
    });
  }
  if (oilCo2e > 0) {
    breakdown.push({
      subcategory: 'heating oil',
      co2eKg: roundTo(oilCo2e, 2),
      percentage: total > 0 ? roundTo((oilCo2e / total) * 100, 1) : 0,
    });
  }

  return {
    category: 'energy',
    totalCo2eKg: roundTo(total, 2),
    annualizedCo2eKg: roundTo(annualized, 2),
    breakdown,
    equivalents: computeEquivalents(annualized),
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate CO₂e emissions for dietary habits.
 * @param input - Diet calculation parameters (weekly consumption)
 * @returns Full calculation result with breakdown and equivalents
 */
export function calculateDiet(input: DietInput): CalculationResult {
  let totalWeekly = 0;
  const breakdown: EmissionBreakdown[] = [];

  for (const item of input.items) {
    const factor = DIET_FACTORS[item.category];
    const co2eKg = item.kgPerWeek * factor;
    totalWeekly += co2eKg;

    breakdown.push({
      subcategory: item.category,
      co2eKg: roundTo(co2eKg, 2),
      percentage: 0, // computed below
    });
  }

  // Compute percentages
  for (const item of breakdown) {
    item.percentage = totalWeekly > 0
      ? roundTo((item.co2eKg / totalWeekly) * 100, 1)
      : 0;
  }

  // Sort by highest emission
  breakdown.sort((a, b) => b.co2eKg - a.co2eKg);

  const annualized = totalWeekly * 52;

  return {
    category: 'diet',
    totalCo2eKg: roundTo(totalWeekly, 2),
    annualizedCo2eKg: roundTo(annualized, 2),
    breakdown,
    equivalents: computeEquivalents(annualized),
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Compute relatable CO₂e equivalents.
 * @param annualCo2eKg - Annual CO₂e in kg
 * @returns Equivalents in trees, driving km, and flights
 */
function computeEquivalents(annualCo2eKg: number) {
  return {
    treesNeeded: roundTo(annualCo2eKg / CO2E_EQUIVALENTS.kgPerTreePerYear, 1),
    drivingKm: roundTo(annualCo2eKg / CO2E_EQUIVALENTS.kgPerDrivingKm, 0),
    flightsLondon2NY: roundTo(annualCo2eKg / CO2E_EQUIVALENTS.kgPerFlightLondonNY, 2),
  };
}

/**
 * Round a number to the specified decimal places.
 */
function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
