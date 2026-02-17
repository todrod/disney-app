"use client";

import LoadingStateBase from '@/components/LoadingState';

export default function DashboardLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <LoadingStateBase size="lg" />
      <p className="mt-4 text-sm text-text-muted">
        Loading your Disney Daily Dashboard...
      </p>
    </div>
  );
}
