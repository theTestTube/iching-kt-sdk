/**
 * BranchesCircleCardView — compact board card (Vitest + @testing-library/react via react-native-web)
 */

import React from 'react';
import { render } from '@testing-library/react';
import { BranchesCircleCardView } from '../cards/BranchesCircleCardView';
import { createMockContext } from './testContext';


describe('BranchesCircleCardView', () => {
  it('renders all twelve earthly branch characters', () => {
    const { getByText } = render(<BranchesCircleCardView context={createMockContext()} />);

    for (const chinese of ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']) {
      expect(getByText(chinese)).toBeTruthy();
    }
  });

  it('highlights no branch without solar-time situation', () => {
    const { queryByTestId } = render(<BranchesCircleCardView context={createMockContext()} />);
    expect(queryByTestId('branches-card-active')).toBeNull();
  });

  it('highlights the frozen solar-time branch and shows its sovereign hexagram (zi → 子, #24 ䷗)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
    });
    const { getByTestId } = render(<BranchesCircleCardView context={context} />);
    expect(getByTestId('branches-card-active').textContent).toContain('子');
    expect(getByTestId('branches-card-center').textContent).toContain('䷗');
  });

  it('prefers a sovereign inputData hexagram over situations (#44 → 午)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
      inputData: { type: 'hexagram', value: 44 },
    });
    const { getByTestId } = render(<BranchesCircleCardView context={context} />);
    expect(getByTestId('branches-card-active').textContent).toContain('午');
  });

  it('shows no highlight when an adopted hexagram is not sovereign (never falls back to situations)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
      inputData: { type: 'hexagram', value: 13 },
    });
    const { queryByTestId } = render(<BranchesCircleCardView context={context} />);
    expect(queryByTestId('branches-card-active')).toBeNull();
  });
});
