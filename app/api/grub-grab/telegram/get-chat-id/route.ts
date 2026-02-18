import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId')?.trim() ?? '';

  if (!chatId) {
    return NextResponse.json({ ok: false, error: 'Provide chatId query parameter' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, chatId });
}
