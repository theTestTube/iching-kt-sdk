/**
 * HexagramDetailView source (#197): the detail view must render the text of
 * the user's chosen source, the same one HexagramCard shows before the tap.
 */

import React from 'react';
import { render } from '@testing-library/react';
import type { KnowletContext, TranslationPreferences } from '@iching-kt/core';
import { DEFAULT_TRANSLATION_PREFERENCES } from '@iching-kt/core';
import { HexagramDetailView } from '../HexagramDetailView';

const createMockContext = (overrides: Partial<KnowletContext> = {}): KnowletContext => ({
  situations: {},
  settings: {},
  language: 'en',
  colorScheme: 'light',
  translationPreferences: DEFAULT_TRANSLATION_PREFERENCES,
  inputData: undefined,
  jumpTo: vi.fn(),
  pushView: vi.fn(),
  popView: vi.fn(),
  currentView: null,
  emitOutput: vi.fn(),
  showKnowletSelector: vi.fn(),
  ...overrides,
});

describe('HexagramDetailView translation source (#197)', () => {
  it('renders the Spanish Zhouyi text when the user chose zhouyi', () => {
    const prefs: TranslationPreferences = { en: 'legge', es: 'zhouyi', zh: 'zhouyi' };
    const { getByText, queryByText } = render(
      <HexagramDetailView context={createMockContext({ language: 'es', translationPreferences: prefs })} hexagramNumber={23} />,
    );
    expect(getByText('La Desintegración')).toBeTruthy();
    expect(queryByText('La Decadencia')).toBeNull();
  });

  it('renders the Spanish Legge text when the user chose legge', () => {
    const prefs: TranslationPreferences = { en: 'legge', es: 'legge', zh: 'zhouyi' };
    const { getByText } = render(
      <HexagramDetailView context={createMockContext({ language: 'es', translationPreferences: prefs })} hexagramNumber={23} />,
    );
    expect(getByText('La Decadencia')).toBeTruthy();
  });
});
