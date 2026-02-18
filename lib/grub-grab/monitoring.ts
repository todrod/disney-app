import { checkRestaurantAvailability } from '@/lib/grub-grab/disney-scraper';
import { buildAvailabilityMessage, sendTelegramMessage } from '@/lib/grub-grab/telegram-service';
import { listAllActiveAlerts, markAlertChecked } from '@/lib/grub-grab/alert-manager';

export async function runAvailabilityCheck(): Promise<{
  checked: number;
  found: number;
  notified: number;
}> {
  const alerts = listAllActiveAlerts();
  let found = 0;
  let notified = 0;

  for (const alert of alerts) {
    const slots = await checkRestaurantAvailability(alert);
    markAlertChecked(alert.id, slots.length);

    if (slots.length > 0) {
      found += 1;
      const message = buildAvailabilityMessage(alert, slots);
      const sent = await sendTelegramMessage(alert.telegramChatId, message);
      if (sent) {
        notified += 1;
      }
    }
  }

  return {
    checked: alerts.length,
    found,
    notified,
  };
}
