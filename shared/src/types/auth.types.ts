/**
 * @module @carbon/shared/types/auth
 * @description Authentication-related type definitions shared between client and server.
 */

import { z } from 'zod';

/** Zod schema for user registration input */
export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be at most 255 characters')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

/** Zod schema for user login input */
export const LoginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required'),
});

/** Inferred TypeScript types from Zod schemas */
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

/** User object returned to the client (no password) */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/** Auth response containing user profile and token metadata */
export interface AuthResponse {
  user: UserProfile;
  message: string;
}
