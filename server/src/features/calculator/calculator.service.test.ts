/**
 * @module features/calculator/calculator.service.test
 * @description Unit tests for carbon emission calculation logic.
 * Tests all three calculators (travel, energy, diet) with authoritative emission factors.
 */

import { describe, it, expect } from 'vitest';
import { calculateTravel, calculateEnergy, calculateDiet } from './calculator.service';
import {
  TRAVEL_FACTORS,
  ENERGY_FACTORS,
  DIET_FACTORS,
  CO2E_EQUIVALENTS,
  FREQUENCY_MULTIPLIERS,
} from '@carbon/shared';
import type { TravelInput, EnergyInput, DietInput } from '@carbon/shared';

// ─── Helpers ───────────────────────────────────────────────

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ─── Travel Calculator ─────────────────────────────────────

describe('calculateTravel', () => {
  it('calculates car petrol emissions correctly', () => {
    const input: TravelInput = {
      vehicleType: 'car',
      fuelType: 'petrol',
      distanceKm: 100,
      frequency: 'one-time',
    };

    const result = calculateTravel(input);

    expect(result.category).toBe('travel');
    expect(result.totalCo2eKg).toBe(roundTo(100 * TRAVEL_FACTORS.car.petrol, 2));
    expect(result.annualizedCo2eKg).toBe(result.totalCo2eKg); // one-time = 1x
    expect(result.breakdown).toHaveLength(1);
    expect(result.breakdown[0]?.subcategory).toBe('car (petrol)');
    expect(result.breakdown[0]?.percentage).toBe(100);
    expect(result.calculatedAt).toBeDefined();
  });

  it('calculates car diesel emissions correctly', () => {
    const input: TravelInput = {
      vehicleType: 'car',
      fuelType: 'diesel',
      distanceKm: 250,
      frequency: 'weekly',
    };

    const result = calculateTravel(input);

    const expected = roundTo(250 * TRAVEL_FACTORS.car.diesel, 2);
    expect(result.totalCo2eKg).toBe(expected);
    expect(result.annualizedCo2eKg).toBe(roundTo(expected * FREQUENCY_MULTIPLIERS.weekly, 2));
  });

  it('calculates electric car emissions (low but non-zero)', () => {
    const input: TravelInput = {
      vehicleType: 'car',
      fuelType: 'electric',
      distanceKm: 100,
      frequency: 'daily',
    };

    const result = calculateTravel(input);

    expect(result.totalCo2eKg).toBe(roundTo(100 * TRAVEL_FACTORS.car.electric, 2));
    expect(result.totalCo2eKg).toBeGreaterThan(0);
    expect(result.totalCo2eKg).toBeLessThan(roundTo(100 * TRAVEL_FACTORS.car.petrol, 2));
  });

  it('calculates flight emissions with different haul types', () => {
    const shortHaul: TravelInput = {
      vehicleType: 'flight',
      flightType: 'shortHaul',
      distanceKm: 1000,
      frequency: 'one-time',
    };
    const longHaul: TravelInput = {
      vehicleType: 'flight',
      flightType: 'longHaul',
      distanceKm: 1000,
      frequency: 'one-time',
    };

    const shortResult = calculateTravel(shortHaul);
    const longResult = calculateTravel(longHaul);

    expect(shortResult.totalCo2eKg).toBe(roundTo(1000 * TRAVEL_FACTORS.flight.shortHaul, 2));
    expect(longResult.totalCo2eKg).toBe(roundTo(1000 * TRAVEL_FACTORS.flight.longHaul, 2));
    // Long haul has higher per-km factor due to radiative forcing
    expect(longResult.totalCo2eKg).toBeGreaterThan(shortResult.totalCo2eKg);
  });

  it('calculates train and bus emissions', () => {
    const trainInput: TravelInput = {
      vehicleType: 'train',
      distanceKm: 500,
      frequency: 'monthly',
    };
    const busInput: TravelInput = {
      vehicleType: 'bus',
      distanceKm: 500,
      frequency: 'monthly',
    };

    const trainResult = calculateTravel(trainInput);
    const busResult = calculateTravel(busInput);

    expect(trainResult.totalCo2eKg).toBe(roundTo(500 * TRAVEL_FACTORS.train, 2));
    expect(busResult.totalCo2eKg).toBe(roundTo(500 * TRAVEL_FACTORS.bus, 2));
    // Train should be lower than bus
    expect(trainResult.totalCo2eKg).toBeLessThan(busResult.totalCo2eKg);
  });

  it('returns zero for bicycle and walking', () => {
    const bikeInput: TravelInput = {
      vehicleType: 'bicycle',
      distanceKm: 50,
      frequency: 'daily',
    };
    const walkInput: TravelInput = {
      vehicleType: 'walking',
      distanceKm: 5,
      frequency: 'daily',
    };

    expect(calculateTravel(bikeInput).totalCo2eKg).toBe(0);
    expect(calculateTravel(walkInput).totalCo2eKg).toBe(0);
  });

  it('computes equivalents based on annualized emissions', () => {
    const input: TravelInput = {
      vehicleType: 'car',
      fuelType: 'petrol',
      distanceKm: 100,
      frequency: 'daily',
    };

    const result = calculateTravel(input);
    const annualized = result.annualizedCo2eKg;

    expect(result.equivalents.treesNeeded).toBe(
      roundTo(annualized / CO2E_EQUIVALENTS.kgPerTreePerYear, 1)
    );
    expect(result.equivalents.drivingKm).toBe(
      roundTo(annualized / CO2E_EQUIVALENTS.kgPerDrivingKm, 0)
    );
    expect(result.equivalents.flightsLondon2NY).toBe(
      roundTo(annualized / CO2E_EQUIVALENTS.kgPerFlightLondonNY, 2)
    );
  });
});

// ─── Energy Calculator ──────────────────────────────────────

describe('calculateEnergy', () => {
  it('calculates electricity-only emissions', () => {
    const input: EnergyInput = {
      electricityKwh: 300,
      naturalGasM3: 0,
      heatingOilLitres: 0,
      period: 'monthly',
    };

    const result = calculateEnergy(input);

    const expected = roundTo(300 * ENERGY_FACTORS.electricity, 2);
    expect(result.category).toBe('energy');
    expect(result.totalCo2eKg).toBe(expected);
    expect(result.annualizedCo2eKg).toBe(roundTo(expected * 12, 2));
    expect(result.breakdown).toHaveLength(1);
    expect(result.breakdown[0]?.subcategory).toBe('electricity');
    expect(result.breakdown[0]?.percentage).toBe(100);
  });

  it('calculates combined energy sources with correct percentages', () => {
    const input: EnergyInput = {
      electricityKwh: 300,
      naturalGasM3: 50,
      heatingOilLitres: 20,
      period: 'monthly',
    };

    const result = calculateEnergy(input);

    const elecCo2e = 300 * ENERGY_FACTORS.electricity;
    const gasCo2e = 50 * ENERGY_FACTORS.naturalGas;
    const oilCo2e = 20 * ENERGY_FACTORS.heatingOil;
    const total = elecCo2e + gasCo2e + oilCo2e;

    expect(result.totalCo2eKg).toBe(roundTo(total, 2));
    expect(result.breakdown).toHaveLength(3);

    // Verify percentages sum to ~100
    const percentageSum = result.breakdown.reduce((sum, b) => sum + b.percentage, 0);
    expect(percentageSum).toBeCloseTo(100, 0);
  });

  it('handles zero across all sources', () => {
    const input: EnergyInput = {
      electricityKwh: 0,
      naturalGasM3: 0,
      heatingOilLitres: 0,
      period: 'yearly',
    };

    const result = calculateEnergy(input);

    expect(result.totalCo2eKg).toBe(0);
    expect(result.annualizedCo2eKg).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it('applies yearly period multiplier (1x)', () => {
    const input: EnergyInput = {
      electricityKwh: 1000,
      naturalGasM3: 0,
      heatingOilLitres: 0,
      period: 'yearly',
    };

    const result = calculateEnergy(input);

    expect(result.totalCo2eKg).toBe(result.annualizedCo2eKg);
  });

  it('applies weekly period multiplier (52x)', () => {
    const input: EnergyInput = {
      electricityKwh: 10,
      naturalGasM3: 0,
      heatingOilLitres: 0,
      period: 'weekly',
    };

    const result = calculateEnergy(input);

    expect(result.annualizedCo2eKg).toBe(roundTo(result.totalCo2eKg * 52, 2));
  });
});

// ─── Diet Calculator ────────────────────────────────────────

describe('calculateDiet', () => {
  it('calculates single food item emissions', () => {
    const input: DietInput = {
      items: [{ category: 'beef', kgPerWeek: 2 }],
    };

    const result = calculateDiet(input);

    const expected = roundTo(2 * DIET_FACTORS.beef, 2);
    expect(result.category).toBe('diet');
    expect(result.totalCo2eKg).toBe(expected);
    expect(result.annualizedCo2eKg).toBe(roundTo(expected * 52, 2));
    expect(result.breakdown).toHaveLength(1);
    expect(result.breakdown[0]?.subcategory).toBe('beef');
    expect(result.breakdown[0]?.percentage).toBe(100);
  });

  it('calculates multiple food items with correct proportions', () => {
    const input: DietInput = {
      items: [
        { category: 'beef', kgPerWeek: 1 },
        { category: 'chicken', kgPerWeek: 2 },
        { category: 'vegetables', kgPerWeek: 5 },
      ],
    };

    const result = calculateDiet(input);

    const beefCo2e = 1 * DIET_FACTORS.beef;
    const chickenCo2e = 2 * DIET_FACTORS.chicken;
    const vegCo2e = 5 * DIET_FACTORS.vegetables;
    const total = beefCo2e + chickenCo2e + vegCo2e;

    expect(result.totalCo2eKg).toBe(roundTo(total, 2));
    expect(result.breakdown).toHaveLength(3);

    // Should be sorted by highest emissions first
    expect(result.breakdown[0]!.co2eKg).toBeGreaterThanOrEqual(result.breakdown[1]!.co2eKg);
    expect(result.breakdown[1]!.co2eKg).toBeGreaterThanOrEqual(result.breakdown[2]!.co2eKg);

    // Percentages should sum to ~100
    const percentageSum = result.breakdown.reduce((s, b) => s + b.percentage, 0);
    expect(percentageSum).toBeCloseTo(100, 0);
  });

  it('handles empty items array', () => {
    const input: DietInput = { items: [] };

    const result = calculateDiet(input);

    expect(result.totalCo2eKg).toBe(0);
    expect(result.annualizedCo2eKg).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it('ranks beef and lamb as highest-impact foods', () => {
    const input: DietInput = {
      items: [
        { category: 'beef', kgPerWeek: 1 },
        { category: 'lamb', kgPerWeek: 1 },
        { category: 'chicken', kgPerWeek: 1 },
        { category: 'legumes', kgPerWeek: 1 },
      ],
    };

    const result = calculateDiet(input);

    // Lamb should be #1 (39.2), beef #2 (27.0)
    expect(result.breakdown[0]?.subcategory).toBe('lamb');
    expect(result.breakdown[1]?.subcategory).toBe('beef');
  });

  it('annualizes weekly diet data (×52 weeks)', () => {
    const input: DietInput = {
      items: [{ category: 'dairy', kgPerWeek: 3 }],
    };

    const result = calculateDiet(input);

    expect(result.annualizedCo2eKg).toBe(roundTo(result.totalCo2eKg * 52, 2));
  });
});
