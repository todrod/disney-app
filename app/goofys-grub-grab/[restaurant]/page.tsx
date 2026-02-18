'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import restaurantsData from '@/data/wdw-restaurants.json';
import { MealPreference, Restaurant, TimePreference } from '@/types/grub-grab';

const restaurants = restaurantsData as Restaurant[];

function todayPlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function RestaurantAlertPage() {
  const params = useParams<{ restaurant: string }>();
  const slug = params.restaurant;
  const restaurant = useMemo(() => restaurants.find((entry) => entry.slug === slug), [slug]);

  const [startDate, setStartDate] = useState(todayPlus(1));
  const [endDate, setEndDate] = useState(todayPlus(5));
  const [partySize, setPartySize] = useState(4);
  const [mealPreference, setMealPreference] = useState<MealPreference>('any');
  const [timePreference, setTimePreference] = useState<TimePreference>('any');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!restaurant) {
    return (
      <section className="card-landio">
        <p className="text-xl font-semibold">Restaurant not found</p>
        <Link href="/goofys-grub-grab" className="btn-ghost mt-3 inline-flex px-4 py-2 rounded-lg">← Back to Goofy's Grub Grab</Link>
      </section>
    );
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/grub-grab/alerts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantSlug: restaurant.slug,
          telegramChatId,
          startDate,
          endDate,
          partySize,
          mealPreference,
          timePreference,
        }),
      });

      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setMessage(data.error ?? 'Unable to create alert.');
        return;
      }

      window.localStorage.setItem('goofy_trooper_chat_id', telegramChatId);
      setMessage('✅ Alert created. Monitoring has started.');
    } catch {
      setMessage('Unable to create alert right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/goofys-grub-grab" className="btn-ghost inline-flex px-4 py-2 rounded-lg">← Back to Goofy's Grub Grab</Link>

      <section className="card-landio card-landio-featured">
        <p className="text-3xl font-bold font-display mb-2">🍽️ {restaurant.name}</p>
        <p className="text-text-muted">{restaurant.cuisine} | {restaurant.priceRange} | {restaurant.location}</p>
        <p className="mt-3 text-sm text-text-muted">Disney booking page:</p>
        <a href={restaurant.disneyUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
          {restaurant.disneyUrl}
        </a>
      </section>

      <section className="card-landio">
        <p className="landio-kicker pill-accent2 inline-flex mb-3">🎯 CREATE RESERVATION ALERT</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-text-muted mb-1">Start date</span>
              <input type="date" min={todayPlus(0)} max={todayPlus(60)} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]" required />
            </label>
            <label className="text-sm">
              <span className="block text-text-muted mb-1">End date</span>
              <input type="date" min={startDate} max={todayPlus(60)} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]" required />
            </label>
          </div>

          <label className="text-sm block">
            <span className="block text-text-muted mb-1">Party Size</span>
            <select value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </label>

          <label className="text-sm block">
            <span className="block text-text-muted mb-1">Meal Preference</span>
            <select value={mealPreference} onChange={(e) => setMealPreference(e.target.value as MealPreference)} className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]">
              <option value="any">Any available (recommended)</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </label>

          <label className="text-sm block">
            <span className="block text-text-muted mb-1">Time Preference</span>
            <select value={timePreference} onChange={(e) => setTimePreference(e.target.value as TimePreference)} className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]">
              <option value="any">Any time (recommended)</option>
              <option value="morning">Morning (before 12:00 PM)</option>
              <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
              <option value="evening">Evening (after 5:00 PM)</option>
            </select>
          </label>

          <label className="text-sm block">
            <span className="block text-text-muted mb-1">Telegram Chat ID</span>
            <input value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} placeholder="Enter Telegram Chat ID" className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]" required />
          </label>

          <button type="submit" disabled={submitting} className="btn-primary inline-flex items-center gap-2 px-4 py-3 rounded-lg min-h-[44px]">
            🔔 {submitting ? 'Starting...' : 'START MONITORING'}
          </button>

          {message && <p className="text-sm text-text-muted">{message}</p>}
          <p className="text-xs text-text-faint">ℹ️ Max 3 active alerts per Telegram Chat ID.</p>
        </form>
      </section>
    </div>
  );
}
