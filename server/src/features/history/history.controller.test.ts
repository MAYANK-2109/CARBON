/**
 * @module features/history/history.controller.test
 * @description Full unit test coverage for the history controller.
 * Covers pagination defaults, category filtering, months capping, date validation,
 * and comprehensive error paths.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { handleGetHistory, handleGetSummary, handleGetTrends } from './history.controller';
import * as historyService from './history.service';

vi.mock('./history.service');

// ─── Helpers ─────────────────────────────────────────────

function makeMockRes() {
  const jsonMock = vi.fn();
  const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
  const mockRes: Partial<Response> = { status: statusMock, json: jsonMock };
  return { mockRes, statusMock, jsonMock };
}

const USER = { userId: 'user-1', email: 'u@test.com' } as any;

// ─── Tests ────────────────────────────────────────────────

describe('History Controller', () => {
  beforeEach(() => vi.clearAllMocks());

  // ─── handleGetHistory ────────────────────────────────

  describe('handleGetHistory', () => {
    it('calls getHistory with correct defaults (page=1, limit=20)', async () => {
      const { mockRes, statusMock, jsonMock } = makeMockRes();
      const mockReq = { query: {}, user: USER } as unknown as Request;
      vi.spyOn(historyService, 'getHistory').mockResolvedValue({ records: [], total: 0 } as any);

      await handleGetHistory(mockReq, mockRes as Response, vi.fn());

      expect(historyService.getHistory).toHaveBeenCalledWith(USER.userId, 1, 20, undefined);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { records: [], total: 0 } });
    });

    it('passes explicit page and limit from query', async () => {
      const { mockRes } = makeMockRes();
      const mockReq = { query: { page: '3', limit: '10' }, user: USER } as unknown as Request;
      vi.spyOn(historyService, 'getHistory').mockResolvedValue({ records: [], total: 0 } as any);

      await handleGetHistory(mockReq, mockRes as Response, vi.fn());

      expect(historyService.getHistory).toHaveBeenCalledWith(USER.userId, 3, 10, undefined);
    });

    it('clamps limit to maximum of 100', async () => {
      const { mockRes } = makeMockRes();
      const mockReq = { query: { limit: '9999' }, user: USER } as unknown as Request;
      vi.spyOn(historyService, 'getHistory').mockResolvedValue({ records: [], total: 0 } as any);

      await handleGetHistory(mockReq, mockRes as Response, vi.fn());

      expect(historyService.getHistory).toHaveBeenCalledWith(USER.userId, 1, 100, undefined);
    });

    it('passes category filter from query string', async () => {
      const { mockRes } = makeMockRes();
      const mockReq = { query: { category: 'energy' }, user: USER } as unknown as Request;
      vi.spyOn(historyService, 'getHistory').mockResolvedValue({ records: [], total: 0 } as any);

      await handleGetHistory(mockReq, mockRes as Response, vi.fn());

      expect(historyService.getHistory).toHaveBeenCalledWith(USER.userId, 1, 20, 'energy');
    });

    it('calls next with error on service failure', async () => {
      const { mockRes } = makeMockRes();
      const mockNext = vi.fn();
      const mockReq = { query: {}, user: USER } as unknown as Request;
      const error = new Error('DB error');
      vi.spyOn(historyService, 'getHistory').mockRejectedValue(error);

      await handleGetHistory(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  // ─── handleGetSummary ────────────────────────────────

  describe('handleGetSummary', () => {
    it('defaults to current month date range when no query params given', async () => {
      const { mockRes, statusMock } = makeMockRes();
      const mockReq = { query: {}, user: USER } as unknown as Request;
      vi.spyOn(historyService, 'getSummary').mockResolvedValue({ totalCo2eKg: 0 } as any);

      await handleGetSummary(mockReq, mockRes as Response, vi.fn());

      expect(historyService.getSummary).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('passes parsed dates when start and end query params are provided', async () => {
      const { mockRes } = makeMockRes();
      const mockReq = {
        query: { start: '2025-01-01', end: '2025-12-31' },
        user: USER,
      } as unknown as Request;
      vi.spyOn(historyService, 'getSummary').mockResolvedValue({ totalCo2eKg: 42 } as any);

      await handleGetSummary(mockReq, mockRes as Response, vi.fn());

      const [, start, end] = (historyService.getSummary as any).mock.calls[0];
      expect(start).toBeInstanceOf(Date);
      expect(end).toBeInstanceOf(Date);
      expect(start.getFullYear()).toBe(2025);
    });

    it('calls next with 400 AppError when start date is invalid', async () => {
      const mockNext = vi.fn();
      const { mockRes } = makeMockRes();
      const mockReq = {
        query: { start: 'not-a-date', end: '2025-12-31' },
        user: USER,
      } as unknown as Request;

      await handleGetSummary(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('calls next with 400 AppError when end date is invalid', async () => {
      const mockNext = vi.fn();
      const { mockRes } = makeMockRes();
      const mockReq = {
        query: { start: '2025-01-01', end: 'also-invalid' },
        user: USER,
      } as unknown as Request;

      await handleGetSummary(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('calls next with error on service failure', async () => {
      const mockNext = vi.fn();
      const { mockRes } = makeMockRes();
      const mockReq = { query: {}, user: USER } as unknown as Request;
      const error = new Error('Aggregation failed');
      vi.spyOn(historyService, 'getSummary').mockRejectedValue(error);

      await handleGetSummary(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  // ─── handleGetTrends ─────────────────────────────────

  describe('handleGetTrends', () => {
    it('calls getMonthlyTrends with default 6 months when no query param', async () => {
      const { mockRes, statusMock, jsonMock } = makeMockRes();
      const mockReq = { query: {}, user: USER } as unknown as Request;
      vi.spyOn(historyService, 'getMonthlyTrends').mockResolvedValue([] as any);

      await handleGetTrends(mockReq, mockRes as Response, vi.fn());

      expect(historyService.getMonthlyTrends).toHaveBeenCalledWith(USER.userId, 6);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: [] });
    });

    it('passes custom months value from query', async () => {
      const { mockRes } = makeMockRes();
      const mockReq = { query: { months: '12' }, user: USER } as unknown as Request;
      vi.spyOn(historyService, 'getMonthlyTrends').mockResolvedValue([] as any);

      await handleGetTrends(mockReq, mockRes as Response, vi.fn());

      expect(historyService.getMonthlyTrends).toHaveBeenCalledWith(USER.userId, 12);
    });

    it('clamps months to maximum of 24', async () => {
      const { mockRes } = makeMockRes();
      const mockReq = { query: { months: '999' }, user: USER } as unknown as Request;
      vi.spyOn(historyService, 'getMonthlyTrends').mockResolvedValue([] as any);

      await handleGetTrends(mockReq, mockRes as Response, vi.fn());

      expect(historyService.getMonthlyTrends).toHaveBeenCalledWith(USER.userId, 24);
    });

    it('calls next with error on service failure', async () => {
      const mockNext = vi.fn();
      const { mockRes } = makeMockRes();
      const mockReq = { query: {}, user: USER } as unknown as Request;
      const error = new Error('Trends failed');
      vi.spyOn(historyService, 'getMonthlyTrends').mockRejectedValue(error);

      await handleGetTrends(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
