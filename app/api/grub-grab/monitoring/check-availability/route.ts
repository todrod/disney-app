import { NextResponse } from 'next/server';
import { runAvailabilityCheck } from '@/lib/grub-grab/monitoring';

export async function GET() {
  try {
    const summary = await runAvailabilityCheck();
    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Monitoring check failed' },
      { status: 500 }
    );
  }
}
