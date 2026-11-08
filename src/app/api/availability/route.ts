import { NextResponse } from 'next/server';
import { getMonthAvailability } from '@/lib/rdv/availability';
import { getDb } from '@/lib/rdv/db';
import { openMonths } from '@/lib/rdv/slots';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const now = new Date();
  const month = new URL(request.url).searchParams.get('month') ?? openMonths(now)[0];
  const availability = await getMonthAvailability(await getDb(), month, now);
  if (!availability) return NextResponse.json({ error: 'month_closed' }, { status: 404 });
  return NextResponse.json(availability, { headers: { 'Cache-Control': 'no-store' } });
}
