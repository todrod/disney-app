"use client";

import DailyDashboard from '@/components/dashboard/DailyDashboard';

/**
 * Daily Dashboard Page
 * Renders the Disney Daily Dashboard with live data fetching
 * 
 * The DailyDashboard component now handles all data fetching internally
 * using custom hooks with 5-minute client-side caching.
 */

export default function DailyDashboardPage() {
  return (
    <main className="min-h-screen lg:pl-64 bg-bg text-text">
      <DailyDashboard />
    </main>
  );
}
