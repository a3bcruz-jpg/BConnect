import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get('unread') === 'true';
    const limitParam = Number(url.searchParams.get('limit') ?? '50');
    const limit = Number.isInteger(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50;

    let query = supabase
      .from('notifications')
      .select('id, user_id, type, priority, title, message, incident_id, read_at, created_at')
      .eq('user_id', authData.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) query = query.is('read_at', null);

    const { data: notifications, error } = await query;
    if (error) {
      console.error('notification list query failed', error);
      return NextResponse.json({ error: 'Unable to load notifications.' }, { status: 500 });
    }

    return NextResponse.json({ notifications: notifications ?? [] });
  } catch (error) {
    console.error('notification list failed', error);
    return NextResponse.json({ error: 'Notification service is temporarily unavailable.' }, { status: 503 });
  }
}
