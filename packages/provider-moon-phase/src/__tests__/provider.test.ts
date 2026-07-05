/**
 * Moon Phase Situation Provider Tests
 *
 * Verifies the SituationProvider<MoonPhaseData> implementation:
 * 1. Provider has correct id and name
 * 2. getCurrentData returns valid MoonPhaseData
 * 3. subscribe/unsubscribe lifecycle works correctly
 * 4. Immediate callback on subscribe
 *
 * Framework: Jest
 * Run: npm test -- --testPathPattern=provider
 */

import { createMoonPhaseProvider } from '../provider';
import type { MoonPhaseData } from '../types';
import { PHASE_ORDER } from '../types';

describe('Moon Phase Situation Provider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should have id "moon-phase"', () => {
    const provider = createMoonPhaseProvider();
    expect(provider.id).toBe('moon-phase');
  });

  it('should have name "Moon Phase"', () => {
    const provider = createMoonPhaseProvider();
    expect(provider.name).toBe('Moon Phase');
  });

  describe('getCurrentData', () => {
    it('should return valid MoonPhaseData', () => {
      const provider = createMoonPhaseProvider();
      const data = provider.getCurrentData();

      expect(data.type).toBe('moon-phase');
      expect(PHASE_ORDER).toContain(data.phaseName);
      expect(data.phaseIndex).toBeGreaterThanOrEqual(0);
      expect(data.phaseIndex).toBeLessThanOrEqual(7);
      expect(data.illumination).toBeGreaterThanOrEqual(0);
      expect(data.illumination).toBeLessThanOrEqual(1);
      expect(data.lunationProgress).toBeGreaterThanOrEqual(0);
      expect(data.lunationProgress).toBeLessThan(1);
      expect(data.lunarDay).toBeGreaterThanOrEqual(1);
      expect(data.lunarDay).toBeLessThanOrEqual(30);
      expect(typeof data.isWaxing).toBe('boolean');
      expect(data.phaseProgress).toBeGreaterThanOrEqual(0);
      expect(data.phaseProgress).toBeLessThanOrEqual(1);
    });
  });

  describe('subscribe', () => {
    it('should call callback immediately with current data', () => {
      const provider = createMoonPhaseProvider();
      const callback = vi.fn();

      provider.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(1);

      const data: MoonPhaseData = callback.mock.calls[0][0];
      expect(data.type).toBe('moon-phase');
    });

    it('should return an unsubscribe function', () => {
      const provider = createMoonPhaseProvider();
      const callback = vi.fn();

      const unsubscribe = provider.subscribe(callback);
      expect(typeof unsubscribe).toBe('function');

      unsubscribe();
      // Advance time past update interval — should not call again
      vi.advanceTimersByTime(4000000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should update after hourly interval', () => {
      const provider = createMoonPhaseProvider();
      const callback = vi.fn();

      provider.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(1);

      // Advance 1 hour
      vi.advanceTimersByTime(3600000);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should support multiple subscribers', () => {
      const provider = createMoonPhaseProvider();
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      provider.subscribe(cb1);
      provider.subscribe(cb2);

      // Both should have been called immediately
      expect(cb1).toHaveBeenCalledTimes(1);
      expect(cb2).toHaveBeenCalledTimes(1);

      // Advance 1 hour — both should be called again
      vi.advanceTimersByTime(3600000);
      expect(cb1).toHaveBeenCalledTimes(2);
      expect(cb2).toHaveBeenCalledTimes(2);
    });

    it('should stop updates when all subscribers unsubscribe', () => {
      const provider = createMoonPhaseProvider();
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      const unsub1 = provider.subscribe(cb1);
      const unsub2 = provider.subscribe(cb2);

      unsub1();
      unsub2();

      // Advance time — no more calls
      vi.advanceTimersByTime(3600000);
      expect(cb1).toHaveBeenCalledTimes(1);
      expect(cb2).toHaveBeenCalledTimes(1);
    });
  });
});
