import { describe, expect, it } from 'vitest';
import { getCheckedPins } from './pins';
import type { Day } from '@/data/trip';

function makeDay(overrides: Partial<Day>): Day {
  return {
    id: 'day1',
    label: '',
    title: '',
    date: '',
    dateISO: '2026-04-25',
    city: 'Boston',
    startTime: '9:00 AM',
    blocks: [],
    recommendations: [],
    ...overrides,
  };
}

describe('getCheckedPins', () => {
  it('returns nothing when no checks are set', () => {
    const day = makeDay({
      blocks: [
        {
          id: 'b1',
          kind: 'activity',
          duration: 30,
          title: '',
          details: '',
          type: 'normal',
          tags: [],
          locations: [{ name: 'X', address: '1 Main St', lat: 42, lng: -71 }],
        },
      ],
    });
    expect(getCheckedPins([day], {})).toEqual([]);
  });

  it('includes a location only when its sub-checkbox is set', () => {
    const day = makeDay({
      blocks: [
        {
          id: 'b1',
          kind: 'activity',
          duration: 30,
          title: '',
          details: '',
          type: 'normal',
          tags: [],
          locations: [
            { name: 'X', address: '1 Main St', lat: 42.1, lng: -71.1 },
            { name: 'Y', address: '2 Main St', lat: 42.2, lng: -71.2 },
          ],
        },
      ],
    });
    const pins = getCheckedPins([day], { 'b1:1 Main St': true });
    expect(pins).toHaveLength(1);
    expect(pins[0].name).toBe('X');
    expect(pins[0].city).toBe('boston');
  });

  it('walks eat-block picks', () => {
    const day = makeDay({
      blocks: [
        {
          id: 'b1',
          kind: 'eat',
          duration: 60,
          title: '',
          details: '',
          type: 'normal',
          tags: [],
          eating: {
            area: 'North End',
            areaCenter: { lat: 42.36, lng: -71.05 },
            picks: [
              { name: 'Neptune', address: '63 Salem St', lat: 42.36, lng: -71.05, why: '' },
            ],
          },
        },
      ],
    });
    const pins = getCheckedPins([day], { 'b1:63 Salem St': true });
    expect(pins.map((p) => p.name)).toEqual(['Neptune']);
  });

  it('walks optional visits with the opt: prefix', () => {
    const day = makeDay({
      optionalVisits: [{ name: 'Library', address: '700 Boylston St', lat: 42.34, lng: -71.07 }],
    });
    const pins = getCheckedPins([day], { 'day1:opt:700 Boylston St': true });
    expect(pins).toHaveLength(1);
    expect(pins[0].id).toBe('day1:opt:700 Boylston St');
  });

  it('classifies NYC days by dateISO after 2026-04-27', () => {
    const boston = makeDay({
      id: 'day3',
      dateISO: '2026-04-27',
      optionalVisits: [{ name: 'A', address: 'A addr', lat: 42, lng: -71 }],
    });
    const nyc = makeDay({
      id: 'day5',
      dateISO: '2026-04-29',
      city: 'NYC',
      optionalVisits: [{ name: 'B', address: 'B addr', lat: 40, lng: -74 }],
    });
    const pins = getCheckedPins([boston, nyc], {
      'day3:opt:A addr': true,
      'day5:opt:B addr': true,
    });
    const cityByName = Object.fromEntries(pins.map((p) => [p.name, p.city]));
    expect(cityByName).toEqual({ A: 'boston', B: 'nyc' });
  });
});
