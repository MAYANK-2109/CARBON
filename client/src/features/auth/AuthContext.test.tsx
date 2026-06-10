/**
 * @module features/auth/AuthContext.test
 * @description Unit tests for the AuthContext provider and its API integrations.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from './AuthContext';
import React, { useContext } from 'react';
import { api } from '../../lib/api';

vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

const TestComponent = () => {
  const context = useContext(AuthContext);
  if (!context) return null;
  return (
    <div>
      <span data-testid="is-auth">{context.isAuthenticated.toString()}</span>
      <span data-testid="is-loading">{context.isLoading.toString()}</span>
      <span data-testid="user-email">{context.user?.email || 'none'}</span>
      <button onClick={() => context.login({ email: 'test@test.com', password: 'password' })}>Login</button>
      <button onClick={() => context.logout()}>Logout</button>
      <button onClick={() => context.refreshProfile()}>Refresh</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks auth on mount and sets user on success', async () => {
    mockGet.mockResolvedValueOnce({ data: { success: true, data: { user: { email: 'mount@test.com' } } } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-loading').textContent).toBe('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('is-loading').textContent).toBe('false');
    });
    expect(screen.getByTestId('is-auth').textContent).toBe('true');
    expect(screen.getByTestId('user-email').textContent).toBe('mount@test.com');
  });

  it('checks auth on mount and sets null on failure', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-loading').textContent).toBe('false');
    });
    expect(screen.getByTestId('is-auth').textContent).toBe('false');
    expect(screen.getByTestId('user-email').textContent).toBe('none');
  });

  it('handles auth:logout event', async () => {
    mockGet.mockResolvedValueOnce({ data: { success: true, data: { user: { email: 'auth@test.com' } } } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-auth').textContent).toBe('true');
    });

    window.dispatchEvent(new CustomEvent('auth:logout'));

    await waitFor(() => {
      expect(screen.getByTestId('is-auth').textContent).toBe('false');
    });
  });
});
