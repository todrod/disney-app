'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/goofy-beacon/supabase-browser';

interface CrawlStop {
  id: number;
  venueId: string;
  stopOrder: number;
  visited: boolean;
  visitedAt: string | null;
  note: string | null;
  venue: {
    id: string;
    name: string;
    area: string;
    locationDetail: string;
    signatureDrink: string;
  } | null;
}

interface CrawlPayload {
  id: string;
  userId: string;
  title: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  stops: CrawlStop[];
}

interface CrawlDetailClientProps {
  crawlId: string;
}

export default function CrawlDetailClient({ crawlId }: CrawlDetailClientProps) {
  const [crawl, setCrawl] = useState<CrawlPayload | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const progress = useMemo(() => {
    if (!crawl || crawl.stops.length === 0) return 0;
    const done = crawl.stops.filter((stop) => stop.visited).length;
    return Math.round((done / crawl.stops.length) * 100);
  }, [crawl]);

  const getToken = async () => {
    const { data } = await supabaseBrowser.auth.getSession();
    const token = data.session?.access_token;
    return token ?? null;
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(`/api/grog-trot/crawls/${crawlId}`, { headers });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.error ?? 'Could not load crawl');
        setCrawl(null);
        return;
      }
      setCrawl(data.crawl as CrawlPayload);
      setIsOwner(Boolean(data.isOwner));
    } catch (err) {
      setError((err as Error).message || 'Could not load crawl');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crawlId]);

  const toggleStop = async (stopId: number, visited: boolean) => {
    const token = await getToken();
    if (!token) {
      setError('Sign in required to update check-ins.');
      return;
    }

    const response = await fetch(`/api/grog-trot/crawls/${crawlId}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stopId, visited }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error ?? 'Could not update check-in');
      return;
    }

    setCrawl((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stops: prev.stops.map((stop) =>
          stop.id === stopId
            ? {
                ...stop,
                visited,
                visitedAt: visited ? new Date().toISOString() : null,
              }
            : stop
        ),
      };
    });
  };

  if (loading) {
    return <div className="card-landio">Loading crawl…</div>;
  }

  if (error) {
    return <div className="card-landio text-danger">{error}</div>;
  }

  if (!crawl) {
    return <div className="card-landio text-text-muted">Crawl not found.</div>;
  }

  return (
    <section className="card-landio">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xl font-semibold">{crawl.title}</p>
          <p className="text-sm text-text-muted">
            {crawl.isPublic ? 'Public share link' : 'Private crawl'} • {crawl.stops.length} stops • {progress}% complete
          </p>
        </div>
        <Link href="/dashboard" className="btn-ghost px-3 py-2 rounded-lg">Back to Dashboard</Link>
      </div>

      <div className="w-full h-2 rounded-full bg-surface2 mb-5 overflow-hidden">
        <div className="h-2 bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      <ol className="space-y-3">
        {crawl.stops.map((stop) => (
          <li key={stop.id} className="rounded-xl border border-border bg-surface2 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">Stop {stop.stopOrder}: {stop.venue?.name ?? stop.venueId}</p>
                <p className="text-sm text-text-muted">{stop.venue?.locationDetail ?? 'Location pending'} • {stop.venue?.area ?? 'Unknown area'}</p>
                {stop.venue?.signatureDrink && <p className="text-sm mt-1">Signature: {stop.venue.signatureDrink}</p>}
              </div>
              <label className="inline-flex items-center gap-2 min-h-[44px]">
                <input
                  type="checkbox"
                  checked={stop.visited}
                  disabled={!isOwner}
                  onChange={(event) => toggleStop(stop.id, event.target.checked)}
                />
                {isOwner ? 'Done' : 'Read-only'}
              </label>
            </div>
          </li>
        ))}
      </ol>

      {!isOwner && (
        <p className="text-xs text-text-muted mt-4">
          This is a public view. Only the crawl owner can check off stops.
        </p>
      )}
    </section>
  );
}
