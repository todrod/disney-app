import { NextRequest, NextResponse } from 'next/server';
import { listAlertsByUser } from '@/lib/grub-grab/alert-manager';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId')?.trim();

  if (!chatId) {
    return NextResponse.json({ ok: true, alerts: [] });
  }

  const alerts = listAlertsByUser(chatId);
  return NextResponse.json({ ok: true, alerts });
}
