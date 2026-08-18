import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Use Admin Client

export async function POST(req) {
  try {
    const { agency_name, owner_email, temp_password, subscription_end_date, company_name_ar, vat_no, cr_no, phone, address_ar } = await req.json();

    // 1. Create Auth User using Admin Client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: owner_email,
      password: temp_password,
      email_confirm: true
    });

    if (authError) throw new Error(authError.message);

    // 2. Create Tenant Record
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert([{ agency_name, owner_email, subscription_end_date, is_paid: true }])
      .select()
      .single();

    if (tenantError) throw new Error(tenantError.message);

    // 3. Create App User Profile linked to Tenant
    const { error: profileError } = await supabaseAdmin
      .from('app_users')
      .insert([{
        id: authData.user.id,
        email: owner_email,
        username: agency_name,
        role: 'Admin',
        is_admin: true,
        tenant_id: tenant.id,
        can_access_invoices: true, can_access_bank: true, can_access_hr: true,
        can_access_reports: true, can_access_settings: true
      }]);

    if (profileError) throw new Error(profileError.message);

    // 4. Create Default Settings
    await supabaseAdmin
      .from('settings')
      .insert([{ 
        tenant_id: tenant.id, 
        company_name_en: agency_name, 
        company_name_ar: company_name_ar || agency_name,
        vat_no, cr_no, phone, address_ar
      }]);

    return NextResponse.json({ success: true, tenant_id: tenant.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
