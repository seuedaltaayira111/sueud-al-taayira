import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { email, username, role, is_admin, can_access_invoices, can_access_bank, can_access_hr, can_access_reports, can_access_settings, employee_id, tenant_id, temp_password } = await req.json();

    // Use the password the caller generated (so the toast shown to the admin
    // matches the real password) — fall back to generating one if missing.
    const tempPass = temp_password || (Math.random().toString(36).slice(-8) + 'A1!');

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: tempPass,
      email_confirm: true
    });

    if (authError) throw new Error(authError.message);

    // 2. Create App User Profile
    const { error: profileError } = await supabaseAdmin
      .from('app_users')
      .insert([{
        id: authData.user.id,
        email: email,
        username: username,
        role: role,
        is_admin: is_admin,
        tenant_id: tenant_id,
        can_access_invoices: can_access_invoices,
        can_access_bank: can_access_bank,
        can_access_hr: can_access_hr,
        can_access_reports: can_access_reports,
        can_access_settings: can_access_settings,
        employee_id: employee_id || null
      }]);

    if (profileError) throw new Error(profileError.message);

    return NextResponse.json({ success: true, temp_password: tempPass });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
