import type { Db } from './db';
import { hmac } from './tokens';

/** Renvoie false si le maximum est atteint. L'adresse IP n'est jamais stockée en clair. */
export async function hitRateLimit(
  db: Db, scope: string, subject: string, max: number, windowMs: number, now: Date,
): Promise<boolean> {
  const key = `${scope}:${hmac(subject)}`;
  const since = new Date(now.getTime() - windowMs);
  const [{ count }] = await db.query<{ count: number }>(
    'SELECT count(*)::int AS count FROM rate_limits WHERE key = $1 AND at > $2', [key, since],
  );
  if (count >= max) return false;
  await db.query('INSERT INTO rate_limits (key, at) VALUES ($1, $2)', [key, now]);
  return true;
}
