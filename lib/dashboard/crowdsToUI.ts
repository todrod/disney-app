import { ParkSnapshot, CrowdLevel } from '@/data/daily-dashboard-schema';

/**
 * crowdsToUI
 * Maps crowd API data to UI-ready format
 * Ensures card height stability and item position consistency
 */

export interface UIParkSnapshot extends ParkSnapshot {
  // UI-specific properties for smooth animations
  isAnimating?: boolean;
  animationDelay?: number;
}

export interface UIDisplayData {
  parks: UIParkSnapshot[];
  lastUpdated: string;
}

/**
 * Validates and transforms crowd data for UI rendering
 * Ensures all parks are present in consistent order
 * Preserves card height stability
 */
export function crowdsToUI(parks: ParkSnapshot[], lastUpdated: string): UIDisplayData {
  // Define park order for consistency
  const parkOrder = ['magic-kingdom', 'epcot', 'hollywood-studios', 'animal-kingdom'];
  
  // Create a map for quick lookup
  const parksMap = new Map(parks.map(park => [park.id, park]));
  
  // Build ordered array with animation delays
  const orderedParks: UIParkSnapshot[] = parkOrder.map((id, index) => {
    const park = parksMap.get(id as ParkSnapshot['id']);
    
    if (!park) {
      // Fallback to default park data if missing
      return {
        id: id as ParkSnapshot['id'],
        name: id
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        shortName: id
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        crowdLevel: 'low',
        crowdValue: 1,
        crowdLabel: 'Unknown',
        headline: 'No data available',
        color: 'gray' as any,
        status: 'closed',
        animationDelay: index * 50, // Stagger animations
      };
    }
    
    return {
      ...park,
      animationDelay: index * 50, // Stagger animations for visual appeal
    };
  });
  
  return {
    parks: orderedParks,
    lastUpdated,
  };
}

/**
 * Calculates crowd level change for smooth animations
 * Returns whether the level changed and the direction
 */
export function getCrowdLevelChange(
  prevLevel: CrowdLevel | null | undefined,
  newLevel: CrowdLevel
): {
  changed: boolean;
  direction: 'up' | 'down' | 'none';
} {
  if (!prevLevel) return { changed: true, direction: 'none' };
  
  const levelValues = { low: 1, moderate: 2, high: 3 };
  const prevValue = levelValues[prevLevel];
  const newValue = levelValues[newLevel];
  
  if (prevValue === newValue) return { changed: false, direction: 'none' };
  
  return {
    changed: true,
    direction: newValue > prevValue ? 'up' : 'down',
  };
}

/**
 * Gets CSS classes for crowd meter animations
 */
export function getCrowdMeterClasses(
  changed: boolean,
  direction: 'up' | 'down' | 'none'
): string {
  const baseClasses = 'transition-all duration-500 ease-in-out';
  
  if (!changed) return baseClasses;
  
  const directionClasses = {
    up: 'scale-110',
    down: 'scale-95',
    none: '',
  };
  
  return `${baseClasses} ${directionClasses[direction]}`;
}
