import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const ADMIN_ROLES = ['super_admin', 'lgu_admin', 'barangay_admin', 'auditor'] as const;

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: actor, error: actorError } = await supabase
    .from('profiles')
    .select('role, barangay_id')
    .eq('id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (actorError || !actor || !ADMIN_ROLES.includes(actor.role as typeof ADMIN_ROLES[number])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, barangay_id, is_active, created_at, barangays(name, municipality)')
    .order('created_at', { ascending: false });

  if (actor.role === 'barangay_admin') {
    query = query.eq('barangay_id', actor.barangay_id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data ?? [] });
}
