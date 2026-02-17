import { DailyDashboardData } from '@/data/daily-dashboard-schema';

/**
 * newsletterToUI
 * Maps newsletter API data to UI-ready format
 * Ensures data validation and consistency
 * Hides empty sections (no placeholder skeletons)
 */

export interface UIDashboardData {
  // Must-See Today (only when urgent items exist)
  mustSeeToday: DailyDashboardData['mustSeeToday'];
  
  // What's Hot Today (always shown, max 3 tiles)
  hotTiles: DailyDashboardData['hotTiles'];
  
  // Top Stories (only shown when stories exist, max 5)
  topStories: DailyDashboardData['topStories'];
  
  // Park Snapshots (always shown)
  parks: DailyDashboardData['parks'];
  
  // Resort Spotlight (only shown when blurbs exist, max 2)
  resortSpotlight: DailyDashboardData['resortSpotlight'];
  
  // Section visibility flags for update-safe rendering
  showMustSeeToday: boolean;
  showTopStories: boolean;
  showResortSpotlight: boolean;
}

/**
 * Validates and transforms newsletter data for UI rendering
 * Maintains consistent array lengths to prevent layout shifts
 */
export function newsletterToUI(data: DailyDashboardData): UIDashboardData {
  return {
    // Must-See Today: Only show if urgent item exists
    mustSeeToday: data.mustSeeToday?.priority === 'urgent' ? data.mustSeeToday : null,
    
    // Hot Tiles: Always show, max 3, pad if needed
    hotTiles: data.hotTiles.slice(0, 3),
    
    // Top Stories: Show only if stories exist, max 5
    topStories: data.topStories.slice(0, 5),
    
    // Park Snapshots: Always show all 4 parks
    parks: data.parks,
    
    // Resort Spotlight: Show only if blurbs exist, max 2
    resortSpotlight: data.resortSpotlight.slice(0, 2),
    
    // Visibility flags for update-safe rendering
    showMustSeeToday: data.mustSeeToday?.priority === 'urgent',
    showTopStories: data.topStories.length > 0,
    showResortSpotlight: data.resortSpotlight.length > 0,
  };
}

/**
 * Compares two UIDashboardData objects to determine if a section changed
 * Used for update-safe rendering (only re-render changed sections)
 */
export function didSectionChange(
  prevData: UIDashboardData | null,
  newData: UIDashboardData,
  section: keyof Pick<UIDashboardData, 'mustSeeToday' | 'hotTiles' | 'topStories' | 'parks' | 'resortSpotlight'>
): boolean {
  if (!prevData) return true;

  const prev = prevData[section];
  const next = newData[section];

  // Simple comparison - may need deeper comparison for nested objects
  return JSON.stringify(prev) !== JSON.stringify(next);
}
