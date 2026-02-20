'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import QuickNavigation from '@/components/QuickNavigation';
import { supabaseBrowser } from '@/lib/goofy-beacon/supabase-browser';
import {
  generateGrogTrot,
  getGrogTrotTemplates,
  getGrogTrotVenues,
} from '@/lib/grog-trot/algorithm';
import type { CrawlGenerateInput, GeneratedCrawl, GrogArea, GrogVibe } from '@/types/grog-trot';

const areas: GrogArea[] = [
  'Magic Kingdom',
  'EPCOT',
  'Hollywood Studios',
  'Animal Kingdom',
  'Disney Springs',
  'Monorail Resorts',
  'EPCOT Resorts',
  'Other Resorts',
];

const vibes: GrogVibe[] = [
  'tiki',
  'themed_immersive',
  'upscale_lounge',
  'outdoor_bar',
  'pub',
  'speakeasy',
  'sports_bar',
  'wine_bar',
  'live_music',
  'pool_bar',
];

const STORAGE_KEY = 'goofy_grog_trot_checked_v1';

function toLabel(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function GoofysGrogTrotPage() {
  const templates = useMemo(() => getGrogTrotTemplates(), []);
  const venueCount = useMemo(() => getGrogTrotVenues().length, []);

  const [vibeSelection, setVibeSelection] = useState<GrogVibe[]>([]);
  const [startingArea, setStartingArea] = useState<GrogArea>('Disney Springs');
  const [numberOfStops, setNumberOfStops] = useState(5);
  const [excludePoolBars, setExcludePoolBars] = useState(false);
  const [excludeReservationRequired, setExcludeReservationRequired] = useState(true);

  const [crawl, setCrawl] = useState<GeneratedCrawl | null>(null);
  const [checkedStops, setCheckedStops] = useState<Record<string, boolean>>({});
  const [nearbyHints, setNearbyHints] = useState<Record<string, number>>({});
  const [gpsMessage, setGpsMessage] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [savePublic, setSavePublic] = useState(true);
  const [saving, setSaving] = useState(false);

  const progress = useMemo(() => {
    if (!crawl || crawl.stops.length === 0) return 0;
    const done = crawl.stops.filter((stop) => checkedStops[stop.venue.id]).length;
    return Math.round((done / crawl.stops.length) * 100);
  }, [crawl, checkedStops]);

  const generate = (partial?: Partial<CrawlGenerateInput>) => {
    const input: CrawlGenerateInput = {
      vibes: partial?.vibes ?? vibeSelection,
      numberOfStops: partial?.numberOfStops ?? numberOfStops,
      startingArea: partial?.startingArea ?? startingArea,
      excludePoolBars: partial?.excludePoolBars ?? excludePoolBars,
      excludeReservationRequired: partial?.excludeReservationRequired ?? excludeReservationRequired,
    };

    const next = generateGrogTrot(input);
    setCrawl(next);
    setNearbyHints({});
    setGpsMessage('');
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!crawl) return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      const next: Record<string, boolean> = {};
      for (const stop of crawl.stops) {
        if (parsed[stop.venue.id]) next[stop.venue.id] = true;
      }
      setCheckedStops(next);
    } catch {
      // ignore malformed local cache
    }
  }, [crawl]);

  const toggleStop = (venueId: string) => {
    setCheckedStops((prev) => {
      const next = { ...prev, [venueId]: !prev[venueId] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const applyTemplate = (slug: string) => {
    const selected = templates.find((template) => template.slug === slug);
    if (!selected) return;

    const suggestedVibes = Array.from(new Set(selected.stops.flatMap((stop) => stop.vibes))).slice(0, 2);
    const preferredArea = selected.stops[0]?.area ?? 'Disney Springs';
    setVibeSelection(suggestedVibes as GrogVibe[]);
    setStartingArea(preferredArea);
    setNumberOfStops(selected.stops.length);

    generate({
      vibes: suggestedVibes as GrogVibe[],
      startingArea: preferredArea,
      numberOfStops: selected.stops.length,
    });
  };

  const runGpsAssist = () => {
    setGpsMessage('');
    if (!crawl) return;
    if (!navigator.geolocation) {
      setGpsMessage('GPS is not available on this device.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const hints: Record<string, number> = {};

        for (const stop of crawl.stops) {
          const meters = Math.round(distanceMeters(latitude, longitude, stop.venue.latitude, stop.venue.longitude));
          hints[stop.venue.id] = meters;
        }

        setNearbyHints(hints);

        const nearest = crawl.stops
          .map((stop) => ({ id: stop.venue.id, name: stop.venue.name, meters: hints[stop.venue.id] }))
          .sort((a, b) => a.meters - b.meters)[0];

        if (nearest && nearest.meters <= 220) {
          setGpsMessage(`You're likely near ${nearest.name} (${nearest.meters}m).`);
        } else if (nearest) {
          setGpsMessage(`Closest stop looks like ${nearest.name} (${nearest.meters}m away).`);
        }
      },
      (error) => {
        setGpsMessage(`Could not get GPS location (${error.message}).`);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const copyShareLink = async () => {
    if (!crawl) return;
    const stopIds = crawl.stops.map((stop) => stop.venue.id).join(',');
    const url = `${window.location.origin}/goofys-grog-trot?stops=${encodeURIComponent(stopIds)}`;
    await navigator.clipboard.writeText(url);
    setShareMessage('Share link copied.');
    setTimeout(() => setShareMessage(''), 2500);
  };

  const saveCrawl = async () => {
    if (!crawl) return;
    setSaving(true);
    setShareMessage('');
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setShareMessage('Sign in first via Find Your Group, then save.');
        return;
      }

      const response = await fetch('/api/grog-trot/crawls/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: crawl.title,
          isPublic: savePublic,
          stops: crawl.stops.map((stop) => ({
            venueId: stop.venue.id,
            stopOrder: stop.order,
          })),
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setShareMessage(payload.error ?? 'Could not save crawl');
        return;
      }

      const shareUrl = `${window.location.origin}/goofys-grog-trot/${payload.crawlId}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage(`Saved. Share link copied: /goofys-grog-trot/${payload.crawlId}`);
    } catch (err) {
      setShareMessage((err as Error).message || 'Could not save crawl');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen lg:pl-64 bg-bg text-text">
      <QuickNavigation />
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10 space-y-6">
        <section className="card-landio card-landio-featured text-center">
          <p className="text-3xl md:text-4xl font-bold font-display mb-2">🍹 Goofy's Grog Trot</p>
          <p className="text-lg text-text">Sip. Stroll. Stay Goofy.</p>
          <p className="text-text-muted mt-2">Build a Disney bar crawl with practical directions and easy check-offs.</p>
          <p className="text-xs text-text-muted mt-2">Starter venue list: {venueCount} lounges and bars</p>
        </section>

        <section className="card-landio">
          <p className="landio-kicker pill-accent2 inline-flex mb-3">⚙️ BUILD YOUR CRAWL</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-muted block mb-1">Starting area</label>
              <select
                value={startingArea}
                onChange={(event) => setStartingArea(event.target.value as GrogArea)}
                className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]"
              >
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Stops</label>
              <input
                type="number"
                min={3}
                max={8}
                value={numberOfStops}
                onChange={(event) => setNumberOfStops(Number(event.target.value))}
                className="w-full rounded-xl bg-surface2 border border-border p-3 min-h-[44px]"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {vibes.map((vibe) => {
              const active = vibeSelection.includes(vibe);
              return (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => {
                    setVibeSelection((prev) =>
                      prev.includes(vibe) ? prev.filter((item) => item !== vibe) : [...prev, vibe]
                    );
                  }}
                  className={`rounded-lg px-3 py-2 min-h-[44px] text-sm border ${active ? 'bg-accent text-text border-accent' : 'border-border bg-surface2 text-text-muted'}`}
                >
                  {toLabel(vibe)}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-text-muted">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={excludePoolBars} onChange={(event) => setExcludePoolBars(event.target.checked)} />
              Exclude pool bars
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={excludeReservationRequired} onChange={(event) => setExcludeReservationRequired(event.target.checked)} />
              Exclude reservation-heavy stops
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => generate()} className="btn-primary px-4 py-2 rounded-lg min-h-[44px]">Generate Crawl</button>
            <button type="button" onClick={runGpsAssist} className="btn-ghost px-4 py-2 rounded-lg min-h-[44px]">Use GPS Assist</button>
            <button type="button" onClick={saveCrawl} disabled={saving} className="btn-ghost px-4 py-2 rounded-lg min-h-[44px]">
              {saving ? 'Saving...' : 'Save Crawl'}
            </button>
            <button type="button" onClick={copyShareLink} className="btn-ghost px-4 py-2 rounded-lg min-h-[44px]">Copy Share Link</button>
            <Link href="/dashboard" className="btn-ghost px-4 py-2 rounded-lg min-h-[44px] inline-flex items-center">Open Dashboard</Link>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-text-muted mt-3">
            <input type="checkbox" checked={savePublic} onChange={(event) => setSavePublic(event.target.checked)} />
            Save as public shareable crawl
          </label>

          {gpsMessage && <p className="text-sm text-text-muted mt-3">{gpsMessage}</p>}
          {shareMessage && <p className="text-sm text-success mt-2">{shareMessage}</p>}
        </section>

        <section className="card-landio">
          <p className="landio-kicker pill-warning inline-flex mb-3">🎯 QUICK TEMPLATES</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {templates.map((template) => (
              <button
                key={template.slug}
                type="button"
                className="text-left rounded-lg border border-border bg-surface2 px-3 py-3 min-h-[44px] hover:border-accent"
                onClick={() => applyTemplate(template.slug)}
              >
                <p className="font-semibold">{template.title}</p>
                <p className="text-xs text-text-muted">{template.stops.length} stops</p>
              </button>
            ))}
          </div>
        </section>

        {crawl && (
          <section className="card-landio">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold text-lg">{crawl.title}</p>
                <p className="text-sm text-text-muted">Estimated {crawl.estimatedHours} hours • {crawl.totalTravelMinutes} min travel</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Progress</p>
                <p className="font-semibold">{progress}%</p>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-surface2 mb-5 overflow-hidden">
              <div className="h-2 bg-accent transition-all" style={{ width: `${progress}%` }} />
            </div>

            <ol className="space-y-4">
              {crawl.stops.map((stop, index) => {
                const leg = crawl.legs[index];
                const nearbyMeters = nearbyHints[stop.venue.id];
                const isNearby = typeof nearbyMeters === 'number' && nearbyMeters <= 220;

                return (
                  <li key={stop.venue.id} className="rounded-xl border border-border bg-surface2 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">Stop {index + 1}: {stop.venue.name}</p>
                        <p className="text-sm text-text-muted">{stop.venue.locationDetail} • {stop.venue.area}</p>
                        <p className="text-sm mt-1">Signature: {stop.venue.signatureDrink}</p>
                        <p className="text-xs text-text-muted mt-1">{stop.venue.description}</p>
                        {typeof nearbyMeters === 'number' && (
                          <p className={`text-xs mt-1 ${isNearby ? 'text-success' : 'text-text-muted'}`}>
                            {isNearby ? 'Nearby now' : 'Distance'}: {nearbyMeters}m
                          </p>
                        )}
                      </div>
                      <label className="inline-flex items-center gap-2 min-h-[44px]">
                        <input
                          type="checkbox"
                          checked={Boolean(checkedStops[stop.venue.id])}
                          onChange={() => toggleStop(stop.venue.id)}
                        />
                        Done
                      </label>
                    </div>

                    {leg && (
                      <div className="mt-3 text-sm text-text-muted border-t border-border pt-3">
                        <p className="font-medium">Next leg ({leg.minutes} min via {leg.mode}):</p>
                        <p>{leg.directionText}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="mt-5 text-sm text-text-muted">
              <p className="font-medium mb-1">New to Disney transportation?</p>
              <p>Use My Disney Experience map + posted signs at each transport hub. Cast Members at monorail, Skyliner, boat docks, and bus loops can confirm your next transfer fast.</p>
            </div>
          </section>
        )}

        <section className="card-landio text-sm text-text-muted">
          <p className="font-medium text-text mb-1">Want dining alerts too?</p>
          <Link href="/goofys-grub-grab" className="btn-ghost px-3 py-2 rounded-lg inline-flex min-h-[44px]">Open Goofy's Grub Grab</Link>
        </section>
      </div>
    </main>
  );
}
