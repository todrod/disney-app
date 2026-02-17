"use client";

import type { HotTile as HotTileType } from '@/data/daily-dashboard-schema';

interface HotTileProps {
  tile: HotTileType;
}

const tileColors: Record<HotTileType['type'], string> = {
  'events-alerts': 'bg-info/10 text-info',
  'limited-merch': 'bg-accent/10 text-accent',
  'crowds': 'bg-warning/10 text-warning',
};

const tileBgColors: Record<HotTileType['type'], string> = {
  'events-alerts': 'border-info/30',
  'limited-merch': 'border-accent/30',
  'crowds': 'border-warning/30',
};

export default function HotTile({ tile }: HotTileProps) {
  const colorClass = tileColors[tile.type];
  const borderClass = tileBgColors[tile.type];

  return (
    <article className={`card-landio-mini flex flex-col items-center justify-center p-5 text-center border-2 ${borderClass}`}>
      {/* Icon */}
      <div className="text-4xl mb-3" aria-hidden="true">
        {tile.icon}
      </div>

      {/* Headline */}
      <h3 className="text-sm font-semibold text-text mb-2">
        {tile.headline}
      </h3>

      {/* Count or value if present */}
      {tile.count !== undefined && (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${colorClass}`}>
          {tile.count} items
        </span>
      )}

      {tile.value && (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${colorClass}`}>
          {tile.value}
        </span>
      )}
    </article>
  );
}
