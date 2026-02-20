export type GrogArea =
  | 'Magic Kingdom'
  | 'EPCOT'
  | 'Hollywood Studios'
  | 'Animal Kingdom'
  | 'Disney Springs'
  | 'Monorail Resorts'
  | 'EPCOT Resorts'
  | 'Other Resorts';

export type GrogVibe =
  | 'tiki'
  | 'themed_immersive'
  | 'upscale_lounge'
  | 'outdoor_bar'
  | 'pub'
  | 'speakeasy'
  | 'sports_bar'
  | 'wine_bar'
  | 'live_music'
  | 'pool_bar';

export interface GrogVenue {
  id: string;
  slug: string;
  name: string;
  area: GrogArea;
  locationDetail: string;
  vibes: GrogVibe[];
  description: string;
  signatureDrink: string;
  requiresReservation: boolean;
  adultsOnly: boolean;
  poolBar: boolean;
  foodAvailable: boolean;
  latitude: number;
  longitude: number;
}

export interface TransportEdge {
  fromArea: GrogArea;
  toArea: GrogArea;
  mode: 'walk' | 'monorail' | 'skyliner' | 'boat' | 'bus';
  avgMinutes: number;
}

export interface CrawlStop {
  venue: GrogVenue;
  order: number;
}

export interface CrawlLeg {
  fromVenueId: string;
  toVenueId: string;
  mode: TransportEdge['mode'];
  minutes: number;
  directionText: string;
}

export interface GeneratedCrawl {
  title: string;
  vibeLabel: string;
  stops: CrawlStop[];
  legs: CrawlLeg[];
  totalTravelMinutes: number;
  estimatedHours: number;
}

export interface CrawlGenerateInput {
  vibes: GrogVibe[];
  numberOfStops: number;
  startingArea: GrogArea;
  excludePoolBars: boolean;
  excludeReservationRequired: boolean;
}
