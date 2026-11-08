import type { Db } from './db';
import { mails, trySendMail } from './mail';
import { hasEnoughNotice } from './slots';

type Entry = { name: string; email: string };

export async function joinWaitlist(
  db: Db, input: { slotStart: Date; name: string; email: string }, now: Date,
): Promise<{ ok: true } | { ok: false; reason: 'not_pending' }> {
  const [pending] = await db.query(
    `SELECT id FROM bookings WHERE slot_start = $1 AND status = 'pending' AND expires_at > $2`,
    [input.slotStart, now],
  );
  if (!pending || !hasEnoughNotice(input.slotStart, now)) return { ok: false, reason: 'not_pending' };
  await db.query(
    'INSERT INTO waitlist (slot_start, name, email) VALUES ($1, $2, $3) ON CONFLICT (slot_start, email) DO NOTHING',
    [input.slotStart, input.name, input.email],
  );
  return { ok: true };
}

const takeEntries = (db: Db, slot: Date) =>
  db.query<Entry>('DELETE FROM waitlist WHERE slot_start = $1 RETURNING name, email', [slot]);

/** Le créneau est de nouveau libre : tous les inscrits sont prévenus en même temps. */
export async function notifyWaitlistFreed(db: Db, slot: Date, now: Date): Promise<void> {
  const entries = await takeEntries(db, slot);
  if (!hasEnoughNotice(slot, now)) return;
  await Promise.all(entries.map((entry) => trySendMail(mails.waitlistFreed(entry, slot))));
}

/** Le créneau est définitivement pris. */
export async function notifyWaitlistTaken(db: Db, slot: Date): Promise<void> {
  const entries = await takeEntries(db, slot);
  await Promise.all(entries.map((entry) => trySendMail(mails.waitlistTaken(entry, slot))));
}
