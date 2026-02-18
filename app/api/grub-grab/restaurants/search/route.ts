import { NextRequest, NextResponse } from 'next/server';
import { searchRestaurants } from '@/lib/grub-grab/restaurants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  const restaurants = searchRestaurants(q).slice(0, 25);

  return NextResponse.json({ ok: true, restaurants });
}
