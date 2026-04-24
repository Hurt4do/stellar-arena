import { createClient } from "@supabase/supabase-js";

// Server-side only client using service role key — bypasses RLS.
// NEVER import this in client components ("use client").
// Falls back to anon key if service role key is not configured.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey || anonKey
);
