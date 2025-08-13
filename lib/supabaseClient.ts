// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Prefer environment variables, fallback to hardcoded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lwcrabjetfsxncfygtvq.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Y3JhYmpldGZzeG5jZnlndHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzYyOTIsImV4cCI6MjA3MDA1MjI5Mn0.04V_2Egctqf4-BbO8ZX4ITADarEpQVcl7Ow1zD5poqs";

// Only create client if URL and key are available
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
