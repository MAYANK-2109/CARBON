/**
 * @module @carbon/shared/types/api
 * @description Generic API response types and tip-related types.
 */

/** Standard API success response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

/** Standard API error response */
export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/** Impact level for reduction tips */
export type TipImpactLevel = 'high' | 'medium' | 'low';

/** A single carbon reduction tip */
export interface ReductionTip {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'energy' | 'diet' | 'general';
  impactLevel: TipImpactLevel;
  estimatedSavingsKgPerYear: number;
  iconName: string;
}
