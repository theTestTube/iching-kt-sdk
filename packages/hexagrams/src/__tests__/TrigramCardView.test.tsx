/**
 * TrigramCardView — compact trigram card (Vitest + @testing-library/react via
 * react-native-web). Migrated to the shared CARD_TYPOGRAPHY/CARD_SPACING tokens
 * (#82); this covers both render states the migration must preserve.
 */

import React from 'react';
import { render } from '@testing-library/react';
import type { KnowletContext } from '@iching-kt/core';
import { DEFAULT_TRANSLATION_PREFERENCES } from '@iching-kt/core';
import { TrigramCardView } from '../TrigramCardView';

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

describe('TrigramCardView', () => {
  it('renders the placeholder icon and label when no trigram input is present', () => {
    const { getByText } = render(<TrigramCardView context={createMockContext()} />);
    expect(getByText('☰')).toBeTruthy();
    expect(getByText('Trigrams')).toBeTruthy();
  });

  it('renders the trigram unicode and chinese gloss for a trigram input', () => {
    const context = createMockContext({ inputData: { type: 'trigram', value: 'earth' } });
    const { getByText } = render(<TrigramCardView context={context} />);
    expect(getByText('☷')).toBeTruthy();
    expect(getByText('坤')).toBeTruthy();
  });
});
