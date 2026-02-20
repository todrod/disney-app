'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/goofy-beacon/supabase-browser';
import QuickNavigation from '@/components/QuickNavigation';

interface CrawlListItem {
  id: string;
  title: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  totalStops: number;
  visitedStops: number;
}

export default function DashboardPage() {
  const [crawls, setCrawls] = useState<CrawlListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const totalCompleted = useMemo(
    () => crawls.filter((crawl) => crawl.totalStops > 0 && crawl.totalStops === crawl.visitedStops).length,
    [crawls]
  );

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError('Sign in at Find Your Group first to load your saved crawls.');
        setCrawls([]);
        return;
      }

      const response = await fetch('/api/grog-trot/crawls/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? 'Could not load saved crawls');
        return;
      }

      setCrawls(payload.crawls ?? []);
    } catch (err) {
      setError((err as Error).message || 'Could not load saved crawls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => null);
  }, []);

  return (
    <main className="min-h-screen lg:pl-64 bg-bg text-text">
      <QuickNavigation />
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10 space-y-6">
        <section className="card-landio card-landio-featured text-center">
          <p className="text-3xl md:text-4xl font-bold font-display mb-2">📋 Crawl Dashboard</p>
          <p className="text-text-muted">Saved Goofy's Grog Trot routes and progress</p>
        </section>

        <section className="card-landio">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="font-semibold">Your stats</p>
              <p className="text-sm text-text-muted">{crawls.length} saved • {totalCompleted} fully completed</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost px-3 py-2 rounded-lg" onClick={() => load()}>Refresh</button>
              <Link href="/goofys-grog-trot" className="btn-primary px-3 py-2 rounded-lg">Build New Crawl</Link>
            </div>
          </div>

          {loading && <p className="text-text-muted">Loading saved crawls…</p>}
          {!loading && error && <p className="text-danger">{error}</p>}

          {!loading && !error && crawls.length === 0 && (
            <p className="text-text-muted">No saved crawls yet. Create one in Goofy's Grog Trot.</p>
          )}

          <div className="space-y-3">
            {crawls.map((crawl) => {
              const progress = crawl.totalStops > 0 ? Math.round((crawl.visitedStops / crawl.totalStops) * 100) : 0;
              return (
                <article key={crawl.id} className="rounded-xl border border-border bg-surface2 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{crawl.title}</p>
                      <p className="text-sm text-text-muted">
                        {crawl.isPublic ? 'Public' : 'Private'} • {crawl.visitedStops}/{crawl.totalStops} stops complete • {progress}%
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/goofys-grog-trot/${crawl.id}`} className="btn-ghost px-3 py-2 rounded-lg">Open</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
