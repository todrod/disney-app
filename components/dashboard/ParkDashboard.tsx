'use client';

import Link from 'next/link';
import { useState } from 'react';
import Card from './Card';
import Tile from './Tile';
import Toggle from './Toggle';
import CrowdMeter from './CrowdMeter';
import HeadlinesList from './HeadlinesList';
import { useDashboardRenderModel } from '@/hooks/dashboard/useDashboardRenderModel';

const ICONS: Record<string, string> = {
  event_alert: '📣',
  limited_merch: '🛍️',
  crowds: '👥',
};

const parkFromSlug: Record<string, 'MK' | 'EPCOT' | 'DHS' | 'AK'> = {
  mk: 'MK',
  epcot: 'EPCOT',
  dhs: 'DHS',
  ak: 'AK',
  'magic-kingdom': 'MK',
  'hollywood-studios': 'DHS',
  'animal-kingdom': 'AK',
};

export default function ParkDashboard({ slug }: { slug: string }) {
  const [expanded, setExpanded] = useState(false);
  const { model, isLoading, error } = useDashboardRenderModel();
  const parkCode = parkFromSlug[slug] || 'MK';

  if (isLoading && !model) return <main className="min-h-screen lg:pl-64 bg-bg text-text p-6">Loading...</main>;
  if (!model) return <main className="min-h-screen lg:pl-64 bg-bg text-text p-6">Failed to load park dashboard.</main>;

  const park = model.parks[parkCode];

  return (
    <main className="min-h-screen lg:pl-64 bg-bg text-text">
      <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-text-muted"><Link href="/daily-dashboard" className="hover:underline">Home</Link> &gt; Parks &gt; {parkCode}</p>
            <h1 className="text-display-xl font-bold font-display">{parkCode} Today</h1>
          </div>
          <Toggle expanded={expanded} onChange={setExpanded} />
        </div>

        {error ? <p className="text-sm text-warning">{error}</p> : null}

        <Card title="Park Pulse" icon="🎯" kicker="LIVE">
          <CrowdMeter score={park.crowd.score} label={park.crowd.label} updatedAt={park.crowd.generatedAt} note={park.crowd.note} />
          <p className="text-sm text-text-muted mt-3">{park.todayVibe}</p>
        </Card>

        {park.mustSee.length > 0 && (
          <Card title="Must-See Today" icon="🔴">
            <HeadlinesList items={park.mustSee} expanded={expanded} />
          </Card>
        )}

        {park.hot.length > 0 && (
          <Card title="What's Hot in This Park" icon="🔥">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {park.hot.slice(0, 3).map((tile) => (
                <Tile key={tile.id} title={tile.category.replace('_', ' ')} text={expanded ? tile.long : tile.short} icon={ICONS[tile.category] || 'ℹ️'} />
              ))}
            </div>
          </Card>
        )}

        {park.headlines.length > 0 && (
          <Card title="Park Headlines" icon="📰">
            <HeadlinesList items={park.headlines.slice(0, 6)} expanded={expanded} />
          </Card>
        )}

        {park.resortTieIns.length > 0 && (
          <Card title="Resort Tie-ins" icon="🏨">
            <HeadlinesList items={park.resortTieIns.slice(0, 3)} expanded={expanded} />
          </Card>
        )}
      </div>
    </main>
  );
}
