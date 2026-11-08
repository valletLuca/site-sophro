import { NextResponse } from 'next/server';
import { createBooking } from '@/lib/rdv/bookings';
import { getDb } from '@/lib/rdv/db';
import { hitRateLimit } from '@/lib/rdv/ratelimit';
import { clientIp } from '@/lib/rdv/request';
import { parseBooking } from '@/lib/rdv/validation';

export const dynamic = 'force-dynamic';

const MAX_PER_HOUR = 5;

const STATUS_BY_REASON = { unbookable: 409, taken: 409, mail_failed: 503 } as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'invalid' }, { status: 400 });

  // Champ piège : un robot croit avoir réussi, mais rien n'est enregistré.
  if ((body as { website?: unknown }).website) return NextResponse.json({ status: 'pending' }, { status: 201 });

  const parsed = parseBooking(body);
  if (!parsed.ok) return NextResponse.json({ error: 'invalid', fields: parsed.fields }, { status: 422 });

  const db = await getDb();
  const now = new Date();
  if (!(await hitRateLimit(db, 'booking', clientIp(request.headers), MAX_PER_HOUR, 3600_000, now))) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const result = await createBooking(db, parsed.data, now);
  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: STATUS_BY_REASON[result.reason] });
  return NextResponse.json({ status: 'pending' }, { status: 201 });
}
