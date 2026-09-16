import type { EarthlyBranch, ShichenData } from './types';

/**
 * Calculate mean solar wall time as UTC + longitude × 4 minutes.
 * The returned Date encodes solar calendar fields in UTC; read it with UTC
 * getters, not local getters. No equation-of-time correction is applied.
 * Only offsetMinutes (relative to device-reported civil time) uses timezone data.
 */
export function calculateTrueSolarTime(
  civilTime: Date,
  longitude: number
): { solarTime: Date; offsetMinutes: number } {
  const longitudeOffsetMinutes = longitude * 4;
  const solarTime = new Date(civilTime.getTime() + longitudeOffsetMinutes * 60_000);
  const offsetMinutes = longitudeOffsetMinutes + civilTime.getTimezoneOffset();

  return { solarTime, offsetMinutes };
}

/**
 * Earthly Branches in order (Zi = 0, Chou = 1, etc.)
 */
const EARTHLY_BRANCHES: EarthlyBranch[] = [
  'zi', 'chou', 'yin', 'mao', 'chen', 'si',
  'wu', 'wei', 'shen', 'you', 'xu', 'hai',
];

/**
 * Twelve Sovereign Hexagrams (消息卦, xiaoxigua) correlated with shichen
 *
 * These hexagrams represent the waxing and waning of yin-yang energy:
 * - Zi (23:00-01:00): #24 Fu (Return) - Yang returns at midnight
 * - Wu (11:00-13:00): #44 Gou (Encounter) - Yin emerges at noon
 */
const SOVEREIGN_HEXAGRAMS: number[] = [
  24, // Zi: Fu (Return)
  19, // Chou: Lin (Approach)
  11, // Yin: Tai (Peace)
  34, // Mao: Dazhuang (Great Power)
  43, // Chen: Guai (Breakthrough)
  1,  // Si: Qian (Creative)
  44, // Wu: Gou (Encounter)
  33, // Wei: Dun (Retreat)
  12, // Shen: Pi (Standstill)
  20, // You: Guan (Contemplation)
  23, // Xu: Bo (Splitting Apart)
  2,  // Hai: Kun (Receptive)
];

/**
 * Get shichen (double-hour) data from solar time
 *
 * Shichen system:
 * - 12 periods of 2 hours each
 * - Zi hour starts at 23:00 (not midnight!)
 * - Each shichen corresponds to an Earthly Branch and Sovereign Hexagram
 */
export function getShichenFromSolarTime(solarTime: Date): ShichenData {
  const hours = solarTime.getUTCHours();
  const minutes = solarTime.getUTCMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Adjust for Zi hour starting at 23:00 instead of 00:00
  // Add 60 minutes to shift the cycle
  const adjustedMinutes = (totalMinutes + 60) % (24 * 60);

  // Each shichen is 120 minutes (2 hours)
  const shichenIndex = Math.floor(adjustedMinutes / 120);

  // Progress within current shichen (0.0 to 1.0)
  const progress = (adjustedMinutes % 120) / 120;

  // Minutes until next shichen
  const minutesToNext = 120 - (adjustedMinutes % 120);

  return {
    index: shichenIndex,
    branch: EARTHLY_BRANCHES[shichenIndex],
    hexagramNumber: SOVEREIGN_HEXAGRAMS[shichenIndex],
    progress,
    minutesToNext,
  };
}
