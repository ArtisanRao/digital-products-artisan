'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = { name: string; email: string };
type AuthContextType = {
  /** New canonical field */
  currentUser: User | null;
  /** Back-compat alias for older code that uses `user` */
  user: User | null;

  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'dpa_users';
const SESSION_KEY = 'dpa_session';

function readUsers(): Array<User & { password: string }> {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}
function writeUsers(users: Array<User & { password: string }>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const email = localStorage.getItem(SESSION_KEY);
      if (!email) return;
      const users = readUsers();
      const u = users.find((x) => x.email === email);
      if (u) setCurrentUser({ name: u.name, email: u.email });
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      user: currentUser, // ← back-compat alias

      async signup(name, email, password) {
        const users = readUsers();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error('Email already registered');
        }
        users.push({ name, email, password });
        writeUsers(users);
        localStorage.setItem(SESSION_KEY, email);
        setCurrentUser({ name, email });
      },

      async login(email, password) {
        const users = readUsers();
        const match = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!match) throw new Error('Invalid email or password');
        localStorage.setItem(SESSION_KEY, match.email);
        setCurrentUser({ name: match.name, email: match.email });
      },

      async logout() {
        localStorage.removeItem(SESSION_KEY);
        setCurrentUser(null);
      },
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
