import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const staffRoles = ['super_admin', 'lgu_admin', 'barangay_admin', 'official', 'responder', 'auditor'];

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, barangay_id, role, is_active')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (!profile?.is_active || !profile.barangay_id || !staffRoles.includes(profile.role)) {
      return NextResponse.json({ error: 'You are not authorized to view responders.' }, { status: 403 });
    }

    const { data: responders, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, responder_availability, is_active')
      .eq('barangay_id', profile.barangay_id)
      .eq('role', 'responder')
      .eq('is_active', true)
      .order('full_name', { ascending: true });

    if (error) {
      console.error('responder lookup failed', error);
      return NextResponse.json({ error: 'Unable to load responders.' }, { status: 500 });
    }

    return NextResponse.json({ responders: responders ?? [] });
  } catch (error) {
    console.error('responder service failed', error);
    return NextResponse.json({ error: 'Responder service is temporarily unavailable.' }, { status: 503 });
  }
}
