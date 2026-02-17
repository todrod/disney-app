import { NextResponse } from 'next/server';
import newsletterFixture from '@/data/fixtures/newsletter-latest.json';

export async function GET() {
  return NextResponse.json(newsletterFixture, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
