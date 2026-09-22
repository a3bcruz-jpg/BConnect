import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PATCH() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', authData.user.id)
      .is('read_at', null)
      .select('id');

    if (error) {
      console.error('mark all notifications read failed', error);
      return NextResponse.json({ error: 'Unable to update notifications.' }, { status: 500 });
    }

    return NextResponse.json({ updated: data?.length ?? 0 });
  } catch (error) {
    console.error('mark all notifications read failed', error);
    return NextResponse.json({ error: 'Notification service is temporarily unavailable.' }, { status: 503 });
  }
}
