'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Debug log (masked for safety)
  console.log('[Supabase Init] URL:', url || '(undefined)');
  console.log(
    '[Supabase Init] Anon Key:',
    anonKey ? anonKey.substring(0, 6) + '...' : '(undefined)'
  );

  if (!url || !anonKey) {
    const msg = `❌ Supabase configuration missing.
      NEXT_PUBLIC_SUPABASE_URL: ${url || '(undefined)'}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKey ? '(set)' : '(undefined)'}
    `;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    } else {
      console.warn(msg);
      console.warn('⚠️ Using fallback Supabase credentials for local development.');
    }
  }

  supabase = createClient(
    url || 'https://lwcrabjetfsxncfygtvq.supabase.co',
    anonKey ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Y3JhYmpldGZzeG5jZnlndHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzYyOTIsImV4cCI6MjA3MDA1MjI5Mn0.04V_2Egctqf4-BbO8ZX4ITADarEpQVcl7Ow1zD5poqs'
  );

  return supabase;
}
