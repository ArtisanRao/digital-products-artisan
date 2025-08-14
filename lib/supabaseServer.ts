import { createClient } from "@supabase/supabase-js";

// Server-only Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables!"
  );
}

// This client can be used in server-side code (getStaticProps, route handlers, etc.)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
