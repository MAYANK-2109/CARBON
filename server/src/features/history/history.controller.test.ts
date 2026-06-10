import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { handleGetHistory, handleGetSummary, handleGetTrends } from './history.controller';
import * as historyService from './history.service';

vi.mock('./history.service');

describe('History Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: any;
  let statusMock: any;
  let jsonMock: any;

  beforeEach(() => {
    jsonMock = vi.fn();
    mockRes = {
      json: jsonMock,
    };
    statusMock = vi.fn().mockReturnValue(mockRes);
    mockRes.status = statusMock;
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('handleGetHistory', () => {
    it('gets history successfully', async () => {
      mockReq = { query: { page: '1', limit: '20' }, user: { userId: '1' } as any };
      vi.spyOn(historyService, 'getHistory').mockResolvedValue({ records: [], total: 0 } as any);

      await handleGetHistory(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { records: [], total: 0 } });
    });

    it('handles errors', async () => {
      mockReq = { query: {}, user: { userId: '1' } as any };
      const error = new Error('Test');
      vi.spyOn(historyService, 'getHistory').mockRejectedValue(error);

      await handleGetHistory(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('handleGetSummary', () => {
    it('gets summary successfully', async () => {
      mockReq = { query: {}, user: { userId: '1' } as any };
      vi.spyOn(historyService, 'getSummary').mockResolvedValue({ totalCo2eKg: 0 } as any);

      await handleGetSummary(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { totalCo2eKg: 0 } });
    });
    
    it('gets summary with custom dates successfully', async () => {
      mockReq = { query: { start: '2025-01-01', end: '2025-12-31' }, user: { userId: '1' } as any };
      vi.spyOn(historyService, 'getSummary').mockResolvedValue({ totalCo2eKg: 0 } as any);

      await handleGetSummary(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('calls next with 400 AppError when date strings are invalid', async () => {
      mockReq = { query: { start: 'not-a-date', end: '2025-12-31' }, user: { userId: '1' } as any };

      await handleGetSummary(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400 })
      );
    });
  });

  describe('handleGetTrends', () => {
    it('gets trends successfully', async () => {
      mockReq = { query: { months: '6' }, user: { userId: '1' } as any };
      vi.spyOn(historyService, 'getMonthlyTrends').mockResolvedValue([] as any);

      await handleGetTrends(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: [] });
    });

    it('handles errors from getMonthlyTrends', async () => {
      mockReq = { query: {}, user: { userId: '1' } as any };
      const error = new Error('Trends failed');
      vi.spyOn(historyService, 'getMonthlyTrends').mockRejectedValue(error);

      await handleGetTrends(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
