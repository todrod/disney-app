import { NextRequest, NextResponse } from 'next/server';
import { createAlert } from '@/lib/grub-grab/alert-manager';
import { MealPreference, TimePreference } from '@/types/grub-grab';

interface CreateAlertBody {
  restaurantSlug?: string;
  telegramChatId?: string;
  startDate?: string;
  endDate?: string;
  partySize?: number;
  mealPreference?: MealPreference;
  timePreference?: TimePreference;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateAlertBody;
    const alert = createAlert({
      restaurantSlug: body.restaurantSlug ?? '',
      telegramChatId: body.telegramChatId ?? '',
      startDate: body.startDate ?? '',
      endDate: body.endDate ?? '',
      partySize: Number(body.partySize ?? 2),
      mealPreference: (body.mealPreference ?? 'any') as MealPreference,
      timePreference: (body.timePreference ?? 'any') as TimePreference,
    });

    return NextResponse.json({ ok: true, alert });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unable to create alert' },
      { status: 400 }
    );
  }
}
