"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

// Updated User type with optional name
type User = {
  id: string;
  email: string | null;
  name?: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabaseClient();

  // Helper to map Supabase user to our User type
  const mapUser = (u: any): User => ({
    id: u.id,
    email: u.email ?? null,
    name: u.user_metadata?.name ?? null,
  });

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data }) => {
      const supaUser = data.session?.user;
      setUser(supaUser ? mapUser(supaUser) : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const supaUser = session?.user;
      setUser(supaUser ? mapUser(supaUser) : null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error("Sign in error:", error.message);
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) console.error("Sign up error:", error.message);
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out error:", error.message);
    setUser(null);
    setLoading(false);
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signIn, signUp, signOut, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
