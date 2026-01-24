import { SituationProvider } from '@iching-kt/core';

// I-Ching uses 12 double-hours (shi chen), each 2 hours
// Starting at 23:00 (Zi hour) through the day
const EARTHLY_BRANCHES = [
  'zi',    // 子 23:00-01:00 Rat
  'chou',  // 丑 01:00-03:00 Ox
  'yin',   // 寅 03:00-05:00 Tiger
  'mao',   // 卯 05:00-07:00 Rabbit
  'chen',  // 辰 07:00-09:00 Dragon
  'si',    // 巳 09:00-11:00 Snake
  'wu',    // 午 11:00-13:00 Horse
  'wei',   // 未 13:00-15:00 Goat
  'shen',  // 申 15:00-17:00 Monkey
  'you',   // 酉 17:00-19:00 Rooster
  'xu',    // 戌 19:00-21:00 Dog
  'hai',   // 亥 21:00-23:00 Pig
] as const;

export type EarthlyBranch = (typeof EARTHLY_BRANCHES)[number];

export interface TimeData {
  hour: number;
  minute: number;
  earthlyBranch: EarthlyBranch;
  earthlyBranchIndex: number;
  // Progress within current double-hour (0-1)
  branchProgress: number;
  [key: string]: unknown;
}

function getEarthlyBranchIndex(hour: number): number {
  // Zi hour starts at 23:00
  const adjustedHour = (hour + 1) % 24;
  return Math.floor(adjustedHour / 2);
}

function getBranchProgress(hour: number, minute: number): number {
  const adjustedHour = (hour + 1) % 24;
  const hourInBranch = adjustedHour % 2;
  return (hourInBranch * 60 + minute) / 120;
}

function getCurrentTimeData(): TimeData {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const branchIndex = getEarthlyBranchIndex(hour);

  return {
    hour,
    minute,
    earthlyBranch: EARTHLY_BRANCHES[branchIndex],
    earthlyBranchIndex: branchIndex,
    branchProgress: getBranchProgress(hour, minute),
  };
}

export function createTimeProvider(): SituationProvider<TimeData> {
  let currentData = getCurrentTimeData();
  const listeners = new Set<(data: TimeData) => void>();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const updateData = () => {
    currentData = getCurrentTimeData();
    listeners.forEach((cb) => cb(currentData));
  };

  /**
   * Calculate milliseconds until next minute boundary.
   * Aligns updates to minute changes for better power efficiency.
   */
  const getMillisecondsToNextMinute = (): number => {
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();
    const msUntilNextMinute = secondsUntilNextMinute * 1000 - now.getMilliseconds();
    return msUntilNextMinute + 100; // Small buffer to ensure past minute boundary
  };

  const scheduleNextUpdate = () => {
    if (timeoutId || listeners.size === 0) return;

    const delay = getMillisecondsToNextMinute();
    timeoutId = setTimeout(() => {
      timeoutId = null;
      updateData();
      // Schedule next update at the next minute boundary
      scheduleNextUpdate();
    }, delay);
  };

  return {
    id: 'time',
    name: 'Time',
    subscribe(callback) {
      listeners.add(callback);
      if (listeners.size === 1) {
        scheduleNextUpdate(); // Smart timing aligned to minute boundaries
      }
      return () => {
        listeners.delete(callback);
        if (listeners.size === 0 && timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };
    },
    getCurrentData() {
      return currentData;
    },
  };
}

export { EARTHLY_BRANCHES };
