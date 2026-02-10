import type { SituationProvider } from '@iching-kt/core';
import type { MoonPhaseData } from './types';
import { calculateMoonPhase, getPhaseProgress } from './calculator';

/**
 * Moon Phase Situation Provider
 *
 * Emits MoonPhaseData based on astronomical moon phase calculations.
 * Updates hourly since moon phases change slowly (~3.7 days per phase).
 *
 * Follows the same SituationProvider pattern as provider-time and
 * provider-solar-time.
 */

/** Default update interval: 1 hour (3600000 ms) */
const DEFAULT_UPDATE_INTERVAL_MS = 3600000;

function getCurrentMoonPhaseData(): MoonPhaseData {
  const now = new Date();
  const calc = calculateMoonPhase(now);
  const phaseProgress = getPhaseProgress(calc.lunationProgress);

  return {
    type: 'moon-phase',
    phaseName: calc.phaseName,
    phaseIndex: calc.phaseIndex,
    illumination: calc.illumination,
    lunationProgress: calc.lunationProgress,
    lunarDay: calc.lunarDay,
    isWaxing: calc.isWaxing,
    phaseProgress,
  };
}

export function createMoonPhaseProvider(): SituationProvider<MoonPhaseData> {
  let currentData = getCurrentMoonPhaseData();
  const listeners = new Set<(data: MoonPhaseData) => void>();
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const updateData = () => {
    currentData = getCurrentMoonPhaseData();
    listeners.forEach((cb) => cb(currentData));
  };

  const startUpdates = () => {
    if (intervalId) return;
    intervalId = setInterval(updateData, DEFAULT_UPDATE_INTERVAL_MS);
  };

  const stopUpdates = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return {
    id: 'moon-phase',
    name: 'Moon Phase',

    subscribe(callback: (data: MoonPhaseData) => void): () => void {
      listeners.add(callback);

      if (listeners.size === 1) {
        startUpdates();
      }

      // Immediately provide current data
      callback(currentData);

      return () => {
        listeners.delete(callback);

        if (listeners.size === 0) {
          stopUpdates();
        }
      };
    },

    getCurrentData(): MoonPhaseData {
      return currentData;
    },
  };
}
