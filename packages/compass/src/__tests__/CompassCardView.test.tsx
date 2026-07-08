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
