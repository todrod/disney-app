import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';
import { clampExpiryHours } from '@/lib/goofy-beacon/utils';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = (await request.json()) as { groupId?: string; extendHours?: number };
    const groupId = (body.groupId ?? '').trim();
    const extendHours = clampExpiryHours(body.extendHours ?? 24);

    if (!groupId) {
      return NextResponse.json({ ok: false, error: 'groupId is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: group } = await supabase
      .from('groups')
      .select('id,owner_user_id,expires_at')
      .eq('id', groupId)
      .maybeSingle();

    if (!group) {
      return NextResponse.json({ ok: false, error: 'Group not found' }, { status: 404 });
    }

    if (group.owner_user_id !== user.id) {
      return NextResponse.json({ ok: false, error: 'Only the owner can extend this group' }, { status: 403 });
    }

    const currentExpiry = new Date(group.expires_at).getTime();
    const nextExpiry = new Date(Math.max(currentExpiry, Date.now()) + extendHours * 60 * 60 * 1000).toISOString();

    const { error: groupError } = await supabase
      .from('groups')
      .update({ expires_at: nextExpiry })
      .eq('id', groupId);
    if (groupError) {
      return NextResponse.json({ ok: false, error: 'Could not extend group' }, { status: 500 });
    }

    const { error: inviteError } = await supabase
      .from('group_invites')
      .update({ expires_at: nextExpiry })
      .eq('group_id', groupId);

    if (inviteError) {
      return NextResponse.json({ ok: false, error: 'Could not extend invite expiry' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, expiresAt: nextExpiry });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || 'Unauthorized' }, { status: 401 });
  }
}
