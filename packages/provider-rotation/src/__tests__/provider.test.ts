import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRotationProvider, calculateHeading } from '../provider';
import type { ExpoMagnetometer } from '../types';

// --- heading normalization ---

// expo-sensors axes (phone flat, portrait): x=device right, y=device top
// heading = bearing of device top from magnetic north
describe('calculateHeading', () => {
  it('device top → North (field in +y): 0°', () => {
    expect(calculateHeading(0, 1)).toBeCloseTo(0, 1);
  });

  it('device top → East (field in -x, North is left): 90°', () => {
    expect(calculateHeading(-1, 0)).toBeCloseTo(90, 1);
  });

  it('device top → South (field in -y): 180°', () => {
    expect(calculateHeading(0, -1)).toBeCloseTo(180, 1);
  });

  it('device top → West (field in +x, North is right): 270°', () => {
    expect(calculateHeading(1, 0)).toBeCloseTo(270, 1);
  });

  it('always returns 0–359', () => {
    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg * Math.PI) / 180;
      const heading = calculateHeading(Math.cos(rad), Math.sin(rad));
      expect(heading).toBeGreaterThanOrEqual(0);
      expect(heading).toBeLessThan(360);
    }
  });
});

// --- provider lifecycle ---

function makeMagnetometer() {
  let listener: ((data: { x: number; y: number; z: number }) => void) | null = null;
  const mock: ExpoMagnetometer = {
    addListener: vi.fn((cb: (data: { x: number; y: number; z: number }) => void) => {
      listener = cb;
      return { remove: vi.fn(() => { listener = null; }) };
    }),
    setUpdateInterval: vi.fn(),
  };
  const emit = (data: { x: number; y: number; z: number }) => listener?.(data);
  return { mock, emit };
}

describe('createRotationProvider', () => {
  let mag: ReturnType<typeof makeMagnetometer>;

  beforeEach(() => {
    mag = makeMagnetometer();
  });

  it('returns initial heading 0 before any sensor data', () => {
    const provider = createRotationProvider({ expoMagnetometer: mag.mock });
    expect(provider.getCurrentData().heading).toBe(0);
    expect(provider.getCurrentData().type).toBe('rotation');
  });

  it('id is "rotation"', () => {
    const provider = createRotationProvider({ expoMagnetometer: mag.mock });
    expect(provider.id).toBe('rotation');
  });

  it('sensor starts on first subscribe', () => {
    const provider = createRotationProvider({ expoMagnetometer: mag.mock });
    expect(mag.mock.addListener).not.toHaveBeenCalled();
    const unsub = provider.subscribe(() => {});
    expect(mag.mock.addListener).toHaveBeenCalledTimes(1);
    unsub();
  });

  it('sensor stops when last subscriber unsubscribes', () => {
    const provider = createRotationProvider({ expoMagnetometer: mag.mock });
    const unsub = provider.subscribe(() => {});
    unsub();
    // addListener returns { remove } — verify remove was called
    const { remove } = (mag.mock.addListener as ReturnType<typeof vi.fn>).mock.results[0].value;
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('sensor does not restart for second subscriber', () => {
    const provider = createRotationProvider({ expoMagnetometer: mag.mock });
    const u1 = provider.subscribe(() => {});
    const u2 = provider.subscribe(() => {});
    expect(mag.mock.addListener).toHaveBeenCalledTimes(1);
    u1();
    u2();
  });

  it('delivers current data immediately on subscribe', () => {
    const provider = createRotationProvider({ expoMagnetometer: mag.mock });
    const received: number[] = [];
    provider.subscribe((d) => received.push(d.heading));
    expect(received).toHaveLength(1);
  });

  it('propagates sensor updates to subscribers', () => {
    const provider = createRotationProvider({ expoMagnetometer: mag.mock });
    const headings: number[] = [];
    provider.subscribe((d) => headings.push(d.heading));

    // device top → North (field in +y): x=0, y=1 → heading ≈ 0°
    mag.emit({ x: 0, y: 1, z: 0 });
    expect(headings.length).toBe(2); // initial + update
    expect(headings[1]).toBeCloseTo(0, 1);
  });

  it('sets update interval from config', () => {
    createRotationProvider({ expoMagnetometer: mag.mock, updateIntervalMs: 200 }).subscribe(() => {});
    expect(mag.mock.setUpdateInterval).toHaveBeenCalledWith(200);
  });

  it('default update interval is 100ms', () => {
    createRotationProvider({ expoMagnetometer: mag.mock }).subscribe(() => {});
    expect(mag.mock.setUpdateInterval).toHaveBeenCalledWith(100);
  });
});
