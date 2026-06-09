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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get<{ success: boolean; data: { user: UserProfile } }>('/auth/profile');
      if (res.data.success && res.data.data.user) {
        setUser(res.data.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      // If unauthorized, user is simply not logged in
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
      const res = await api.get<{ success: boolean; data: { user: UserProfile } }>('/auth/profile');
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
