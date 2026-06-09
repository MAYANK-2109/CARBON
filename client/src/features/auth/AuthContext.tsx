import React, { createContext, useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import type { UserProfile, LoginInput, RegisterInput, AuthResponse } from '@carbon/shared';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: { user: UserProfile } }>('/auth/me');
      if (res.data.success && res.data.data.user) {
        setUser(res.data.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    checkAuth();
  }, [checkAuth]);

  // ─── Silent Refresh Failure Handler ──────────────────────────────────────
  // The API interceptor dispatches 'auth:logout' when the refresh token is also
  // expired/invalid. We clear user state here so ProtectedRoute can redirect to
  // /login once — no repeated login loop.
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      setIsLoading(false);
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = async (credentials: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
      if (res.data.success && res.data.data.user) {
        setUser(res.data.data.user);
      }
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
      if (res.data.success && res.data.data.user) {
        setUser(res.data.data.user);
      }
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get<{ success: boolean; data: { user: UserProfile } }>('/auth/me');
      if (res.data.success && res.data.data.user) {
        setUser(res.data.data.user);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
