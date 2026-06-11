/**
 * @module shared/types/calculator.types.test
 * @description Unit tests for the shared Zod schemas for all calculator inputs.
 * Validates accept/reject behaviour at boundaries for TravelInput, EnergyInput, and DietInput.
 */

import { describe, it, expect } from 'vitest';
import {
  TravelInputSchema,
  EnergyInputSchema,
  DietInputSchema,
} from '../types/calculator.types';

// ─── TravelInputSchema ────────────────────────────────────

describe('TravelInputSchema', () => {
  it('accepts a valid car travel input', () => {
    const result = TravelInputSchema.safeParse({
      vehicleType: 'car',
      fuelType: 'petrol',
      distanceKm: 100,
      frequency: 'daily',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid flight input', () => {
    const result = TravelInputSchema.safeParse({
      vehicleType: 'flight',
      flightType: 'longHaul',
      distanceKm: 10000,
      frequency: 'one-time',
    });
    expect(result.success).toBe(true);
  });

  it('defaults frequency to "one-time" when omitted', () => {
    const result = TravelInputSchema.safeParse({
      vehicleType: 'bicycle',
      distanceKm: 5,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.frequency).toBe('one-time');
    }
  });

  it('rejects negative distanceKm', () => {
    const result = TravelInputSchema.safeParse({
      vehicleType: 'car',
      distanceKm: -1,
      frequency: 'daily',
    });
    expect(result.success).toBe(false);
  });

  it('rejects distanceKm exceeding 50,000', () => {
    const result = TravelInputSchema.safeParse({
      vehicleType: 'car',
      distanceKm: 99999,
      frequency: 'daily',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid vehicleType', () => {
    const result = TravelInputSchema.safeParse({
      vehicleType: 'rocket',
      distanceKm: 100,
      frequency: 'daily',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid frequency value', () => {
    const result = TravelInputSchema.safeParse({
      vehicleType: 'car',
      distanceKm: 100,
      frequency: 'hourly',
    });
    expect(result.success).toBe(false);
  });
});

// ─── EnergyInputSchema ────────────────────────────────────

describe('EnergyInputSchema', () => {
  it('accepts a valid energy input with all sources', () => {
    const result = EnergyInputSchema.safeParse({
      electricityKwh: 300,
      naturalGasM3: 50,
      heatingOilLitres: 20,
      period: 'monthly',
    });
    expect(result.success).toBe(true);
  });

  it('defaults all usage fields to 0 when omitted', () => {
    const result = EnergyInputSchema.safeParse({ period: 'monthly' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.electricityKwh).toBe(0);
      expect(result.data.naturalGasM3).toBe(0);
      expect(result.data.heatingOilLitres).toBe(0);
    }
  });

  it('defaults period to "monthly" when omitted', () => {
    const result = EnergyInputSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.period).toBe('monthly');
    }
  });

  it('rejects negative electricityKwh', () => {
    const result = EnergyInputSchema.safeParse({ electricityKwh: -10 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid period value', () => {
    const result = EnergyInputSchema.safeParse({
      electricityKwh: 100,
      period: 'annually',
    });
    expect(result.success).toBe(false);
  });
});

// ─── DietInputSchema ─────────────────────────────────────

describe('DietInputSchema', () => {
  it('accepts a valid diet input', () => {
    const result = DietInputSchema.safeParse({
      items: [
        { category: 'beef', kgPerWeek: 2 },
        { category: 'vegetables', kgPerWeek: 5 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('accepts zero kgPerWeek for a food category', () => {
    const result = DietInputSchema.safeParse({
      items: [{ category: 'chicken', kgPerWeek: 0 }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty items array', () => {
    const result = DietInputSchema.safeParse({ items: [] });
    expect(result.success).toBe(false);
  });

  it('rejects negative kgPerWeek', () => {
    const result = DietInputSchema.safeParse({
      items: [{ category: 'beef', kgPerWeek: -1 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid food category', () => {
    const result = DietInputSchema.safeParse({
      items: [{ category: 'unicorn_meat', kgPerWeek: 1 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects kgPerWeek exceeding 100', () => {
    const result = DietInputSchema.safeParse({
      items: [{ category: 'beef', kgPerWeek: 200 }],
    });
    expect(result.success).toBe(false);
  });
});
