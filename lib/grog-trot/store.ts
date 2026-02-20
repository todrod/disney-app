import venuesJson from '@/data/grog-trot/venues.json';
import type { GrogVenue } from '@/types/grog-trot';

const venues = venuesJson as GrogVenue[];
const venueById = new Map(venues.map((venue) => [venue.id, venue]));

export interface StoredStop {
  id: number;
  venueId: string;
  stopOrder: number;
  visited: boolean;
  visitedAt: string | null;
  note: string | null;
}

export interface StoredCrawl {
  id: string;
  userId: string;
  title: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  stops: StoredStop[];
}

export function hydrateStoredCrawl(crawl: StoredCrawl) {
  return {
    ...crawl,
    stops: crawl.stops
      .slice()
      .sort((a, b) => a.stopOrder - b.stopOrder)
      .map((stop) => ({
        ...stop,
        venue: venueById.get(stop.venueId) ?? null,
      })),
  };
}

export function getGrogVenueById(venueId: string): GrogVenue | null {
  return venueById.get(venueId) ?? null;
}
