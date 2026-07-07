/**
 * solarTimeDataAt — pure situation-at-timestamp function (#67).
 *
 * Computes the SolarTimeData the provider would emit at an arbitrary civil
 * time from a fixed position, with no clock or I/O. Pin-time "time adoption"
 * relies on this to recompute a frozen hours snapshot at the last-message time.
 *
 * Solar time is derived from the civil clock's LOCAL hours and timezone offset,
 * so these fixtures pin the runtime timezone to UTC (verified deterministic).
 * Under UTC the timezone central meridian is 0°, so the solar offset is simply
 * longitude × 4 minutes and solar hours equal UTC hours (+ that offset).
 *
 * Framework: Vitest (globals)
 */
process.env.TZ = 'UTC';

import type { GeoPosition } from '@iching-kt/core';
import { solarTimeDataAt } from '../provider';

const at = (longitude: number, precision: GeoPosition['precision']): GeoPosition => ({
  longitude,
  latitude: 0,
  precision,
  timestamp: new Date(0),
});

describe('solarTimeDataAt', () => {
  it('emits solar == civil at the prime meridian (no longitude offset)', () => {
    const data = solarTimeDataAt(at(0, 'high'), new Date('2020-06-21T12:00:00Z'));

    expect(data.type).toBe('solar-time');
    expect(data.longitude).toBe(0);
    expect(data.precision).toBe('high');
    expect(data.solarOffsetMinutes).toBe(0);
    expect(data.hour).toBe(12);
    expect(data.minute).toBe(0);
    expect(data.solarHour).toBe(12);
    expect(data.solarMinute).toBe(0);
    // Solar 12:00 → Wu (Horse) double-hour, Sovereign Hexagram #44 Gou.
    expect(data.shichen.branch).toBe('wu');
    expect(data.shichen.index).toBe(6);
    expect(data.shichen.hexagramNumber).toBe(44);
    expect(data.earthlyBranch).toBe('wu');
  });

  it('advances solar time by 4 minutes per degree east of the meridian', () => {
    // 120°E → +480 min (8h) of solar offset; civil 00:00 UTC → solar 08:00.
    const data = solarTimeDataAt(at(120, 'high'), new Date('2020-01-01T00:00:00Z'));

    expect(data.solarOffsetMinutes).toBe(480);
    expect(data.hour).toBe(0);
    expect(data.solarHour).toBe(8);
    expect(data.solarMinute).toBe(0);
    // Solar 08:00 → Chen (Dragon) double-hour, Sovereign Hexagram #43 Guai.
    expect(data.shichen.branch).toBe('chen');
    expect(data.shichen.index).toBe(4);
    expect(data.shichen.hexagramNumber).toBe(43);
  });

  it('falls back to a timezone-estimated longitude when position is missing', () => {
    // Under UTC the estimate resolves to 0° longitude at low precision.
    const data = solarTimeDataAt(null, new Date('2020-06-21T12:00:00Z'));

    expect(data.longitude).toBeCloseTo(0); // ±0 estimate at UTC's 0° meridian
    expect(data.precision).toBe('low');
    expect(data.solarOffsetMinutes).toBe(0);
    expect(data.solarHour).toBe(12);
  });

  it('is deterministic — same inputs yield an identical snapshot', () => {
    const civil = new Date('2021-03-15T09:30:00Z');
    const a = solarTimeDataAt(at(-58.4, 'high'), civil);
    const b = solarTimeDataAt(at(-58.4, 'high'), civil);
    expect(a).toEqual(b);
  });
});
