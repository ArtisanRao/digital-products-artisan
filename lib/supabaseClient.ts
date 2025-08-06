// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://lwcrabjetfsxncfygtvq.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Y3JhYmpldGZzeG5jZnlndHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzYyOTIsImV4cCI6MjA3MDA1MjI5Mn0.04V_2Egctqf4-BbO8ZX4ITADarEpQVcl7Ow1zD5poqs"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
