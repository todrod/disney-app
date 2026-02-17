import { NextResponse } from 'next/server';
import { sampleDailyDashboardData } from '@/data/daily-dashboard-sample-data';

/**
 * GET /api/dashboard/crowds
 * Returns crowd data for all parks
 * 
 * Cache strategy: Client-side caching recommended (5 minutes)
 * Edge caching: 1 minute
 */
export async function GET() {
  try {
    // Simulate API delay for realistic loading states (remove in production)
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return crowd data from sample data (replace with actual data fetch in production)
    return NextResponse.json(
      {
        lastUpdated: sampleDailyDashboardData.lastUpdated,
        parks: sampleDailyDashboardData.parks,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching crowd data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crowd data' },
      { status: 500 }
    );
  }
}
