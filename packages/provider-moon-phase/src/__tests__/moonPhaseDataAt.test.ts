/**
 * moonPhaseDataAt — pure situation-at-timestamp function (#67).
 *
 * Computes the MoonPhaseData the provider would emit for an arbitrary date,
 * with no clock or I/O. Pin-time "time adoption" relies on this to recompute a
 * frozen moon snapshot at the last-message timestamp.
 *
 * Fixtures are pinned to known astronomical events (US Naval Observatory /
 * timeanddate.com). The calculator uses the mean synodic month, so illumination
 * is asserted with a tolerance. Moon phase is derived from UTC (Julian Date),
 * so no timezone pinning is needed.
 *
 * Framework: Vitest (globals)
 */
import { moonPhaseDataAt } from '../provider';

describe('moonPhaseDataAt', () => {
  it('reports a full moon at the 2000-01-21 lunar eclipse', () => {
    const data = moonPhaseDataAt(new Date('2000-01-21T04:40:00Z'));

    expect(data.type).toBe('moon-phase');
    expect(data.phaseName).toBe('full_moon');
    expect(data.phaseIndex).toBe(4);
    expect(data.isWaxing).toBe(false);
    expect(data.illumination).toBeCloseTo(0.999, 2);
    expect(data.lunationProgress).toBeCloseTo(0.489, 2);
    expect(data.lunarDay).toBe(15);
  });

  it('reports a new moon at the 2020-06-21 solar eclipse', () => {
    const data = moonPhaseDataAt(new Date('2020-06-21T12:00:00Z'));

    expect(data.phaseName).toBe('new_moon');
    expect(data.phaseIndex).toBe(0);
    expect(data.isWaxing).toBe(true);
    expect(data.illumination).toBeCloseTo(0, 2);
  });

  it('reports a new moon at the 2024-12-30 new moon', () => {
    const data = moonPhaseDataAt(new Date('2024-12-30T22:27:00Z'));

    expect(data.phaseName).toBe('new_moon');
    expect(data.illumination).toBeCloseTo(0, 2);
  });

  it('is deterministic — same date yields an identical snapshot', () => {
    const date = new Date('2023-08-01T18:00:00Z');
    expect(moonPhaseDataAt(date)).toEqual(moonPhaseDataAt(date));
  });
});
