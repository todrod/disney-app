import { DiningAlert, MealPreference, TimePreference } from '@/types/grub-grab';
import { getRestaurantBySlug } from '@/lib/grub-grab/restaurants';

interface CreateAlertInput {
  restaurantSlug: string;
  telegramChatId: string;
  startDate: string;
  endDate: string;
  partySize: number;
  mealPreference: MealPreference;
  timePreference: TimePreference;
}

type AlertStore = {
  alertsById: Map<string, DiningAlert>;
  alertsByUser: Map<string, Set<string>>;
};

const globalKey = '__goofy_grub_grab_alert_store__';

function getStore(): AlertStore {
  const scoped = globalThis as typeof globalThis & { [globalKey]?: AlertStore };
  if (!scoped[globalKey]) {
    scoped[globalKey] = {
      alertsById: new Map<string, DiningAlert>(),
      alertsByUser: new Map<string, Set<string>>(),
    };
  }
  return scoped[globalKey]!;
}

function isValidDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const max = new Date(now);
  max.setDate(max.getDate() + 60);

  return (
    !Number.isNaN(start.getTime()) &&
    !Number.isNaN(end.getTime()) &&
    start <= end &&
    start >= new Date(now.toISOString().slice(0, 10)) &&
    end <= max
  );
}

export function listAlertsByUser(telegramChatId: string): DiningAlert[] {
  const store = getStore();
  const ids = store.alertsByUser.get(telegramChatId);
  if (!ids) return [];

  return Array.from(ids)
    .map((id) => store.alertsById.get(id))
    .filter((alert): alert is DiningAlert => Boolean(alert))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function listAllActiveAlerts(): DiningAlert[] {
  const store = getStore();
  return Array.from(store.alertsById.values()).filter((alert) => alert.status === 'active');
}

export function createAlert(input: CreateAlertInput): DiningAlert {
  const telegramChatId = input.telegramChatId.trim();
  if (!telegramChatId) {
    throw new Error('Telegram Chat ID is required');
  }

  if (input.partySize < 2 || input.partySize > 10) {
    throw new Error('Party size must be between 2 and 10');
  }

  if (!isValidDateRange(input.startDate, input.endDate)) {
    throw new Error('Date range must be valid and within the next 60 days');
  }

  const restaurant = getRestaurantBySlug(input.restaurantSlug);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  const existingAlerts = listAlertsByUser(telegramChatId).filter((alert) => alert.status === 'active');
  if (existingAlerts.length >= 3) {
    throw new Error('Maximum of 3 active alerts per user');
  }

  const alert: DiningAlert = {
    id: crypto.randomUUID(),
    userId: telegramChatId,
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      disneyUrl: restaurant.disneyUrl,
      location: restaurant.location,
    },
    dateRange: {
      start: input.startDate,
      end: input.endDate,
    },
    partySize: input.partySize,
    mealPreference: input.mealPreference,
    timePreference: input.timePreference,
    telegramChatId,
    status: 'active',
    createdAt: new Date().toISOString(),
    triggeredDates: [],
    totalChecks: 0,
    successfulFinds: 0,
  };

  const store = getStore();
  store.alertsById.set(alert.id, alert);
  const userAlerts = store.alertsByUser.get(telegramChatId) ?? new Set<string>();
  userAlerts.add(alert.id);
  store.alertsByUser.set(telegramChatId, userAlerts);

  return alert;
}

export function removeAlert(alertId: string, telegramChatId: string): boolean {
  const store = getStore();
  const alert = store.alertsById.get(alertId);
  if (!alert) return false;
  if (alert.telegramChatId !== telegramChatId) return false;

  store.alertsById.delete(alertId);
  const userAlerts = store.alertsByUser.get(telegramChatId);
  if (userAlerts) {
    userAlerts.delete(alertId);
    if (userAlerts.size === 0) {
      store.alertsByUser.delete(telegramChatId);
    }
  }

  return true;
}

export function markAlertChecked(alertId: string, foundSlots: number): void {
  const store = getStore();
  const alert = store.alertsById.get(alertId);
  if (!alert) return;

  alert.lastChecked = new Date().toISOString();
  alert.totalChecks += 1;
  if (foundSlots > 0) {
    alert.successfulFinds += 1;
  }
  store.alertsById.set(alertId, alert);
}
