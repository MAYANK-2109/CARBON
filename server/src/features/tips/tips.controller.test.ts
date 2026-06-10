import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { handleGetTips, handleGetPersonalizedTips } from './tips.controller';
import { TIPS_DATABASE } from './tips.data';

describe('Tips Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: any;
  let jsonMock: any;

  beforeEach(() => {
    jsonMock = vi.fn();
    mockRes = {
      json: jsonMock,
    };
    statusMock = vi.fn().mockReturnValue(mockRes);
    mockRes.status = statusMock;
    vi.clearAllMocks();
  });

  describe('handleGetTips', () => {
    it('returns all tips when no query params are provided', () => {
      mockReq = { query: {} };
      handleGetTips(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Array),
      });
      expect(jsonMock.mock.calls[0][0].data.length).toBe(TIPS_DATABASE.length);
    });

    it('filters tips by category', () => {
      mockReq = { query: { category: 'travel' } };
      handleGetTips(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      const data = jsonMock.mock.calls[0][0].data;
      expect(data.every((t: any) => t.category === 'travel')).toBe(true);
    });

    it('limits the number of tips returned', () => {
      mockReq = { query: { limit: '2' } };
      handleGetTips(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock.mock.calls[0][0].data.length).toBe(2);
    });
  });

  describe('handleGetPersonalizedTips', () => {
    it('returns 5 highest impact tips', () => {
      mockReq = {};
      handleGetPersonalizedTips(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock.mock.calls[0][0].data.length).toBe(5);
    });
  });
});
