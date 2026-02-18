import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';
import { GroupStateMember } from '@/types/goofy-beacon';

export async function GET(
  request: NextRequest,
  context: { params: { groupId: string } }
) {
  try {
    const user = await requireAuthenticatedUser(request);
    const groupId = context.params.groupId;
    const supabase = getSupabaseAdmin();

    const { data: membership } = await supabase
      .from('group_members')
      .select('group_id,user_id,display_name,opted_in')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ ok: false, error: 'Not a member of this group' }, { status: 403 });
    }

    const { data: group } = await supabase
      .from('groups')
      .select('id,name,invite_code,owner_user_id,expires_at,created_at')
      .eq('id', groupId)
      .maybeSingle();

    if (!group) {
      return NextResponse.json({ ok: false, error: 'Group not found' }, { status: 404 });
    }

    const { data: members } = await supabase
      .from('group_members')
      .select('group_id,user_id,display_name,opted_in,joined_at')
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });

    const { data: pings } = await supabase
      .from('member_last_ping')
      .select('group_id,user_id,lat,lng,accuracy_m,zone_label,pinged_at')
      .eq('group_id', groupId);

    const pingByUser = new Map((pings ?? []).map((ping) => [ping.user_id, ping]));

    const resultMembers: GroupStateMember[] = (members ?? []).map((member) => {
      const ping = pingByUser.get(member.user_id);
      return {
        user_id: member.user_id,
        display_name: member.display_name,
        opted_in: member.opted_in,
        ping: ping
          ? {
              lat: ping.lat,
              lng: ping.lng,
              accuracy_m: ping.accuracy_m,
              zone_label: ping.zone_label,
              pinged_at: ping.pinged_at,
            }
          : undefined,
      };
    });

    const { data: telegramLink } = await supabase
      .from('telegram_group_links')
      .select('telegram_chat_id,linked_at')
      .eq('group_id', groupId)
      .maybeSingle();

    return NextResponse.json({
      ok: true,
      group,
      membership,
      members: resultMembers,
      telegramLinked: Boolean(telegramLink?.telegram_chat_id),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || 'Unauthorized' }, { status: 401 });
  }
}
