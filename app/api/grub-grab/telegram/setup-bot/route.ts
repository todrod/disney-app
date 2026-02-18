import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { message?: { chat?: { id?: number }; text?: string } };
  const chatId = body.message?.chat?.id;
  const text = body.message?.text ?? '';

  if (!chatId) {
    return NextResponse.json({ ok: true });
  }

  // Minimal webhook handler for Telegram setup pings.
  if (text.startsWith('/start')) {
    return NextResponse.json({
      ok: true,
      reply: `🍴 Welcome to Goofy's Grub Grab! Your chat id is ${chatId}`,
      chatId: String(chatId),
    });
  }

  return NextResponse.json({ ok: true, chatId: String(chatId) });
}
