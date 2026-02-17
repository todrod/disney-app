"use client";

import type { ResortBlurb as ResortBlurbType } from '@/data/daily-dashboard-schema';

interface ResortBlurbProps {
  blurb: ResortBlurbType;
}

export default function ResortBlurb({ blurb }: ResortBlurbProps) {
  return (
    <article className="card-landio-mini p-4">
      {/* Headline */}
      <h3 className="text-base font-semibold text-text mb-2">
        {blurb.headline}
      </h3>

      {/* Summary */}
      <p className="text-sm text-text-muted leading-relaxed">
        {blurb.summary}
      </p>
    </article>
  );
}
