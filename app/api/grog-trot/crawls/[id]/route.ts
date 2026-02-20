import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { hydrateStoredCrawl, StoredCrawl } from '@/lib/grog-trot/store';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const crawlId = context.params.id;
    const supabase = getSupabaseAdmin();

    const authHeader = request.headers.get('authorization') || '';
    const hasBearer = authHeader.startsWith('Bearer ');

    let viewerId: string | null = null;
    if (hasBearer) {
      try {
        const user = await requireAuthenticatedUser(request);
        viewerId = user.id;
      } catch {
        viewerId = null;
      }
    }

    const { data: crawl, error: crawlError } = await supabase
      .from('grog_user_crawls')
      .select('id,user_id,title,is_public,created_at,updated_at')
      .eq('id', crawlId)
      .maybeSingle();

    if (crawlError || !crawl) {
      return NextResponse.json({ ok: false, error: 'Crawl not found' }, { status: 404 });
    }

    const isOwner = viewerId === crawl.user_id;
    if (!crawl.is_public && !isOwner) {
      return NextResponse.json({ ok: false, error: 'This crawl is private' }, { status: 403 });
    }

    const { data: stops, error: stopsError } = await supabase
      .from('grog_user_crawl_stops')
      .select('id,venue_id,stop_order,visited,visited_at,note')
      .eq('crawl_id', crawlId)
      .order('stop_order', { ascending: true });

    if (stopsError) {
      return NextResponse.json({ ok: false, error: 'Could not load crawl stops' }, { status: 500 });
    }

    const stored: StoredCrawl = {
      id: crawl.id,
      userId: crawl.user_id,
      title: crawl.title,
      isPublic: crawl.is_public,
      createdAt: crawl.created_at,
      updatedAt: crawl.updated_at,
      stops: (stops ?? []).map((stop: any) => ({
        id: stop.id,
        venueId: stop.venue_id,
        stopOrder: stop.stop_order,
        visited: stop.visited,
        visitedAt: stop.visited_at,
        note: stop.note,
      })),
    };

    return NextResponse.json({ ok: true, crawl: hydrateStoredCrawl(stored), isOwner });
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not load crawl' }, { status: 500 });
  }
}
