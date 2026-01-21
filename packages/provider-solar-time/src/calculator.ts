import type { EarthlyBranch, ShichenData } from './types';

/**
 * Calculate true local solar time from civil time and longitude
 *
 * Formula:
 * 1. Get STANDARD timezone offset (not DST-adjusted)
 * 2. Calculate timezone central meridian: (offsetMinutes / 60) * 15
 * 3. Calculate longitude offset from timezone center
 * 4. Convert longitude offset to time: 4 minutes per degree
 * 5. Apply offset to civil time
 *
 * IMPORTANT: The timezone central meridian is a physical constant and does NOT
 * change with DST. We must use the standard (winter) timezone offset, not the
 * DST-adjusted offset.
 *
 * Example: User at -74° longitude in UTC-5 timezone (EST, not EDT)
 * - Timezone central meridian: (-300 / 60) * 15 = -75°
 * - Longitude offset: -74 - (-75) = +1°
 * - Solar offset: +1 * 4 = +4 minutes
 * - Solar time is 4 minutes ahead of clock time
 */
export function calculateTrueSolarTime(
  civilTime: Date,
  longitude: number
): { solarTime: Date; offsetMinutes: number } {
  // Step 1: Get timezone offset and remove DST adjustment if present
  // getTimezoneOffset() returns the CURRENT offset (includes DST if active)
  const currentOffsetMinutes = -civilTime.getTimezoneOffset();

  // To find the STANDARD offset, we check if DST is likely active by comparing
  // with a known non-DST date. In Northern Hemisphere, DST is roughly March-November.
  // A more reliable approach: check offset on winter date (January 2) and summer date (July 2)
  const testWinterDate = new Date(civilTime.getFullYear(), 0, 2); // January 2
  const testSummerDate = new Date(civilTime.getFullYear(), 6, 2); // July 2

  const winterOffsetMinutes = -testWinterDate.getTimezoneOffset();
  const summerOffsetMinutes = -testSummerDate.getTimezoneOffset();

  // Determine standard offset (the smaller one, which is always standard time)
  const standardOffsetMinutes = Math.min(winterOffsetMinutes, summerOffsetMinutes);

  // Step 2: Calculate timezone central meridian using STANDARD offset
  // This meridian is a physical constant and doesn't change with DST
  const timezoneCentralLongitude = (standardOffsetMinutes / 60) * 15;

  // Step 3: Calculate longitude offset from timezone center
  const longitudeOffset = longitude - timezoneCentralLongitude;

  // Step 4: Convert longitude offset to time offset
  // Earth rotates 360° in 24 hours = 15°/hour = 4 minutes/degree
  const solarOffsetMinutes = longitudeOffset * 4;

  // Step 5: Apply offset to civil time (use the actual current offset to stay in civil time)
  // The solarOffsetMinutes is relative to the timezone's meridian
  const solarTime = new Date(
    civilTime.getTime() + solarOffsetMinutes * 60 * 1000
  );

  return { solarTime, offsetMinutes: solarOffsetMinutes };
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
  const hours = solarTime.getHours();
  const minutes = solarTime.getMinutes();
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
