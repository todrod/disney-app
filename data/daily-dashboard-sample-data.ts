import { DailyDashboardData } from './daily-dashboard-schema';

/**
 * Sample Disney Daily Dashboard Data
 * Based on Basil's intelligence for February 16, 2026
 */

export const sampleDailyDashboardData: DailyDashboardData = {
  date: 'February 16, 2026',
  lastUpdated: '6:33 PM EST',

  // Must-See Today (urgent only)
  mustSeeToday: {
    id: 'mco-delays',
    headline: 'MCO Airport Delays - Add 2+ Hours Travel Time',
    summary: '163 flight delays and 17 cancellations at Orlando International due to TSA operations.',
    category: 'alert',
    priority: 'urgent',
    timestamp: '7:00 AM EST',
    expanded: 'Government shutdown affecting TSA operations causing major delays. Check security wait times online before heading to airport. Expect longer security lines and potential travel disruptions to Disney World.',
  },

  // What's Hot Today (3 tiles)
  hotTiles: [
    {
      id: 'events-alerts',
      type: 'events-alerts',
      headline: 'EPCOT Broadway Concerts',
      icon: '🎭',
    },
    {
      id: 'limited-merch',
      type: 'limited-merch',
      headline: 'Valentine\'s Collection',
      icon: '💝',
      count: 5,
    },
    {
      id: 'crowds',
      type: 'crowds',
      headline: 'Moderate Today',
      icon: '👥',
      value: 'Moderate',
    },
  ],

  // Top Stories (max 5)
  topStories: [
    {
      id: 'frozen-reopens',
      headline: 'Frozen Ever After Reopens with New Animatronics',
      summary: 'Frozen Ever After just reopened at EPCOT with upgraded Audio-Animatronics.',
      category: 'entertainment',
      park: 'epcot',
      timestamp: '10:35 AM EST',
      expanded: 'The upgrade features more realistic Anna, Elsa, and Kristoff animatronics with silicone molded faces replacing rear-projected faces. Large crowds drawing 90+ minute wait times at rope drop.',
    },
    {
      id: 'living-land-reopens',
      headline: 'Living with the Land Reopens - Breadfruit Tree Removed',
      summary: 'Living with the Land reopened around 3:30 PM after unexpected closure.',
      category: 'alert',
      park: 'epcot',
      timestamp: '2:34 PM EST',
      expanded: 'Ride was drained earlier for load station repairs. The iconic breadfruit tree has been permanently removed due to space constraints and safety concerns. Tree trunk salvaged, rest being composted.',
    },
    {
      id: 'gertie-repaired',
      headline: 'Gertie the Dinosaur Tail Crack Patched',
      summary: 'Disney\'s Hollywood Studios fixed visible crack in Gertie the Dinosaur tail.',
      category: 'entertainment',
      park: 'hollywood-studios',
      timestamp: '2:34 PM EST',
      expanded: 'Color difference still visible, may fade or be painted over. Status: Back to normal photo op.',
    },
    {
      id: 'voices-liberty',
      headline: 'Presidents\' Day Voices of Liberty Echo Sets at EPCOT',
      summary: 'Special amplified sets with performers on ground floor and second-floor balcony.',
      category: 'event',
      park: 'epcot',
      timestamp: '2:34 PM EST',
      expanded: 'Happening now at The American Adventure. Songs: "Golden Dream" and "This Land is Your Land". Other dates: Memorial Day, Flag Day, July 4th, Labor Day, Veterans Day.',
    },
    {
      id: 'mermaid-refurb',
      headline: 'Under the Sea Refurbishment at Magic Kingdom',
      summary: 'Under the Sea – Journey of the Little Mermaid closed for refurbishment today.',
      category: 'alert',
      park: 'magic-kingdom',
      timestamp: '10:35 AM EST',
      expanded: 'Short-term maintenance expected to reopen tomorrow. Valentine\'s-themed treats still available throughout park.',
    },
  ],

  // Park Snapshots
  parks: [
    {
      id: 'magic-kingdom',
      name: 'Magic Kingdom',
      shortName: 'Magic Kingdom',
      crowdLevel: 'moderate',
      crowdValue: 6,
      crowdLabel: 'Moderate',
      headline: 'Little Mermaid closed for refurbishment',
      color: 'blue',
      status: 'open',
    },
    {
      id: 'epcot',
      name: 'EPCOT',
      shortName: 'EPCOT',
      crowdLevel: 'high',
      crowdValue: 8,
      crowdLabel: 'High',
      headline: 'Festival of the Arts in full swing',
      color: 'purple',
      status: 'open',
    },
    {
      id: 'hollywood-studios',
      name: 'Hollywood Studios',
      shortName: 'Hollywood Studios',
      crowdLevel: 'moderate',
      crowdValue: 6,
      crowdLabel: 'Moderate',
      headline: 'Gertie the Dinosaur crack patched',
      color: 'red',
      status: 'open',
    },
    {
      id: 'animal-kingdom',
      name: 'Animal Kingdom',
      shortName: 'Animal Kingdom',
      crowdLevel: 'low',
      crowdValue: 4,
      crowdLabel: 'Low-Moderate',
      headline: 'No major issues reported',
      color: 'green',
      status: 'open',
    },
  ],

  // Resort Spotlight
  resortSpotlight: [
    {
      id: 'crews-cup-closing',
      headline: 'Crew\'s Cup Lounge Closing Feb 23',
      summary: 'Disney\'s Yacht Club lounge closing for refurbishment through May 2026. Famous prime rib sliders will be unavailable.',
    },
    {
      id: 'festival-food',
      headline: 'EPCOT Festival Food Studios Open',
      summary: 'Culinary workshops and festival food booths serve artistic, Instagram-worthy dishes throughout the park.',
    },
  ],
};
