/**
 * @module shared/constants/emission-factors.test
 * @description Unit tests for the shared emission factor constants.
 * Validates that all constants are numerically sane, consistent with
 * authoritative sources, and structurally complete.
 */

import { describe, it, expect } from 'vitest';
import {
  TRAVEL_FACTORS,
  ENERGY_FACTORS,
  DIET_FACTORS,
  CO2E_EQUIVALENTS,
  FREQUENCY_MULTIPLIERS,
} from '../constants/emission-factors';

describe('TRAVEL_FACTORS', () => {
  it('has non-negative emission factors for all car fuel types', () => {
    expect(TRAVEL_FACTORS.car.petrol).toBeGreaterThan(0);
    expect(TRAVEL_FACTORS.car.diesel).toBeGreaterThan(0);
    expect(TRAVEL_FACTORS.car.electric).toBeGreaterThan(0);
    expect(TRAVEL_FACTORS.car.hybrid).toBeGreaterThan(0);
  });

  it('electric car emits significantly less than petrol', () => {
    expect(TRAVEL_FACTORS.car.electric).toBeLessThan(TRAVEL_FACTORS.car.petrol);
  });

  it('has positive emission factors for all flight distance tiers', () => {
    expect(TRAVEL_FACTORS.flight.domestic).toBeGreaterThan(0);
    expect(TRAVEL_FACTORS.flight.shortHaul).toBeGreaterThan(0);
    expect(TRAVEL_FACTORS.flight.longHaul).toBeGreaterThan(0);
  });

  it('domestic flights have the highest per-km factor due to takeoff', () => {
    expect(TRAVEL_FACTORS.flight.domestic).toBeGreaterThan(TRAVEL_FACTORS.flight.shortHaul);
  });

  it('bus emissions are higher than train per km', () => {
    expect(TRAVEL_FACTORS.bus).toBeGreaterThan(TRAVEL_FACTORS.train);
  });

  it('bicycle and walking have zero emissions', () => {
    expect(TRAVEL_FACTORS.bicycle).toBe(0);
    expect(TRAVEL_FACTORS.walking).toBe(0);
  });
});

describe('ENERGY_FACTORS', () => {
  it('all energy emission factors are positive', () => {
    expect(ENERGY_FACTORS.electricity).toBeGreaterThan(0);
    expect(ENERGY_FACTORS.naturalGas).toBeGreaterThan(0);
    expect(ENERGY_FACTORS.heatingOil).toBeGreaterThan(0);
  });

  it('natural gas and heating oil are significantly higher per-unit than electricity', () => {
    // Gas per m3 and oil per litre should be far higher than electricity per kWh
    expect(ENERGY_FACTORS.naturalGas).toBeGreaterThan(ENERGY_FACTORS.electricity);
    expect(ENERGY_FACTORS.heatingOil).toBeGreaterThan(ENERGY_FACTORS.electricity);
  });
});

describe('DIET_FACTORS', () => {
  const allCategories = ['beef','lamb','pork','chicken','fish','dairy','eggs','vegetables','fruits','grains','legumes'] as const;

  it('has a positive emission factor for every food category', () => {
    for (const cat of allCategories) {
      expect(DIET_FACTORS[cat]).toBeGreaterThan(0);
    }
  });

  it('beef and lamb have the highest emission factors', () => {
    const allValues = Object.values(DIET_FACTORS);
    const max1 = Math.max(...allValues);
    const sorted = allValues.sort((a, b) => b - a);
    expect([DIET_FACTORS.beef, DIET_FACTORS.lamb]).toContain(max1);
    expect([DIET_FACTORS.beef, DIET_FACTORS.lamb]).toContain(sorted[1]);
  });

  it('plant-based foods have significantly lower factors than red meat', () => {
    expect(DIET_FACTORS.vegetables).toBeLessThan(DIET_FACTORS.beef);
    expect(DIET_FACTORS.legumes).toBeLessThan(DIET_FACTORS.beef);
    expect(DIET_FACTORS.fruits).toBeLessThan(DIET_FACTORS.chicken);
  });
});

describe('CO2E_EQUIVALENTS', () => {
  it('all equivalent constants are positive', () => {
    expect(CO2E_EQUIVALENTS.kgPerTreePerYear).toBeGreaterThan(0);
    expect(CO2E_EQUIVALENTS.kgPerDrivingKm).toBeGreaterThan(0);
    expect(CO2E_EQUIVALENTS.kgPerFlightLondonNY).toBeGreaterThan(0);
  });

  it('a London–NY flight emits several orders of magnitude more than 1 km of driving', () => {
    expect(CO2E_EQUIVALENTS.kgPerFlightLondonNY).toBeGreaterThan(
      CO2E_EQUIVALENTS.kgPerDrivingKm * 100
    );
  });
});

describe('FREQUENCY_MULTIPLIERS', () => {
  it('one-time and yearly multipliers equal 1', () => {
    expect(FREQUENCY_MULTIPLIERS['one-time']).toBe(1);
    expect(FREQUENCY_MULTIPLIERS.yearly).toBe(1);
  });

  it('daily multiplier is 365', () => {
    expect(FREQUENCY_MULTIPLIERS.daily).toBe(365);
  });

  it('weekly multiplier is 52', () => {
    expect(FREQUENCY_MULTIPLIERS.weekly).toBe(52);
  });

  it('monthly multiplier is 12', () => {
    expect(FREQUENCY_MULTIPLIERS.monthly).toBe(12);
  });

  it('multipliers are in ascending order: monthly < weekly < daily', () => {
    expect(FREQUENCY_MULTIPLIERS.monthly).toBeLessThan(FREQUENCY_MULTIPLIERS.weekly);
    expect(FREQUENCY_MULTIPLIERS.weekly).toBeLessThan(FREQUENCY_MULTIPLIERS.daily);
  });
});
