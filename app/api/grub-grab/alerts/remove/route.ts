import { NextRequest, NextResponse } from 'next/server';
import { removeAlert } from '@/lib/grub-grab/alert-manager';

interface RemoveAlertBody {
  alertId?: string;
  telegramChatId?: string;
}

export async function DELETE(request: NextRequest) {
  const body = (await request.json()) as RemoveAlertBody;
  const alertId = body.alertId?.trim() ?? '';
  const telegramChatId = body.telegramChatId?.trim() ?? '';

  if (!alertId || !telegramChatId) {
    return NextResponse.json({ ok: false, error: 'alertId and telegramChatId are required' }, { status: 400 });
  }

  const removed = removeAlert(alertId, telegramChatId);
  if (!removed) {
    return NextResponse.json({ ok: false, error: 'Alert not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
