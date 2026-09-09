import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { validateCreateIncidentInput } from '@/lib/incidents/validation';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  const validation = validateCreateIncidentInput(body);
  if (!validation.ok) {
    return NextResponse.json({ error: 'Validation failed.', details: validation.errors }, { status: 422 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, barangay_id, is_active')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('incident profile lookup failed', profileError);
      return NextResponse.json({ error: 'Unable to verify reporter profile.' }, { status: 500 });
    }

    if (!profile?.is_active || !profile.barangay_id) {
      return NextResponse.json({ error: 'An active barangay profile is required to submit an incident.' }, { status: 403 });
    }

    const { data: referenceData, error: referenceError } = await supabase.rpc('next_incident_reference');
    if (referenceError || typeof referenceData !== 'string') {
      console.error('incident reference generation failed', referenceError);
      return NextResponse.json({ error: 'Unable to generate incident reference.' }, { status: 500 });
    }

    const { data: incident, error: insertError } = await supabase
      .from('incidents')
      .insert({
        reference_number: referenceData,
        barangay_id: profile.barangay_id,
        reporter_id: authData.user.id,
        category: validation.data.category ?? 'other',
        description: validation.data.description,
        latitude: validation.data.location?.latitude ?? null,
        longitude: validation.data.location?.longitude ?? null,
        location_text: validation.data.location?.address ?? null,
        landmark: validation.data.location?.landmark ?? null,
        status: 'submitted',
      })
      .select('id, reference_number, status, created_at')
      .single();

    if (insertError) {
      console.error('incident insert failed', insertError);
      return NextResponse.json({ error: 'Unable to create incident.' }, { status: 500 });
    }

    return NextResponse.json({ incident }, { status: 201 });
  } catch (error) {
    console.error('incident creation failed', error);
    return NextResponse.json({ error: 'Incident service is temporarily unavailable.' }, { status: 503 });
  }
}
