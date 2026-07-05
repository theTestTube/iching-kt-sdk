/**
 * HexagramMatrixCardView — compact board card (Vitest + @testing-library/react via react-native-web)
 */

import React from 'react';
import { render } from '@testing-library/react';
import { HexagramMatrixCardView } from '../cards/HexagramMatrixCardView';
import { createMockContext } from './testContext';


describe('HexagramMatrixCardView', () => {
  it('renders a miniature 8x8 grid of 64 cells', () => {
    const { getAllByTestId } = render(<HexagramMatrixCardView context={createMockContext()} />);
    expect(getAllByTestId('matrix-card-cell')).toHaveLength(64);
  });

  it('highlights no cell without solar-time situation', () => {
    const { queryByTestId } = render(<HexagramMatrixCardView context={createMockContext()} />);
    expect(queryByTestId('matrix-card-active')).toBeNull();
  });

  it('highlights the sovereign hexagram of the frozen solar-time branch (zi → #24 ䷗)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
    });
    const { getByTestId } = render(<HexagramMatrixCardView context={context} />);
    expect(getByTestId('matrix-card-active')).toBeTruthy();
    expect(getByTestId('matrix-card-glyph').textContent).toContain('䷗');
  });

  it('prefers an inputData hexagram over situations (#13 → ䷌)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
      inputData: { type: 'hexagram', value: 13 },
    });
    const { getByTestId } = render(<HexagramMatrixCardView context={context} />);
    expect(getByTestId('matrix-card-glyph').textContent).toContain('䷌');
  });

  it('shows no highlight when an adopted hexagram is malformed (never falls back to situations)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
      inputData: { type: 'hexagram', value: 'thirteen' },
    });
    const { queryByTestId } = render(<HexagramMatrixCardView context={context} />);
    expect(queryByTestId('matrix-card-active')).toBeNull();
  });
});
