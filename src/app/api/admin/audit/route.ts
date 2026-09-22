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
    .from('audit_logs')
    .select('id, action, resource_type, resource_id, metadata, created_at, actor:profiles!audit_logs_actor_id_fkey(id, full_name, role)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (actor.role === 'barangay_admin') {
    const { data: scopedProfiles } = await supabase.from('profiles').select('id').eq('barangay_id', actor.barangay_id);
    query = query.in('actor_id', (scopedProfiles ?? []).map((p) => p.id));
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ events: data ?? [] });
}
