/**
 * HexagramView attribution (#197): the source label must name the text
 * actually rendered. A preference stored before #197 ('wilhelm') resolves to
 * Legge, so the label must say Legge — never Wilhelm-Baynes.
 */

import React from 'react';
import { render } from '@testing-library/react';
import type { KnowletContext, TranslationPreferences } from '@iching-kt/core';
import { DEFAULT_TRANSLATION_PREFERENCES } from '@iching-kt/core';
import { HexagramView } from '../HexagramView';

const createMockContext = (overrides: Partial<KnowletContext> = {}): KnowletContext => ({
  situations: {},
  settings: {},
  language: 'en',
  colorScheme: 'light',
  translationPreferences: DEFAULT_TRANSLATION_PREFERENCES,
  inputData: { type: 'hexagram', value: 1 },
  jumpTo: vi.fn(),
  pushView: vi.fn(),
  popView: vi.fn(),
  currentView: null,
  emitOutput: vi.fn(),
  showKnowletSelector: vi.fn(),
  ...overrides,
});

const stale = { en: 'wilhelm', es: 'wilhelm', zh: 'zhouyi' } as unknown as TranslationPreferences;

describe('HexagramView attribution (#197)', () => {
  it.each(['en', 'es'])('labels a stale wilhelm preference (%s) as Legge', (language) => {
    const { getByText, queryByText } = render(
      <HexagramView context={createMockContext({ language, translationPreferences: stale })} />,
    );
    expect(getByText('James Legge (1882)')).toBeTruthy();
    expect(queryByText(/Wilhelm/)).toBeNull();
  });

  it('labels the Chinese text as Zhouyi', () => {
    const { getByText } = render(<HexagramView context={createMockContext({ language: 'zh' })} />);
    expect(getByText('周易 Zhouyi')).toBeTruthy();
  });
});
