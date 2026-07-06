/**
 * YinYangCardView — compact polarity card (Vitest + @testing-library/react via react-native-web)
 *
 * Covers pin-time adoption rendering: inputData.value may be a plain
 * YinYangId or an adopted `{ polarity, explanation }` object whose
 * explanation sentence is shown under the badge.
 */

import React from 'react';
import { render } from '@testing-library/react';
import type { KnowletContext } from '@iching-kt/core';
import { DEFAULT_TRANSLATION_PREFERENCES } from '@iching-kt/core';
import { YinYangCardView } from '../YinYangCardView';

const createMockContext = (overrides: Partial<KnowletContext> = {}): KnowletContext => ({
  situations: {},
  settings: {},
  language: 'en',
  colorScheme: 'light',
  translationPreferences: DEFAULT_TRANSLATION_PREFERENCES,
  jumpTo: vi.fn(),
  pushView: vi.fn(),
  popView: vi.fn(),
  currentView: null,
  emitOutput: vi.fn(),
  showKnowletSelector: vi.fn(),
  ...overrides,
});

describe('YinYangCardView', () => {
  it('renders the default view when no input data is present', () => {
    const { getByText } = render(<YinYangCardView context={createMockContext()} />);
    expect(getByText('☯')).toBeTruthy();
    expect(getByText('Yin/Yang')).toBeTruthy();
  });

  it('renders the badge for a plain polarity value', () => {
    const context = createMockContext({ inputData: { type: 'yinyang', value: 'yin' } });
    const { getByText } = render(<YinYangCardView context={context} />);
    expect(getByText('陰')).toBeTruthy();
    expect(getByText('yīn')).toBeTruthy();
  });

  it('renders badge and explanation for an adopted { polarity, explanation } value', () => {
    const explanation =
      "Adopted yang because 4 of the main hexagram's 6 lines are solid (yang) — the dominant polarity.";
    const context = createMockContext({
      inputData: { type: 'yinyang', value: { polarity: 'yang', explanation } },
    });
    const { getByText } = render(<YinYangCardView context={context} />);
    expect(getByText('陽')).toBeTruthy();
    expect(getByText('yáng')).toBeTruthy();
    expect(getByText(explanation)).toBeTruthy();
  });

  it('renders no explanation for an adopted value without one', () => {
    const context = createMockContext({
      inputData: { type: 'yinyang', value: { polarity: 'yin' } },
    });
    const { getByText, queryByTestId } = render(<YinYangCardView context={context} />);
    expect(getByText('陰')).toBeTruthy();
    expect(queryByTestId('yinyang-card-explanation')).toBeNull();
  });

  it('falls back to the default view for an unmappable adopted value', () => {
    const context = createMockContext({
      inputData: { type: 'yinyang', value: { polarity: 'plasma' } },
    });
    const { getByText } = render(<YinYangCardView context={context} />);
    expect(getByText('☯')).toBeTruthy();
  });
});
