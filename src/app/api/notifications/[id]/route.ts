import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: 'Notification id is required.' }, { status: 400 });

    let body: unknown = {};
    try {
      body = await request.json();
    } catch {
      // Empty body is valid and means mark as read.
    }

    const read = typeof body === 'object' && body !== null && 'read' in body
      ? (body as { read?: unknown }).read
      : true;

    if (read !== true) {
      return NextResponse.json({ error: 'Only marking a notification as read is supported.' }, { status: 422 });
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', authData.user.id)
      .select('id, read_at')
      .maybeSingle();

    if (error) {
      console.error('notification read update failed', error);
      return NextResponse.json({ error: 'Unable to update notification.' }, { status: 500 });
    }

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found.' }, { status: 404 });
    }

    return NextResponse.json({ notification });
  } catch (error) {
    console.error('notification update failed', error);
    return NextResponse.json({ error: 'Notification service is temporarily unavailable.' }, { status: 503 });
  }
}
