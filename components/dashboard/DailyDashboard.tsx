"use client";

import { useState, useEffect } from 'react';
import { useNewsletterData } from '@/hooks/dashboard/useNewsletterData';
import { useCrowdData } from '@/hooks/dashboard/useCrowdData';
import { newsletterToUI } from '@/lib/dashboard/newsletterToUI';
import { crowdsToUI } from '@/lib/dashboard/crowdsToUI';
import { CrowdLevel } from '@/data/daily-dashboard-schema';
import QuickMoreToggle from './QuickMoreToggle';
import StoryCard from './StoryCard';
import HotTile from './HotTile';
import ParkCard from './ParkCard';
import ResortBlurb from './ResortBlurb';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

/**
 * DailyDashboard Component
 * Renders the Disney Daily Dashboard with live data
 * Features:
 * - Client-side data fetching with 5-minute caching
 * - Skeleton loading states
 * - Error handling with fallback
 * - Update-safe rendering (only changed sections update)
 * - Smooth crowd meter animations
 * - Preserves Quick/More toggle state across updates
 */

export default function DailyDashboard() {
  const [isMore, setIsMore] = useState(false);
  
  // Fetch data using custom hooks
  const { data: newsletterData, isLoading: newsletterLoading, error: newsletterError } = useNewsletterData();
  const { data: crowdData, isLoading: crowdLoading, error: crowdError } = useCrowdData();
  
  // Track previous crowd levels for animations
  const [prevCrowdLevels, setPrevCrowdLevels] = useState<Record<string, CrowdLevel>>({});
  
  // Transform data to UI format
  const uiData = newsletterData ? newsletterToUI(newsletterData) : null;
  const uiCrowdData = crowdData && newsletterData ? crowdsToUI(crowdData, newsletterData.lastUpdated) : null;
  
  // Update previous crowd levels when new data arrives (for animations)
  useEffect(() => {
    if (uiCrowdData) {
      setPrevCrowdLevels(currentLevels => {
        const newLevels: Record<string, CrowdLevel> = {};
        uiCrowdData.parks.forEach(park => {
          newLevels[park.id] = park.crowdLevel;
        });
        return newLevels;
      });
    }
  }, [uiCrowdData]);
  
  // Loading state
  if (newsletterLoading || crowdLoading) {
    return <LoadingState />;
  }
  
  // Error state (but show partial data if available)
  if (newsletterError && crowdError && !newsletterData && !crowdData) {
    return <ErrorState message="Unable to load dashboard data. Please check your connection and try again." />;
  }
  
  // Empty state
  if (!uiData || !uiCrowdData) {
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
          {uiData.topStories[0]?.timestamp || uiData.hotTiles[0]?.value || uiCrowdData.lastUpdated} • Updated {uiCrowdData.lastUpdated}
        </p>
      </header>

      {/* Quick/More Magic Toggle */}
      <div className="flex justify-center">
        <QuickMoreToggle onToggle={setIsMore} isMore={isMore} />
      </div>

      {/* Error banner if partial data */}
      {(newsletterError || crowdError) && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-warning">
            ⚠️ Some data may be outdated. Pull to refresh or tap to retry.
          </p>
        </div>
      )}

      {/* Must-See Today (only when urgent items exist) */}
      {uiData.showMustSeeToday && uiData.mustSeeToday && (
        <section aria-labelledby="must-see-heading">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl" aria-hidden="true">
              🔴
            </span>
            <h2 id="must-see-heading" className="text-lg font-semibold text-text">
              Must-See Today
            </h2>
          </div>
          <StoryCard story={uiData.mustSeeToday} isMore={isMore} showExpanded={true} />
        </section>
      )}

      {/* What's Hot Today (3 tiles) */}
      <section aria-labelledby="hot-today-heading">
        <h2 id="hot-today-heading" className="text-lg font-semibold text-text mb-3">
          What's Hot Today
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {uiData.hotTiles.map((tile) => (
            <HotTile key={tile.id} tile={tile} />
          ))}
        </div>
      </section>

      {/* Top Stories (only shown when stories exist) */}
      {uiData.showTopStories && uiData.topStories.length > 0 && (
        <section aria-labelledby="stories-heading">
          <h2 id="stories-heading" className="text-lg font-semibold text-text mb-3">
            Top Stories
          </h2>
          <div className="flex flex-col gap-3">
            {uiData.topStories.map((story) => (
              <StoryCard key={story.id} story={story} isMore={isMore} />
            ))}
          </div>
        </section>
      )}

      {/* Park Snapshot Row (horizontal scroll) */}
      <section aria-labelledby="parks-heading">
        <h2 id="parks-heading" className="text-lg font-semibold text-text mb-3">
          Park Snapshots
        </h2>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {uiCrowdData.parks.map((park) => (
            <div key={park.id} className="snap-start" style={{ animationDelay: `${park.animationDelay}ms` }}>
              <ParkCard 
                park={park} 
                prevCrowdLevel={prevCrowdLevels[park.id]}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Resort Spotlight (only shown when blurbs exist) */}
      {uiData.showResortSpotlight && uiData.resortSpotlight.length > 0 && (
        <section aria-labelledby="resort-heading">
          <h2 id="resort-heading" className="text-lg font-semibold text-text mb-3">
            Resort Spotlight
          </h2>
          <div className="flex flex-col gap-3">
            {uiData.resortSpotlight.map((blurb) => (
              <ResortBlurb key={blurb.id} blurb={blurb} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
