import { AvailableSlot, DiningAlert } from '@/types/grub-grab';

interface SlotCandidate {
  time: string;
  hour24: number;
}

function matchesTimePreference(hour24: number, preference: DiningAlert['timePreference']): boolean {
  if (preference === 'any') return true;
  if (preference === 'morning') return hour24 < 12;
  if (preference === 'afternoon') return hour24 >= 12 && hour24 < 17;
  return hour24 >= 17;
}

function matchesMealPreference(hour24: number, preference: DiningAlert['mealPreference']): boolean {
  if (preference === 'any') return true;
  if (preference === 'breakfast') return hour24 < 11;
  if (preference === 'lunch') return hour24 >= 11 && hour24 < 17;
  return hour24 >= 17;
}

function buildDeterministicSlots(seed: string): SlotCandidate[] {
  const baseSlots: SlotCandidate[] = [
    { time: '8:15 AM', hour24: 8 },
    { time: '9:40 AM', hour24: 9 },
    { time: '11:30 AM', hour24: 11 },
    { time: '1:05 PM', hour24: 13 },
    { time: '2:45 PM', hour24: 14 },
    { time: '5:15 PM', hour24: 17 },
    { time: '6:40 PM', hour24: 18 },
    { time: '8:10 PM', hour24: 20 },
  ];

  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return baseSlots.filter((_, idx) => (idx + hash) % 3 === 0);
}

export async function checkRestaurantAvailability(alert: DiningAlert): Promise<AvailableSlot[]> {
  const start = new Date(alert.dateRange.start);
  const end = new Date(alert.dateRange.end);
  const slots: AvailableSlot[] = [];

  // Lightweight deterministic simulation for personal usage and dev reliability.
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().slice(0, 10);
    const daySeed = `${alert.restaurant.slug}-${date}-${alert.partySize}`;
    const candidates = buildDeterministicSlots(daySeed);

    for (const candidate of candidates) {
      if (!matchesMealPreference(candidate.hour24, alert.mealPreference)) continue;
      if (!matchesTimePreference(candidate.hour24, alert.timePreference)) continue;

      slots.push({
        date,
        time: candidate.time,
        bookingUrl: alert.restaurant.disneyUrl,
      });
    }
  }

  return slots;
}
