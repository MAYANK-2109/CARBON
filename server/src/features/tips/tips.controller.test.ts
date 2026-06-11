/**
 * @module features/tips/tips.controller.test
 * @description Full unit test coverage for tips controller,
 * including edge cases: combined filters, limit clamping, sort order, and empty results.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { handleGetTips, handleGetPersonalizedTips } from './tips.controller';
import { TIPS_DATABASE } from './tips.data';

describe('Tips Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: ReturnType<typeof vi.fn>;
  let jsonMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    vi.clearAllMocks();
  });

  describe('handleGetTips', () => {
    it('returns all tips when no query params are provided', () => {
      mockReq = { query: {} };
      handleGetTips(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      const response = jsonMock.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(TIPS_DATABASE.length);
    });

    it('generates sequential IDs (tip-001, tip-002, …) for every tip', () => {
      mockReq = { query: {} };
      handleGetTips(mockReq as Request, mockRes as Response);

      const data = jsonMock.mock.calls[0][0].data;
      expect(data[0].id).toBe('tip-001');
      expect(data[1].id).toBe('tip-002');
    });

    it('filters tips by travel category', () => {
      mockReq = { query: { category: 'travel' } };
      handleGetTips(mockReq as Request, mockRes as Response);

      const data = jsonMock.mock.calls[0][0].data;
      expect(data.length).toBeGreaterThan(0);
      expect(data.every((t: any) => t.category === 'travel')).toBe(true);
    });

    it('filters tips by energy category', () => {
      mockReq = { query: { category: 'energy' } };
      handleGetTips(mockReq as Request, mockRes as Response);

      const data = jsonMock.mock.calls[0][0].data;
      expect(data.length).toBeGreaterThan(0);
      expect(data.every((t: any) => t.category === 'energy')).toBe(true);
    });

    it('filters tips by diet category', () => {
      mockReq = { query: { category: 'diet' } };
      handleGetTips(mockReq as Request, mockRes as Response);

      const data = jsonMock.mock.calls[0][0].data;
      expect(data.length).toBeGreaterThan(0);
      expect(data.every((t: any) => t.category === 'diet')).toBe(true);
    });

    it('returns empty array for a non-existent category', () => {
      mockReq = { query: { category: 'nonexistent' } };
      handleGetTips(mockReq as Request, mockRes as Response);

      expect(jsonMock.mock.calls[0][0].data).toHaveLength(0);
    });

    it('limits the number of tips returned', () => {
      mockReq = { query: { limit: '2' } };
      handleGetTips(mockReq as Request, mockRes as Response);

      expect(jsonMock.mock.calls[0][0].data.length).toBe(2);
    });

    it('applies limit=1 returning exactly one tip', () => {
      mockReq = { query: { limit: '1' } };
      handleGetTips(mockReq as Request, mockRes as Response);

      expect(jsonMock.mock.calls[0][0].data.length).toBe(1);
    });

    it('combines category filter and limit correctly', () => {
      mockReq = { query: { category: 'travel', limit: '1' } };
      handleGetTips(mockReq as Request, mockRes as Response);

      const data = jsonMock.mock.calls[0][0].data;
      expect(data.length).toBe(1);
      expect(data[0].category).toBe('travel');
    });

    it('returns all tips when limit exceeds total count', () => {
      mockReq = { query: { limit: '999' } };
      handleGetTips(mockReq as Request, mockRes as Response);

      expect(jsonMock.mock.calls[0][0].data.length).toBe(TIPS_DATABASE.length);
    });
  });

  describe('handleGetPersonalizedTips', () => {
    it('returns exactly 5 tips', () => {
      mockReq = {};
      handleGetPersonalizedTips(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock.mock.calls[0][0].data.length).toBe(5);
    });

    it('returns tips sorted by impact level (high > medium > low)', () => {
      mockReq = {};
      handleGetPersonalizedTips(mockReq as Request, mockRes as Response);

      const data = jsonMock.mock.calls[0][0].data;
      // All top 5 should be "high" impact tips since the DB has enough
      const levelOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
      for (let i = 0; i < data.length - 1; i++) {
        expect(levelOrder[data[i].impactLevel]).toBeGreaterThanOrEqual(
          levelOrder[data[i + 1].impactLevel]
        );
      }
    });

    it('each tip in personalized list has required fields', () => {
      mockReq = {};
      handleGetPersonalizedTips(mockReq as Request, mockRes as Response);

      const data = jsonMock.mock.calls[0][0].data;
      for (const tip of data) {
        expect(tip).toHaveProperty('id');
        expect(tip).toHaveProperty('title');
        expect(tip).toHaveProperty('category');
        expect(tip).toHaveProperty('impactLevel');
        expect(tip).toHaveProperty('estimatedSavingsKgPerYear');
      }
    });
  });
});
