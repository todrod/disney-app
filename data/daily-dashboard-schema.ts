/**
 * Disney Daily Dashboard Data Schema
 * Newsletter-style presentation for 30-second skim + expanded reading mode
 */

export type CrowdLevel = 'low' | 'moderate' | 'high';

export interface ParkSnapshot {
  id: 'magic-kingdom' | 'epcot' | 'hollywood-studios' | 'animal-kingdom';
  name: string;
  shortName: string;
  crowdLevel: CrowdLevel;
  crowdValue: number; // 1-10 scale
  crowdLabel: string;
  headline: string;
  color: string; // 'blue' | 'purple' | 'red' | 'green'
  status: 'open' | 'closed' | 'maintenance';
}

export interface Story {
  id: string;
  headline: string;
  summary: string; // 1 sentence
  expanded?: string; // 2-3 sentences (optional)
  category: 'event' | 'alert' | 'merch' | 'food' | 'entertainment' | 'general';
  park?: string;
  timestamp?: string;
  priority?: 'urgent' | 'normal';
}

export interface HotTile {
  id: string;
  type: 'events-alerts' | 'limited-merch' | 'crowds';
  headline: string;
  icon: string;
  count?: number; // For merch items count
  value?: string; // Crowd level
}

export interface ResortBlurb {
  id: string;
  headline: string;
  summary: string;
}

export interface DailyDashboardData {
  date: string;
  lastUpdated: string;
  
  // Must-See Today (max 1 item, only when urgent)
  mustSeeToday: Story | null;
  
  // What's Hot Today (3 tiles)
  hotTiles: HotTile[];
  
  // Top Stories (max 5)
  topStories: Story[];
  
  // Park Snapshots (horizontal scroll)
  parks: ParkSnapshot[];
  
  // Resort Spotlight (1-2 short blurbs)
  resortSpotlight: ResortBlurb[];
}

export const CROWD_LEVELS = {
  LOW: { value: 3, label: 'Low', level: 'low' as CrowdLevel },
  MODERATE: { value: 6, label: 'Moderate', level: 'moderate' as CrowdLevel },
  HIGH: { value: 9, label: 'High', level: 'high' as CrowdLevel },
} as const;

export const PARK_COLORS = {
  MAGIC_KINGDOM: 'blue',
  EPCOT: 'purple',
  HOLLYWOOD_STUDIOS: 'red',
  ANIMAL_KINGDOM: 'green',
} as const;
