import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-service-key"; // FIX: Added fallback

// Frontend Client (Respects Row Level Security - RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin Client (Bypasses RLS - Only use in API routes/Server side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
