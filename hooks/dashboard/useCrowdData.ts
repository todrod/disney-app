import { useState, useEffect, useCallback, useRef } from 'react';
import { ParkSnapshot } from '@/data/daily-dashboard-schema';

interface UseCrowdDataResult {
  data: ParkSnapshot[] | null;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Cache duration: 5 minutes (in milliseconds)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * useCrowdData Hook
 * Fetches crowd data from /api/dashboard/crowds
 * Implements client-side caching with 5-minute expiration
 * Includes error handling and automatic refetching
 */
export function useCrowdData(): UseCrowdDataResult {
  const [data, setData] = useState<ParkSnapshot[] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache state
  const cacheRef = useRef<{
    data: ParkSnapshot[] | null;
    lastUpdated: string | null;
    timestamp: number;
  }>({
    data: null,
    lastUpdated: null,
    timestamp: 0,
  });

  const fetchData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    const { data: cachedData, lastUpdated: cachedLastUpdated, timestamp } = cacheRef.current;

    // Check if we have valid cached data (unless force refresh)
    if (!forceRefresh && cachedData && (now - timestamp) < CACHE_DURATION) {
      setData(cachedData);
      setLastUpdated(cachedLastUpdated);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dashboard/crowds', {
        cache: 'no-store', // Disable browser caching to control it ourselves
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Update cache
      cacheRef.current = {
        data: result.parks,
        lastUpdated: result.lastUpdated,
        timestamp: now,
      };

      setData(result.parks);
      setLastUpdated(result.lastUpdated);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch crowd data';
      console.error('Crowd data fetch error:', errorMessage);
      setError(errorMessage);

      // If we have cached data, fall back to it even if expired
      if (cachedData) {
        setData(cachedData);
        setLastUpdated(cachedLastUpdated);
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
    lastUpdated,
    isLoading,
    error,
    refetch: () => fetchData(true),
  };
}
