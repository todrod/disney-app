"use client";

import { useEffect, useState } from 'react';
import DailyDashboard from '@/components/dashboard/DailyDashboard';
import { sampleDailyDashboardData } from '@/data/daily-dashboard-sample-data';

export default function DailyDashboardPage() {
  const [data, setData] = useState<typeof sampleDailyDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setData(sampleDailyDashboardData);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen lg:pl-64 bg-bg text-text">
      <DailyDashboard data={data} isLoading={isLoading} />
    </main>
  );
}
