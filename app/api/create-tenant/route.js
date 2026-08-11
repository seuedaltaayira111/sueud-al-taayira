import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  try {
    const body = await req.json();
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.owner_email,
      password: body.temp_password,
      email_confirm: true,
    });

    if (authError) throw new Error(authError.message);
    const userId = authData.user.id;

    // 2. Create Tenant
    const { data: tenantData, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert([{ 
        agency_name: body.agency_name, 
        owner_email: body.owner_email, 
        is_paid: true, 
        subscription_end_date: body.subscription_end_date 
      }])
      .select().single();

    if (tenantError) throw new Error(tenantError.message);

    // 3. Create App User Link
    const { error: appUserError } = await supabaseAdmin
      .from('app_users')
      .insert([{
        id: userId,
        email: body.owner_email,
        username: body.agency_name,
        tenant_id: tenantData.id,
        role: 'AgencyAdmin',
        is_admin: true,
        can_access_invoices: true,
        can_access_bank: true,
        can_access_hr: true,
        can_access_reports: true,
        can_access_settings: true
      }]);

    if (appUserError) throw new Error(appUserError.message);

    // 4. Create Settings for this Agency (FIX FOR TENANT ID MISSING & PRE-FILL)
    const { error: settingsError } = await supabaseAdmin
      .from('settings')
      .insert([{ 
        tenant_id: tenantData.id,
        company_name_en: body.agency_name,
        company_name_ar: body.company_name_ar || body.agency_name,
        vat_no: body.vat_no || '',
        cr_no: body.cr_no || '',
        phone: body.phone || '',
        address_ar: body.address_ar || '',
        invoice_footer: 'Thank you for choosing us!'
      }]);

    if (settingsError) throw new Error(settingsError.message);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
