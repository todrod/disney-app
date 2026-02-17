"use client";

import EmptyStateBase from '@/components/EmptyState';

export default function DashboardEmptyState() {
  return (
    <EmptyStateBase
      icon={
        <span className="text-6xl" aria-hidden="true">
          🏰
        </span>
      }
      title="No Disney News Today"
      description="Check back later for the latest updates from Walt Disney World."
    />
  );
}
