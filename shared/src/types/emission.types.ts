/**
 * @module @carbon/shared/types/emission
 * @description Emission record types for historical tracking and aggregation.
 */

/** Categories of carbon emissions tracked by the application */
export type EmissionCategory = 'travel' | 'energy' | 'diet';

/** A single emission record stored in the database */
export interface EmissionRecord {
  id: string;
  userId: string;
  category: EmissionCategory;
  subcategory: string;
  inputValue: number;
  inputUnit: string;
  co2eKg: number;
  createdAt: string;
}

/** Aggregated summary of emissions for a time period */
export interface EmissionSummary {
  totalCo2eKg: number;
  byCategory: {
    travel: number;
    energy: number;
    diet: number;
  };
  recordCount: number;
  period: {
    start: string;
    end: string;
  };
}

/** A single data point in a time-series trend */
export interface TrendDataPoint {
  date: string;
  co2eKg: number;
  category?: EmissionCategory;
}

/** Monthly trend data for charts */
export interface MonthlyTrend {
  month: string;
  year: number;
  totalCo2eKg: number;
  byCategory: {
    travel: number;
    energy: number;
    diet: number;
  };
}

/** Paginated history response */
export interface PaginatedHistory {
  records: EmissionRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
