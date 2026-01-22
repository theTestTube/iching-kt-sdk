import type { GeoLocator, GeoPosition, GeoLocatorStatus, LocationPermissionState } from '@iching-kt/core';

/**
 * GpsGeoLocator - High precision location using device GPS
 *
 * Uses expo-location to access device GPS hardware. Provides ~10m accuracy
 * (~0.0001° longitude → <1 second solar time difference).
 *
 * Requires foreground location permission.
 */

export interface ExpoLocation {
  requestForegroundPermissionsAsync: () => Promise<{ status: string; canAskAgain?: boolean }>;
  getForegroundPermissionsAsync: () => Promise<{ status: string; canAskAgain?: boolean }>;
  getCurrentPositionAsync: (options?: { accuracy?: number }) => Promise<{
    coords: {
      latitude: number;
      longitude: number;
      accuracy: number | null;
    };
  }>;
  watchPositionAsync: (
    options: { accuracy?: number; distanceInterval?: number },
    callback: (location: { coords: { latitude: number; longitude: number; accuracy: number | null } }) => void
  ) => Promise<{ remove: () => void }>;
  Accuracy: {
    Highest: number;
    High: number;
    Balanced: number;
    Low: number;
  };
}

interface GpsGeoLocatorConfig {
  expoLocation: ExpoLocation;
}

export function createGpsGeoLocator(config: GpsGeoLocatorConfig): GeoLocator {
  const { expoLocation } = config;
  const listeners = new Set<(position: GeoPosition) => void>();
  let watchSubscription: { remove: () => void } | null = null;
  let currentPosition: GeoPosition | null = null;
  let permissionState: LocationPermissionState = 'undetermined';

  // Refresh permission state from OS
  async function refreshPermissionState(): Promise<void> {
    try {
      const { status } = await expoLocation.getForegroundPermissionsAsync();
      const newState = mapExpoPermissionStatus(status);
      if (newState !== permissionState) {
        permissionState = newState;
        // If permission just became granted, start watching
        if (permissionState === 'granted' && listeners.size > 0) {
          startWatching();
        }
        // If permission was revoked, stop watching
        if (permissionState !== 'granted') {
          stopWatching();
          currentPosition = null; // Clear stale position
        }
      }
    } catch (error) {
      console.warn('Failed to get GPS permission status:', error);
    }
  }

  // Initialize permission state on startup
  refreshPermissionState();

  function mapExpoPermissionStatus(status: string): LocationPermissionState {
    switch (status) {
      case 'granted':
        return 'granted';
      case 'denied':
        return 'denied';
      case 'undetermined':
        return 'undetermined';
      default:
        return 'denied';
    }
  }

  async function startWatching(): Promise<void> {
    if (watchSubscription || permissionState !== 'granted') {
      return;
    }

    try {
      watchSubscription = await expoLocation.watchPositionAsync(
        {
          accuracy: expoLocation.Accuracy.High,
          distanceInterval: 100, // Update every 100 meters
        },
        (location) => {
          const position: GeoPosition = {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
            precision: 'high',
            timestamp: new Date(),
            accuracyMeters: location.coords.accuracy ?? undefined,
          };
          currentPosition = position;
          listeners.forEach(cb => cb(position));
        }
      );
    } catch (error) {
      console.warn('Failed to start GPS watching:', error);
    }
  }

  function stopWatching(): void {
    if (watchSubscription) {
      watchSubscription.remove();
      watchSubscription = null;
    }
  }

  return {
    id: 'gps',
    name: 'GPS',
    maxPrecision: 'high',

    getStatus(): GeoLocatorStatus {
      // Precision should reflect ACTUAL position data availability, not just permission
      // BUG FIX: Don't claim 'high' precision until we have a valid, fresh position
      const hasValidPosition =
        currentPosition !== null &&
        (Date.now() - currentPosition.timestamp.getTime()) < 60000; // Position must be < 60s old

      return {
        permissionState,
        isAvailable: true, // GPS is available on all mobile devices
        currentPrecision: hasValidPosition ? 'high' : 'low',
      };
    },

    async requestPermission(): Promise<LocationPermissionState> {
      try {
        const { status } = await expoLocation.requestForegroundPermissionsAsync();
        const newState = mapExpoPermissionStatus(status);
        if (newState !== permissionState) {
          permissionState = newState;
          // If permission just became granted, start watching
          if (permissionState === 'granted' && listeners.size > 0) {
            startWatching();
          }
          // If permission was denied, stop watching
          if (permissionState !== 'granted') {
            stopWatching();
            currentPosition = null;
          }
        }
        return permissionState;
      } catch (error) {
        console.warn('Failed to request GPS permission:', error);
        return 'denied';
      }
    },

    async getCurrentPosition(): Promise<GeoPosition> {
      if (permissionState !== 'granted') {
        throw new Error('GPS permission not granted');
      }

      try {
        const location = await expoLocation.getCurrentPositionAsync({
          accuracy: expoLocation.Accuracy.High,
        });

        const position: GeoPosition = {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          precision: 'high',
          timestamp: new Date(),
          accuracyMeters: location.coords.accuracy ?? undefined,
        };

        currentPosition = position;
        return position;
      } catch (error) {
        console.warn('Failed to get GPS position:', error);
        throw error;
      }
    },

    subscribe(callback: (position: GeoPosition) => void): () => void {
      listeners.add(callback);

      // If we already have a position, provide it immediately
      if (currentPosition) {
        callback(currentPosition);
      }

      // Start watching if this is the first subscriber
      if (listeners.size === 1 && permissionState === 'granted') {
        startWatching();
      }

      return () => {
        listeners.delete(callback);
        if (listeners.size === 0) {
          stopWatching();
        }
      };
    },

    dispose(): void {
      listeners.clear();
      stopWatching();
    },
  };
}
