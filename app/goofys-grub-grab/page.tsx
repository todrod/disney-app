'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import restaurantsData from '@/data/wdw-restaurants.json';
import { DiningAlert, Restaurant } from '@/types/grub-grab';
import { getLocationCounts } from '@/lib/grub-grab/restaurants';

const restaurants = restaurantsData as Restaurant[];
const locationCards = getLocationCounts();

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

function formatTimeAgo(date?: string): string {
  if (!date) return 'just now';
  const ms = Date.now() - Date.parse(date);
  const minutes = Math.max(1, Math.floor(ms / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function GoofysGrubGrabPage() {
  const [search, setSearch] = useState('');
  const [chatId, setChatId] = useState('');
  const [alerts, setAlerts] = useState<DiningAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return restaurants.slice(0, 12);
    return restaurants
      .filter((r) => r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q))
      .slice(0, 12);
  }, [search]);

  const popular = useMemo(() => restaurants.filter((r) => r.popular).slice(0, 8), []);

  const loadAlerts = async (targetChatId: string) => {
    if (!targetChatId) {
      setAlerts([]);
      return;
    }
    setLoadingAlerts(true);
    try {
      const response = await fetch(`/api/grub-grab/alerts/list?chatId=${encodeURIComponent(targetChatId)}`);
      const data = (await response.json()) as { alerts?: DiningAlert[] };
      setAlerts(data.alerts ?? []);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const removeAlert = async (alertId: string) => {
    if (!chatId) return;
    await fetch('/api/grub-grab/alerts/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId, telegramChatId: chatId }),
    });
    await loadAlerts(chatId);
  };

  useEffect(() => {
    const stored = window.localStorage.getItem('goofy_trooper_chat_id') ?? '';
    if (stored) {
      setChatId(stored);
      loadAlerts(stored).catch(() => null);
    }
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="card-landio card-landio-featured text-center">
        <p className="text-3xl md:text-4xl font-bold font-display mb-2">🍴 Goofy's Grub Grab</p>
        <p className="text-lg text-text">Never miss a magical meal!</p>
        <p className="text-text-muted mt-2">Instant Telegram alerts for Disney dining reservations.</p>
      </section>

      <section className="card-landio">
        <p className="landio-kicker pill-accent2 inline-flex mb-3">🔍 FIND YOUR RESTAURANT</p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by restaurant name, park, or cuisine"
          className="w-full rounded-xl bg-surface2 border border-border p-3 text-base min-h-[44px]"
        />
        {search && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((restaurant) => (
              <Link key={restaurant.id} href={`/goofys-grub-grab/${restaurant.slug}`} className="card-landio p-4 hover-lift">
                <p className="font-semibold">{restaurant.name}</p>
                <p className="text-sm text-text-muted">{restaurant.location} • {restaurant.cuisine}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locationCards.map((card) => (
          <button
            type="button"
            key={card.location}
            onClick={() => setSearch(card.location)}
            className="card-landio p-5 text-left hover-lift"
          >
            <p className="text-2xl mb-1">{card.emoji}</p>
            <p className="font-semibold">{card.location}</p>
            <p className="text-sm text-text-muted">({card.count} spots)</p>
          </button>
        ))}
      </section>

      <section className="card-landio">
        <p className="landio-kicker pill-warning inline-flex mb-3">🔥 HARDEST TO BOOK</p>
        <div className="flex flex-wrap gap-2">
          {popular.map((restaurant) => (
            <Link key={restaurant.id} href={`/goofys-grub-grab/${restaurant.slug}`} className="btn-ghost text-sm px-3 py-2 rounded-full">
              {restaurant.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="card-landio">
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="landio-kicker pill-success inline-flex">🔔 YOUR ACTIVE ALERTS ({alerts.length}/3)</p>
          <button
            type="button"
            onClick={() => chatId && loadAlerts(chatId)}
            className="btn-ghost px-3 py-2 text-sm rounded-lg"
          >
            Refresh
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm text-text-muted block mb-1">Telegram Chat ID</label>
          <input
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            onBlur={() => {
              if (chatId) {
                window.localStorage.setItem('goofy_trooper_chat_id', chatId);
                loadAlerts(chatId).catch(() => null);
              }
            }}
            placeholder="e.g. 123456789"
            className="w-full rounded-xl bg-surface2 border border-border p-3 text-base min-h-[44px]"
          />
        </div>

        {loadingAlerts && <p className="text-text-muted">Loading alerts...</p>}
        {!loadingAlerts && alerts.length === 0 && (
          <p className="text-text-muted">No alerts yet. Pick a restaurant below and create your first alert.</p>
        )}

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="rounded-xl border border-border bg-surface2 p-4">
              <p className="font-semibold">🚀 {alert.restaurant.name} - {alert.restaurant.location}</p>
              <p className="text-sm text-text-muted">
                {formatDate(alert.dateRange.start)} to {formatDate(alert.dateRange.end)} | Party of {alert.partySize} | {alert.mealPreference}
              </p>
              <p className="text-sm text-success mt-1">🟢 Monitoring... Last checked: {formatTimeAgo(alert.lastChecked)}</p>
              <button onClick={() => removeAlert(alert.id)} className="mt-2 text-sm text-danger">❌ Remove Alert</button>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Link href={filtered[0] ? `/goofys-grub-grab/${filtered[0].slug}` : '/goofys-grub-grab/space-220'} className="btn-primary inline-flex px-4 py-2 rounded-lg">
            ➕ Create New Alert
          </Link>
        </div>
      </section>

      <section className="card-landio">
        <p className="landio-kicker pill-info inline-flex mb-3">📱 TELEGRAM SETUP</p>
        <ol className="space-y-2 text-text-muted text-sm">
          <li>1. Open Telegram and chat with your bot (example: @GoofyTrooperBot)</li>
          <li>2. Send <code>/start</code> to activate</li>
          <li>3. Paste your Chat ID in the field above</li>
          <li>4. Create alerts and stay ready for dining drops</li>
        </ol>
        <a
          href="https://t.me/GoofyTrooperBot"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex px-4 py-2 rounded-lg mt-4"
        >
          🔗 Open Telegram Bot
        </a>
      </section>

      {!search && (
        <section className="card-landio">
          <p className="font-semibold mb-3">Suggested restaurants</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((restaurant) => (
              <Link key={restaurant.id} href={`/goofys-grub-grab/${restaurant.slug}`} className="rounded-xl border border-border p-3 hover:bg-surface2">
                <p>{restaurant.name}</p>
                <p className="text-xs text-text-muted">{restaurant.location} • {restaurant.priceRange}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
