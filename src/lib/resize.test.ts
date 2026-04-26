import { describe, expect, it } from 'vitest';
import { computeResizedDimensions } from './resize';

describe('computeResizedDimensions', () => {
  it('passes through when source is narrower than max', () => {
    expect(computeResizedDimensions(800, 600, 1600)).toEqual({ width: 800, height: 600 });
  });

  it('passes through when source equals max width', () => {
    expect(computeResizedDimensions(1600, 1200, 1600)).toEqual({ width: 1600, height: 1200 });
  });

  it('scales down preserving aspect ratio', () => {
    expect(computeResizedDimensions(3200, 2400, 1600)).toEqual({ width: 1600, height: 1200 });
  });

  it('rounds height to integer', () => {
    const { width, height } = computeResizedDimensions(4032, 3024, 1600);
    expect(width).toBe(1600);
    expect(Number.isInteger(height)).toBe(true);
    expect(height).toBe(1200);
  });

  it('handles portrait images', () => {
    expect(computeResizedDimensions(2000, 3000, 1000)).toEqual({ width: 1000, height: 1500 });
  });
});
