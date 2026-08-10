import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Supabase Admin Client (Service Role Key se)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Auth me User Create karo with Password
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.owner_email,
      password: body.temp_password,
      email_confirm: true, // Jaise hi login kare
    });

    if (authError) throw new Error(authError.message);
    const userId = authData.user.id;

    // 2. Tenant (Agency) Create karo
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

    // 3. app_users me entry karo aur Tenant ID link karo
    const { error: appUserError } = await supabaseAdmin
      .from('app_users')
      .insert([{
        id: userId, // Auth wala ID yahan link hoga
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

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
