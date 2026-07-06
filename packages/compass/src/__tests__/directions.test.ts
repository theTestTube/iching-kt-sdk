import { describe, it, expect } from 'vitest';
import { COMPASS_DIRECTIONS, getDirectionForHeading } from '../directions';

describe('COMPASS_DIRECTIONS', () => {
  it('has 8 directions', () => {
    expect(COMPASS_DIRECTIONS).toHaveLength(8);
  });

  it('bearings are 0, 45, 90, ..., 315', () => {
    const bearings = COMPASS_DIRECTIONS.map((d) => d.bearing);
    expect(bearings).toEqual([0, 45, 90, 135, 180, 225, 270, 315]);
  });

  it('maps Later Heaven Bagua correctly', () => {
    const expected = [
      { bearing: 0,   trigramId: 'water',    hexagramNumber: 29 },
      { bearing: 45,  trigramId: 'mountain', hexagramNumber: 52 },
      { bearing: 90,  trigramId: 'thunder',  hexagramNumber: 51 },
      { bearing: 135, trigramId: 'wind',     hexagramNumber: 57 },
      { bearing: 180, trigramId: 'fire',     hexagramNumber: 30 },
      { bearing: 225, trigramId: 'earth',    hexagramNumber: 2  },
      { bearing: 270, trigramId: 'lake',     hexagramNumber: 58 },
      { bearing: 315, trigramId: 'heaven',   hexagramNumber: 1  },
    ];
    for (const { bearing, trigramId, hexagramNumber } of expected) {
      const dir = COMPASS_DIRECTIONS.find((d) => d.bearing === bearing)!;
      expect(dir.trigramId).toBe(trigramId);
      expect(dir.hexagramNumber).toBe(hexagramNumber);
    }
  });

  it('all directions have en/es/zh names', () => {
    for (const dir of COMPASS_DIRECTIONS) {
      expect(dir.names.en).toBeTruthy();
      expect(dir.names.es).toBeTruthy();
      expect(dir.names.zh).toBeTruthy();
    }
  });
});

describe('getDirectionForHeading', () => {
  it('0° → N (water)', () => {
    expect(getDirectionForHeading(0).trigramId).toBe('water');
  });

  it('45° → NE (mountain)', () => {
    expect(getDirectionForHeading(45).trigramId).toBe('mountain');
  });

  it('90° → E (thunder)', () => {
    expect(getDirectionForHeading(90).trigramId).toBe('thunder');
  });

  it('180° → S (fire)', () => {
    expect(getDirectionForHeading(180).trigramId).toBe('fire');
  });

  it('270° → W (lake)', () => {
    expect(getDirectionForHeading(270).trigramId).toBe('lake');
  });

  it('315° → NW (heaven)', () => {
    expect(getDirectionForHeading(315).trigramId).toBe('heaven');
  });

  it('359° → N (water, wraps around)', () => {
    expect(getDirectionForHeading(359).trigramId).toBe('water');
  });

  it('360° → N (water, normalizes)', () => {
    expect(getDirectionForHeading(360).trigramId).toBe('water');
  });

  it('22° stays N (within ±22.5° of 0°)', () => {
    expect(getDirectionForHeading(22).trigramId).toBe('water');
  });

  it('23° snaps to NE (beyond 22.5° boundary)', () => {
    expect(getDirectionForHeading(23).trigramId).toBe('mountain');
  });

  it('handles negative heading', () => {
    expect(getDirectionForHeading(-45).trigramId).toBe('heaven'); // 315°
  });
});
