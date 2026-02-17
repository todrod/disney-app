import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crowdsFixture from '@/data/fixtures/crowds-latest.json';

function toFixtureShape(rows: any[]) {
  const parks: Record<string, any> = {};
  let generatedAt = new Date().toISOString();

  for (const row of rows) {
    const park = row.park || row.park_code;
    if (!park) continue;
    parks[park] = {
      park,
      score: Number(row.score ?? row.crowd_score ?? 5),
      label: row.label ?? row.crowd_label ?? 'Moderate',
      avg_wait_min: Number(row.avg_wait_min ?? row.avg_wait ?? 0),
      data_quality: row.data_quality ?? 'good',
      generated_at: row.generated_at ?? row.updated_at ?? generatedAt,
    };
    generatedAt = parks[park].generated_at;
  }

  return {
    generated_at: generatedAt,
    parks,
  };
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(crowdsFixture, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('crowd_cache_latest')
      .select('*')
      .limit(16);

    if (error || !data || data.length === 0) {
      return NextResponse.json(crowdsFixture, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    const shaped = toFixtureShape(data);
    const hasAllParks = ['MK', 'EPCOT', 'DHS', 'AK'].every((park) => shaped.parks[park]);
    const response = hasAllParks ? shaped : crowdsFixture;

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch {
    return NextResponse.json(crowdsFixture, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  }
}
