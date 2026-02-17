"use client";

import { Story } from '@/data/daily-dashboard-schema';

interface StoryCardProps {
  story: Story;
  isMore: boolean;
  showExpanded?: boolean;
}

const categoryIcons: Record<Story['category'], string> = {
  event: '🎭',
  alert: '⚠️',
  merch: '🛍️',
  food: '🍽️',
  entertainment: '🎬',
  general: '📢',
};

const categoryColors: Record<Story['category'], string> = {
  event: 'bg-info/10 text-info',
  alert: 'bg-danger/10 text-danger',
  merch: 'bg-accent/10 text-accent',
  food: 'bg-warning/10 text-warning',
  entertainment: 'bg-accent2/10 text-accent2',
  general: 'bg-success/10 text-success',
};

export default function StoryCard({ story, isMore, showExpanded = false }: StoryCardProps) {
  const icon = categoryIcons[story.category];
  const categoryColor = categoryColors[story.category];

  // Determine which text to show
  const summaryText = isMore ? (story.expanded || story.summary) : story.summary;

  return (
    <article className="card-landio-mini">
      {/* Header with icon and category */}
      <div className="flex items-start gap-3 mb-3">
        {/* Category icon */}
        <span className={`text-xl flex-shrink-0`} aria-hidden="true">
          {icon}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Headline */}
          <h3 className="text-base font-semibold text-text mb-2 leading-snug">
            {story.headline}
          </h3>

          {/* Category badge */}
          {story.category && (
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${categoryColor}`}
            >
              {story.category}
            </span>
          )}
        </div>

        {/* Timestamp if present */}
        {story.timestamp && (
          <time className="text-xs text-text-muted flex-shrink-0" dateTime={story.timestamp}>
            {story.timestamp}
          </time>
        )}
      </div>

      {/* Summary/Expanded content */}
      <p className="text-sm text-text-muted leading-relaxed">
        {summaryText}
      </p>

      {/* Urgent indicator */}
      {story.priority === 'urgent' && (
        <div className="mt-3 flex items-center gap-2 text-danger text-xs font-medium">
          <span aria-hidden="true">🔴</span>
          <span>Urgent</span>
        </div>
      )}

      {/* Park indicator if present */}
      {story.park && (
        <div className="mt-2 text-xs text-text-muted">
          {story.park}
        </div>
      )}
    </article>
  );
}
