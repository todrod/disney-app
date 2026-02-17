import { useState, useEffect, useCallback, useRef } from 'react';
import { DailyDashboardData } from '@/data/daily-dashboard-schema';

interface UseNewsletterDataResult {
  data: DailyDashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Cache duration: 5 minutes (in milliseconds)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * useNewsletterData Hook
 * Fetches newsletter data from /api/dashboard/newsletter
 * Implements client-side caching with 5-minute expiration
 * Includes error handling and automatic refetching
 */
export function useNewsletterData(): UseNewsletterDataResult {
  const [data, setData] = useState<DailyDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache state
  const cacheRef = useRef<{
    data: DailyDashboardData | null;
    timestamp: number;
  }>({
    data: null,
    timestamp: 0,
  });

  const fetchData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    const { data: cachedData, timestamp } = cacheRef.current;

    // Check if we have valid cached data (unless force refresh)
    if (!forceRefresh && cachedData && (now - timestamp) < CACHE_DURATION) {
      setData(cachedData);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dashboard/newsletter', {
        cache: 'no-store', // Disable browser caching to control it ourselves
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DailyDashboardData = await response.json();

      // Update cache
      cacheRef.current = {
        data: result,
        timestamp: now,
      };

      setData(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch newsletter data';
      console.error('Newsletter data fetch error:', errorMessage);
      setError(errorMessage);

      // If we have cached data, fall back to it even if expired
      if (cachedData) {
        setData(cachedData);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optional: Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true); // Force refresh
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchData(true),
  };
}
