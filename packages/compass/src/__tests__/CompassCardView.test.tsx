/**
 * CompassCardView — compact board card (Vitest + @testing-library/react via react-native-web)
 *
 * Rotation-presence model (#66): the card is LIVE when a `rotation` situation is
 * present, and renders a heading-less DEGRADED state (US 22) when it is absent —
 * e.g. the magnetometer is unavailable, or the card is pinned while another
 * knowlet is active and the app is not driving the sensor.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { CompassCardView } from '../views/CompassCardView';
import { createMockContext } from './testContext';

const rotationAt = (heading: number) => ({
  situations: {
    rotation: { type: 'rotation', heading, accuracy: 0, timestamp: new Date() },
  },
});

describe('CompassCardView', () => {
  it('renders heading-less degraded state when no rotation situation is present', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <CompassCardView context={createMockContext()} />
    );
    // Default north-up: Kan (☵) at center, no live heading readout.
    expect(getByText('☵')).toBeTruthy();
    expect(getByTestId('compass-card-degraded')).toBeTruthy();
    // Honest copy (#95): the heading is missing, not the hardware.
    expect(getByTestId('compass-card-degraded').textContent).toBe('No heading');
    expect(queryByTestId('compass-card-heading')).toBeNull();
  });

  it('renders the live heading when a rotation situation is present (North → 0°, Kan ☵)', () => {
    const context = createMockContext(rotationAt(0));
    const { getByText, getByTestId, queryByTestId } = render(
      <CompassCardView context={context} />
    );
    expect(getByTestId('compass-card-heading').textContent).toContain('0°');
    expect(getByText('☵')).toBeTruthy();
    expect(queryByTestId('compass-card-degraded')).toBeNull();
  });

  it('maps the live heading to the correct Later-Heaven sector (East → 90°, Zhen ☳)', () => {
    const context = createMockContext(rotationAt(90));
    const { getByText, getByTestId } = render(<CompassCardView context={context} />);
    expect(getByTestId('compass-card-heading').textContent).toContain('90°');
    expect(getByText('☳')).toBeTruthy();
  });
});

// ── Location seal layer (#68) — an axis independent of rotation-presence ──
const locationInput = (value: unknown) => ({ inputData: { type: 'gps' as const, value } });

describe('CompassCardView location seal layer', () => {
  it('renders NO location row when there is no location inputData (backward compatible)', () => {
    const { queryByTestId } = render(<CompassCardView context={createMockContext()} />);
    expect(queryByTestId('compass-card-location-acquiring')).toBeNull();
    expect(queryByTestId('compass-card-location-precise')).toBeNull();
    expect(queryByTestId('compass-card-location-unavailable')).toBeNull();
  });

  it('shows the acquiring label, with provisional centroid coords when a displayPosition is present', () => {
    const context = createMockContext(
      locationInput({ locationState: 'acquiring', displayPosition: { latitude: 40.4, longitude: -3.7 } })
    );
    const { getByTestId } = render(<CompassCardView context={context} />);
    const row = getByTestId('compass-card-location-acquiring');
    expect(row.textContent).toContain('Locating');
    expect(row.textContent).toContain('40.4°, -3.7°');
  });

  it('shows a precise located indicator with frozen coords', () => {
    const context = createMockContext(
      locationInput({ locationState: 'precise', frozenPosition: { latitude: 51.5, longitude: -0.1 } })
    );
    const { getByTestId, queryByTestId } = render(<CompassCardView context={context} />);
    const row = getByTestId('compass-card-location-precise');
    expect(row.textContent).toContain('📍');
    expect(row.textContent).toContain('51.5°, -0.1°');
    expect(row.textContent).toContain('Precise');
    expect(queryByTestId('compass-card-location-coarse')).toBeNull();
  });

  it('shows an approximate located indicator for a coarse fix', () => {
    const context = createMockContext(
      locationInput({ locationState: 'coarse', frozenPosition: { latitude: 34.0, longitude: -118.2 } })
    );
    const { getByTestId } = render(<CompassCardView context={context} />);
    const row = getByTestId('compass-card-location-coarse');
    expect(row.textContent).toContain('📍');
    expect(row.textContent).toContain('Approx');
  });

  it('shows the unavailable label for a degraded seal', () => {
    const context = createMockContext(locationInput({ locationState: 'unavailable' }));
    const { getByTestId } = render(<CompassCardView context={context} />);
    expect(getByTestId('compass-card-location-unavailable').textContent).toContain('Location unavailable');
  });

  it('renders BOTH the live heading AND an unavailable location — the two axes are independent', () => {
    const context = createMockContext({
      ...rotationAt(0),
      ...locationInput({ locationState: 'unavailable' }),
    });
    const { getByTestId } = render(<CompassCardView context={context} />);
    // Rotation axis: live heading present (magnetometer working)…
    expect(getByTestId('compass-card-heading').textContent).toContain('0°');
    // …while the location axis is independently unavailable.
    expect(getByTestId('compass-card-location-unavailable')).toBeTruthy();
  });
});
