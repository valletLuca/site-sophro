import { RETENTION_DAYS, REMINDER_BEFORE_EXPIRY_HOURS } from './config';
import { type BookingRow, expireDue } from './bookings';
import type { Db } from './db';
import { mails, trySendMail } from './mail';
import { notifyWaitlistFreed } from './waitlist';

async function handleExpired(db: Db, now: Date) {
  const rows = await db.query<BookingRow>(
    `SELECT * FROM bookings WHERE status = 'expired' AND expiry_handled_at IS NULL`,
  );
  for (const row of rows) {
    if (row.email && !(await trySendMail(mails.expired(row)))) continue;
    await db.query('UPDATE bookings SET expiry_handled_at = $1 WHERE id = $2', [now, row.id]);
    await notifyWaitlistFreed(db, row.slot_start, now);
  }
}

async function sendReminders(db: Db, now: Date) {
  const threshold = new Date(now.getTime() + REMINDER_BEFORE_EXPIRY_HOURS * 3600_000);
  const rows = await db.query<BookingRow>(
    `SELECT * FROM bookings
     WHERE status = 'pending' AND reminder_sent_at IS NULL AND expires_at > $1 AND expires_at <= $2`,
    [now, threshold],
  );
  for (const row of rows) {
    if (await trySendMail(mails.reminderToSophro(row))) {
      await db.query('UPDATE bookings SET reminder_sent_at = $1 WHERE id = $2', [now, row.id]);
    }
  }
}

async function purge(db: Db, now: Date) {
  const limit = new Date(now.getTime() - RETENTION_DAYS * 24 * 3600_000);
  await db.query(
    `UPDATE bookings SET first_name = NULL, last_name = NULL, phone = NULL, email = NULL
     WHERE (status = 'accepted' AND slot_start <= $1)
        OR (status IN ('refused', 'cancelled') AND decided_at <= $1)
        OR (status = 'expired' AND decided_at <= $1 AND expiry_handled_at IS NOT NULL)`,
    [limit],
  );
  await db.query('DELETE FROM waitlist WHERE slot_start <= $1', [now]);
  await db.query('DELETE FROM rate_limits WHERE at <= $1', [new Date(now.getTime() - 24 * 3600_000)]);
}

/** Travail périodique : expirations, rappels et effacement des données. */
export async function runSweep(db: Db, now: Date): Promise<void> {
  await expireDue(db, now);
  await handleExpired(db, now);
  await sendReminders(db, now);
  await purge(db, now);
}
