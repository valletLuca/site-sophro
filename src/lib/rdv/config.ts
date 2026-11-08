/** Toutes les règles modifiables de la prise de rendez-vous sont ici. */

export const SLOT_MINUTES = 60;
export const MIN_NOTICE_HOURS = 24;
export const PENDING_HOURS = 72;
export const REMINDER_BEFORE_EXPIRY_HOURS = 24;
export const CANCEL_NOTICE_HOURS = 24;
export const NEXT_MONTH_OPENS_ON_DAY = 15;
export const RETENTION_DAYS = 30;
export const REASON_MAX_LENGTH = 1000;
export const DUPLICATE_ALERT_THRESHOLD = 2;

/** Clé : jour ISO (1 = lundi, 6 = samedi). Un jour absent est fermé. */
export const WEEKLY_GRID: Record<number, string[]> = {
  1: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
  2: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
  3: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
  4: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
  5: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  6: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
};

/** `online: false` : la séance se réserve uniquement par téléphone. */
export const SESSION_TYPES = {
  individuelle: { label: 'Séance individuelle', min: 1, max: 1, needsLocation: true, online: true },
  enfant_ado: { label: 'Séance enfant/ado', min: 1, max: 1, needsLocation: true, online: true },
  groupe_cabinet: { label: 'Séance en groupe au cabinet', min: 3, max: 6, needsLocation: false, online: false },
  groupe_structure: { label: 'Séance en groupe en structure', min: 2, max: 100, needsLocation: false, online: false },
} as const;

export type SessionType = keyof typeof SESSION_TYPES;
export const SESSION_TYPE_KEYS = Object.keys(SESSION_TYPES) as SessionType[];

export const LOCATIONS = { cabinet: 'Au cabinet', visio: 'En visio' } as const;
export type Location = keyof typeof LOCATIONS;

export function isSessionType(value: unknown): value is SessionType {
  return typeof value === 'string' && value in SESSION_TYPES;
}

export const CONTACT = {
  name: 'Christine Vallet',
  phoneDisplay: '07 81 44 27 33',
  phoneHref: '+33781442733',
  email: 'christinevallet.sophro@gmail.com',
  address: '42 rue du Général Nassoy, 57590 Delme',
};
