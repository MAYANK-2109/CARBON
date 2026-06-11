/**
 * @module utils/formatEmissions.test
 * @description Unit tests for emission formatting utilities.
 * Verifies boundaries, edge cases, and output formatting for each helper.
 */

import { describe, it, expect } from 'vitest';
import { formatCo2e, formatPercentage, formatCo2eDelta, emissionLevel } from './formatEmissions';

// ─── formatCo2e ───────────────────────────────────────────

describe('formatCo2e', () => {
  it('formats sub-kilogram values in grams', () => {
    expect(formatCo2e(0.85)).toBe('850g CO₂e');
    expect(formatCo2e(0.001)).toBe('1g CO₂e');
    expect(formatCo2e(0)).toBe('0g CO₂e');
  });

  it('formats values between 1–999 kg in kilograms', () => {
    expect(formatCo2e(1)).toBe('1 kg CO₂e');
    expect(formatCo2e(12.5)).toBe('12.5 kg CO₂e');
    expect(formatCo2e(100)).toBe('100 kg CO₂e');
    expect(formatCo2e(999.9)).toBe('999.9 kg CO₂e');
  });

  it('formats values ≥ 1000 kg in tonnes', () => {
    expect(formatCo2e(1000)).toBe('1t CO₂e');
    expect(formatCo2e(1500)).toBe('1.5t CO₂e');
    expect(formatCo2e(10000)).toBe('10t CO₂e');
  });

  it('treats negative values as zero', () => {
    expect(formatCo2e(-5)).toBe('0g CO₂e');
  });

  it('correctly handles boundary at exactly 1 kg', () => {
    // 1 kg should go to kg branch, not grams
    expect(formatCo2e(1.0)).toBe('1 kg CO₂e');
  });

  it('correctly handles boundary at exactly 1000 kg', () => {
    // 1000 kg should go to tonnes branch
    expect(formatCo2e(1000)).toBe('1t CO₂e');
  });
});

// ─── formatPercentage ─────────────────────────────────────

describe('formatPercentage', () => {
  it('formats a percentage with 1 decimal place by default', () => {
    expect(formatPercentage(34.5)).toBe('34.5%');
    expect(formatPercentage(100)).toBe('100.0%');
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('respects custom decimal places', () => {
    expect(formatPercentage(33.333, 2)).toBe('33.33%');
    expect(formatPercentage(50, 0)).toBe('50%');
  });
});

// ─── formatCo2eDelta ─────────────────────────────────────

describe('formatCo2eDelta', () => {
  it('returns "No change" when values are nearly equal', () => {
    expect(formatCo2eDelta(100, 100)).toBe('No change');
    expect(formatCo2eDelta(100.02, 100)).toBe('No change'); // within ±0.05
  });

  it('shows a positive delta when current exceeds baseline', () => {
    expect(formatCo2eDelta(15, 10)).toBe('+5 kg');
    expect(formatCo2eDelta(10.5, 10)).toBe('+0.5 kg');
  });

  it('shows a negative delta when current is below baseline', () => {
    expect(formatCo2eDelta(5, 10)).toBe('-5 kg');
    expect(formatCo2eDelta(9.5, 10)).toBe('-0.5 kg');
  });
});

// ─── emissionLevel ────────────────────────────────────────

describe('emissionLevel', () => {
  it('returns "low" for annual emissions below 1000 kg', () => {
    expect(emissionLevel(0)).toBe('low');
    expect(emissionLevel(999)).toBe('low');
  });

  it('returns "moderate" for 1000–2999 kg', () => {
    expect(emissionLevel(1000)).toBe('moderate');
    expect(emissionLevel(2999)).toBe('moderate');
  });

  it('returns "high" for 3000–6999 kg', () => {
    expect(emissionLevel(3000)).toBe('high');
    expect(emissionLevel(6999)).toBe('high');
  });

  it('returns "very high" for 7000 kg and above', () => {
    expect(emissionLevel(7000)).toBe('very high');
    expect(emissionLevel(50000)).toBe('very high');
  });
});
