import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { handleRegister, handleLogin, handleLogout, handleRefresh, handleGetProfile } from './auth.controller';
import * as authService from './auth.service';

vi.mock('./auth.service');

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: any;
  let statusMock: any;
  let jsonMock: any;
  let cookieMock: any;
  let clearCookieMock: any;

  beforeEach(() => {
    jsonMock = vi.fn();
    cookieMock = vi.fn();
    clearCookieMock = vi.fn();
    mockRes = {
      json: jsonMock,
      cookie: cookieMock,
      clearCookie: clearCookieMock,
    };
    statusMock = vi.fn().mockReturnValue(mockRes);
    mockRes.status = statusMock;
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('handleRegister', () => {
    it('registers user successfully', async () => {
      mockReq = { body: { email: 'test@test.com', password: 'pass', name: 'Test' } };
      vi.spyOn(authService, 'registerUser').mockResolvedValue({
        user: { id: '1', email: 'test@test.com', name: 'Test' } as any,
        accessToken: 'access',
        refreshToken: 'refresh',
      });

      await handleRegister(mockReq as Request, mockRes as Response, mockNext);

      expect(cookieMock).toHaveBeenCalledWith('accessToken', 'access', expect.any(Object));
      expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'refresh', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, message: 'Account created successfully.', data: { user: expect.any(Object) } });
    });

    it('handles errors', async () => {
      mockReq = { body: {} };
      const error = new Error('Test Error');
      vi.spyOn(authService, 'registerUser').mockRejectedValue(error);

      await handleRegister(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('handleLogin', () => {
    it('logs in user successfully', async () => {
      mockReq = { body: { email: 'test@test.com', password: 'pass' } };
      vi.spyOn(authService, 'loginUser').mockResolvedValue({
        user: { id: '1', email: 'test@test.com', name: 'Test' } as any,
        accessToken: 'access',
        refreshToken: 'refresh',
      });

      await handleLogin(mockReq as Request, mockRes as Response, mockNext);

      expect(cookieMock).toHaveBeenCalledWith('accessToken', 'access', expect.any(Object));
      expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'refresh', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, message: 'Logged in successfully.', data: { user: expect.any(Object) } });
    });
  });

  describe('handleLogout', () => {
    it('clears cookies', () => {
      handleLogout(mockReq as Request, mockRes as Response);
      expect(clearCookieMock).toHaveBeenCalledWith('accessToken', expect.any(Object));
      expect(clearCookieMock).toHaveBeenCalledWith('refreshToken', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, message: 'Logged out successfully.', data: null });
    });
  });

  describe('handleRefresh', () => {
    it('refreshes tokens', async () => {
      mockReq = { cookies: { refreshToken: 'oldRefresh' } };
      vi.spyOn(authService, 'refreshTokens').mockResolvedValue({
        accessToken: 'newAccess',
        refreshToken: 'newRefresh',
      });

      await handleRefresh(mockReq as Request, mockRes as Response, mockNext);

      expect(cookieMock).toHaveBeenCalledWith('accessToken', 'newAccess', expect.any(Object));
      expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'newRefresh', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('returns 401 if no refresh token', async () => {
      mockReq = { cookies: {} };
      await handleRefresh(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(401);
    });
  });

  describe('handleGetProfile', () => {
    it('gets profile', async () => {
      mockReq = { user: { userId: '1' } as any };
      vi.spyOn(authService, 'getUserProfile').mockResolvedValue({ id: '1' } as any);

      await handleGetProfile(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { user: { id: '1' } } });
    });
  });
});
