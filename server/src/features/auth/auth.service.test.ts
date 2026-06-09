import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser, loginUser, refreshTokens, getUserProfile } from './auth.service';
import { User } from '../../models/User.model';
import bcrypt from 'bcryptjs';
import * as tokenUtils from '../../utils/token';
import { AppError } from '../../middleware/error.middleware';

vi.mock('../../models/User.model', () => {
  return {
    User: {
      findOne: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
    },
  };
});

vi.mock('bcryptjs', () => {
  return {
    default: {
      hash: vi.fn(),
      compare: vi.fn(),
    },
  };
});

vi.mock('../../utils/token', () => {
  return {
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    verifyRefreshToken: vi.fn(),
  };
});

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('successfully registers a user', async () => {
      const mockUser = {
        _id: 'mockUserId',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashedpassword',
        createdAt: new Date(),
      };

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedpassword' as any);
      vi.mocked(User.create).mockResolvedValue(mockUser as any);
      vi.mocked(tokenUtils.generateAccessToken).mockReturnValue('mockAccessToken');
      vi.mocked(tokenUtils.generateRefreshToken).mockReturnValue('mockRefreshToken');

      const result = await registerUser('John Doe', 'john@example.com', 'password123');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(User.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashedpassword',
      });
      expect(result.accessToken).toBe('mockAccessToken');
      expect(result.refreshToken).toBe('mockRefreshToken');
      expect(result.user.name).toBe('John Doe');
      expect(result.user.email).toBe('john@example.com');
    });

    it('throws error if user email already exists', async () => {
      vi.mocked(User.findOne).mockResolvedValue({ _id: 'someId' } as any);

      await expect(
        registerUser('John Doe', 'john@example.com', 'password123')
      ).rejects.toThrowError(new AppError(409, 'An account with this email already exists.'));
    });
  });

  describe('loginUser', () => {
    it('successfully logs in a user', async () => {
      const mockUser = {
        _id: 'mockUserId',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashedpassword',
        createdAt: new Date(),
      };

      // Mock chainable findOne().select()
      const selectMock = vi.fn().mockResolvedValue(mockUser);
      vi.mocked(User.findOne).mockReturnValue({
        select: selectMock,
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
      vi.mocked(tokenUtils.generateAccessToken).mockReturnValue('mockAccessToken');
      vi.mocked(tokenUtils.generateRefreshToken).mockReturnValue('mockRefreshToken');

      const result = await loginUser('john@example.com', 'password123');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(selectMock).toHaveBeenCalledWith('+passwordHash');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(result.accessToken).toBe('mockAccessToken');
      expect(result.user.email).toBe('john@example.com');
    });

    it('throws error for non-existent user email', async () => {
      const selectMock = vi.fn().mockResolvedValue(null);
      vi.mocked(User.findOne).mockReturnValue({
        select: selectMock,
      } as any);

      await expect(loginUser('john@example.com', 'password123')).rejects.toThrowError(
        new AppError(401, 'Invalid email or password.')
      );
    });

    it('throws error for incorrect password', async () => {
      const mockUser = {
        _id: 'mockUserId',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashedpassword',
        createdAt: new Date(),
      };

      const selectMock = vi.fn().mockResolvedValue(mockUser);
      vi.mocked(User.findOne).mockReturnValue({
        select: selectMock,
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(false as any);

      await expect(loginUser('john@example.com', 'wrongpassword')).rejects.toThrowError(
        new AppError(401, 'Invalid email or password.')
      );
    });
  });

  describe('refreshTokens', () => {
    it('successfully refreshes tokens', async () => {
      const mockUser = {
        _id: 'mockUserId',
        email: 'john@example.com',
      };

      vi.mocked(tokenUtils.verifyRefreshToken).mockReturnValue({
        userId: 'mockUserId',
        email: 'john@example.com',
      });
      vi.mocked(User.findById).mockResolvedValue(mockUser as any);
      vi.mocked(tokenUtils.generateAccessToken).mockReturnValue('newAccessToken');
      vi.mocked(tokenUtils.generateRefreshToken).mockReturnValue('newRefreshToken');

      const result = await refreshTokens('validRefreshToken');

      expect(tokenUtils.verifyRefreshToken).toHaveBeenCalledWith('validRefreshToken');
      expect(User.findById).toHaveBeenCalledWith('mockUserId');
      expect(result.accessToken).toBe('newAccessToken');
      expect(result.refreshToken).toBe('newRefreshToken');
    });

    it('throws error for invalid refresh token', async () => {
      vi.mocked(tokenUtils.verifyRefreshToken).mockReturnValue(null);

      await expect(refreshTokens('invalidToken')).rejects.toThrowError(
        new AppError(401, 'Invalid or expired refresh token.')
      );
    });

    it('throws error if user no longer exists', async () => {
      vi.mocked(tokenUtils.verifyRefreshToken).mockReturnValue({
        userId: 'mockUserId',
        email: 'john@example.com',
      });
      vi.mocked(User.findById).mockResolvedValue(null);

      await expect(refreshTokens('validRefreshToken')).rejects.toThrowError(
        new AppError(401, 'User no longer exists.')
      );
    });
  });

  describe('getUserProfile', () => {
    it('successfully fetches user profile', async () => {
      const mockUser = {
        _id: 'mockUserId',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
      };

      vi.mocked(User.findById).mockResolvedValue(mockUser as any);

      const result = await getUserProfile('mockUserId');

      expect(User.findById).toHaveBeenCalledWith('mockUserId');
      expect(result.id).toBe('mockUserId');
      expect(result.name).toBe('John Doe');
    });

    it('throws error if user not found', async () => {
      vi.mocked(User.findById).mockResolvedValue(null);

      await expect(getUserProfile('nonExistentId')).rejects.toThrowError(
        new AppError(404, 'User not found.')
      );
    });
  });
});
