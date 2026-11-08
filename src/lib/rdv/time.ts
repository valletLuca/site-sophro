const ZONE = 'Europe/Paris';

const partsFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: ZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** Date et heure telles qu'on les lit à Paris. */
export function parisParts(instant: Date) {
  const p = Object.fromEntries(partsFormatter.formatToParts(instant).map((x) => [x.type, x.value]));
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    time: `${p.hour}:${p.minute}`,
    month: `${p.year}-${p.month}`,
    dayOfMonth: Number(p.day),
    isoDay: isoDayOf(`${p.year}-${p.month}-${p.day}`),
    utcEquivalent: Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second),
  };
}

/** 1 = lundi … 7 = dimanche, pour une date 'YYYY-MM-DD'. */
export function isoDayOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay() || 7;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Convertit une heure de Paris en instant, changement d'heure compris. */
export function parisToUtc(date: string, time: string): Date {
  const wallClock = Date.parse(`${date}T${time}:00Z`);
  const offset = (instant: number) => parisParts(new Date(instant)).utcEquivalent - instant;
  const firstGuess = wallClock - offset(wallClock);
  return new Date(wallClock - offset(firstGuess));
}

export function weekBounds(instant: Date): { start: Date; end: Date } {
  const { date, isoDay } = parisParts(instant);
  const monday = addDays(date, 1 - isoDay);
  return { start: parisToUtc(monday, '00:00'), end: parisToUtc(addDays(monday, 7), '00:00') };
}

/** « 9h00 » */
export function formatTimeFr(instant: Date): string {
  return parisParts(instant).time.replace(/^0/, '').replace(':', 'h');
}

/** « lundi 9 novembre 2026 » */
export function formatDateFr(instant: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { timeZone: ZONE, dateStyle: 'full' }).format(instant);
}

/** « lundi 9 novembre 2026 à 9h00 » */
export function formatSlotFr(instant: Date): string {
  return `${formatDateFr(instant)} à ${formatTimeFr(instant)}`;
}
