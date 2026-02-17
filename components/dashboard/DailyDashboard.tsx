"use client";

import { useState } from 'react';
import { DailyDashboardData } from '@/data/daily-dashboard-schema';
import QuickMoreToggle from './QuickMoreToggle';
import StoryCard from './StoryCard';
import HotTile from './HotTile';
import ParkCard from './ParkCard';
import ResortBlurb from './ResortBlurb';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

interface DailyDashboardProps {
  data: DailyDashboardData | null;
  isLoading?: boolean;
}

export default function DailyDashboard({ data, isLoading = false }: DailyDashboardProps) {
  const [isMore, setIsMore] = useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!data) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-text mb-2">
          Walt Disney World Today
        </h1>
        <p className="text-sm text-text-muted">
          {data.date} • Updated {data.lastUpdated}
        </p>
      </header>

      {/* Quick/More Magic Toggle */}
      <div className="flex justify-center">
        <QuickMoreToggle onToggle={setIsMore} isMore={isMore} />
      </div>

      {/* Must-See Today (only when urgent items exist) */}
      {data.mustSeeToday && (
        <section aria-labelledby="must-see-heading">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl" aria-hidden="true">
              🔴
            </span>
            <h2 id="must-see-heading" className="text-lg font-semibold text-text">
              Must-See Today
            </h2>
          </div>
          <StoryCard story={data.mustSeeToday} isMore={isMore} showExpanded={true} />
        </section>
      )}

      {/* What's Hot Today (3 tiles) */}
      <section aria-labelledby="hot-today-heading">
        <h2 id="hot-today-heading" className="text-lg font-semibold text-text mb-3">
          What's Hot Today
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.hotTiles.slice(0, 3).map((tile) => (
            <HotTile key={tile.id} tile={tile} />
          ))}
        </div>
      </section>

      {/* Top Stories (max 5) */}
      <section aria-labelledby="stories-heading">
        <h2 id="stories-heading" className="text-lg font-semibold text-text mb-3">
          Top Stories
        </h2>
        <div className="flex flex-col gap-3">
          {data.topStories.slice(0, 5).map((story) => (
            <StoryCard key={story.id} story={story} isMore={isMore} />
          ))}
        </div>
      </section>

      {/* Park Snapshot Row (horizontal scroll) */}
      <section aria-labelledby="parks-heading">
        <h2 id="parks-heading" className="text-lg font-semibold text-text mb-3">
          Park Snapshots
        </h2>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {data.parks.map((park) => (
            <div key={park.id} className="snap-start">
              <ParkCard park={park} />
            </div>
          ))}
        </div>
      </section>

      {/* Resort Spotlight (1-2 blurbs) */}
      {data.resortSpotlight.length > 0 && (
        <section aria-labelledby="resort-heading">
          <h2 id="resort-heading" className="text-lg font-semibold text-text mb-3">
            Resort Spotlight
          </h2>
          <div className="flex flex-col gap-3">
            {data.resortSpotlight.slice(0, 2).map((blurb) => (
              <ResortBlurb key={blurb.id} blurb={blurb} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
