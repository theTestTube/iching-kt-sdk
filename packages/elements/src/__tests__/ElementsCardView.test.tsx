/**
 * ElementsCardView — compact Wu Xing element card (Vitest + @testing-library/react
 * via react-native-web). Migrated to the shared CARD_TYPOGRAPHY/CARD_SPACING
 * tokens (#82); this covers both render states the migration must preserve.
 */

import React from 'react';
import { render } from '@testing-library/react';
import type { KnowletContext } from '@iching-kt/core';
import { DEFAULT_TRANSLATION_PREFERENCES } from '@iching-kt/core';
import { ElementsCardView } from '../ElementsCardView';

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

describe('ElementsCardView', () => {
  it('renders the placeholder icon and label when no element input is present', () => {
    const { getByText } = render(<ElementsCardView context={createMockContext()} />);
    expect(getByText('☯')).toBeTruthy();
    expect(getByText('Element')).toBeTruthy();
  });

  it('renders the badge glyph and capitalized name for an element input', () => {
    const context = createMockContext({ inputData: { type: 'element', value: 'fire' } });
    const { getByText } = render(<ElementsCardView context={context} />);
    expect(getByText('火')).toBeTruthy();
    expect(getByText('Fire')).toBeTruthy();
  });
});
