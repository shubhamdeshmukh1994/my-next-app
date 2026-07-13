'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// 1. Define the shapes for our context state
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Define which routes do NOT require logging in
const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password'];

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 3. Monitor login state changes and run route protection
  useEffect(() => {
    // Check if token exists in localStorage or document cookies
    const token = localStorage.getItem('auth-token');
    const hasToken = !!token;

    setIsAuthenticated(hasToken);
    setIsLoading(false);

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // Case A: Not logged in and trying to access a private page -> Send to /login
    if (!hasToken && !isPublicRoute) {
      router.replace('/login');
    }

    // Case B: Logged in and trying to access login/signup pages -> Send to homepage
    if (hasToken && isPublicRoute) {
      router.replace('/');
    }
  }, [pathname, router]);

  // 4. Authentication actions helper functions
  const login = (token: string) => {
    localStorage.setItem('auth-token', token);
    setIsAuthenticated(true);
    router.replace('/');
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    setIsAuthenticated(false);
    router.replace('/login');
  };

  // 5. Block visual glitches / flashing content while verifying identity
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  if (isLoading || (!isAuthenticated && !isPublicRoute)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Verifying authentication state...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 6. Custom hook to easily use auth anywhere in your app
export function useClientAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
}
