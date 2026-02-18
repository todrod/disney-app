import { AvailableSlot, DiningAlert } from '@/types/grub-grab';

const TELEGRAM_API = 'https://api.telegram.org';

function getBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN ?? null;
}

export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  const token = getBotToken();
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN is not configured; skipping Telegram send.');
    return false;
  }

  const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  return response.ok;
}

export function buildAvailabilityMessage(alert: DiningAlert, slots: AvailableSlot[]): string {
  const topSlots = slots.slice(0, 5);
  const lines = topSlots.map((slot) => `• ${slot.date} at ${slot.time}`);

  return [
    `🍴 Goofy's Grub Grab Alert!`,
    `${alert.restaurant.name} has availability!`,
    `Party of ${alert.partySize} | ${alert.mealPreference} | ${alert.timePreference}`,
    '',
    ...lines,
    '',
    `Book now: ${alert.restaurant.disneyUrl}`,
  ].join('\n');
}
