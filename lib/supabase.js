import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ═══════════════════════════════════════════════════════════════════
// Every form in this app leaves optional date fields (iqama_expiry,
// join_date, credit_due_date, invoice_date, etc.) as an empty string
// when left blank. Postgres date/numeric/uuid columns reject '' with
// "invalid input syntax for type date/numeric/uuid" — which is exactly
// the class of error blocking Employees, HR, and other forms from
// saving at all. Rather than patch ~40 individual insert/update call
// sites one at a time, every insert/update going through this client
// is sanitized here once: empty strings become null, which every
// column type accepts as "no value".
// ═══════════════════════════════════════════════════════════════════
const sanitizeValue = (v) => (v === '' ? null : v);
const sanitizeRecord = (rec) => {
  if (Array.isArray(rec)) return rec.map(sanitizeRecord);
  if (rec && typeof rec === 'object' && !(rec instanceof Date)) {
    const out = {};
    for (const k in rec) out[k] = sanitizeValue(rec[k]);
    return out;
  }
  return rec;
};

const wrapClientWithSanitizer = (client) => {
  if (!client || typeof client.from !== 'function') return client;
  const originalFrom = client.from.bind(client);
  client.from = (table) => {
    const builder = originalFrom(table);
    if (typeof builder.insert === 'function') {
      const originalInsert = builder.insert.bind(builder);
      builder.insert = (payload, ...rest) => originalInsert(sanitizeRecord(payload), ...rest);
    }
    if (typeof builder.update === 'function') {
      const originalUpdate = builder.update.bind(builder);
      builder.update = (payload, ...rest) => originalUpdate(sanitizeRecord(payload), ...rest);
    }
    return builder;
  };
  return client;
};

let supabase;
let supabaseAdmin;

if (supabaseUrl && supabaseAnonKey) {
  supabase = wrapClientWithSanitizer(createClient(supabaseUrl, supabaseAnonKey));
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
  supabaseAdmin = wrapClientWithSanitizer(createClient(supabaseUrl, supabaseServiceKey));
} else {
  supabaseAdmin = supabase;
}

export { supabase, supabaseAdmin };
