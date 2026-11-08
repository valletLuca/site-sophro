import { MIN_NOTICE_HOURS, NEXT_MONTH_OPENS_ON_DAY, SLOT_MINUTES, WEEKLY_GRID } from './config';
import { isoDayOf, parisParts, parisToUtc } from './time';

export function slotEnd(start: Date): Date {
  return new Date(start.getTime() + SLOT_MINUTES * 60_000);
}

export function slotsForDay(date: string): Date[] {
  return (WEEKLY_GRID[isoDayOf(date)] ?? []).map((time) => parisToUtc(date, time));
}

export function isGridSlot(instant: Date): boolean {
  const { date, time } = parisParts(instant);
  const grid = WEEKLY_GRID[isoDayOf(date)] ?? [];
  return grid.includes(time) && instant.getUTCSeconds() === 0 && instant.getUTCMilliseconds() === 0;
}

function nextMonth(month: string): string {
  const [year, m] = month.split('-').map(Number);
  return m === 12 ? `${year + 1}-01` : `${year}-${String(m + 1).padStart(2, '0')}`;
}

/** Mois ouverts à la réservation, du plus proche au plus lointain. */
export function openMonths(now: Date): string[] {
  const { month, dayOfMonth } = parisParts(now);
  return dayOfMonth >= NEXT_MONTH_OPENS_ON_DAY ? [month, nextMonth(month)] : [month];
}

export function hasEnoughNotice(slot: Date, now: Date): boolean {
  return slot.getTime() - now.getTime() >= MIN_NOTICE_HOURS * 3600_000;
}

export function isBookable(slot: Date, now: Date): boolean {
  return isGridSlot(slot) && hasEnoughNotice(slot, now) && openMonths(now).includes(parisParts(slot).month);
}

export function daysOfMonth(month: string): string[] {
  const [year, m] = month.split('-').map(Number);
  const count = new Date(Date.UTC(year, m, 0)).getUTCDate();
  return Array.from({ length: count }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
}
