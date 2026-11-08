import type { Db } from './db';

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_start timestamptz NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'accepted', 'refused', 'expired', 'cancelled')),
    source text NOT NULL CHECK (source IN ('web', 'phone')),
    session_type text NOT NULL,
    location text,
    party_size integer NOT NULL,
    first_name text,
    last_name text,
    phone text,
    email text,
    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz,
    decided_at timestamptz,
    reminder_sent_at timestamptz,
    expiry_handled_at timestamptz
  )`,
  // Garantie centrale : au plus une demande ou un RDV actif par créneau.
  `CREATE UNIQUE INDEX IF NOT EXISTS bookings_one_active_per_slot
    ON bookings (slot_start) WHERE status IN ('pending', 'accepted')`,
  `CREATE INDEX IF NOT EXISTS bookings_slot ON bookings (slot_start)`,
  `CREATE TABLE IF NOT EXISTS blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    start_at timestamptz NOT NULL,
    end_at timestamptz NOT NULL CHECK (end_at > start_at),
    label text NOT NULL DEFAULT ''
  )`,
  `CREATE TABLE IF NOT EXISTS waitlist (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_start timestamptz NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (slot_start, email)
  )`,
  `CREATE TABLE IF NOT EXISTS rate_limits (
    key text NOT NULL,
    at timestamptz NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS rate_limits_key_at ON rate_limits (key, at)`,
];

export async function applySchema(db: Db): Promise<void> {
  for (const statement of STATEMENTS) await db.query(statement);
}
