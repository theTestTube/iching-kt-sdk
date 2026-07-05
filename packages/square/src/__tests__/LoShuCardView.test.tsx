/**
 * LoShuCardView — compact board card (Vitest + @testing-library/react via react-native-web)
 */

import React from 'react';
import { render } from '@testing-library/react';
import { LoShuCardView } from '../cards/LoShuCardView';
import { createMockContext } from './testContext';


describe('LoShuCardView', () => {
  it('renders a miniature 3x3 grid with the eight trigrams and center', () => {
    const { getByText } = render(<LoShuCardView context={createMockContext()} />);

    // One glyph per Lo Shu station: ☵1 ☷2 ☳3 ☴4 ☯5 ☰6 ☱7 ☶8 ☲9
    for (const glyph of ['☵', '☷', '☳', '☴', '☯', '☰', '☱', '☶', '☲']) {
      expect(getByText(glyph)).toBeTruthy();
    }
  });

  it('highlights no cell when no solar-time situation is present', () => {
    const { queryByTestId } = render(<LoShuCardView context={createMockContext()} />);
    expect(queryByTestId('loshu-card-active')).toBeNull();
  });

  it('highlights the cell for the frozen solar-time branch (zi → 1, Water ☵)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
    });
    const { getByTestId } = render(<LoShuCardView context={context} />);
    expect(getByTestId('loshu-card-active').textContent).toContain('☵');
  });

  it('prefers inputData trigram over situations (fire → 9, ☲)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
      inputData: { type: 'trigram', value: 'fire' },
    });
    const { getByTestId } = render(<LoShuCardView context={context} />);
    expect(getByTestId('loshu-card-active').textContent).toContain('☲');
  });

  it('shows no highlight when an adopted trigram is unmappable (never falls back to situations)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
      inputData: { type: 'trigram', value: 'not-a-trigram' },
    });
    const { queryByTestId } = render(<LoShuCardView context={context} />);
    expect(queryByTestId('loshu-card-active')).toBeNull();
  });
});
