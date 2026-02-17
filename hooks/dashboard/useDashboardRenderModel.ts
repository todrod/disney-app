'use client';

import { useCallback, useEffect, useState } from 'react';
import { buildDashboardRenderModel } from '@/lib/dashboard/buildDashboardRenderModel';
import type { DashboardRenderModel, NewsletterRaw, CrowdsRaw } from '@/lib/dashboard/types';

const CACHE_TTL_MS = 5 * 60 * 1000;
const RAW_CACHE_KEY = 'dashboard_raw_cache_v1';
const RENDER_MODEL_KEY = 'dashboard_render_model_v1';

interface RawCachePayload {
  timestamp: number;
  newsletter: NewsletterRaw;
  crowds: CrowdsRaw;
}

interface UseDashboardRenderModelResult {
  model: DashboardRenderModel | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures
  }
}

async function fetchLatest(): Promise<{ newsletter: NewsletterRaw; crowds: CrowdsRaw }> {
  const [newsletterResp, crowdsResp] = await Promise.all([
    fetch('/api/newsletter/latest', { cache: 'no-store' }),
    fetch('/api/crowds/latest', { cache: 'no-store' }),
  ]);

  if (!newsletterResp.ok) {
    throw new Error(`Newsletter fetch failed: ${newsletterResp.status}`);
  }
  if (!crowdsResp.ok) {
    throw new Error(`Crowds fetch failed: ${crowdsResp.status}`);
  }

  const [newsletter, crowds] = await Promise.all([
    newsletterResp.json() as Promise<NewsletterRaw>,
    crowdsResp.json() as Promise<CrowdsRaw>,
  ]);

  return { newsletter, crowds };
}

export function useDashboardRenderModel(): UseDashboardRenderModelResult {
  const [model, setModel] = useState<DashboardRenderModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);

    const now = Date.now();
    const cachedRaw = readJson<RawCachePayload>(RAW_CACHE_KEY);
    const previousModel = readJson<DashboardRenderModel>(RENDER_MODEL_KEY);

    try {
      let source: { newsletter: NewsletterRaw; crowds: CrowdsRaw };
      if (!force && cachedRaw && now - cachedRaw.timestamp < CACHE_TTL_MS) {
        source = {
          newsletter: cachedRaw.newsletter,
          crowds: cachedRaw.crowds,
        };
      } else {
        source = await fetchLatest();
        writeJson(RAW_CACHE_KEY, {
          timestamp: now,
          newsletter: source.newsletter,
          crowds: source.crowds,
        } satisfies RawCachePayload);
      }

      const renderModel = buildDashboardRenderModel(
        source.newsletter,
        source.crowds,
        previousModel
      ) as DashboardRenderModel;
      setModel(renderModel);
      writeJson(RENDER_MODEL_KEY, renderModel);
      setError(null);
    } catch (err) {
      const fallback = previousModel;
      if (fallback) {
        setModel(fallback);
      }
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(() => {
      load(true);
    }, CACHE_TTL_MS);
    return () => window.clearInterval(interval);
  }, [load]);

  return {
    model,
    isLoading,
    error,
    refetch: () => load(true),
  };
}
