
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('mizu_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setSession(parsed);
      } catch {}
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Sign in failed');
    }

    const data = await res.json();
    const sessionData = { user: data.user, token: data.token };
    localStorage.setItem('mizu_auth', JSON.stringify(sessionData));
    setUser(data.user);
    setSession(sessionData);
    return data;
  };

  const signOut = async () => {
    localStorage.removeItem('mizu_auth');
    setUser(null);
    setSession(null);
  };

  const signUp = async (email: string, password: string) => {
    return signIn(email, password);
  };

  const getCurrentUser = async () => user;
  const isEmailVerified = () => true;
  const getUserProfile = async () => user;

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    isEmailVerified,
    getUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
