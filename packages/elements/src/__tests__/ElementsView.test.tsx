/**
 * ElementsView — full board (Vitest + @testing-library/react via react-native-web)
 *
 * Same contract as YinYangView: the board must read only `element` inputData
 * out of the shared global slot, and fall back cleanly for anything else.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import type { KnowletContext } from '@iching-kt/core';
import { DEFAULT_TRANSLATION_PREFERENCES } from '@iching-kt/core';
import { ElementsView } from '../ElementsView';
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

describe('ElementsView', () => {
  it('opens on the element carried by inputData', () => {
    const { container } = render(
      <ElementsView context={createMockContext({ inputData: { type: 'element', value: 'water' } })} />,
    );

    expect(container.textContent).toContain(t.elements.water.description);
  });

  it('ignores a foreign inputData type instead of crashing', () => {
    const { container } = render(
      <ElementsView
        context={createMockContext({
          inputData: { type: 'hexagram', value: { hexagramNumber: 24, changingLines: [] } },
        })}
      />,
    );

    expect(container.textContent).not.toContain(t.elements.wood.description);
    expect(container.textContent).toContain('Element');
  });

  it('ignores an unknown element id instead of crashing', () => {
    const { container } = render(
      <ElementsView context={createMockContext({ inputData: { type: 'element', value: 'aether' } })} />,
    );

    expect(container.textContent).not.toContain(t.elements.wood.description);
  });

  it('shows the same empty state as the card when no element is given', () => {
    const { container } = render(<ElementsView context={createMockContext()} />);

    expect(container.textContent).toContain('☯');
    expect(container.textContent).toContain('Element');
    expect(container.textContent).not.toContain(t.elements.wood.description);
  });

  it('selecting an element on the empty board emits it and shows its detail', () => {
    const context = createMockContext();
    const { container, getByText } = render(<ElementsView context={context} />);

    fireEvent.click(getByText('水'));

    expect(context.emitOutput).toHaveBeenCalledWith('element', 'water');
    expect(container.textContent).toContain(t.elements.water.description);
  });
});
