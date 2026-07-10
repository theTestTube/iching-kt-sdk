/**
 * canAskAgain surfacing (#68).
 *
 * The compass acquire-and-seal flow must route a permanently-denied user to
 * system Settings instead of calling requestPermission() again. That decision
 * keys off GeoLocatorStatus.canAskAgain, which GpsGeoLocator reads from
 * expo-location and CompositeGeoLocator passes through from its
 * highest-precision (GPS) locator.
 */

import { describe, it, expect, vi } from 'vitest';
import { createGpsGeoLocator } from '../GpsGeoLocator';
import { createCompositeGeoLocator } from '../CompositeGeoLocator';
import { createTimezoneGeoLocator } from '../TimezoneGeoLocator';

type PermResult = { status: string; canAskAgain?: boolean };

function makeExpoLocation(initial: PermResult, requested?: PermResult) {
  const getForeground = vi.fn(async () => initial);
  const requestForeground = vi.fn(async () => requested ?? initial);
  return {
    expo: {
      requestForegroundPermissionsAsync: requestForeground,
      getForegroundPermissionsAsync: getForeground,
      getCurrentPositionAsync: vi.fn(async () => ({
        coords: { latitude: 0, longitude: 0, accuracy: 10 },
      })),
      watchPositionAsync: vi.fn(async () => ({ remove: vi.fn() })),
      Accuracy: { Highest: 6, High: 5, Balanced: 4, Low: 2 },
    },
    getForeground,
    requestForeground,
  };
}

// getStatus() is synchronous but the locator refreshes permission state from
// the OS asynchronously on construction; let that microtask settle.
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('GpsGeoLocator.canAskAgain', () => {
  it('surfaces canAskAgain: false when the OS reports permission permanently denied', async () => {
    const { expo } = makeExpoLocation({ status: 'denied', canAskAgain: false });
    const gps = createGpsGeoLocator({ expoLocation: expo });
    await flush();
    const status = gps.getStatus();
    expect(status.permissionState).toBe('denied');
    expect(status.canAskAgain).toBe(false);
  });

  it('surfaces canAskAgain: true when the user can still be prompted', async () => {
    const { expo } = makeExpoLocation({ status: 'undetermined', canAskAgain: true });
    const gps = createGpsGeoLocator({ expoLocation: expo });
    await flush();
    expect(gps.getStatus().canAskAgain).toBe(true);
  });

  it('updates canAskAgain after a request that denies with "Don\'t ask again"', async () => {
    const { expo } = makeExpoLocation(
      { status: 'undetermined', canAskAgain: true },
      { status: 'denied', canAskAgain: false },
    );
    const gps = createGpsGeoLocator({ expoLocation: expo });
    await flush();
    await gps.requestPermission();
    expect(gps.getStatus().canAskAgain).toBe(false);
  });

  it('notifies status subscribers when only canAskAgain flips (permission stays denied)', async () => {
    const { expo } = makeExpoLocation(
      { status: 'denied', canAskAgain: true },
      { status: 'denied', canAskAgain: false },
    );
    const gps = createGpsGeoLocator({ expoLocation: expo });
    await flush();
    const seen: (boolean | undefined)[] = [];
    gps.onStatusChange((s) => seen.push(s.canAskAgain));
    await gps.requestPermission();
    expect(seen).toContain(false);
  });
});

describe('CompositeGeoLocator.canAskAgain', () => {
  it('passes through the highest-precision (GPS) locator canAskAgain', async () => {
    const { expo } = makeExpoLocation({ status: 'denied', canAskAgain: false });
    const gps = createGpsGeoLocator({ expoLocation: expo });
    const timezone = createTimezoneGeoLocator();
    const composite = createCompositeGeoLocator({ locators: [gps, timezone] });
    await flush();
    expect(composite.getStatus().canAskAgain).toBe(false);
  });
});
