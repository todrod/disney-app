import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';

interface CheckBody {
  stopId?: number;
  visited?: boolean;
}

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  try {
    const user = await requireAuthenticatedUser(request);
    const crawlId = context.params.id;
    const body = (await request.json()) as CheckBody;

    if (!Number.isFinite(body.stopId)) {
      return NextResponse.json({ ok: false, error: 'stopId is required' }, { status: 400 });
    }

    const stopId = Number(body.stopId);
    const visited = Boolean(body.visited);

    const supabase = getSupabaseAdmin();

    const { data: crawl } = await supabase
      .from('grog_user_crawls')
      .select('id,user_id')
      .eq('id', crawlId)
      .maybeSingle();

    if (!crawl) {
      return NextResponse.json({ ok: false, error: 'Crawl not found' }, { status: 404 });
    }

    if (crawl.user_id !== user.id) {
      return NextResponse.json({ ok: false, error: 'Only the owner can update check-ins' }, { status: 403 });
    }

    const payload = {
      visited,
      visited_at: visited ? new Date().toISOString() : null,
    };

    const { error } = await supabase
      .from('grog_user_crawl_stops')
      .update(payload)
      .eq('crawl_id', crawlId)
      .eq('id', stopId);

    if (error) {
      return NextResponse.json({ ok: false, error: 'Could not update stop' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || 'Unauthorized' }, { status: 401 });
  }
}
