import { createClient } from '@supabase/supabase-js';

// Frontend Client (Respects RLS)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key"
);

// ⚠️ ADMIN CLIENT — ONLY use in API routes (server-side), NEVER in client components
// This was exposed client-side before — security vulnerability
// If you need admin operations, use API routes with service role key
export const supabaseAdmin = null;
