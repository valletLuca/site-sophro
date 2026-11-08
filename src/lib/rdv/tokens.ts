import { createHmac, timingSafeEqual } from 'node:crypto';

export type TokenPurpose = 'cancel' | 'decide';

export function appSecret(): string {
  const secret = process.env.APP_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') throw new Error('APP_SECRET manquant');
  return 'secret-de-developpement';
}

export function hmac(value: string): string {
  return createHmac('sha256', appSecret()).update(value).digest('base64url');
}

export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function signToken(purpose: TokenPurpose, id: string): string {
  return `${id}.${hmac(`${purpose}:${id}`)}`;
}

/** Renvoie l'identifiant de la demande, ou null si le jeton est invalide. */
export function verifyToken(purpose: TokenPurpose, token: string): string | null {
  const [id, signature, extra] = token.split('.');
  if (!id || !signature || extra !== undefined) return null;
  return safeEqual(signature, hmac(`${purpose}:${id}`)) ? id : null;
}
