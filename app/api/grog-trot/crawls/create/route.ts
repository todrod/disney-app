import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';
import { getGrogVenueById } from '@/lib/grog-trot/store';

interface CreateBody {
  title?: string;
  isPublic?: boolean;
  stops?: Array<{ venueId?: string; stopOrder?: number }>;
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = (await request.json()) as CreateBody;

    const title = (body.title ?? '').trim() || "Goofy's Grog Trot";
    const isPublic = Boolean(body.isPublic);
    const stops = (body.stops ?? [])
      .filter((stop) => stop.venueId && Number.isFinite(stop.stopOrder))
      .map((stop) => ({
        venueId: String(stop.venueId),
        stopOrder: Number(stop.stopOrder),
      }))
      .sort((a, b) => a.stopOrder - b.stopOrder);

    if (stops.length < 2) {
      return NextResponse.json({ ok: false, error: 'At least 2 stops are required' }, { status: 400 });
    }

    if (stops.some((stop) => !getGrogVenueById(stop.venueId))) {
      return NextResponse.json({ ok: false, error: 'One or more stops are invalid' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: crawl, error: crawlError } = await supabase
      .from('grog_user_crawls')
      .insert({
        user_id: user.id,
        title,
        is_public: isPublic,
      })
      .select('id,user_id,title,is_public,created_at,updated_at')
      .single();

    if (crawlError || !crawl) {
      return NextResponse.json({ ok: false, error: 'Could not create crawl' }, { status: 500 });
    }

    const stopPayload = stops.map((stop) => ({
      crawl_id: crawl.id,
      venue_id: stop.venueId,
      stop_order: stop.stopOrder,
    }));

    const { error: stopError } = await supabase.from('grog_user_crawl_stops').insert(stopPayload);
    if (stopError) {
      await supabase.from('grog_user_crawls').delete().eq('id', crawl.id);
      return NextResponse.json({ ok: false, error: 'Could not save crawl stops' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, crawlId: crawl.id });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || 'Unauthorized' }, { status: 401 });
  }
}
