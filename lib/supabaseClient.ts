'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client.
 * Throws an error if environment variables are missing in production.
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("Supabase URL:", url || "MISSING");
  console.log(
    "Supabase Anon Key:",
    anonKey ? anonKey.substring(0, 4) + "...[hidden]" : "MISSING"
  );

  if (!url || !anonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables!'
      );
    } else {
      console.warn(
        'Supabase env variables missing. Using fallback values for local development.'
      );
    }
  }

  supabase = createClient(
    url || '', // fallback to empty string to avoid using hardcoded key
    anonKey || ''
  );

  return supabase;
}
