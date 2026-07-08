import type { SituationData } from '@iching-kt/core';

export interface RotationData extends SituationData {
  type: 'rotation';
  /** Magnetic heading 0–359°, normalized */
  heading: number;
  /** Degrees of uncertainty from magnetometer signal */
  accuracy: number;
  timestamp: Date;
}

/** Injection interface — app provides expo-sensors Magnetometer */
export interface ExpoMagnetometer {
  addListener: (
    callback: (data: { x: number; y: number; z: number }) => void
  ) => { remove: () => void };
  setUpdateInterval: (intervalMs: number) => void;
}

export interface RotationProviderConfig {
  expoMagnetometer: ExpoMagnetometer;
  /** Default: 100ms (10Hz) */
  updateIntervalMs?: number;
}
