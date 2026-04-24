import { describe, expect, it } from 'vitest';
import { mapsUrl, parseTimeString, formatTime, computeBlockTimes } from './schedule';
import type { Day } from '@/data/trip';

describe('mapsUrl', () => {
  it('encodes spaces and commas into a single-address query', () => {
    const url = mapsUrl('63 Salem St, Boston, MA');
    expect(url).toBe(
      'https://www.google.com/maps/search/?api=1&query=63%20Salem%20St%2C%20Boston%2C%20MA',
    );
  });

  it('encodes ampersands and pound signs', () => {
    const url = mapsUrl('Broadway & Morris St, New York, NY');
    expect(url).toContain('%26');
  });

  it('round-trips address content through the query param', () => {
    const address = "Mike's Pastry, 300 Hanover St";
    const url = mapsUrl(address);
    const encoded = url.split('query=')[1];
    expect(decodeURIComponent(encoded)).toBe(address);
  });
});

describe('parseTimeString', () => {
  it('parses standard times', () => {
    expect(parseTimeString('9:00 AM')).toBe(9 * 60);
    expect(parseTimeString('1:30 PM')).toBe(13 * 60 + 30);
    expect(parseTimeString('12:00 PM')).toBe(12 * 60);
    expect(parseTimeString('12:30 AM')).toBe(30);
  });

  it('falls back to 9 AM on garbage input', () => {
    expect(parseTimeString('not a time')).toBe(9 * 60);
  });
});

describe('formatTime', () => {
  it('round-trips common times', () => {
    expect(formatTime(parseTimeString('9:00 AM'))).toBe('9:00 AM');
    expect(formatTime(parseTimeString('1:30 PM'))).toBe('1:30 PM');
    expect(formatTime(parseTimeString('12:00 AM'))).toBe('12:00 AM');
  });
});

describe('computeBlockTimes', () => {
  it('accumulates durations from start time', () => {
    const day: Day = {
      id: 'x',
      label: '',
      title: '',
      date: '',
      dateISO: '2026-04-25',
      city: '',
      startTime: '9:00 AM',
      blocks: [
        { id: 'a', kind: 'activity', duration: 30, title: '', details: '', type: 'normal', tags: [] },
        { id: 'b', kind: 'activity', duration: 60, title: '', details: '', type: 'normal', tags: [] },
      ],
      recommendations: [],
    };
    const times = computeBlockTimes(day);
    expect(times[0]).toEqual({ start: 9 * 60, end: 9 * 60 + 30 });
    expect(times[1]).toEqual({ start: 9 * 60 + 30, end: 9 * 60 + 90 });
  });
});
