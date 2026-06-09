/**
 * @module @carbon/shared/constants/emission-factors
 * @description Authoritative CO₂e emission factors sourced from UK DEFRA 2024
 * and US EPA data. All values are in kg CO₂e per specified unit.
 *
 * Sources:
 * - UK Government GHG Conversion Factors 2024 (DEFRA/BEIS)
 * - US EPA Emission Factors Hub
 * - Our World in Data — Carbon footprint of food
 */

/**
 * Travel emission factors in kg CO₂e per passenger-kilometer.
 * Car factors assume average occupancy (1.5 passengers).
 */
export const TRAVEL_FACTORS = {
  car: {
    petrol: 0.171,
    diesel: 0.168,
    electric: 0.047,
    hybrid: 0.110,
  },
  flight: {
    /** Flights under 500 km */
    domestic: 0.246,
    /** Flights 500–3,500 km */
    shortHaul: 0.156,
    /** Flights over 3,500 km (includes radiative forcing) */
    longHaul: 0.195,
  },
  train: 0.035,
  bus: 0.089,
  bicycle: 0,
  walking: 0,
} as const;

/**
 * Energy emission factors.
 * - Electricity: kg CO₂e per kWh (UK grid average 2024)
 * - Natural Gas: kg CO₂e per cubic metre
 * - Heating Oil: kg CO₂e per litre
 */
export const ENERGY_FACTORS = {
  electricity: 0.233,
  naturalGas: 2.02,
  heatingOil: 2.54,
} as const;

/**
 * Diet emission factors in kg CO₂e per kg of food product.
 * Values represent cradle-to-retail lifecycle emissions.
 */
export const DIET_FACTORS = {
  beef: 27.0,
  lamb: 39.2,
  pork: 12.1,
  chicken: 6.9,
  fish: 6.1,
  dairy: 3.2,
  eggs: 4.8,
  vegetables: 2.0,
  fruits: 1.1,
  grains: 1.4,
  legumes: 0.9,
} as const;

/**
 * Conversion constants for CO₂e equivalents.
 * Used to present emissions in relatable terms.
 */
export const CO2E_EQUIVALENTS = {
  /** Average kg CO₂ absorbed by one mature tree per year */
  kgPerTreePerYear: 22,
  /** Average car emissions in kg CO₂e per km (petrol) */
  kgPerDrivingKm: 0.171,
  /** London → New York round trip in kg CO₂e per passenger */
  kgPerFlightLondonNY: 1800,
} as const;

/**
 * Frequency multipliers to annualize periodic inputs.
 */
export const FREQUENCY_MULTIPLIERS = {
  'one-time': 1,
  daily: 365,
  weekly: 52,
  monthly: 12,
  yearly: 1,
} as const;
