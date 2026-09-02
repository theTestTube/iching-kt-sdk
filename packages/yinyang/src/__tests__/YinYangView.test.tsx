/**
 * YinYangView — full board (Vitest + @testing-library/react via react-native-web)
 *
 * The board reads the SHARED, global `context.inputData`, which carries
 * whatever the last emit/adoption put there — including types this board does
 * not consume. It must select from its own domain only, never from a foreign
 * `inputData.value` (see YinYangCardView's parseYinYangInput).
 */

import React from 'react';
import { render } from '@testing-library/react';
import type { KnowletContext } from '@iching-kt/core';
import { DEFAULT_TRANSLATION_PREFERENCES } from '@iching-kt/core';
import { YinYangView } from '../YinYangView';
import { getTranslation } from '../data';

const t = getTranslation('en');

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

describe('YinYangView', () => {
  it('renders the adopted polarity of a pinned card ({ polarity, explanation } shape)', () => {
    const { container } = render(
      <YinYangView
        context={createMockContext({
          inputData: { type: 'yinyang', value: { polarity: 'yang', explanation: 'Four yang lines.' } },
        })}
      />,
    );

    expect(container.textContent).toContain(t.polarities.yang.description);
  });

  it('renders a plain polarity id', () => {
    const { container } = render(
      <YinYangView context={createMockContext({ inputData: { type: 'yinyang', value: 'yang' } })} />,
    );

    expect(container.textContent).toContain(t.polarities.yang.description);
  });

  it('ignores a foreign inputData type instead of crashing', () => {
    const { container } = render(
      <YinYangView
        context={createMockContext({
          inputData: { type: 'hexagram', value: { hexagramNumber: 24, changingLines: [] } },
        })}
      />,
    );

    expect(container.textContent).toContain(t.polarities.yin.description);
  });

  it('falls back to yin with no inputData', () => {
    const { container } = render(<YinYangView context={createMockContext()} />);

    expect(container.textContent).toContain(t.polarities.yin.description);
  });
});
