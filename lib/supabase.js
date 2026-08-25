import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
let supabaseAdmin;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error('⚠️ Supabase not initialized - URL or Key missing in environment variables');
  supabase = {
    auth: {
      getUser: () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      getSession: () => ({ data: { session: null }, error: { message: 'Supabase not configured' } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => ({})
    },
    from: () => ({
      select: () => ({ data: null, error: { message: 'Not configured' }, eq: () => ({ data: null, error: { message: 'Not configured' } }), maybeSingle: () => ({ data: null, error: { message: 'Not configured' } }), single: () => ({ data: null, error: { message: 'Not configured' } }) }),
      eq: () => ({ data: null, error: { message: 'Not configured' }, select: () => ({ data: null, error: { message: 'Not configured' } }), maybeSingle: () => ({ data: null, error: { message: 'Not configured' } }), single: () => ({ data: null, error: { message: 'Not configured' } }) }),
      insert: () => ({ data: null, error: { message: 'Not configured' }, select: () => ({ data: null, error: { message: 'Not configured' } }), single: () => ({ data: null, error: { message: 'Not configured' } }) }),
      update: () => ({ data: null, error: { message: 'Not configured' }, eq: () => ({ data: null, error: { message: 'Not configured' } }), select: () => ({ data: null, error: { message: 'Not configured' } }), single: () => ({ data: null, error: { message: 'Not configured' } }) }),
      delete: () => ({ data: null, error: { message: 'Not configured' } }),
      order: () => ({ data: null, error: { message: 'Not configured' } }),
      limit: () => ({ data: null, error: { message: 'Not configured' } })
    })
  };
}

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
} else {
  supabaseAdmin = supabase;
}

export { supabase, supabaseAdmin };
