import type { Day } from '@/data/trip';

export type Pin = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  city: 'boston' | 'nyc';
};

function cityFor(day: Day): 'boston' | 'nyc' {
  // Boston-side days: day.city starts with "Boston" or equals "Travel" (day4 starts in Boston).
  // NYC-side days: day.city starts with "NYC" or "NYC →".
  // day4 ("Travel") ends in NYC and its checked pins are NYC-coordinates; classify by dateISO instead.
  const iso = day.dateISO;
  return iso <= '2026-04-27' ? 'boston' : 'nyc';
}

export function getCheckedPins(days: Day[], checks: Record<string, boolean>): Pin[] {
  const pins: Pin[] = [];
  for (const day of days) {
    const city = cityFor(day);
    for (const block of day.blocks) {
      if (block.locations) {
        for (const loc of block.locations) {
          const id = `${block.id}:${loc.address}`;
          if (checks[id]) pins.push({ id, name: loc.name, address: loc.address, lat: loc.lat, lng: loc.lng, city });
        }
      }
      if (block.eating) {
        for (const r of block.eating.picks) {
          const id = `${block.id}:${r.address}`;
          if (checks[id]) pins.push({ id, name: r.name, address: r.address, lat: r.lat, lng: r.lng, city });
        }
      }
    }
    if (day.optionalVisits) {
      for (const loc of day.optionalVisits) {
        const id = `${day.id}:opt:${loc.address}`;
        if (checks[id]) pins.push({ id, name: loc.name, address: loc.address, lat: loc.lat, lng: loc.lng, city });
      }
    }
  }
  return pins;
}
