/**
 * @module features/auth/auth.controller.test
 * @description Unit tests for authentication request handlers.
 * Covers all happy paths, error paths, and edge cases.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { handleRegister, handleLogin, handleLogout, handleRefresh, handleGetProfile } from './auth.controller';
import * as authService from './auth.service';

vi.mock('./auth.service');

const mockUserProfile = { id: '1', email: 'test@test.com', name: 'Test User', createdAt: new Date().toISOString() };

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let cookieMock: ReturnType<typeof vi.fn>;
  let clearCookieMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jsonMock = vi.fn();
    cookieMock = vi.fn();
    clearCookieMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockRes = {
      json: jsonMock,
      cookie: cookieMock,
      clearCookie: clearCookieMock,
      status: statusMock,
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  // ─── handleRegister ────────────────────────────────────────

  describe('handleRegister', () => {
    it('registers user successfully — sets cookies and responds 201', async () => {
      mockReq = { body: { email: 'test@test.com', password: 'pass', name: 'Test User' } };
      vi.spyOn(authService, 'registerUser').mockResolvedValue({
        user: mockUserProfile,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      await handleRegister(mockReq as Request, mockRes as Response, mockNext);

      expect(cookieMock).toHaveBeenCalledWith('accessToken', 'access-token', expect.any(Object));
      expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Account created successfully.',
        data: { user: mockUserProfile },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('passes error to next when registration fails (duplicate email)', async () => {
      mockReq = { body: { email: 'existing@test.com', password: 'pass', name: 'Dupe' } };
      const error = new Error('Email already exists');
      vi.spyOn(authService, 'registerUser').mockRejectedValue(error);

      await handleRegister(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  // ─── handleLogin ────────────────────────────────────────

  describe('handleLogin', () => {
    it('logs in user successfully — sets cookies and responds 200', async () => {
      mockReq = { body: { email: 'test@test.com', password: 'pass' } };
      vi.spyOn(authService, 'loginUser').mockResolvedValue({
        user: mockUserProfile,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      await handleLogin(mockReq as Request, mockRes as Response, mockNext);

      expect(cookieMock).toHaveBeenCalledWith('accessToken', 'access-token', expect.any(Object));
      expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Logged in successfully.',
        data: { user: mockUserProfile },
      });
    });

    it('passes error to next on invalid credentials', async () => {
      mockReq = { body: { email: 'wrong@test.com', password: 'wrongpass' } };
      const error = new Error('Invalid email or password.');
      vi.spyOn(authService, 'loginUser').mockRejectedValue(error);

      await handleLogin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  // ─── handleLogout ─────────────────────────────────────

  describe('handleLogout', () => {
    it('clears both auth cookies and responds 200', () => {
      mockReq = {};
      handleLogout(mockReq as Request, mockRes as Response);

      expect(clearCookieMock).toHaveBeenCalledWith('accessToken', expect.any(Object));
      expect(clearCookieMock).toHaveBeenCalledWith('refreshToken', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully.',
        data: null,
      });
    });
  });

  // ─── handleRefresh ────────────────────────────────────

  describe('handleRefresh', () => {
    it('refreshes tokens and sets new cookies', async () => {
      mockReq = { cookies: { refreshToken: 'old-refresh-token' } };
      vi.spyOn(authService, 'refreshTokens').mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      await handleRefresh(mockReq as Request, mockRes as Response, mockNext);

      expect(cookieMock).toHaveBeenCalledWith('accessToken', 'new-access-token', expect.any(Object));
      expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'new-refresh-token', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: null,
        message: 'Token refreshed successfully.',
      });
    });

    it('responds 401 when no refresh token cookie is present', async () => {
      mockReq = { cookies: {} };

      await handleRefresh(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'No refresh token provided.',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('passes error to next when refresh token is invalid/expired', async () => {
      mockReq = { cookies: { refreshToken: 'expired-token' } };
      const error = new Error('Invalid or expired refresh token.');
      vi.spyOn(authService, 'refreshTokens').mockRejectedValue(error);

      await handleRefresh(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  // ─── handleGetProfile ────────────────────────────────

  describe('handleGetProfile', () => {
    it('returns user profile for authenticated request', async () => {
      mockReq = { user: { userId: 'user-1', email: 'test@test.com' } };
      vi.spyOn(authService, 'getUserProfile').mockResolvedValue(mockUserProfile);

      await handleGetProfile(mockReq as Request, mockRes as Response, mockNext);

      expect(authService.getUserProfile).toHaveBeenCalledWith('user-1');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { user: mockUserProfile } });
    });

    it('passes error to next when user is not found', async () => {
      mockReq = { user: { userId: 'deleted-user', email: 'gone@test.com' } };
      const error = new Error('User not found.');
      vi.spyOn(authService, 'getUserProfile').mockRejectedValue(error);

      await handleGetProfile(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});
