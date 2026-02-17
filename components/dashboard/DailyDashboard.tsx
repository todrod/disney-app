'use client';

import Link from 'next/link';
import { useState } from 'react';
import Card from './Card';
import Tile from './Tile';
import Toggle from './Toggle';
import ParkCard from './ParkCard';
import HeadlinesList from './HeadlinesList';
import { useDashboardRenderModel } from '@/hooks/dashboard/useDashboardRenderModel';

const ICONS: Record<string, string> = {
  event_alert: '📣',
  limited_merch: '🛍️',
  crowds: '👥',
};

export default function DailyDashboard() {
  const [expanded, setExpanded] = useState(false);
  const { model, isLoading, error, refetch } = useDashboardRenderModel();

  if (isLoading && !model) {
    return <main className="min-h-screen lg:pl-64 bg-bg text-text p-6">Loading dashboard...</main>;
  }

  if (!model) {
    return (
      <main className="min-h-screen lg:pl-64 bg-bg text-text p-6">
        <p className="mb-3">Unable to load dashboard.</p>
        <button type="button" onClick={refetch} className="px-4 py-2 rounded-lg bg-surface2 min-h-[44px]">Retry</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen lg:pl-64 bg-bg text-text">
      <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-display-2xl font-bold font-display">Walt Disney World Today</h1>
            <p className="text-sm text-text-muted">Updated {new Date(model.generatedAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-ghost min-h-[44px] px-4 py-2 rounded-lg">
              ← Home
            </Link>
            <Toggle expanded={expanded} onChange={setExpanded} />
          </div>
        </header>

        {error ? (
          <div className="card-landio-mini p-4 border border-warning/30">
            <p className="text-warning text-sm">{error}</p>
          </div>
        ) : null}

        {model.home.mustSee.length > 0 && (
          <Card title="Must-See Today" icon="🔴" kicker="PRIORITY">
            <HeadlinesList items={model.home.mustSee.slice(0, 1)} expanded={expanded} />
          </Card>
        )}

        <Card title="What's Hot Today" icon="🔥">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {model.home.hotTiles.slice(0, 3).map((tile) => (
              <Tile
                key={tile.id}
                title={tile.title}
                text={expanded ? tile.long : tile.short}
                icon={ICONS[tile.category] || 'ℹ️'}
              />
            ))}
          </div>
        </Card>

        {model.home.topStories.length > 0 && (
          <Card title="Top Stories" icon="📰">
            <HeadlinesList items={model.home.topStories.slice(0, 5)} expanded={expanded} />
          </Card>
        )}

        <Card title="Park Snapshot" icon="🏰">
          <div className="flex overflow-x-auto gap-4 pb-2">
            {model.home.parkSnapshots.map((park) => (
              <ParkCard key={park.park} park={park} />
            ))}
          </div>
        </Card>

        {model.home.resortSpotlight.length > 0 && (
          <Card title="Resort Spotlight" icon="🏨">
            <HeadlinesList items={model.home.resortSpotlight.slice(0, 2)} expanded={expanded} />
          </Card>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/daily-dashboard/mk" className="btn-ghost min-h-[44px] px-4 py-2 rounded-lg">MK</Link>
          <Link href="/daily-dashboard/epcot" className="btn-ghost min-h-[44px] px-4 py-2 rounded-lg">EPCOT</Link>
          <Link href="/daily-dashboard/dhs" className="btn-ghost min-h-[44px] px-4 py-2 rounded-lg">DHS</Link>
          <Link href="/daily-dashboard/ak" className="btn-ghost min-h-[44px] px-4 py-2 rounded-lg">AK</Link>
        </div>
      </div>
    </main>
  );
}
