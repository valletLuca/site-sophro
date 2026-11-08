import { CANCEL_NOTICE_HOURS, PENDING_HOURS } from './config';
import type { Db } from './db';
import { type MailBooking, mails, sendMail, trySendMail } from './mail';
import { isBookable, slotEnd } from './slots';
import { weekBounds } from './time';
import type { BookingInput } from './validation';
import { notifyWaitlistFreed, notifyWaitlistTaken } from './waitlist';

export type BookingStatus = 'pending' | 'accepted' | 'refused' | 'expired' | 'cancelled';

export interface BookingRow extends MailBooking {
  status: BookingStatus;
  source: 'web' | 'phone';
  created_at: Date;
  expires_at: Date | null;
}

class MailFailed extends Error {}

/** Passe en « expiré » les demandes dont le délai est dépassé. Les mails partent au balayage. */
export async function expireDue(db: Db, now: Date): Promise<void> {
  await db.query(
    `UPDATE bookings SET status = 'expired', decided_at = $1 WHERE status = 'pending' AND expires_at <= $1`,
    [now],
  );
}

export async function isBlocked(db: Db, slot: Date): Promise<boolean> {
  const rows = await db.query('SELECT 1 FROM blocks WHERE start_at < $1 AND end_at > $2 LIMIT 1', [slotEnd(slot), slot]);
  return rows.length > 0;
}

/** Nombre de demandes et RDV actifs de la personne dans la semaine (lundi-dimanche) du créneau. */
export async function countWeekBookings(
  db: Db, who: { email: string | null; phone: string | null }, slot: Date, now: Date,
): Promise<number> {
  const { start, end } = weekBounds(slot);
  const [{ count }] = await db.query<{ count: number }>(
    `SELECT count(*)::int AS count FROM bookings
     WHERE slot_start >= $1 AND slot_start < $2 AND (email = $3 OR phone = $4)
       AND (status = 'accepted' OR (status = 'pending' AND expires_at > $5))`,
    [start, end, who.email, who.phone, now],
  );
  return count;
}

export async function getBooking(db: Db, id: string): Promise<BookingRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db.query<BookingRow>('SELECT * FROM bookings WHERE id = $1', [id]);
  return row ?? null;
}

export type CreateResult = { ok: true; id: string } | { ok: false; reason: 'unbookable' | 'taken' | 'mail_failed' };

export async function createBooking(db: Db, input: BookingInput, now: Date): Promise<CreateResult> {
  if (!isBookable(input.slotStart, now)) return { ok: false, reason: 'unbookable' };
  const expiresAt = new Date(Math.min(now.getTime() + PENDING_HOURS * 3600_000, input.slotStart.getTime()));

  let booking: BookingRow;
  try {
    const created = await db.tx(async (tx) => {
      await expireDue(tx, now);
      if (await isBlocked(tx, input.slotStart)) return null;
      const [row] = await tx.query<BookingRow>(
        `INSERT INTO bookings (slot_start, status, source, session_type, location, party_size,
           first_name, last_name, phone, email, created_at, expires_at)
         VALUES ($1, 'pending', 'web', $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (slot_start) WHERE status IN ('pending', 'accepted') DO NOTHING
         RETURNING *`,
        [input.slotStart, input.sessionType, input.location, input.partySize,
          input.firstName, input.lastName, input.phone, input.email, now, expiresAt],
      );
      if (!row) return null;
      const duplicates = await countWeekBookings(tx, row, input.slotStart, now);
      // Le motif n'existe que dans ce mail : sans lui, la demande n'a pas lieu d'être.
      try {
        await sendMail(mails.requestToSophro(row, input.reason, duplicates));
      } catch {
        throw new MailFailed();
      }
      return row;
    });
    if (!created) return { ok: false, reason: 'taken' };
    booking = created;
  } catch (error) {
    if (error instanceof MailFailed) return { ok: false, reason: 'mail_failed' };
    throw error;
  }

  await trySendMail(mails.requestToClient(booking));
  return { ok: true, id: booking.id };
}

export type DecideResult = { ok: true; mailed: boolean } | { ok: false; reason: 'not_pending' };

export async function decideBooking(
  db: Db, id: string, decision: 'accept' | 'refuse', options: { message?: string }, now: Date,
): Promise<DecideResult> {
  const [row] = await db.query<BookingRow>(
    `UPDATE bookings SET status = $1, decided_at = $2
     WHERE id = $3 AND status = 'pending' AND expires_at > $2 RETURNING *`,
    [decision === 'accept' ? 'accepted' : 'refused', now, id],
  );
  if (!row) return { ok: false, reason: 'not_pending' };

  if (decision === 'accept') {
    const mailed = await trySendMail(mails.accepted(row));
    await notifyWaitlistTaken(db, row.slot_start);
    return { ok: true, mailed };
  }
  const mailed = await trySendMail(mails.refused(row, options.message?.trim() || undefined));
  await notifyWaitlistFreed(db, row.slot_start, now);
  return { ok: true, mailed };
}

export type CancelResult = { ok: true; mailed: boolean } | { ok: false; reason: 'not_active' | 'too_late' };

export async function cancelBooking(db: Db, id: string, by: 'client' | 'admin', now: Date): Promise<CancelResult> {
  const before = await getBooking(db, id);
  const active = before && (before.status === 'accepted'
    || (before.status === 'pending' && before.expires_at! > now));
  if (!active) return { ok: false, reason: 'not_active' };

  const latest = new Date(before.slot_start.getTime() - CANCEL_NOTICE_HOURS * 3600_000);
  if (by === 'client' && now > latest) return { ok: false, reason: 'too_late' };

  const [row] = await db.query<BookingRow>(
    `UPDATE bookings SET status = 'cancelled', decided_at = $1
     WHERE id = $2 AND status IN ('pending', 'accepted') RETURNING *`,
    [now, id],
  );
  if (!row) return { ok: false, reason: 'not_active' };

  let mailed = true;
  if (by === 'client') mailed = await trySendMail(mails.cancelledByClient(row));
  else if (row.email) mailed = await trySendMail(mails.cancelledByAdmin(row));

  if (before.status === 'pending') await notifyWaitlistFreed(db, row.slot_start, now);
  return { ok: true, mailed };
}
