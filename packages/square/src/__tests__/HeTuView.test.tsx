/**
 * HeTuView Component Tests
 *
 * Framework: Jest + React Native Testing Library
 * Install: npm install --save-dev @testing-library/react-native jest @types/jest
 *
 * Run: npm test -- --testPathPattern=HeTuView
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { HeTuView } from '../views/HeTuView';
import { KnowletContext } from '@iching-kt/core';
import { EarthlyBranch } from '@iching-kt/provider-time';

// Mock context factory
const createMockContext = (overrides: Partial<KnowletContext> = {}): KnowletContext => ({
  situations: {
    time: {
      earthlyBranch: 'zi' as EarthlyBranch, // Water element
      branchProgress: 0.5,
    },
  },
  settings: {},
  language: 'en',
  colorScheme: 'light',
  jumpTo: jest.fn(),
  pushView: jest.fn(),
  popView: jest.fn(),
  currentView: null,
  emitOutput: jest.fn(),
  showKnowletSelector: jest.fn(),
  ...overrides,
});

describe('HeTuView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all five elements', () => {
      const context = createMockContext();
      const { getByText } = render(<HeTuView context={context} />);

      expect(getByText('Water')).toBeTruthy();
      expect(getByText('Fire')).toBeTruthy();
      expect(getByText('Wood')).toBeTruthy();
      expect(getByText('Metal')).toBeTruthy();
      expect(getByText('Earth')).toBeTruthy();
    });

    it('renders title in English', () => {
      const context = createMockContext({ language: 'en' });
      const { getByText } = render(<HeTuView context={context} />);

      expect(getByText('River Map')).toBeTruthy();
      expect(getByText('河圖 He Tu')).toBeTruthy();
    });

    it('renders title in Spanish', () => {
      const context = createMockContext({ language: 'es' });
      const { getByText } = render(<HeTuView context={context} />);

      expect(getByText('Mapa del Río')).toBeTruthy();
      expect(getByText('Tierra')).toBeTruthy(); // Earth in Spanish
    });

    it('displays inner and outer numbers for each element', () => {
      const context = createMockContext();
      const { getByText } = render(<HeTuView context={context} />);

      expect(getByText('1 · 6')).toBeTruthy();  // Water
      expect(getByText('2 · 7')).toBeTruthy();  // Fire
      expect(getByText('3 · 8')).toBeTruthy();  // Wood
      expect(getByText('4 · 9')).toBeTruthy();  // Metal
      expect(getByText('5 · 10')).toBeTruthy(); // Earth
    });
  });

  describe('Active Element State', () => {
    it('highlights Water element when branch is zi', () => {
      const context = createMockContext({
        situations: { time: { earthlyBranch: 'zi' } },
      });
      const { getByLabelText } = render(<HeTuView context={context} />);

      const waterElement = getByLabelText('Water');
      expect(waterElement.props.accessibilityState.selected).toBe(true);
    });

    it('highlights Earth element when branch is chen', () => {
      const context = createMockContext({
        situations: { time: { earthlyBranch: 'chen' } },
      });
      const { getByLabelText } = render(<HeTuView context={context} />);

      const earthElement = getByLabelText('Earth');
      expect(earthElement.props.accessibilityState.selected).toBe(true);
    });

    it('shows active element in legend', () => {
      const context = createMockContext({
        situations: { time: { earthlyBranch: 'chen' } },
      });
      const { getByText } = render(<HeTuView context={context} />);

      expect(getByText(/Active element:/)).toBeTruthy();
      expect(getByText(/Earth/)).toBeTruthy();
    });
  });

  describe('State Transitions', () => {
    it('correctly updates when transitioning from Earth to Water branch', async () => {
      const initialContext = createMockContext({
        situations: { time: { earthlyBranch: 'chen' } }, // Earth
      });

      const { getByLabelText, rerender } = render(<HeTuView context={initialContext} />);

      // Initially Earth should be active
      expect(getByLabelText('Earth').props.accessibilityState.selected).toBe(true);
      expect(getByLabelText('Water').props.accessibilityState.selected).toBe(false);

      // Transition to Water branch
      const updatedContext = createMockContext({
        situations: { time: { earthlyBranch: 'zi' } }, // Water
      });

      await act(async () => {
        rerender(<HeTuView context={updatedContext} />);
      });

      // Now Water should be active, Earth should be inactive
      await waitFor(() => {
        expect(getByLabelText('Water').props.accessibilityState.selected).toBe(true);
        expect(getByLabelText('Earth').props.accessibilityState.selected).toBe(false);
      });
    });

    it('correctly updates when transitioning from Water to Earth branch', async () => {
      const initialContext = createMockContext({
        situations: { time: { earthlyBranch: 'zi' } }, // Water
      });

      const { getByLabelText, rerender } = render(<HeTuView context={initialContext} />);

      // Transition to Earth branch
      const updatedContext = createMockContext({
        situations: { time: { earthlyBranch: 'xu' } }, // Earth
      });

      await act(async () => {
        rerender(<HeTuView context={updatedContext} />);
      });

      await waitFor(() => {
        expect(getByLabelText('Earth').props.accessibilityState.selected).toBe(true);
        expect(getByLabelText('Water').props.accessibilityState.selected).toBe(false);
      });
    });

    it('handles rapid state transitions without visual glitches', async () => {
      const context = createMockContext();
      const { getByLabelText, rerender } = render(<HeTuView context={context} />);

      const branches: EarthlyBranch[] = ['zi', 'chen', 'wu', 'shen', 'yin'];

      for (const branch of branches) {
        await act(async () => {
          rerender(
            <HeTuView
              context={createMockContext({
                situations: { time: { earthlyBranch: branch } },
              })}
            />
          );
        });
      }

      // After rapid transitions, the last state should be correct
      // yin -> Wood element
      await waitFor(() => {
        expect(getByLabelText('Wood').props.accessibilityState.selected).toBe(true);
      });
    });
  });

  describe('Interactions', () => {
    it('calls emitOutput on element press', () => {
      const emitOutput = jest.fn();
      const context = createMockContext({ emitOutput });
      const { getByLabelText } = render(<HeTuView context={context} />);

      fireEvent.press(getByLabelText('Water'));

      expect(emitOutput).toHaveBeenCalledWith('element', 'water');
    });

    it('calls showKnowletSelector on element long press', () => {
      const showKnowletSelector = jest.fn();
      const context = createMockContext({ showKnowletSelector });
      const { getByLabelText } = render(<HeTuView context={context} />);

      fireEvent(getByLabelText('Earth'), 'longPress');

      expect(showKnowletSelector).toHaveBeenCalledWith('element', 'earth');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing time data gracefully', () => {
      const context = createMockContext({
        situations: {},
      });
      const { getByText, queryByText } = render(<HeTuView context={context} />);

      // All elements should still render
      expect(getByText('Water')).toBeTruthy();
      expect(getByText('Earth')).toBeTruthy();

      // No active element legend should appear
      expect(queryByText(/Active element:/)).toBeNull();
    });

    it('handles undefined earthlyBranch', () => {
      const context = createMockContext({
        situations: { time: { earthlyBranch: undefined } },
      });
      const { getByLabelText } = render(<HeTuView context={context} />);

      // No element should be marked as active
      expect(getByLabelText('Water').props.accessibilityState.selected).toBe(false);
      expect(getByLabelText('Earth').props.accessibilityState.selected).toBe(false);
    });
  });
});
