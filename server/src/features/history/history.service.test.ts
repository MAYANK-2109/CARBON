/**
 * @module features/history/history.service.test
 * @description Unit tests for emission history queries and aggregation.
 * Uses valid MongoDB ObjectId hex strings to avoid BSON errors.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHistory, getSummary, getMonthlyTrends } from './history.service';
import { Emission } from '../../models/Emission.model';

// A valid 24-character hex ObjectId string required by BSON
const VALID_USER_ID = '507f1f77bcf86cd799439011';

vi.mock('../../models/Emission.model');

describe('History Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── getHistory ──────────────────────────────────────────────

  describe('getHistory', () => {
    it('returns paginated history records', async () => {
      const mockRecord = {
        _id: { toString: () => 'rec-id-1' },
        userId: { toString: () => VALID_USER_ID },
        category: 'travel',
        subcategory: 'car (petrol)',
        inputValue: 100,
        inputUnit: 'kg CO₂e',
        co2eKg: 21.2,
        createdAt: new Date('2025-01-15T00:00:00Z'),
      };

      vi.spyOn(Emission, 'countDocuments').mockResolvedValue(1 as any);
      vi.spyOn(Emission, 'find').mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([mockRecord]),
      } as any);

      const result = await getHistory(VALID_USER_ID, 1, 10);

      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.records).toHaveLength(1);
      expect(result.records[0]?.category).toBe('travel');
      expect(result.records[0]?.subcategory).toBe('car (petrol)');
      expect(result.records[0]?.co2eKg).toBe(21.2);
    });

    it('returns empty records when user has no history', async () => {
      vi.spyOn(Emission, 'countDocuments').mockResolvedValue(0 as any);
      vi.spyOn(Emission, 'find').mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await getHistory(VALID_USER_ID, 1, 20);

      expect(result.total).toBe(0);
      expect(result.records).toHaveLength(0);
      expect(result.totalPages).toBe(0);
    });

    it('passes category filter to the query', async () => {
      const findSpy = vi.spyOn(Emission, 'find').mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as any);
      vi.spyOn(Emission, 'countDocuments').mockResolvedValue(0 as any);

      await getHistory(VALID_USER_ID, 1, 20, 'energy');

      // Verify the query filter included the category
      const filterArg = findSpy.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(filterArg?.['category']).toBe('energy');
    });

    it('calculates correct totalPages for multi-page results', async () => {
      vi.spyOn(Emission, 'countDocuments').mockResolvedValue(55 as any);
      vi.spyOn(Emission, 'find').mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await getHistory(VALID_USER_ID, 2, 20);

      expect(result.total).toBe(55);
      expect(result.totalPages).toBe(3); // ceil(55/20)
    });
  });

  // ─── getSummary ──────────────────────────────────────────────

  describe('getSummary', () => {
    it('returns aggregated emission summary', async () => {
      vi.spyOn(Emission, 'aggregate').mockResolvedValue([
        { _id: 'travel', total: 10, count: 2 },
        { _id: 'energy', total: 20, count: 3 },
        { _id: 'diet', total: 5, count: 1 },
      ]);

      const start = new Date('2025-01-01');
      const end = new Date('2025-01-31');
      const result = await getSummary(VALID_USER_ID, start, end);

      expect(result.totalCo2eKg).toBe(35);
      expect(result.byCategory.travel).toBe(10);
      expect(result.byCategory.energy).toBe(20);
      expect(result.byCategory.diet).toBe(5);
      expect(result.recordCount).toBe(6);
      expect(result.period.start).toBe(start.toISOString());
      expect(result.period.end).toBe(end.toISOString());
    });

    it('returns zeros for categories with no records', async () => {
      vi.spyOn(Emission, 'aggregate').mockResolvedValue([
        { _id: 'travel', total: 42, count: 5 },
      ]);

      const result = await getSummary(VALID_USER_ID, new Date('2025-01-01'), new Date('2025-01-31'));

      expect(result.byCategory.travel).toBe(42);
      expect(result.byCategory.energy).toBe(0);
      expect(result.byCategory.diet).toBe(0);
      expect(result.totalCo2eKg).toBe(42);
    });

    it('returns all zeros when no emissions exist', async () => {
      vi.spyOn(Emission, 'aggregate').mockResolvedValue([]);

      const result = await getSummary(VALID_USER_ID, new Date('2025-01-01'), new Date('2025-01-31'));

      expect(result.totalCo2eKg).toBe(0);
      expect(result.byCategory).toEqual({ travel: 0, energy: 0, diet: 0 });
      expect(result.recordCount).toBe(0);
    });
  });

  // ─── getMonthlyTrends ─────────────────────────────────────────

  describe('getMonthlyTrends', () => {
    it('returns trends grouped by month', async () => {
      vi.spyOn(Emission, 'aggregate').mockResolvedValue([
        { _id: { year: 2025, month: 1, category: 'travel' }, total: 50 },
        { _id: { year: 2025, month: 1, category: 'energy' }, total: 20 },
      ]);

      const result = await getMonthlyTrends(VALID_USER_ID, 6);

      expect(result).toHaveLength(1);
      expect(result[0]?.month).toBe('Jan');
      expect(result[0]?.year).toBe(2025);
      expect(result[0]?.totalCo2eKg).toBeCloseTo(70, 1);
      expect(result[0]?.byCategory.travel).toBe(50);
      expect(result[0]?.byCategory.energy).toBe(20);
      expect(result[0]?.byCategory.diet).toBe(0);
    });

    it('returns multiple months sorted chronologically', async () => {
      vi.spyOn(Emission, 'aggregate').mockResolvedValue([
        { _id: { year: 2025, month: 3, category: 'diet' }, total: 30 },
        { _id: { year: 2025, month: 1, category: 'travel' }, total: 15 },
        { _id: { year: 2025, month: 2, category: 'energy' }, total: 25 },
      ]);

      const result = await getMonthlyTrends(VALID_USER_ID, 6);

      // Results come back in insertion order from the Map (sorted by aggregate sort)
      expect(result).toHaveLength(3);
      const months = result.map((r) => r.month);
      expect(months).toContain('Jan');
      expect(months).toContain('Feb');
      expect(months).toContain('Mar');
    });

    it('returns empty array when no trends exist', async () => {
      vi.spyOn(Emission, 'aggregate').mockResolvedValue([]);

      const result = await getMonthlyTrends(VALID_USER_ID, 6);

      expect(result).toHaveLength(0);
    });
  });
});
