import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';
import { sendTelegramNotification } from '@/lib/goofy-beacon/telegram';

function extractInviteCode(text: string): string | null {
  const trimmed = text.trim();
  const match = trimmed.match(/^\/link(?:@\w+)?\s+([A-Za-z0-9-]+)$/i);
  return match?.[1]?.toUpperCase() ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const update = (await request.json()) as {
      message?: { text?: string; chat?: { id?: number | string } };
    };

    const text = update.message?.text ?? '';
    const chatId = update.message?.chat?.id;
    if (!chatId) {
      return NextResponse.json({ ok: true });
    }

    const inviteCode = extractInviteCode(text);
    if (!inviteCode) {
      await sendTelegramNotification(String(chatId), 'Use: /link INVITECODE');
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabaseAdmin();
    const { data: invite } = await supabase
      .from('group_invites')
      .select('group_id,expires_at')
      .eq('invite_code', inviteCode)
      .maybeSingle();

    if (!invite || new Date(invite.expires_at).getTime() < Date.now()) {
      await sendTelegramNotification(String(chatId), 'Invite code is invalid or expired.');
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabase.from('telegram_group_links').upsert({
      group_id: invite.group_id,
      telegram_chat_id: String(chatId),
    });

    if (error) {
      await sendTelegramNotification(String(chatId), 'Could not link this chat to the group.');
      return NextResponse.json({ ok: true });
    }

    await sendTelegramNotification(String(chatId), `Linked successfully. Goofy Beacon updates for code ${inviteCode} are enabled.`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
