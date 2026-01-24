import type { GeoLocator, GeoPosition, GeoLocatorStatus, LocationPermissionState } from '@iching-kt/core';

/**
 * TimezoneGeoLocator - Fallback locator that always works
 *
 * Uses device timezone offset to estimate longitude. This is the lowest precision
 * option but requires no permissions and works everywhere.
 *
 * Formula: longitude = (timezoneOffsetMinutes / 60) * 15
 *
 * Example: UTC-5 (New York) = -300 minutes → (-300 / 60) * 15 = -75° longitude
 */

function getTimezoneBasedLongitude(): number {
  const offsetMinutes = -new Date().getTimezoneOffset();
  return (offsetMinutes / 60) * 15;
}

export function createTimezoneGeoLocator(): GeoLocator {
  const listeners = new Set<(position: GeoPosition) => void>();
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const getCurrentPosition = (): GeoPosition => ({
    longitude: getTimezoneBasedLongitude(),
    latitude: 0, // We don't know latitude from timezone alone
    precision: 'low',
    timestamp: new Date(),
  });

  return {
    id: 'timezone',
    name: 'Timezone Fallback',
    maxPrecision: 'low',

    getStatus(): GeoLocatorStatus {
      return {
        permissionState: 'granted',
        isAvailable: true,
        currentPrecision: 'low',
      };
    },

    requestPermission(): Promise<LocationPermissionState> {
      return Promise.resolve('granted');
    },

    getCurrentPosition(): Promise<GeoPosition> {
      return Promise.resolve(getCurrentPosition());
    },

    subscribe(callback: (position: GeoPosition) => void): () => void {
      listeners.add(callback);

      // Immediately provide current position
      callback(getCurrentPosition());

      // Start checking for timezone changes (rare but possible)
      if (listeners.size === 1) {
        intervalId = setInterval(() => {
          const position = getCurrentPosition();
          listeners.forEach(cb => cb(position));
        }, 60000); // Check every minute
      }

      return () => {
        listeners.delete(callback);
        if (listeners.size === 0 && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };
    },

    onStatusChange(callback: (status: GeoLocatorStatus) => void): () => void {
      // Timezone locator status never changes (always granted, available, low precision)
      // Just provide the current status immediately
      callback({
        permissionState: 'granted',
        isAvailable: true,
        currentPrecision: 'low',
      });

      // Return no-op unsubscribe since status never changes
      return () => {};
    },

    dispose(): void {
      listeners.clear();
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
  };
}
