/**
 * @module features/auth/useAuth.test
 * @description Unit tests for the useAuth hook.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useAuth } from './useAuth';
import { AuthContext } from './AuthContext';

describe('useAuth hook', () => {
  it('throws an error if used outside of AuthProvider', () => {
    // Suppress expected console.error from React about unhandled errors in render
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });

  it('returns context value when used within AuthProvider', () => {
    const mockContextValue = {
      user: { id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User', footprint: { total: 0 } },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshProfile: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toEqual(mockContextValue);
  });
});
