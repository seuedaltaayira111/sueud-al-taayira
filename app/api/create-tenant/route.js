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

    // NOTE: Yahan settings pehle se create nahi karenge. 
    // Agency login karega toh use /setup page milega wahan wo apna data save karega.

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
