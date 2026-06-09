/**
 * @module features/auth/auth.service
 * @description Authentication business logic — registration, login, token management.
 */

import bcrypt from 'bcryptjs';
import { User, IUser } from '../../models/User.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../../utils/token';
import { AppError } from '../../middleware/error.middleware';
import type { UserProfile } from '@carbon/shared';

const SALT_ROUNDS = 12;

/**
 * Register a new user account.
 * @param name - User display name
 * @param email - User email (unique)
 * @param password - Raw password (will be hashed)
 * @returns Object containing user profile, access token, and refresh token
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ user: UserProfile; accessToken: string; refreshToken: string }> {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(409, 'An account with this email already exists.');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await User.create({ name, email, passwordHash });

  // Generate tokens
  const payload: TokenPayload = { userId: user._id.toString(), email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: formatUserProfile(user),
    accessToken,
    refreshToken,
  };
}

/**
 * Authenticate a user with email and password.
 * @param email - User email
 * @param password - Raw password
 * @returns Object containing user profile, access token, and refresh token
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: UserProfile; accessToken: string; refreshToken: string }> {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const payload: TokenPayload = { userId: user._id.toString(), email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: formatUserProfile(user),
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh an expired access token using a valid refresh token.
 * @param token - Refresh token
 * @returns New access token and refresh token
 */
export async function refreshTokens(
  token: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = verifyRefreshToken(token);
  if (!payload) {
    throw new AppError(401, 'Invalid or expired refresh token.');
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    throw new AppError(401, 'User no longer exists.');
  }

  const newPayload: TokenPayload = { userId: user._id.toString(), email: user.email };
  return {
    accessToken: generateAccessToken(newPayload),
    refreshToken: generateRefreshToken(newPayload),
  };
}

/**
 * Get user profile by ID.
 * @param userId - User database ID
 * @returns User profile or throws if not found
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found.');
  }
  return formatUserProfile(user);
}

/**
 * Format a Mongoose user document into a safe UserProfile DTO.
 */
function formatUserProfile(user: IUser): UserProfile {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}
