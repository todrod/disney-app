import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = (await request.json()) as { groupId?: string; optIn?: boolean };

    const groupId = (body.groupId ?? '').trim();
    const optIn = Boolean(body.optIn);

    if (!groupId) {
      return NextResponse.json({ ok: false, error: 'groupId is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('group_members')
      .update({ opted_in: optIn })
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ ok: false, error: 'Could not update sharing preference' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, optedIn: optIn });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || 'Unauthorized' }, { status: 401 });
  }
}
