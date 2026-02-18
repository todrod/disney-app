import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';
import { clampExpiryHours, generateInviteCode } from '@/lib/goofy-beacon/utils';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = (await request.json()) as { name?: string; displayName?: string; expiresInHours?: number };

    const name = (body.name ?? '').trim();
    const displayName = (body.displayName ?? 'Teammate').trim();
    if (!name) {
      return NextResponse.json({ ok: false, error: 'Group name is required' }, { status: 400 });
    }

    const expiresInHours = clampExpiryHours(body.expiresInHours);
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();

    const supabase = getSupabaseAdmin();

    let inviteCode = '';
    for (let i = 0; i < 6; i += 1) {
      const candidate = generateInviteCode(8);
      const { data: exists } = await supabase
        .from('group_invites')
        .select('invite_code')
        .eq('invite_code', candidate)
        .maybeSingle();
      if (!exists) {
        inviteCode = candidate;
        break;
      }
    }

    if (!inviteCode) {
      return NextResponse.json({ ok: false, error: 'Could not generate invite code' }, { status: 500 });
    }

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        owner_user_id: user.id,
        name,
        invite_code: inviteCode,
        expires_at: expiresAt,
      })
      .select('*')
      .single();

    if (groupError || !group) {
      return NextResponse.json({ ok: false, error: 'Failed to create group' }, { status: 500 });
    }

    const { error: inviteError } = await supabase.from('group_invites').upsert({
      invite_code: inviteCode,
      group_id: group.id,
      created_by: user.id,
      expires_at: expiresAt,
    });
    if (inviteError) {
      return NextResponse.json({ ok: false, error: 'Failed to create invite' }, { status: 500 });
    }

    const { error: memberError } = await supabase.from('group_members').upsert({
      group_id: group.id,
      user_id: user.id,
      display_name: displayName || 'Teammate',
      opted_in: false,
    });

    if (memberError) {
      return NextResponse.json({ ok: false, error: 'Failed to add owner as member' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, group, inviteCode });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || 'Unauthorized' }, { status: 401 });
  }
}
