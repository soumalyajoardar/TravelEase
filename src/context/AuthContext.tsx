"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, this would be a secure HttpOnly cookie session validated by the backend.
// For the mockup, we simulate standard Auth flows using local state and localStorage.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initial load: check for session
    const storedUser = localStorage.getItem('te_mock_session');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('te_mock_session');
      }
    }
    setIsLoading(false);
  }, []);

  // Protected route checking
  useEffect(() => {
    if (!isLoading) {
      const protectedRoutes = ['/account', '/profile', '/admin'];
      const isProtected = protectedRoutes.some(route => pathname?.startsWith(route));
      
      if (isProtected && !user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname || '/')}`);
      }
    }
  }, [isLoading, user, pathname, router]);

  const login = async (email: string, password: string) => {
    // Simulate network delay and backend validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Strict Mock Backend Validation Rule: We only mock the flow, no hardcoded "fake users" in UI, 
    // but we need to let the user in for testing the prototype. 
    // If they type 'admin@travelease.com', give admin role, otherwise standard customer.
    if (password.length < 6) {
      throw new Error("Your email or password is incorrect.");
    }
    
    const loggedInUser: User = {
      id: 'USR' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      name: email.split('@')[0], // Derive simple name from email for mock
      email,
      role: email === 'admin@travelease.com' ? 'admin' : 'customer'
    };
    
    setUser(loggedInUser);
    localStorage.setItem('te_mock_session', JSON.stringify(loggedInUser));
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate network delay and backend validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: 'USR' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      name,
      email,
      role: 'customer'
    };
    
    setUser(newUser);
    localStorage.setItem('te_mock_session', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('te_mock_session');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
