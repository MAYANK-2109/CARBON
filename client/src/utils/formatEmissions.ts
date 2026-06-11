/**
 * @module utils/formatEmissions
 * @description Utility helpers for formatting CO₂e emission values into
 * human-readable strings for display in the UI.
 */

/**
 * Format a CO₂e value in kg into a clean, human-readable string.
 * - Values < 1 kg → displayed in grams (e.g. "850g CO₂e")
 * - Values < 1000 kg → displayed in kg (e.g. "12.5 kg CO₂e")
 * - Values ≥ 1000 kg → displayed in tonnes (e.g. "1.2t CO₂e")
 *
 * @param kgValue - CO₂e value in kilograms
 * @returns Human-readable formatted string
 */
export function formatCo2e(kgValue: number): string {
  if (kgValue < 0) return '0g CO₂e';
  if (kgValue < 1) {
    return `${Math.round(kgValue * 1000)}g CO₂e`;
  }
  if (kgValue < 1000) {
    return `${Math.round(kgValue * 10) / 10} kg CO₂e`;
  }
  return `${Math.round((kgValue / 1000) * 100) / 100}t CO₂e`;
}

/**
 * Format a percentage value with a consistent decimal places.
 * @param value - Percentage value (0–100)
 * @param decimals - Decimal places (default 1)
 * @returns Formatted percentage string e.g. "34.5%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a CO₂e kg value as a difference (±) from a baseline.
 * Positive means more emissions, negative means fewer.
 *
 * @param current - Current CO₂e kg
 * @param baseline - Baseline CO₂e kg to compare against
 * @returns Signed string e.g. "+2.3 kg", "-1.5 kg", "No change"
 */
export function formatCo2eDelta(current: number, baseline: number): string {
  const delta = current - baseline;
  if (Math.abs(delta) < 0.05) return 'No change';
  const sign = delta > 0 ? '+' : '';
  return `${sign}${Math.round(delta * 10) / 10} kg`;
}

/**
 * Return a qualitative label for an emission level.
 * Based on approximate IPCC per-capita targets for 2030.
 *
 * @param annualKg - Annual CO₂e in kg
 * @returns Category label: "low" | "moderate" | "high" | "very high"
 */
export function emissionLevel(annualKg: number): 'low' | 'moderate' | 'high' | 'very high' {
  if (annualKg < 1000) return 'low';
  if (annualKg < 3000) return 'moderate';
  if (annualKg < 7000) return 'high';
  return 'very high';
}
