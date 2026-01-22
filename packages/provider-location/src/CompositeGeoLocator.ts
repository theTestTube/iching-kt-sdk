import type { GeoLocator, GeoPosition, GeoLocatorStatus, LocationPermissionState } from '@iching-kt/core';

/**
 * CompositeGeoLocator - Coordinates multiple locators
 *
 * Selects the best available locator based on permission state and precision.
 * Falls back gracefully from GPS → Network → Timezone.
 */

export interface CompositeGeoLocatorConfig {
  locators: GeoLocator[];
}

export function createCompositeGeoLocator(config: CompositeGeoLocatorConfig): GeoLocator {
  const { locators } = config;
  const listeners = new Set<(position: GeoPosition) => void>();
  const unsubscribers = new Map<string, () => void>();
  let currentPosition: GeoPosition | null = null;
  let currentBestLocatorId: string | null = null;
  let reevaluationInterval: ReturnType<typeof setInterval> | null = null;

  function getBestLocator(): GeoLocator {
    // Try to find a locator with granted permission, highest precision first
    const sortedByPrecision = [...locators].sort((a, b) => {
      const precisionOrder = { high: 3, medium: 2, low: 1 };
      return precisionOrder[b.maxPrecision] - precisionOrder[a.maxPrecision];
    });

    for (const locator of sortedByPrecision) {
      const status = locator.getStatus();
      if (status.permissionState === 'granted' && status.isAvailable) {
        return locator;
      }
    }

    // Fallback to the lowest precision locator (should always work)
    return sortedByPrecision[sortedByPrecision.length - 1];
  }

  function subscribeToLocator(locator: GeoLocator): void {
    if (unsubscribers.has(locator.id)) {
      return; // Already subscribed
    }

    const unsubscribe = locator.subscribe((position) => {
      currentPosition = position;
      listeners.forEach(cb => cb(position));
    });

    unsubscribers.set(locator.id, unsubscribe);
  }

  function unsubscribeFromLocator(locator: GeoLocator): void {
    const unsubscribe = unsubscribers.get(locator.id);
    if (unsubscribe) {
      unsubscribe();
      unsubscribers.delete(locator.id);
    }
  }

  function updateSubscriptions(): void {
    const bestLocator = getBestLocator();

    // Check if best locator changed
    if (currentBestLocatorId !== bestLocator.id) {
      // Unsubscribe from all locators except the best one
      for (const locator of locators) {
        if (locator.id !== bestLocator.id) {
          unsubscribeFromLocator(locator);
        }
      }

      // Subscribe to the best locator
      subscribeToLocator(bestLocator);
      currentBestLocatorId = bestLocator.id;
    }
  }

  function startReevaluationInterval(): void {
    if (reevaluationInterval) return;

    // Re-evaluate best locator every 500ms
    // This handles async permission checks completing after initial subscription
    reevaluationInterval = setInterval(() => {
      if (listeners.size > 0) {
        updateSubscriptions();
      }
    }, 500);
  }

  function stopReevaluationInterval(): void {
    if (reevaluationInterval) {
      clearInterval(reevaluationInterval);
      reevaluationInterval = null;
    }
  }

  // Get the highest precision locator (for permission requests)
  function getHighestPrecisionLocator(): GeoLocator {
    return locators.reduce((best, current) => {
      const precisionOrder = { high: 3, medium: 2, low: 1 };
      return precisionOrder[current.maxPrecision] > precisionOrder[best.maxPrecision]
        ? current
        : best;
    });
  }

  return {
    id: 'composite',
    name: 'Composite GeoLocator',
    maxPrecision: 'high', // Maximum possible precision from available locators

    /** Current cached position (exposed for sync access by providers) */
    get currentPosition() {
      return currentPosition;
    },

    getStatus(): GeoLocatorStatus {
      const bestLocator = getBestLocator();
      const bestStatus = bestLocator.getStatus();

      // Return the permission state of the HIGHEST precision locator (GPS)
      // so the UI knows if we can request better precision
      const highestPrecisionLocator = getHighestPrecisionLocator();
      const highestStatus = highestPrecisionLocator.getStatus();

      return {
        permissionState: highestStatus.permissionState,
        isAvailable: highestStatus.isAvailable,
        currentPrecision: bestStatus.currentPrecision,
      };
    },

    async requestPermission(): Promise<LocationPermissionState> {
      // Request permission from the highest precision locator
      const highestPrecisionLocator = getHighestPrecisionLocator();
      const result = await highestPrecisionLocator.requestPermission();

      // Update subscriptions based on new permission state
      if (listeners.size > 0) {
        updateSubscriptions();
      }

      return result;
    },

    async getCurrentPosition(): Promise<GeoPosition> {
      const bestLocator = getBestLocator();
      return bestLocator.getCurrentPosition();
    },

    subscribe(callback: (position: GeoPosition) => void): () => void {
      listeners.add(callback);

      // Provide current position immediately if available
      if (currentPosition) {
        callback(currentPosition);
      }

      // Update subscriptions when first listener is added
      if (listeners.size === 1) {
        updateSubscriptions();
        startReevaluationInterval();
      }

      return () => {
        listeners.delete(callback);
        if (listeners.size === 0) {
          // Unsubscribe from all locators when no more listeners
          for (const locator of locators) {
            unsubscribeFromLocator(locator);
          }
          stopReevaluationInterval();
          currentBestLocatorId = null;
        }
      };
    },

    dispose(): void {
      listeners.clear();
      stopReevaluationInterval();
      currentBestLocatorId = null;
      for (const locator of locators) {
        unsubscribeFromLocator(locator);
        locator.dispose();
      }
    },
  };
}
