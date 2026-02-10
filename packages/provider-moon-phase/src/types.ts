import type { SituationData } from '@iching-kt/core';

/** The 8 moon phases based on the Cantong qi system */
export type MoonPhaseId =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

/** Raw astronomical moon phase calculation result */
export interface MoonPhaseCalculation {
  /** Phase angle in degrees (0-360). 0 = new moon, 180 = full moon */
  phaseAngle: number;
  /** Illumination fraction (0-1). 0 = new moon, 1 = full moon */
  illumination: number;
  /** Phase name (one of 8 phases) */
  phaseName: MoonPhaseId;
  /** Phase index (0-7) */
  phaseIndex: number;
  /** Lunation progress (0-1). 0 = new moon, 0.5 = full moon */
  lunationProgress: number;
  /** Approximate lunar day (1-30) */
  lunarDay: number;
  /** Whether the moon is waxing (getting brighter) */
  isWaxing: boolean;
}

/** Data emitted by the moon-phase situation provider */
export interface MoonPhaseData extends SituationData {
  type: 'moon-phase';
  /** Phase name (one of 8 phases) */
  phaseName: MoonPhaseId;
  /** Phase index (0-7) */
  phaseIndex: number;
  /** Illumination fraction (0-1) */
  illumination: number;
  /** Lunation progress (0-1). Full synodic cycle */
  lunationProgress: number;
  /** Approximate lunar day (1-30) */
  lunarDay: number;
  /** Whether the moon is waxing */
  isWaxing: boolean;
  /** Progress within the current phase (0-1) */
  phaseProgress: number;
}

/** Phase boundaries as fractions of the synodic month */
export const PHASE_BOUNDARIES: { id: MoonPhaseId; start: number; end: number }[] = [
  { id: 'new_moon',         start: 0,       end: 0.0625 },
  { id: 'waxing_crescent',  start: 0.0625,  end: 0.1875 },
  { id: 'first_quarter',    start: 0.1875,  end: 0.3125 },
  { id: 'waxing_gibbous',   start: 0.3125,  end: 0.4375 },
  { id: 'full_moon',        start: 0.4375,  end: 0.5625 },
  { id: 'waning_gibbous',   start: 0.5625,  end: 0.6875 },
  { id: 'last_quarter',     start: 0.6875,  end: 0.8125 },
  { id: 'waning_crescent',  start: 0.8125,  end: 0.9375 },
];

/** Order of phases for navigation */
export const PHASE_ORDER: MoonPhaseId[] = [
  'new_moon',
  'waxing_crescent',
  'first_quarter',
  'waxing_gibbous',
  'full_moon',
  'waning_gibbous',
  'last_quarter',
  'waning_crescent',
];
