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

import { createClient } from '@/utils/supabase/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error loading session:", error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    }

    async function fetchProfile(authUser: any) {
      if (!mounted) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error || !data) {
          // If profile doesn't exist yet (e.g. just signed up and trigger hasn't fired), 
          // create a fallback user object
          setUser({
            id: authUser.id,
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
            role: 'customer'
          });
        } else {
          setUser({
            id: data.id,
            name: data.full_name,
            email: data.email,
            role: data.role as 'customer' | 'admin'
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }
    
    // We insert into profiles directly from client side to ensure it exists immediately if RLS allows it
    // Wait, typically this is done via DB trigger. But just in case:
    if (data.user) {
      // Best effort insert. If it fails due to RLS, the trigger hopefully caught it.
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: name,
        email: email,
        role: 'customer'
      }).select().single();
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
