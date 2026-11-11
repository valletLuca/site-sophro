import { type BookingRow, countWeekBookings, expireDue, isBlocked } from './bookings';
import type { Db } from './db';
import { SLOT_MINUTES } from './config';
import { isGridSlot } from './slots';
import { addDays, parisToUtc } from './time';

export type AdminBooking = BookingRow & { duplicates: number };

function withDuplicates(db: Db, rows: BookingRow[], now: Date): Promise<AdminBooking[]> {
  return Promise.all(rows.map(async (row) => ({
    ...row,
    duplicates: row.source === 'web' ? await countWeekBookings(db, row, row.slot_start, now) : 1,
  })));
}

export async function listPending(db: Db, now: Date): Promise<AdminBooking[]> {
  const rows = await db.query<BookingRow>(
    `SELECT * FROM bookings WHERE status = 'pending' AND expires_at > $1 ORDER BY slot_start`, [now],
  );
  return withDuplicates(db, rows, now);
}

export async function listUpcoming(db: Db, now: Date): Promise<AdminBooking[]> {
  const rows = await db.query<BookingRow>(
    `SELECT * FROM bookings WHERE status = 'accepted' AND slot_start > $1 ORDER BY slot_start`, [now],
  );
  return withDuplicates(db, rows, now);
}

export interface BlockRow {
  id: string;
  start_at: Date;
  end_at: Date;
  label: string;
}

export function listBlocks(db: Db, now: Date): Promise<BlockRow[]> {
  return db.query<BlockRow>('SELECT * FROM blocks WHERE end_at > $1 ORDER BY start_at', [now]);
}

export async function deleteBlock(db: Db, id: string): Promise<void> {
  await db.query('DELETE FROM blocks WHERE id = $1', [id]);
}

export interface BlockRange {
  start: Date;
  end: Date;
  label: string;
}

export function findBlockConflicts(db: Db, range: BlockRange, now: Date): Promise<BookingRow[]> {
  return db.query<BookingRow>(
    `SELECT * FROM bookings
     WHERE slot_start < $1 AND slot_start + ($4 * interval '1 minute') > $2
       AND (status = 'accepted' OR (status = 'pending' AND expires_at > $3))
     ORDER BY slot_start`,
    [range.end, range.start, now, SLOT_MINUTES],
  );
}

export interface BlockForm {
  from: string;
  to: string;
  startTime: string;
  endTime: string;
}

const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isTime = (value: string) => /^\d{2}:\d{2}$/.test(value);
const MAX_BLOCK_DAYS = 366;

/**
 * Sans heure : les journées entières, en une plage. Avec une heure de début et/ou de fin :
 * cette plage horaire chaque jour (début absent = minuit, fin absente = minuit suivant).
 */
export function blockRanges(form: BlockForm): { start: Date; end: Date }[] | null {
  const to = form.to || form.from;
  const { from, startTime, endTime } = form;
  if (!isDate(from) || !isDate(to) || to < from) return null;
  if ((startTime && !isTime(startTime)) || (endTime && !isTime(endTime))) return null;
  if (startTime && endTime && endTime <= startTime) return null;

  if (!startTime && !endTime) return [{ start: parisToUtc(from, '00:00'), end: parisToUtc(addDays(to, 1), '00:00') }];

  const ranges = [];
  for (let day = from; day <= to; day = addDays(day, 1)) {
    if (ranges.length >= MAX_BLOCK_DAYS) return null;
    ranges.push({
      start: parisToUtc(day, startTime || '00:00'),
      end: endTime ? parisToUtc(day, endTime) : parisToUtc(addDays(day, 1), '00:00'),
    });
  }
  return ranges;
}

export type BlockResult = { ok: true } | { ok: false; reason: 'conflict'; conflicts: number };

/** Tout ou rien : si une seule plage recouvre une demande ou un RDV, aucune n'est enregistrée. */
export async function createBlocks(
  db: Db, ranges: { start: Date; end: Date }[], label: string, now: Date,
): Promise<BlockResult> {
  return db.tx(async (tx) => {
    let conflicts = 0;
    for (const range of ranges) conflicts += (await findBlockConflicts(tx, { ...range, label }, now)).length;
    if (conflicts > 0) return { ok: false as const, reason: 'conflict' as const, conflicts };
    for (const range of ranges) {
      await tx.query('INSERT INTO blocks (start_at, end_at, label) VALUES ($1, $2, $3)', [range.start, range.end, label]);
    }
    return { ok: true as const };
  });
}

export function createBlock(db: Db, range: BlockRange, now: Date): Promise<BlockResult> {
  return createBlocks(db, [range], range.label, now);
}

export type PhoneResult = { ok: true } | { ok: false; reason: 'not_a_slot' | 'taken' };

export async function addPhoneBooking(
  db: Db, input: { slotStart: Date; name: string; phone?: string }, now: Date,
): Promise<PhoneResult> {
  if (!isGridSlot(input.slotStart)) return { ok: false, reason: 'not_a_slot' };
  return db.tx(async (tx) => {
    await expireDue(tx, now);
    if (await isBlocked(tx, input.slotStart)) return { ok: false as const, reason: 'taken' as const };
    const rows = await tx.query(
      `INSERT INTO bookings (slot_start, status, source, session_type, party_size, last_name, phone, created_at, decided_at)
       VALUES ($1, 'accepted', 'phone', 'individuelle', 1, $2, $3, $4, $4)
       ON CONFLICT (slot_start) WHERE status IN ('pending', 'accepted') DO NOTHING
       RETURNING id`,
      [input.slotStart, input.name, input.phone || null, now],
    );
    return rows.length > 0 ? { ok: true as const } : { ok: false as const, reason: 'taken' as const };
  });
}
