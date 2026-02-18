import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';
import { labelZone } from '@/lib/goofy-beacon/geo';
import { formatPingNotification, sendTelegramNotification } from '@/lib/goofy-beacon/telegram';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = (await request.json()) as {
      groupId?: string;
      lat?: number;
      lng?: number;
      accuracyM?: number;
    };

    const groupId = (body.groupId ?? '').trim();
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    const accuracyM = Number.isFinite(Number(body.accuracyM)) ? Math.max(0, Math.round(Number(body.accuracyM))) : null;

    if (!groupId || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ ok: false, error: 'groupId, lat, and lng are required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: membership } = await supabase
      .from('group_members')
      .select('display_name,opted_in')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ ok: false, error: 'You are not a member of this group' }, { status: 403 });
    }

    if (!membership.opted_in) {
      return NextResponse.json({ ok: false, error: 'You must opt in before sharing your location' }, { status: 400 });
    }

    const zoneLabel = labelZone(lat, lng);
    const pingedAt = new Date().toISOString();

    const { error: upsertError } = await supabase.from('member_last_ping').upsert({
      group_id: groupId,
      user_id: user.id,
      lat,
      lng,
      accuracy_m: accuracyM,
      zone_label: zoneLabel,
      pinged_at: pingedAt,
    });

    if (upsertError) {
      return NextResponse.json({ ok: false, error: 'Failed to save ping' }, { status: 500 });
    }

    const { data: link } = await supabase
      .from('telegram_group_links')
      .select('telegram_chat_id')
      .eq('group_id', groupId)
      .maybeSingle();

    if (link?.telegram_chat_id) {
      const text = formatPingNotification({
        displayName: membership.display_name,
        zoneLabel,
        pingedAtIso: pingedAt,
        accuracyM,
        groupId,
      });
      await sendTelegramNotification(link.telegram_chat_id, text);
    }

    return NextResponse.json({ ok: true, zoneLabel, pingedAt });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || 'Unauthorized' }, { status: 401 });
  }
}
