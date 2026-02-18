import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('group_members')
      .select('group_id, display_name, opted_in, groups!inner(id,name,expires_at,invite_code,owner_user_id)')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: 'Could not load groups' }, { status: 500 });
    }

    const groups = (data ?? []).map((entry: any) => ({
      groupId: entry.group_id,
      displayName: entry.display_name,
      optedIn: entry.opted_in,
      group: entry.groups,
    }));

    return NextResponse.json({ ok: true, groups });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || 'Unauthorized' }, { status: 401 });
  }
}
