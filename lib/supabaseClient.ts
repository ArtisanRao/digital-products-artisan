'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client.
 * Logs env vars (URL fully, anon key masked) for debugging.
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
      console.warn('Using hardcoded Supabase credentials for local development');
    }
  }

  supabase = createClient(
    url || 'https://lwcrabjetfsxncfygtvq.supabase.co',
    anonKey ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Y3JhYmpldGZzeG5jZnlndHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzYyOTIsImV4cCI6MjA3MDA1MjI5Mn0.04V_2Egctqf4-BbO8ZX4ITADarEpQVcl7Ow1zD5poqs'
  );

  return supabase;
}
