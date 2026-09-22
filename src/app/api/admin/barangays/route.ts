import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const ADMIN_ROLES = ['super_admin', 'lgu_admin', 'barangay_admin', 'auditor'] as const;

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: actor } = await supabase
    .from('profiles')
    .select('role, barangay_id')
    .eq('id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (!actor || !ADMIN_ROLES.includes(actor.role as typeof ADMIN_ROLES[number])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let query = supabase
    .from('barangays')
    .select('id, name, municipality, province, region, latitude, longitude, created_at, updated_at')
    .order('name', { ascending: true });

  if (actor.role === 'barangay_admin') {
    query = query.eq('id', actor.barangay_id);
  }

  const { data: barangays, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = (barangays ?? []).map((b) => b.id);
  if (!ids.length) return NextResponse.json({ barangays: [] });

  const [{ data: profiles }, { data: incidents }] = await Promise.all([
    supabase.from('profiles').select('barangay_id, role').in('barangay_id', ids).eq('is_active', true),
    supabase.from('incidents').select('barangay_id, status').in('barangay_id', ids).not('status', 'in', '(closed,rejected,cancelled,duplicate)'),
  ]);

  const enriched = (barangays ?? []).map((barangay) => ({
    ...barangay,
    residents: (profiles ?? []).filter((p) => p.barangay_id === barangay.id && p.role === 'resident').length,
    officials: (profiles ?? []).filter((p) => p.barangay_id === barangay.id && p.role === 'official').length,
    responders: (profiles ?? []).filter((p) => p.barangay_id === barangay.id && p.role === 'responder').length,
    incidents: (incidents ?? []).filter((i) => i.barangay_id === barangay.id).length,
  }));

  return NextResponse.json({ barangays: enriched });
}
