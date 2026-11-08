import type { Db } from './db';
import { daysOfMonth, hasEnoughNotice, openMonths, slotEnd, slotsForDay } from './slots';
import { addDays, formatTimeFr, parisToUtc } from './time';

export type SlotState = 'free' | 'pending' | 'reserved' | 'unavailable';

export interface PublicSlot {
  start: string;
  label: string;
  state: SlotState;
}

export interface MonthAvailability {
  month: string;
  openMonths: string[];
  days: { date: string; slots: PublicSlot[] }[];
}

/** Renvoie uniquement des heures et des états : aucune donnée personnelle ne sort d'ici. */
export async function getMonthAvailability(db: Db, month: string, now: Date): Promise<MonthAvailability | null> {
  const open = openMonths(now);
  if (!open.includes(month)) return null;

  const dates = daysOfMonth(month);
  const from = parisToUtc(dates[0], '00:00');
  const to = parisToUtc(addDays(dates[dates.length - 1], 1), '00:00');

  const bookings = await db.query<{ slot_start: Date; status: string; expires_at: Date | null }>(
    `SELECT slot_start, status, expires_at FROM bookings
     WHERE slot_start >= $1 AND slot_start < $2 AND status IN ('pending', 'accepted')`,
    [from, to],
  );
  const blocks = await db.query<{ start_at: Date; end_at: Date }>(
    'SELECT start_at, end_at FROM blocks WHERE start_at < $1 AND end_at > $2', [to, from],
  );

  const stateByStart = new Map<number, SlotState>();
  for (const b of bookings) {
    if (b.status === 'accepted') stateByStart.set(b.slot_start.getTime(), 'reserved');
    else if (b.expires_at! > now) stateByStart.set(b.slot_start.getTime(), 'pending');
  }

  const stateOf = (slot: Date): SlotState => {
    if (!hasEnoughNotice(slot, now)) return 'unavailable';
    if (blocks.some((b) => b.start_at < slotEnd(slot) && b.end_at > slot)) return 'reserved';
    return stateByStart.get(slot.getTime()) ?? 'free';
  };

  return {
    month,
    openMonths: open,
    days: dates.map((date) => ({
      date,
      slots: slotsForDay(date).map((slot) => ({
        start: slot.toISOString(),
        label: formatTimeFr(slot),
        state: stateOf(slot),
      })),
    })),
  };
}
