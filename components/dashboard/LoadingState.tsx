"use client";

/**
 * LoadingState Component for Dashboard
 * Displays skeleton loaders for better UX during data fetch
 * Shows the structure of the dashboard to prevent layout shifts
 */

export default function LoadingState() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto px-4 py-6">
      {/* Header Skeleton */}
      <header className="text-center mb-4">
        <div className="h-10 w-64 bg-surface3 rounded-lg mx-auto mb-2 animate-pulse" />
        <div className="h-4 w-48 bg-surface3 rounded mx-auto animate-pulse" />
      </header>

      {/* Toggle Skeleton */}
      <div className="flex justify-center">
        <div className="h-10 w-64 bg-surface3 rounded-full animate-pulse" />
      </div>

      {/* Must-See Today Skeleton */}
      <section className="animate-pulse">
        <div className="h-6 w-40 bg-surface3 rounded mb-3" />
        <div className="h-32 bg-surface3 rounded-lg" />
      </section>

      {/* Hot Tiles Skeleton */}
      <section className="animate-pulse">
        <div className="h-6 w-48 bg-surface3 rounded mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface3 rounded-lg" />
          ))}
        </div>
      </section>

      {/* Top Stories Skeleton */}
      <section className="animate-pulse">
        <div className="h-6 w-32 bg-surface3 rounded mb-3" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-surface3 rounded-lg mb-3" />
        ))}
      </section>

      {/* Park Snapshots Skeleton */}
      <section className="animate-pulse">
        <div className="h-6 w-36 bg-surface3 rounded mb-3" />
        <div className="flex overflow-x-auto gap-4 pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] max-w-[320px] h-40 bg-surface3 rounded-lg" />
          ))}
        </div>
      </section>

      {/* Resort Spotlight Skeleton */}
      <section className="animate-pulse">
        <div className="h-6 w-40 bg-surface3 rounded mb-3" />
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-surface3 rounded-lg mb-3" />
        ))}
      </section>
    </div>
  );
}
