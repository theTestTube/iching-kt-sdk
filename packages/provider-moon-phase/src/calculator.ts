/**
 * Moon Phase Calculator
 *
 * Based on Jean Meeus, "Astronomical Algorithms" (public domain method).
 * Calculates lunar phase from date using the synodic month approximation.
 *
 * The algorithm uses a known new moon epoch and the mean synodic month
 * (29.53058770576 days) to determine the current lunation progress.
 */

import { MoonPhaseCalculation, MoonPhaseId, PHASE_BOUNDARIES } from './types';

/** Mean synodic month in days (new moon to new moon) */
const SYNODIC_MONTH = 29.53058770576;

/**
 * Known new moon epoch: January 6, 2000 18:14 UTC
 * (Julian Date 2451550.26)
 * Source: Meeus, Astronomical Algorithms
 */
const KNOWN_NEW_MOON_JD = 2451550.26;

/** Convert a Date to Julian Date */
function dateToJD(date: Date): number {
  const time = date.getTime();
  // Unix epoch (Jan 1 1970 00:00 UTC) = JD 2440587.5
  return time / 86400000 + 2440587.5;
}

/**
 * Calculate the lunation progress for a given date.
 * Returns a value from 0 to 1, where:
 *   0 = new moon
 *   0.25 = first quarter
 *   0.5 = full moon
 *   0.75 = last quarter
 */
function getLunationProgress(date: Date): number {
  const jd = dateToJD(date);
  const daysSinceKnown = jd - KNOWN_NEW_MOON_JD;
  const lunations = daysSinceKnown / SYNODIC_MONTH;
  // Get fractional part (0-1 representing progress through current lunation)
  return ((lunations % 1) + 1) % 1;
}

/**
 * Determine the moon phase from lunation progress.
 * Divides the synodic month into 8 equal phases.
 */
function getPhaseFromProgress(progress: number): { phaseName: MoonPhaseId; phaseIndex: number } {
  // Handle wrap-around: progress near 1.0 is still new_moon
  if (progress >= 0.9375) {
    return { phaseName: 'new_moon', phaseIndex: 0 };
  }

  for (let i = 0; i < PHASE_BOUNDARIES.length; i++) {
    const boundary = PHASE_BOUNDARIES[i];
    if (progress >= boundary.start && progress < boundary.end) {
      return { phaseName: boundary.id, phaseIndex: i };
    }
  }

  // Fallback (should not reach here)
  return { phaseName: 'new_moon', phaseIndex: 0 };
}

/**
 * Calculate illumination from lunation progress.
 * Uses cosine approximation for the illuminated fraction.
 */
function getIllumination(progress: number): number {
  // Illumination follows a cosine curve:
  // 0 at new moon (progress=0), 1 at full moon (progress=0.5)
  return (1 - Math.cos(2 * Math.PI * progress)) / 2;
}

/**
 * Calculate moon phase data for a given date.
 *
 * @param date - The date to calculate the moon phase for
 * @returns MoonPhaseCalculation with phase angle, illumination, phase name, etc.
 */
export function calculateMoonPhase(date: Date): MoonPhaseCalculation {
  const lunationProgress = getLunationProgress(date);
  const { phaseName, phaseIndex } = getPhaseFromProgress(lunationProgress);
  const illumination = getIllumination(lunationProgress);
  const phaseAngle = lunationProgress * 360;
  const lunarDay = Math.floor(lunationProgress * 30) + 1;
  // Waxing = phases 0-3 (new moon through waxing gibbous)
  // Waning = phases 4-7 (full moon through waning crescent)
  const isWaxing = phaseIndex < 4;

  return {
    phaseAngle,
    illumination,
    phaseName,
    phaseIndex,
    lunationProgress,
    lunarDay: Math.min(lunarDay, 30),
    isWaxing,
  };
}

/**
 * Calculate progress within the current phase (0-1).
 * Used by the UI for the phase progress bar.
 */
export function getPhaseProgress(lunationProgress: number): number {
  // Handle wrap-around for new_moon at end of cycle
  const effectiveProgress = lunationProgress >= 0.9375
    ? lunationProgress - 0.9375
    : lunationProgress;

  const phaseWidth = 0.125; // Each phase is 1/8 of the cycle

  if (lunationProgress >= 0.9375) {
    // Last portion of new moon phase (0.9375 to 1.0 maps to 0.5 to 1.0 of the phase)
    // First portion (0.0 to 0.0625) maps to 0.0 to 0.5
    return (lunationProgress - 0.9375) / phaseWidth;
  }

  for (const boundary of PHASE_BOUNDARIES) {
    if (lunationProgress >= boundary.start && lunationProgress < boundary.end) {
      return (lunationProgress - boundary.start) / (boundary.end - boundary.start);
    }
  }

  return 0;
}
