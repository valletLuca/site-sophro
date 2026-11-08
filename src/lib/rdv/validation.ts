import { z } from 'zod';
import {
  type Location, REASON_MAX_LENGTH, type SessionType, SESSION_TYPES, SESSION_TYPE_KEYS,
} from './config';

export interface BookingInput {
  slotStart: Date;
  sessionType: SessionType;
  location: Location | null;
  partySize: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  reason: string;
}

const REQUIRED = 'Ce champ est obligatoire.';
const singleLine = (max: number) =>
  z.string({ error: REQUIRED }).trim().min(1, REQUIRED).max(max, 'Ce texte est trop long.')
    .regex(/^[^\r\n]*$/, 'Ce champ est invalide.');

export function normalizePhone(raw: string): string {
  const compact = raw.replace(/[\s.\-()]/g, '').replace(/^00/, '+');
  return compact.startsWith('+33') ? `0${compact.slice(3)}` : compact;
}

const phone = z.string({ error: REQUIRED }).trim().min(1, REQUIRED).transform(normalizePhone)
  .refine((v) => /^0[1-9]\d{8}$/.test(v) || /^\+[1-9]\d{7,14}$/.test(v), 'Numéro de téléphone invalide.');

const email = z.string({ error: REQUIRED }).trim().toLowerCase().min(1, REQUIRED)
  .pipe(z.email('Adresse mail invalide.').max(200, 'Adresse mail invalide.'));

const slotStart = z.iso.datetime({ error: 'Créneau invalide.' }).transform((v) => new Date(v));

const schema = z.object({
  slotStart,
  sessionType: z.enum(SESSION_TYPE_KEYS, { error: 'Choisissez un type de séance.' }),
  location: z.unknown().optional(),
  partySize: z.unknown().optional(),
  firstName: singleLine(80),
  lastName: singleLine(80),
  phone,
  email,
  reason: z.string({ error: REQUIRED }).trim().min(1, REQUIRED)
    .max(REASON_MAX_LENGTH, `${REASON_MAX_LENGTH} caractères maximum.`),
  consent: z.literal(true, { error: 'Votre accord est nécessaire pour envoyer la demande.' }),
}).superRefine((value, ctx) => {
  const rule = SESSION_TYPES[value.sessionType];
  if (!rule.online) {
    ctx.addIssue({ code: 'custom', path: ['sessionType'], message: 'Pour les groupes, merci de prendre rendez-vous par téléphone.' });
    return;
  }
  if (rule.needsLocation && value.location !== 'cabinet' && value.location !== 'visio') {
    ctx.addIssue({ code: 'custom', path: ['location'], message: 'Choisissez cabinet ou visio.' });
  }
  if (rule.max > 1) {
    const size = Number(value.partySize);
    if (!Number.isInteger(size) || size < rule.min || size > rule.max) {
      ctx.addIssue({ code: 'custom', path: ['partySize'], message: `Entre ${rule.min} et ${rule.max} personnes.` });
    }
  }
});

export type ParseResult<T> = { ok: true; data: T } | { ok: false; fields: Record<string, string> };

function fieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) fields[String(issue.path[0] ?? 'form')] ??= issue.message;
  return fields;
}

export function parseBooking(body: unknown): ParseResult<BookingInput> {
  const parsed = schema.safeParse(body);
  if (!parsed.success) return { ok: false, fields: fieldErrors(parsed.error) };
  const { sessionType, location, partySize, slotStart: start, firstName, lastName, phone: tel, email: mail, reason } = parsed.data;
  const rule = SESSION_TYPES[sessionType];
  return {
    ok: true,
    data: {
      slotStart: start,
      sessionType,
      location: rule.needsLocation ? (location as Location) : null,
      partySize: rule.max > 1 ? Number(partySize) : 1,
      firstName,
      lastName,
      phone: tel,
      email: mail,
      reason,
    },
  };
}

const waitlistSchema = z.object({ slotStart, name: singleLine(160), email });

export function parseWaitlist(body: unknown): ParseResult<z.output<typeof waitlistSchema>> {
  const parsed = waitlistSchema.safeParse(body);
  return parsed.success ? { ok: true, data: parsed.data } : { ok: false, fields: fieldErrors(parsed.error) };
}
