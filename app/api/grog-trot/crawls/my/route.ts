import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/goofy-beacon/auth';
import { getSupabaseAdmin } from '@/lib/goofy-beacon/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request);
    const supabase = getSupabaseAdmin();

    const { data: crawls, error } = await supabase
      .from('grog_user_crawls')
      .select('id,title,is_public,created_at,updated_at,grog_user_crawl_stops(id,visited)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: 'Could not load crawls' }, { status: 500 });
    }

    const rows = (crawls ?? []).map((crawl: any) => {
      const totalStops = (crawl.grog_user_crawl_stops ?? []).length;
      const visitedStops = (crawl.grog_user_crawl_stops ?? []).filter((stop: any) => stop.visited).length;
      return {
        id: crawl.id,
        title: crawl.title,
        isPublic: crawl.is_public,
        createdAt: crawl.created_at,
        updatedAt: crawl.updated_at,
        totalStops,
        visitedStops,
      };
    });

    return NextResponse.json({ ok: true, crawls: rows });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || 'Unauthorized' }, { status: 401 });
  }
}
