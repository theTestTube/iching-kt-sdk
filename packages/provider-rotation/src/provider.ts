import type { SituationProvider } from '@iching-kt/core';
import type { RotationData, RotationProviderConfig } from './types';

const DEFAULT_UPDATE_INTERVAL_MS = 100;

/**
 * Calculate compass heading (bearing of device top from magnetic north).
 * Assumes phone lying flat in portrait orientation.
 * expo-sensors axes: x = device right, y = device top, z = out of screen.
 * Formula: atan2(-x, y) — not atan2(y, x) which would give device-right as "north".
 */
export function calculateHeading(x: number, y: number): number {
  return (Math.atan2(-x, y) * (180 / Math.PI) + 360) % 360;
}

export function createRotationProvider(
  config: RotationProviderConfig
): SituationProvider<RotationData> {
  const { expoMagnetometer, updateIntervalMs = DEFAULT_UPDATE_INTERVAL_MS } = config;

  let currentData: RotationData = {
    type: 'rotation',
    heading: 0,
    accuracy: 0,
    timestamp: new Date(),
  };

  const listeners = new Set<(data: RotationData) => void>();
  let subscription: { remove: () => void } | null = null;

  const startSensor = () => {
    if (subscription) return;
    expoMagnetometer.setUpdateInterval(updateIntervalMs);
    subscription = expoMagnetometer.addListener(({ x, y, z }) => {
      const heading = calculateHeading(x, y);
      // Approximate accuracy from vector magnitude deviation from unit sphere
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const accuracy = Math.abs(magnitude - 1) * 90;
      currentData = {
        type: 'rotation',
        heading,
        accuracy,
        timestamp: new Date(),
      };
      listeners.forEach((cb) => cb(currentData));
    });
  };

  const stopSensor = () => {
    if (subscription) {
      subscription.remove();
      subscription = null;
    }
  };

  return {
    id: 'rotation',
    name: 'Rotation',

    subscribe(callback: (data: RotationData) => void): () => void {
      listeners.add(callback);
      if (listeners.size === 1) {
        startSensor();
      }
      callback(currentData);
      return () => {
        listeners.delete(callback);
        if (listeners.size === 0) {
          stopSensor();
        }
      };
    },

    getCurrentData(): RotationData {
      return currentData;
    },
  };
}
