import type { Day } from '@/data/trip';
import { computeBlockTimes } from './schedule';

export type Now = { dateISO: string; minutes: number };

/**
 * Get the current time. If `override` is provided (e.g. from a `?now=` query
 * param), use that instead of the real clock. The override can be a full ISO
 * string like `2026-04-26T14:00` or a date-and-time in local format.
 */
export function getNow(override?: string | null): Now {
  const d = override ? new Date(override) : new Date();
  if (isNaN(d.getTime())) return getNow(null);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return {
    dateISO: `${yyyy}-${mm}-${dd}`,
    minutes: d.getHours() * 60 + d.getMinutes(),
  };
}

export type ActiveBlock = {
  day: Day;
  blockIndex: number;
  blockStart: number;
  blockEnd: number;
};

/**
 * Find the schedule block that contains `now`, if any. Returns null when the
 * current date isn't a trip day or the time falls outside any block.
 */
export function findActiveBlock(days: Day[], now: Now): ActiveBlock | null {
  const day = days.find((d) => d.dateISO === now.dateISO);
  if (!day) return null;
  const times = computeBlockTimes(day);
  const idx = times.findIndex((t) => now.minutes >= t.start && now.minutes < t.end);
  if (idx < 0) return null;
  return {
    day,
    blockIndex: idx,
    blockStart: times[idx].start,
    blockEnd: times[idx].end,
  };
}
