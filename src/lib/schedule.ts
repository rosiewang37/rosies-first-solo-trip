import type { Day } from '@/data/trip';

export type BlockTime = {
  start: number;
  end: number;
};

export function parseTimeString(s: string): number {
  const match = s.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 9 * 60;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const pm = match[3].toUpperCase() === 'PM';
  if (pm && h !== 12) h += 12;
  if (!pm && h === 12) h = 0;
  return h * 60 + m;
}

export function formatTime(minutes: number): string {
  const total = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
}

export function computeBlockTimes(day: Day): BlockTime[] {
  const start = parseTimeString(day.startTime);
  const times: BlockTime[] = [];
  let cursor = start;
  for (const block of day.blocks) {
    times.push({ start: cursor, end: cursor + block.duration });
    cursor += block.duration;
  }
  return times;
}

export function mapsUrl(location: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}
