'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'manager' | 'staff' | 'barber' | 'customer' | 'client';
  phone?: string;
  avatar?: string;
  tenantId?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert session to our User type
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user as any).role || 'customer',
        phone: (session.user as any).phone,
        avatar: session.user.image,
        tenantId: (session.user as any).tenantId
      });
      setError(null);
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [session, status]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/' });
      setUser(null);
      setError(null);
    } catch (err) {
      setError('Logout failed. Please try again.');
    }
  }, []);

  const register = useCallback(async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message || 'Registration failed');
        return false;
      }

      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      return false;
    }
  }, []);

  const hasRole = useCallback((roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  const isAdmin = useCallback(() => hasRole(['admin']), [hasRole]);
  const isManager = useCallback(() => hasRole(['admin', 'manager']), [hasRole]);
  const isStaff = useCallback(() => hasRole(['admin', 'manager', 'staff', 'barber']), [hasRole]);
  const isCustomer = useCallback(() => hasRole(['customer', 'client']), [hasRole]);

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!user,
    error,
    login,
    logout,
    register,
    hasRole,
    isAdmin,
    isManager,
    isStaff,
    isCustomer,
    clearError: () => setError(null)
  };
}
