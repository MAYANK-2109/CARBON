import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { handleChat } from './chat.controller';
import * as chatService from './chat.service';
import * as historyService from '../history/history.service';

vi.mock('./chat.service');
vi.mock('../history/history.service');

describe('Chat Controller', () => {
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

  describe('handleChat', () => {
    it('handles chat successfully without user', async () => {
      mockReq = { body: { messages: [{ role: 'user', content: 'hello' }] } };
      vi.spyOn(chatService, 'generateChatResponse').mockResolvedValue('hi there');

      await handleChat(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { reply: 'hi there' } });
    });

    it('handles chat successfully with user', async () => {
      mockReq = { body: { messages: [{ role: 'user', content: 'hello' }] }, user: { userId: '1' } as any };
      vi.spyOn(historyService, 'getSummary').mockResolvedValue({ totalCo2eKg: 10 } as any);
      vi.spyOn(chatService, 'generateChatResponse').mockResolvedValue('hi there');

      await handleChat(mockReq as Request, mockRes as Response, mockNext);

      expect(historyService.getSummary).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { reply: 'hi there' } });
    });

    it('handles missing messages array', async () => {
      mockReq = { body: {} };
      
      await handleChat(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: 'Invalid request: "messages" list is required.' });
    });

    it('handles errors', async () => {
      mockReq = { body: { messages: [] } };
      const error = new Error('Test Error');
      vi.spyOn(chatService, 'generateChatResponse').mockRejectedValue(error);

      await handleChat(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
    
    it('handles summary fetch failure gracefully', async () => {
      mockReq = { body: { messages: [{ role: 'user', content: 'hello' }] }, user: { userId: '1' } as any };
      vi.spyOn(historyService, 'getSummary').mockRejectedValue(new Error('Fetch failed'));
      vi.spyOn(chatService, 'generateChatResponse').mockResolvedValue('hi there');

      await handleChat(mockReq as Request, mockRes as Response, mockNext);

      expect(historyService.getSummary).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { reply: 'hi there' } });
    });
  });
});
