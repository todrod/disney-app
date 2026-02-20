import venuesJson from '@/data/grog-trot/venues.json';
import edgesJson from '@/data/grog-trot/transport-edges.json';
import type {
  CrawlGenerateInput,
  CrawlLeg,
  CrawlStop,
  GeneratedCrawl,
  GrogArea,
  GrogVenue,
  TransportEdge,
} from '@/types/grog-trot';

const venues = venuesJson as GrogVenue[];
const edges = edgesJson as TransportEdge[];

const templateMap: Record<string, string[]> = {
  'tiki-night': [
    'mr-tambu-lounge',
    'mr-trader-sams-terrace',
    'mr-trader-sams-grotto',
    'mr-outer-rim',
    'mr-california-grill-lounge',
  ],
  'world-showcase-tour': [
    'ep-choza-de-margarita',
    'ep-la-cava-del-tequila',
    'ep-rose-and-crown-pub',
    'ep-tutto-gusto',
    'ep-spice-road-table',
  ],
  'speakeasy-crawl': [
    'ds-enzos-hideaway',
    'ds-the-edison',
    'er-abracadabar',
    'ds-jock-lindseys',
    'er-belle-vue',
  ],
  'resort-hop': [
    'mr-enchanted-rose',
    'mr-tambu-lounge',
    'mr-outer-rim',
    'or-territory-lounge',
    'or-geyser-point',
  ],
  'galaxy-to-galaxy': [
    'hs-ogas-cantina',
    'hs-baseline-tap-house',
    'hs-brown-derby-lounge',
    'hs-tune-in-lounge',
    'hs-sunshine-day-bar',
  ],
};

const directionalNudges: Record<TransportEdge['mode'], string> = {
  walk: 'Follow Disney wayfinding signs and keep your park map open.',
  monorail: 'Head to the monorail platform and verify the destination loop before boarding.',
  skyliner: 'Follow signs to Disney Skyliner, then transfer lines if posted on station boards.',
  boat: 'Use the water launch dock and confirm the resort/park name with the cast member.',
  bus: 'Go to the bus loop, match the route name on the digital board, and board that bay.',
};

function buildGraph() {
  const graph = new Map<GrogArea, Map<GrogArea, TransportEdge>>();

  for (const edge of edges) {
    if (!graph.has(edge.fromArea)) graph.set(edge.fromArea, new Map());
    if (!graph.has(edge.toArea)) graph.set(edge.toArea, new Map());

    const forward = graph.get(edge.fromArea)!;
    const reverse = graph.get(edge.toArea)!;

    forward.set(edge.toArea, edge);
    reverse.set(edge.fromArea, {
      fromArea: edge.toArea,
      toArea: edge.fromArea,
      mode: edge.mode,
      avgMinutes: edge.avgMinutes,
    });
  }

  return graph;
}

const graph = buildGraph();

function getShortestEdge(from: GrogArea, to: GrogArea): TransportEdge {
  if (from === to) {
    return { fromArea: from, toArea: to, mode: 'walk', avgMinutes: 8 };
  }

  const direct = graph.get(from)?.get(to);
  if (direct) return direct;

  const via = graph.get(from);
  if (!via || via.size === 0) {
    return { fromArea: from, toArea: to, mode: 'bus', avgMinutes: 35 };
  }

  // Light heuristic: pick the best 2-leg connection.
  let best: TransportEdge | null = null;
  for (const step of Array.from(via.values())) {
    const second = graph.get(step.toArea)?.get(to);
    if (!second) continue;
    const minutes = step.avgMinutes + second.avgMinutes;
    if (!best || minutes < best.avgMinutes) {
      best = {
        fromArea: from,
        toArea: to,
        mode: step.mode,
        avgMinutes: minutes,
      };
    }
  }

  return best ?? { fromArea: from, toArea: to, mode: 'bus', avgMinutes: 35 };
}

function toDirectionText(from: GrogVenue, to: GrogVenue, leg: TransportEdge): string {
  const nudge = directionalNudges[leg.mode];
  return `From ${from.name}, go to ${to.locationDetail}. Use ${leg.mode} (${leg.avgMinutes} min). ${nudge}`;
}

function vibeLabel(vibes: string[]): string {
  if (vibes.length === 0) return 'Mixed Magic';
  return vibes.map((v) => v.replace(/_/g, ' ')).join(' + ');
}

export function getGrogTrotVenues(): GrogVenue[] {
  return venues;
}

export function getGrogTrotTemplates() {
  return Object.entries(templateMap).map(([slug, stopIds]) => ({
    slug,
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
    stops: stopIds
      .map((id) => venues.find((venue) => venue.id === id))
      .filter((venue): venue is GrogVenue => Boolean(venue)),
  }));
}

export function generateGrogTrot(input: CrawlGenerateInput): GeneratedCrawl {
  const clampedStops = Math.max(3, Math.min(8, input.numberOfStops));

  let candidates = venues.filter((venue) => {
    if (input.excludePoolBars && venue.poolBar) return false;
    if (input.excludeReservationRequired && venue.requiresReservation) return false;
    if (input.vibes.length > 0 && !input.vibes.some((vibe) => venue.vibes.includes(vibe))) return false;
    return true;
  });

  if (candidates.length < clampedStops) {
    candidates = venues.filter((venue) => {
      if (input.excludePoolBars && venue.poolBar) return false;
      if (input.excludeReservationRequired && venue.requiresReservation) return false;
      return true;
    });
  }

  const chosen: GrogVenue[] = [];

  const starters = candidates
    .filter((venue) => venue.area === input.startingArea)
    .sort((a, b) => Number(a.requiresReservation) - Number(b.requiresReservation));

  if (starters.length > 0) {
    chosen.push(starters[0]);
  } else if (candidates.length > 0) {
    chosen.push(candidates[0]);
  }

  while (chosen.length < clampedStops) {
    const current = chosen[chosen.length - 1];
    const remaining = candidates.filter((candidate) => !chosen.some((picked) => picked.id === candidate.id));
    if (remaining.length === 0) break;

    remaining.sort((a, b) => {
      const edgeA = getShortestEdge(current.area, a.area);
      const edgeB = getShortestEdge(current.area, b.area);

      const areaRepeatPenaltyA = a.area === current.area ? 3 : 0;
      const areaRepeatPenaltyB = b.area === current.area ? 3 : 0;

      const scoreA = edgeA.avgMinutes + areaRepeatPenaltyA;
      const scoreB = edgeB.avgMinutes + areaRepeatPenaltyB;

      if (scoreA !== scoreB) return scoreA - scoreB;
      return Number(a.requiresReservation) - Number(b.requiresReservation);
    });

    chosen.push(remaining[0]);
  }

  const stops: CrawlStop[] = chosen.map((venue, index) => ({
    venue,
    order: index + 1,
  }));

  const legs: CrawlLeg[] = [];
  let totalTravelMinutes = 0;

  for (let i = 0; i < stops.length - 1; i += 1) {
    const from = stops[i].venue;
    const to = stops[i + 1].venue;
    const edge = getShortestEdge(from.area, to.area);
    totalTravelMinutes += edge.avgMinutes;

    legs.push({
      fromVenueId: from.id,
      toVenueId: to.id,
      mode: edge.mode,
      minutes: edge.avgMinutes,
      directionText: toDirectionText(from, to, edge),
    });
  }

  const estimatedHours = Math.max(2.5, Math.round(((stops.length * 42 + totalTravelMinutes) / 60) * 10) / 10);

  return {
    title: `Goofy's Grog Trot: ${vibeLabel(input.vibes)}`,
    vibeLabel: vibeLabel(input.vibes),
    stops,
    legs,
    totalTravelMinutes,
    estimatedHours,
  };
}
