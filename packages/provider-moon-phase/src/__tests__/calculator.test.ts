/**
 * Moon Phase Calculator Tests
 *
 * Verifies the Meeus-based lunar phase calculator against known
 * astronomical dates. Tolerances account for the mean synodic month
 * approximation (real lunar months vary by ~13 hours).
 *
 * Framework: Jest
 * Run: npm test -- --testPathPattern=calculator
 */

import { calculateMoonPhase, getPhaseProgress } from '../calculator';

describe('Moon Phase Calculator', () => {
  describe('calculateMoonPhase', () => {
    // Known astronomical events (UTC)
    // Source: US Naval Observatory / timeanddate.com
    const KNOWN_PHASES = [
      // 2024-01-11 11:57 UTC — New Moon
      { date: new Date('2024-01-11T11:57:00Z'), expectedPhase: 'new_moon' as const, expectedWaxing: true },
      // 2024-01-18 03:52 UTC — First Quarter
      { date: new Date('2024-01-18T03:52:00Z'), expectedPhase: 'first_quarter' as const, expectedWaxing: true },
      // 2024-01-25 17:54 UTC — Full Moon
      { date: new Date('2024-01-25T17:54:00Z'), expectedPhase: 'full_moon' as const, expectedWaxing: false },
      // 2024-02-02 23:18 UTC — Last Quarter
      { date: new Date('2024-02-02T23:18:00Z'), expectedPhase: 'last_quarter' as const, expectedWaxing: false },
      // 2024-02-09 22:59 UTC — New Moon
      { date: new Date('2024-02-09T22:59:00Z'), expectedPhase: 'new_moon' as const, expectedWaxing: true },
      // 2024-08-19 18:26 UTC — Full Moon (Blue Moon)
      { date: new Date('2024-08-19T18:26:00Z'), expectedPhase: 'full_moon' as const, expectedWaxing: false },
      // 2025-01-29 12:36 UTC — New Moon
      { date: new Date('2025-01-29T12:36:00Z'), expectedPhase: 'new_moon' as const, expectedWaxing: true },
    ];

    KNOWN_PHASES.forEach(({ date, expectedPhase, expectedWaxing }) => {
      it(`should identify ${expectedPhase} on ${date.toISOString()}`, () => {
        const result = calculateMoonPhase(date);
        expect(result.phaseName).toBe(expectedPhase);
        expect(result.isWaxing).toBe(expectedWaxing);
      });
    });

    it('should return illumination near 0 at new moon', () => {
      // 2024-01-11 — New Moon
      const result = calculateMoonPhase(new Date('2024-01-11T11:57:00Z'));
      expect(result.illumination).toBeLessThan(0.05);
    });

    it('should return illumination near 1 at full moon', () => {
      // 2024-01-25 — Full Moon
      const result = calculateMoonPhase(new Date('2024-01-25T17:54:00Z'));
      expect(result.illumination).toBeGreaterThan(0.95);
    });

    it('should return illumination near 0.5 at first quarter', () => {
      // 2024-01-18 — First Quarter
      const result = calculateMoonPhase(new Date('2024-01-18T03:52:00Z'));
      expect(result.illumination).toBeGreaterThan(0.35);
      expect(result.illumination).toBeLessThan(0.65);
    });

    it('should return phase angle 0-360', () => {
      const result = calculateMoonPhase(new Date());
      expect(result.phaseAngle).toBeGreaterThanOrEqual(0);
      expect(result.phaseAngle).toBeLessThan(360);
    });

    it('should return lunation progress 0-1', () => {
      const result = calculateMoonPhase(new Date());
      expect(result.lunationProgress).toBeGreaterThanOrEqual(0);
      expect(result.lunationProgress).toBeLessThan(1);
    });

    it('should return lunar day 1-30', () => {
      const result = calculateMoonPhase(new Date());
      expect(result.lunarDay).toBeGreaterThanOrEqual(1);
      expect(result.lunarDay).toBeLessThanOrEqual(30);
    });

    it('should return phase index 0-7', () => {
      const result = calculateMoonPhase(new Date());
      expect(result.phaseIndex).toBeGreaterThanOrEqual(0);
      expect(result.phaseIndex).toBeLessThanOrEqual(7);
    });

    it('should produce a full cycle over ~29.5 days', () => {
      const start = new Date('2024-01-11T12:00:00Z'); // New Moon
      const phases = new Set<string>();

      // Sample every ~3.7 days across one lunation
      for (let i = 0; i < 8; i++) {
        const date = new Date(start.getTime() + i * 3.69 * 24 * 60 * 60 * 1000);
        const result = calculateMoonPhase(date);
        phases.add(result.phaseName);
      }

      // Should have hit all 8 phases
      expect(phases.size).toBe(8);
    });

    it('waxing phases should have increasing illumination', () => {
      const start = new Date('2024-01-11T12:00:00Z'); // New Moon
      let prevIllumination = 0;

      // Check first 4 phases (waxing: new → full)
      for (let day = 1; day <= 14; day += 3) {
        const date = new Date(start.getTime() + day * 24 * 60 * 60 * 1000);
        const result = calculateMoonPhase(date);
        expect(result.illumination).toBeGreaterThanOrEqual(prevIllumination);
        prevIllumination = result.illumination;
      }
    });
  });

  describe('getPhaseProgress', () => {
    it('should return 0 at the start of a phase', () => {
      // Start of waxing_crescent: progress = 0.0625
      expect(getPhaseProgress(0.0625)).toBeCloseTo(0, 1);
    });

    it('should return ~0.5 at the middle of a phase', () => {
      // Middle of waxing_crescent: (0.0625 + 0.1875) / 2 = 0.125
      expect(getPhaseProgress(0.125)).toBeCloseTo(0.5, 1);
    });

    it('should return close to 1 near the end of a phase', () => {
      // Near end of waxing_crescent: 0.1874
      expect(getPhaseProgress(0.1874)).toBeGreaterThan(0.9);
    });

    it('should return 0-1 for any lunation progress', () => {
      for (let p = 0; p < 1; p += 0.05) {
        const progress = getPhaseProgress(p);
        expect(progress).toBeGreaterThanOrEqual(0);
        expect(progress).toBeLessThanOrEqual(1);
      }
    });
  });
});
