import { NextRequest, NextResponse } from 'next/server';
import { getAllRestaurants, getRestaurantsByLocation } from '@/lib/grub-grab/restaurants';
import { RestaurantLocation } from '@/types/grub-grab';

const validLocations: RestaurantLocation[] = [
  'Magic Kingdom',
  'EPCOT',
  'Hollywood Studios',
  'Animal Kingdom',
  'Disney Springs',
  'Resort Hotels',
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') as RestaurantLocation | null;

  if (!location || !validLocations.includes(location)) {
    return NextResponse.json({ ok: true, restaurants: getAllRestaurants() });
  }

  return NextResponse.json({ ok: true, restaurants: getRestaurantsByLocation(location) });
}
