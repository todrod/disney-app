import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = (await request.json()) as { inviteCode?: string; displayName?: string };

    const inviteCode = (body.inviteCode ?? '').trim().toUpperCase();
    const displayName = (body.displayName ?? 'Teammate').trim();

    if (!inviteCode) {
      return NextResponse.json({ ok: false, error: 'Invite code is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: invite } = await supabase
      .from('group_invites')
      .select('invite_code,group_id,expires_at')
      .eq('invite_code', inviteCode)
      .maybeSingle();

    if (!invite || new Date(invite.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ ok: false, error: 'Invite code is invalid or expired' }, { status: 400 });
    }

    const { data: group } = await supabase
      .from('groups')
      .select('id,name,expires_at')
      .eq('id', invite.group_id)
      .maybeSingle();

    if (!group || new Date(group.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ ok: false, error: 'Group has expired' }, { status: 400 });
    }

    const { error: memberError } = await supabase.from('group_members').upsert({
      group_id: invite.group_id,
      user_id: user.id,
      display_name: displayName || 'Teammate',
    });

    if (memberError) {
      return NextResponse.json({ ok: false, error: 'Could not join group' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, groupId: invite.group_id });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || 'Unauthorized' }, { status: 401 });
  }
}
