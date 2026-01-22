import type { SituationData, LocationPrecision } from '@iching-kt/core';

/** Earthly Branch names for the 12 double-hours */
export type EarthlyBranch =
  | 'zi'   // 子 Rat     23:00-01:00
  | 'chou' // 丑 Ox      01:00-03:00
  | 'yin'  // 寅 Tiger   03:00-05:00
  | 'mao'  // 卯 Rabbit  05:00-07:00
  | 'chen' // 辰 Dragon  07:00-09:00
  | 'si'   // 巳 Snake   09:00-11:00
  | 'wu'   // 午 Horse   11:00-13:00
  | 'wei'  // 未 Goat    13:00-15:00
  | 'shen' // 申 Monkey  15:00-17:00
  | 'you'  // 酉 Rooster 17:00-19:00
  | 'xu'   // 戌 Dog     19:00-21:00
  | 'hai'; // 亥 Pig     21:00-23:00

/** Shichen (double-hour) data with hexagram correlation */
export interface ShichenData {
  /** Shichen index (0-11, where 0 = Zi/Rat hour starting at solar 23:00) */
  index: number;
  /** Earthly Branch name */
  branch: EarthlyBranch;
  /** Corresponding Sovereign Hexagram number (1-64) */
  hexagramNumber: number;
  /** Progress through current shichen (0.0 to 1.0) */
  progress: number;
  /** Minutes until next shichen transition */
  minutesToNext: number;
}

/** Solar time data emitted by SolarTimeProvider */
export interface SolarTimeData extends SituationData {
  type: 'solar-time';

  /** Civil clock time (with timezone/DST as reported by device) */
  civilTime: Date;

  /** True local solar time */
  solarTime: Date;

  /** Offset from civil time in minutes (positive = solar ahead of civil) */
  solarOffsetMinutes: number;

  /** Precision of the solar time calculation */
  precision: LocationPrecision;

  /** Current shichen (double-hour) based on solar time */
  shichen: ShichenData;

  /** Longitude used for calculation */
  longitude: number;

  /** Civil time hour (0-23) */
  hour: number;

  /** Civil time minute (0-59) */
  minute: number;

  /** Solar time hour (0-23) */
  solarHour: number;

  /** Solar time minute (0-59) */
  solarMinute: number;

  // Legacy compatibility with @iching-kt/provider-time
  /** Earthly branch for current shichen */
  earthlyBranch: EarthlyBranch;

  /** Earthly branch index (0-11) */
  earthlyBranchIndex: number;

  /** Progress through current shichen (0.0 to 1.0) */
  branchProgress: number;
}
