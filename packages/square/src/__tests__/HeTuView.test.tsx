/**
 * HeTuView Component Tests
 *
 * Framework: Jest + @testing-library/react (DOM via react-native-web)
 *
 * Run: npm test -- --testPathPattern=HeTuView
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { HeTuView } from '../views/HeTuView';
import { KnowletContext } from '@iching-kt/core';
import { EarthlyBranch } from '@iching-kt/provider-time';

// Mock context factory
// HeTuView reads earthly branch from situations['solar-time'].shichen
const createMockContext = (overrides: Partial<KnowletContext> = {}): KnowletContext => ({
  situations: {
    'solar-time': {
      shichen: 'zi' as EarthlyBranch, // Water element
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
    it('shows Water as active element when branch is zi', () => {
      const context = createMockContext({
        situations: { 'solar-time': { shichen: 'zi' } },
      });
      const { getByText } = render(<HeTuView context={context} />);

      expect(getByText(/Active element:.*Water/)).toBeTruthy();
    });

    it('shows Earth as active element when branch is chen', () => {
      const context = createMockContext({
        situations: { 'solar-time': { shichen: 'chen' } },
      });
      const { getByText } = render(<HeTuView context={context} />);

      expect(getByText(/Active element:.*Earth/)).toBeTruthy();
    });

    it('shows active element legend text', () => {
      const context = createMockContext({
        situations: { 'solar-time': { shichen: 'chen' } },
      });
      const { getByText } = render(<HeTuView context={context} />);

      expect(getByText(/Active element:.*Earth/)).toBeTruthy();
    });
  });

  describe('State Transitions', () => {
    it('correctly updates when transitioning from Earth to Water branch', async () => {
      const initialContext = createMockContext({
        situations: { 'solar-time': { shichen: 'chen' } }, // Earth
      });

      const { getByText, rerender } = render(<HeTuView context={initialContext} />);

      // Initially Earth should be active
      expect(getByText(/Active element:.*Earth/)).toBeTruthy();

      // Transition to Water branch
      const updatedContext = createMockContext({
        situations: { 'solar-time': { shichen: 'zi' } }, // Water
      });

      await act(async () => {
        rerender(<HeTuView context={updatedContext} />);
      });

      // Now Water should be active
      await waitFor(() => {
        expect(getByText(/Active element:.*Water/)).toBeTruthy();
      });
    });

    it('correctly updates when transitioning from Water to Earth branch', async () => {
      const initialContext = createMockContext({
        situations: { 'solar-time': { shichen: 'zi' } }, // Water
      });

      const { getByText, rerender } = render(<HeTuView context={initialContext} />);

      // Transition to Earth branch
      const updatedContext = createMockContext({
        situations: { 'solar-time': { shichen: 'xu' } }, // Earth
      });

      await act(async () => {
        rerender(<HeTuView context={updatedContext} />);
      });

      await waitFor(() => {
        expect(getByText(/Active element:.*Earth/)).toBeTruthy();
      });
    });

    it('handles rapid state transitions without visual glitches', async () => {
      const context = createMockContext();
      const { getByText, rerender } = render(<HeTuView context={context} />);

      const branches: EarthlyBranch[] = ['zi', 'chen', 'wu', 'shen', 'yin'];

      for (const branch of branches) {
        await act(async () => {
          rerender(
            <HeTuView
              context={createMockContext({
                situations: { 'solar-time': { shichen: branch } },
              })}
            />
          );
        });
      }

      // After rapid transitions, the last state should be correct
      // yin -> Wood element
      await waitFor(() => {
        expect(getByText(/Active element:.*Wood/)).toBeTruthy();
      });
    });
  });

  describe('Interactions', () => {
    it('calls emitOutput on element click', () => {
      const emitOutput = jest.fn();
      const context = createMockContext({ emitOutput });
      const { getByLabelText } = render(<HeTuView context={context} />);

      fireEvent.click(getByLabelText('Water'));

      expect(emitOutput).toHaveBeenCalledWith('element', 'water');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing solar-time data gracefully', () => {
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

    it('handles undefined shichen', () => {
      const context = createMockContext({
        situations: { 'solar-time': { shichen: undefined } },
      });
      const { queryByText } = render(<HeTuView context={context} />);

      // No active element legend should appear
      expect(queryByText(/Active element:/)).toBeNull();
    });
  });
});
