import { cookies, headers } from 'next/headers';
import { getDb } from './db';
import { hitRateLimit } from './ratelimit';
import { clientIp } from './request';
import { hmac, safeEqual } from './tokens';

const COOKIE = 'rdv_admin';
const SESSION_HOURS = 12;
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60_000;

export function createSessionValue(now: Date): string {
  const expires = String(now.getTime() + SESSION_HOURS * 3600_000);
  return `${expires}.${hmac(`admin:${expires}`)}`;
}

export function isValidSession(value: string | undefined, now: Date): boolean {
  const [expires, signature] = (value ?? '').split('.');
  if (!expires || !signature) return false;
  return safeEqual(signature, hmac(`admin:${expires}`)) && Number(expires) > now.getTime();
}

export async function isAdmin(): Promise<boolean> {
  return isValidSession((await cookies()).get(COOKIE)?.value, new Date());
}

export type LoginResult = 'ok' | 'wrong' | 'limited';

export async function login(password: string): Promise<LoginResult> {
  const now = new Date();
  const db = await getDb();
  if (!(await hitRateLimit(db, 'login', clientIp(await headers()), MAX_ATTEMPTS, ATTEMPT_WINDOW_MS, now))) return 'limited';
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !safeEqual(hmac(password), hmac(expected))) return 'wrong';
  (await cookies()).set(COOKIE, createSessionValue(now), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  });
  return 'ok';
}

export async function logout(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
