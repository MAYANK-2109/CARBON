import { describe, it, expect, vi } from 'vitest';
import { getHistory, getSummary, getMonthlyTrends } from './history.service';
import { Emission } from '../../models/Emission.model';

vi.mock('../../models/Emission.model');

describe('History Service', () => {
  describe('getHistory', () => {
    it('returns history records', async () => {
      vi.spyOn(Emission, 'countDocuments').mockResolvedValue(1 as any);
      vi.spyOn(Emission, 'find').mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ id: '1' }]),
      } as any);

      const result = await getHistory('user1', { page: 1, limit: 10 });
      expect(result.total).toBe(1);
      expect(result.records.length).toBe(1);
    });
  });

  describe('getSummary', () => {
    it('returns summary', async () => {
      vi.spyOn(Emission, 'aggregate').mockResolvedValue([
        { _id: 'travel', total: 10 },
        { _id: 'energy', total: 20 },
      ]);

      const result = await getSummary('user1');
      expect(result.totalCo2eKg).toBe(30);
      expect(result.byCategory).toEqual({ travel: 10, energy: 20 });
    });
  });

  describe('getMonthlyTrends', () => {
    it('returns trends', async () => {
      vi.spyOn(Emission, 'aggregate').mockResolvedValue([
        { _id: { year: 2025, month: 1 }, total: 50 },
      ]);

      const result = await getMonthlyTrends('user1', 6);
      expect(result.length).toBe(1);
      expect(result[0].co2eKg).toBe(50);
    });
  });
});
