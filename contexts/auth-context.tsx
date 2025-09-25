"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  // existing API (unchanged)
  login: (email: string, password: string) => Promise<AuthUser | null>;
  signup: (name: string, email: string, password: string) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  // optional helpers (new)
  loginWithOtp?: (email: string) => Promise<void>;
  sendPasswordReset?: (email: string) => Promise<void>;
  refresh?: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAuthUser(u: any | null): AuthUser | null {
  if (!u) return null;
  const name =
    u.user_metadata?.full_name ??
    u.user_metadata?.name ??
    u.user_metadata?.username ??
    undefined;
  return { id: u.id, email: u.email!, name };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const u = data.session?.user ?? null;
        if (mounted.current) setUser(toAuthUser(u));
      } finally {
        if (mounted.current) setLoading(false);
      }
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted.current) return;
      const u = session?.user ?? null;
      setUser(toAuthUser(u));
    });

    return () => {
      mounted.current = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const refresh = async () => {
    const { data } = await supabase.auth.getSession();
    const u = toAuthUser(data.session?.user ?? null);
    if (mounted.current) setUser(u);
    return u;
  };

  const login: AuthContextType["login"] = async (email, password) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const u = toAuthUser(data.user ?? data.session?.user ?? null);
    if (mounted.current) setUser(u);
    return u;
  };

  const signup: AuthContextType["signup"] = async (name, email, password) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
    const u = toAuthUser(data.user ?? null);
    if (mounted.current) setUser(u);
    return u;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    if (mounted.current) setUser(null);
  };

  // optional helpers (don’t break existing callers)
  const loginWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  };

  const sendPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/reset-password`,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, loginWithOtp, sendPasswordReset, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
