import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { agency_name, owner_email, temp_password, subscription_end_date, company_name_ar, vat_no, cr_no, phone, address_ar } = await req.json();

    // 1. Create Auth User in Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: owner_email,
      password: temp_password,
      email_confirm: true
    });

    if (authError) throw new Error(authError.message);

    // 2. Create Tenant Record
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert([{ agency_name, owner_email, subscription_end_date, is_paid: true }])
      .select()
      .single();

    if (tenantError) throw new Error(tenantError.message);

    // 3. Create App User Profile linked to Tenant
    const { error: profileError } = await supabase
      .from('app_users')
      .insert([{
        id: authData.user.id,
        email: owner_email,
        username: agency_name,
        role: 'Admin',
        is_admin: true,
        tenant_id: tenant.id,
        can_access_invoices: true,
        can_access_bank: true,
        can_access_hr: true,
        can_access_reports: true,
        can_access_settings: true
      }]);

    if (profileError) throw new Error(profileError.message);

    // 4. Create Default Settings for the new Agency
    await supabase
      .from('settings')
      .insert([{ 
        tenant_id: tenant.id, 
        company_name_en: agency_name, 
        company_name_ar: company_name_ar || agency_name,
        vat_no: vat_no,
        cr_no: cr_no,
        phone: phone,
        address_ar: address_ar
      }]);

    return NextResponse.json({ success: true, tenant_id: tenant.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
