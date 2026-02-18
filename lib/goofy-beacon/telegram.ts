const TELEGRAM_API_BASE = 'https://api.telegram.org';

export async function sendTelegramNotification(chatId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) {
    return;
  }

  await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });
}

export function formatPingNotification(input: {
  displayName: string;
  zoneLabel: string;
  pingedAtIso: string;
  accuracyM: number | null;
  groupId: string;
  appBaseUrl?: string;
}): string {
  const ts = new Date(input.pingedAtIso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const accuracyText = input.accuracyM == null ? 'n/a' : `${input.accuracyM}`;
  const base = input.appBaseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.thegoofytrooper.com';

  return `${input.displayName} pinged: ${input.zoneLabel} (${ts}, ±${accuracyText}m)\n${base}/group/${input.groupId}`;
}
