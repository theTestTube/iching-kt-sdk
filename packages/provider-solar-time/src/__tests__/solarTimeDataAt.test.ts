/**
 * solarTimeDataAt — pure situation-at-timestamp function (#67).
 *
 * Computes the SolarTimeData the provider would emit at an arbitrary civil
 * time from a fixed position, with no clock or I/O. Pin-time "time adoption"
 * relies on this to recompute a frozen hours snapshot at the last-message time.
 *
 * Framework: Vitest (globals)
 */
import type { GeoPosition } from '@iching-kt/core';
import { solarTimeDataAt } from '../provider';

const at = (longitude: number, precision: GeoPosition['precision']): GeoPosition => ({
  longitude,
  latitude: 0,
  precision,
  timestamp: new Date(0),
});

describe('solarTimeDataAt', () => {
  beforeEach(() => {
    vi.stubEnv('TZ', 'UTC');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

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

  it('keeps New York solar time unchanged between winter and DST', () => {
    vi.stubEnv('TZ', 'America/New_York');
    const winter = new Date('2020-01-21T12:00:00Z');
    const summer = new Date('2020-07-21T12:00:00Z');
    expect(winter.getTimezoneOffset()).toBe(300);
    expect(summer.getTimezoneOffset()).toBe(240);

    for (const [instant, civilHour, offset] of [[winter, 7, 4], [summer, 8, -56]] as const) {
      const data = solarTimeDataAt(at(-74, 'high'), instant);
      expect([data.solarHour, data.solarMinute]).toEqual([7, 4]);
      expect([data.hour, data.minute]).toEqual([civilHour, 0]);
      expect(data.solarOffsetMinutes).toBe(offset);
      expect(data.shichen.branch).toBe('chen');
      expect(data.shichen.hexagramNumber).toBe(43);
    }
  });

  it.each(['UTC', 'America/New_York'])(
    'preserves solar dates and shichen boundaries in %s', (timezone) => {
      vi.stubEnv('TZ', timezone);
      const cases = [
        ['2020-07-21T11:55:00Z', -74, '2020-07-21T06:59:00.000Z', 6, 59, 'mao', 34, 119 / 120, 1],
        ['2020-07-21T11:56:00Z', -74, '2020-07-21T07:00:00.000Z', 7, 0, 'chen', 43, 0, 120],
        ['2020-01-01T00:00:00Z', -15, '2019-12-31T23:00:00.000Z', 23, 0, 'zi', 24, 0, 120],
        ['2020-12-31T23:30:00Z', 15, '2021-01-01T00:30:00.000Z', 0, 30, 'zi', 24, 0.75, 30],
      ] as const;

      for (const [instant, longitude, solarDate, hour, minute, branch, hexagram, progress, remaining] of cases) {
        const data = solarTimeDataAt(at(longitude, 'high'), new Date(instant));
        expect(data.solarTime.toISOString()).toBe(solarDate);
        expect([data.solarHour, data.solarMinute]).toEqual([hour, minute]);
        expect(data.shichen.branch).toBe(branch);
        expect(data.shichen.hexagramNumber).toBe(hexagram);
        expect(data.shichen.progress).toBeCloseTo(progress);
        expect(data.shichen.minutesToNext).toBe(remaining);
        expect(data.earthlyBranch).toBe(branch);
        expect(data.earthlyBranchIndex).toBe(data.shichen.index);
        expect(data.branchProgress).toBeCloseTo(progress);
      }
    }
  );

  it('keeps fixed-longitude solar time independent of a stale device timezone offset', () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(300);
    const data = solarTimeDataAt(at(-74, 'high'), new Date('2020-07-21T11:56:00Z'));
    expect([data.solarHour, data.solarMinute]).toEqual([7, 0]);
    expect(data.shichen.branch).toBe('chen');
    expect(data.shichen.hexagramNumber).toBe(43);
  });

  it('is deterministic — same inputs yield an identical snapshot', () => {
    const civil = new Date('2021-03-15T09:30:00Z');
    const a = solarTimeDataAt(at(-58.4, 'high'), civil);
    const b = solarTimeDataAt(at(-58.4, 'high'), civil);
    expect(a).toEqual(b);
  });
});
