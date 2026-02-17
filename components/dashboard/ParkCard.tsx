"use client";

import { ParkSnapshot } from '@/data/daily-dashboard-schema';
import CrowdMeter from './CrowdMeter';

interface ParkCardProps {
  park: ParkSnapshot;
}

const parkColors: Record<ParkSnapshot['color'], string> = {
  blue: 'bg-magic-kingdom/10 text-magic-kingdom',
  purple: 'bg-epcot-primary/10 text-epcot-primary',
  red: 'bg-hollywood-primary/10 text-hollywood-primary',
  green: 'bg-animal-primary/10 text-animal-primary',
};

const parkBorderColors: Record<ParkSnapshot['color'], string> = {
  blue: 'border-magic-kingdom/30',
  purple: 'border-epcot-primary/30',
  red: 'border-hollywood-primary/30',
  green: 'border-animal-primary/30',
};

const statusLabels: Record<ParkSnapshot['status'], string> = {
  open: 'Open',
  closed: 'Closed',
  maintenance: 'Maintenance',
};

export default function ParkCard({ park }: ParkCardProps) {
  const headerColor = parkColors[park.color];
  const borderColor = parkBorderColors[park.color];
  const statusColor = park.status === 'open' ? 'text-success' : 'text-danger';

  return (
    <article
      className={`card-landio flex flex-col min-w-[280px] max-w-[320px] p-4 border-2 ${borderColor}`}
      role="region"
      aria-label={`${park.name} - ${statusLabels[park.status]}`}
    >
      {/* Park name with color coding */}
      <div className={`px-3 py-2 rounded-lg mb-4 ${headerColor}`}>
        <h3 className="text-base font-bold font-display">
          {park.name}
        </h3>
      </div>

      {/* Status indicator */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium ${statusColor}`}>
          {statusLabels[park.status]}
        </span>
        {park.status !== 'open' && (
          <span className="text-xs text-text-muted" aria-hidden="true">
            🔒
          </span>
        )}
      </div>

      {/* Crowd meter */}
      <div className="mb-4">
        <CrowdMeter value={park.crowdValue} label={park.crowdLabel} />
      </div>

      {/* Headline */}
      <div className="flex-1 flex items-center">
        <p className="text-sm text-text-muted leading-snug">
          {park.headline}
        </p>
      </div>
    </article>
  );
}
