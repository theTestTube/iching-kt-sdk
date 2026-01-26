import type { SituationProvider, GeoLocator, GeoPosition } from '@iching-kt/core';
import type { SolarTimeData } from './types';
import { calculateTrueSolarTime, getShichenFromSolarTime } from './calculator';

/**
 * SolarTimeProvider - Provides true local solar time based on user location
 *
 * Combines:
 * - GeoLocator position updates (longitude)
 * - Timer for regular time updates
 *
 * Emits: SolarTimeData with dual times (civil + solar), precision, shichen
 */

export interface SolarTimeProviderConfig {
  geoLocator: GeoLocator;
  updateIntervalMs?: number; // Default: 60000 (1 minute)
}

function getCurrentSolarTimeData(
  geoLocator: GeoLocator,
  civilTime: Date
): SolarTimeData {
  // Get current position from geoLocator
  let position: GeoPosition | null | undefined = geoLocator.currentPosition;

  if (!position) {
    // Fallback: estimate longitude from timezone offset
    const offsetMinutes = -civilTime.getTimezoneOffset();
    const longitude = (offsetMinutes / 60) * 15;
    position = {
      longitude,
      latitude: 0,
      precision: 'low',
      timestamp: civilTime,
    };
  }

  // Calculate solar time
  const { solarTime, offsetMinutes } = calculateTrueSolarTime(
    civilTime,
    position.longitude
  );

  // Get shichen data
  const shichen = getShichenFromSolarTime(solarTime);

  return {
    type: 'solar-time',
    civilTime,
    solarTime,
    solarOffsetMinutes: offsetMinutes,
    precision: position.precision,
    shichen,
    longitude: position.longitude,
    hour: civilTime.getHours(),
    minute: civilTime.getMinutes(),
    solarHour: solarTime.getHours(),
    solarMinute: solarTime.getMinutes(),
    // Legacy compatibility
    earthlyBranch: shichen.branch,
    earthlyBranchIndex: shichen.index,
    branchProgress: shichen.progress,
  };
}

export function createSolarTimeProvider(
  config: SolarTimeProviderConfig
): SituationProvider<SolarTimeData> {
  const { geoLocator, updateIntervalMs = 60000 } = config;

  let currentData = getCurrentSolarTimeData(geoLocator, new Date());
  const listeners = new Set<(data: SolarTimeData) => void>();
  let timeTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let geoUnsubscribe: (() => void) | null = null;

  const updateData = () => {
    currentData = getCurrentSolarTimeData(geoLocator, new Date());
    listeners.forEach((cb) => cb(currentData));
  };

  /**
   * Calculate milliseconds until next minute boundary.
   * This creates idle periods by aligning updates to minute changes,
   * allowing Android to enter low-power states between updates.
   */
  const getMillisecondsToNextMinute = (): number => {
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();
    const msUntilNextMinute = secondsUntilNextMinute * 1000 - now.getMilliseconds();
    // Add small buffer (100ms) to ensure we're past the minute boundary
    return msUntilNextMinute + 100;
  };

  const scheduleNextUpdate = () => {
    if (timeTimeoutId) return; // Already scheduled

    const delay = getMillisecondsToNextMinute();
    timeTimeoutId = setTimeout(() => {
      timeTimeoutId = null;
      updateData();
      // Schedule next update at the next minute boundary
      scheduleNextUpdate();
    }, delay);
  };

  const startUpdates = () => {
    if (timeTimeoutId || geoUnsubscribe) {
      return; // Already started
    }

    // Subscribe to position updates from geoLocator
    geoUnsubscribe = geoLocator.subscribe((position) => {
      // Position changed, recalculate solar time
      updateData();
    });

    // Start smart timing (aligns to minute boundaries)
    scheduleNextUpdate();
  };

  const stopUpdates = () => {
    if (geoUnsubscribe) {
      geoUnsubscribe();
      geoUnsubscribe = null;
    }

    if (timeTimeoutId) {
      clearTimeout(timeTimeoutId);
      timeTimeoutId = null;
    }
  };

  return {
    id: 'solar-time',
    name: 'Solar Time',

    subscribe(callback: (data: SolarTimeData) => void): () => void {
      listeners.add(callback);

      // Start updates when first listener is added
      if (listeners.size === 1) {
        startUpdates();
      }

      // Immediately provide current data
      callback(currentData);

      return () => {
        listeners.delete(callback);

        // Stop updates when last listener is removed
        if (listeners.size === 0) {
          stopUpdates();
        }
      };
    },

    getCurrentData(): SolarTimeData {
      return currentData;
    },
  };
}
