import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const allowed = ['available', 'busy', 'offline'] as const;
type Availability = (typeof allowed)[number];

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, is_active, responder_availability')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (error) {
      console.error('responder availability lookup failed', error);
      return NextResponse.json({ error: 'Unable to load responder availability.' }, { status: 500 });
    }
    if (profile?.role !== 'responder' || !profile.is_active) {
      return NextResponse.json({ error: 'Active responder profile required.' }, { status: 403 });
    }

    return NextResponse.json({ availability: profile.responder_availability ?? 'available' });
  } catch (error) {
    console.error('responder availability service failed', error);
    return NextResponse.json({ error: 'Responder availability service is temporarily unavailable.' }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 }); }

  const availability = typeof body === 'object' && body !== null && 'availability' in body
    ? (body as { availability?: unknown }).availability
    : undefined;

  if (!allowed.includes(availability as Availability)) {
    return NextResponse.json({ error: 'Availability must be available, busy, or offline.' }, { status: 422 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { data, error } = await supabase.rpc('set_responder_availability', { p_availability: availability });
    if (error) {
      console.error('responder availability update failed', error);
      return NextResponse.json({ error: error.message || 'Unable to update responder availability.' }, { status: 500 });
    }

    return NextResponse.json({ availability: data });
  } catch (error) {
    console.error('responder availability update service failed', error);
    return NextResponse.json({ error: 'Responder availability service is temporarily unavailable.' }, { status: 503 });
  }
}
