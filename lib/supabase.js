import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug: Log actual values (remove after fixing)
if (typeof window !== 'undefined') {
  console.log('🔑 ENV DEBUG:', {
    url: supabaseUrl ? supabaseUrl.substring(0, 40) + '...' : 'MISSING',
    urlLen: supabaseUrl?.length || 0,
    key: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING',
    keyLen: supabaseAnonKey?.length || 0,
    svcKey: supabaseServiceKey ? 'SET (' + supabaseServiceKey.length + ' chars)' : 'MISSING'
  });
}

// Only create client if BOTH url and key are available
let supabase;
let supabaseAdmin;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a dummy client that won't crash but will fail on auth calls
  console.error('⚠️ Supabase not initialized - URL or Key missing');
  supabase = {
    auth: {
      getUser: () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      getSession: () => ({ data: { session: null }, error: { message: 'Supabase not configured' } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => ({})
    },
    from: () => ({ select: () => ({ data: null, error: { message: 'Not configured' } }), eq: () => ({ data: null, error: { message: 'Not configured' } }), maybeSingle: () => ({ data: null, error: { message: 'Not configured' } }), insert: () => ({ error: { message: 'Not configured' } }), update: () => ({ error: { message: 'Not configured' } }), delete: () => ({ error: { message: 'Not configured' } }) })
  };
}

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
} else {
  supabaseAdmin = supabase;
}

export { supabase, supabaseAdmin };
