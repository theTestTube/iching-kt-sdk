import type { GeoLocator, GeoPosition, GeoLocatorStatus, LocationPermissionState, LocationPrecision } from '@iching-kt/core';

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
    options: { accuracy?: number; distanceInterval?: number; timeInterval?: number },
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

/** Determine precision from position accuracy in meters.
 * GPS typically provides 5-30m accuracy → 'high'
 * Network/coarse location provides 100-5000m → 'medium'
 */
function precisionFromAccuracy(accuracyMeters: number | undefined): LocationPrecision {
  if (accuracyMeters === undefined) return 'high'; // No accuracy info, assume best
  return accuracyMeters < 100 ? 'high' : 'medium';
}

export function createGpsGeoLocator(config: GpsGeoLocatorConfig): GeoLocator {
  const { expoLocation } = config;
  const listeners = new Set<(position: GeoPosition) => void>();
  const statusListeners = new Set<(status: GeoLocatorStatus) => void>();
  let watchSubscription: { remove: () => void } | null = null;
  let currentPosition: GeoPosition | null = null;
  let permissionState: LocationPermissionState = 'undetermined';
  let lastEmittedStatus: GeoLocatorStatus | null = null;

  // Helper to emit status change events (only if status actually changed)
  function emitStatusChange(): void {
    const currentStatus = getStatusInternal();

    // Check if status actually changed
    if (lastEmittedStatus) {
      const unchanged =
        lastEmittedStatus.permissionState === currentStatus.permissionState &&
        lastEmittedStatus.isAvailable === currentStatus.isAvailable &&
        lastEmittedStatus.currentPrecision === currentStatus.currentPrecision;

      if (unchanged) {
        return; // Don't emit duplicate events
      }
    }

    lastEmittedStatus = currentStatus;
    statusListeners.forEach(cb => cb(currentStatus));
  }

  // Internal status getter (doesn't trigger events)
  function getStatusInternal(): GeoLocatorStatus {
    // Precision should reflect ACTUAL position data availability, not just permission.
    // Position is valid when:
    // - Watcher is active: position is the best available (coarse locations on
    //   stationary devices update infrequently, but data remains valid)
    // - Watcher is inactive: position is valid for 120s grace period
    //   (covers app backgrounding before watcher cleanup)
    const hasValidPosition =
      currentPosition !== null &&
      (watchSubscription !== null ||
        (Date.now() - currentPosition.timestamp.getTime()) < 120000);

    return {
      permissionState,
      isAvailable: true, // GPS is available on all mobile devices
      currentPrecision: hasValidPosition ? currentPosition.precision : 'low',
    };
  }

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
        // Emit status change event
        emitStatusChange();
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
          timeInterval: 60000, // Throttle to max once per minute (allows CPU idle periods)
        },
        (location) => {
          const accuracy = location.coords.accuracy ?? undefined;
          const position: GeoPosition = {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
            precision: precisionFromAccuracy(accuracy),
            timestamp: new Date(),
            accuracyMeters: accuracy,
          };
          const hadValidPosition = currentPosition !== null;
          currentPosition = position;
          listeners.forEach(cb => cb(position));

          // Emit status change if precision changed (no position -> has position)
          if (!hadValidPosition) {
            emitStatusChange();
          }
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
      return getStatusInternal();
    },

    async refreshStatus(): Promise<void> {
      await refreshPermissionState();
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
          // Emit status change event
          emitStatusChange();
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

        const accuracy = location.coords.accuracy ?? undefined;
        const position: GeoPosition = {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          precision: precisionFromAccuracy(accuracy),
          timestamp: new Date(),
          accuracyMeters: accuracy,
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

    onStatusChange(callback: (status: GeoLocatorStatus) => void): () => void {
      statusListeners.add(callback);

      // Immediately provide current status
      callback(getStatusInternal());

      return () => {
        statusListeners.delete(callback);
      };
    },

    dispose(): void {
      listeners.clear();
      statusListeners.clear();
      stopWatching();
    },
  };
}
