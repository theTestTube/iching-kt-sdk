/**
 * HeTuCardView — compact board card (Vitest + @testing-library/react via react-native-web)
 */

import React from 'react';
import { render } from '@testing-library/react';
import { HeTuCardView } from '../cards/HeTuCardView';
import { createMockContext } from './testContext';


describe('HeTuCardView', () => {
  it('renders the five elemental stations with their inner·outer numbers', () => {
    const { getByText } = render(<HeTuCardView context={createMockContext()} />);

    expect(getByText('1·6')).toBeTruthy();  // Water
    expect(getByText('2·7')).toBeTruthy();  // Fire
    expect(getByText('3·8')).toBeTruthy();  // Wood
    expect(getByText('4·9')).toBeTruthy();  // Metal
    expect(getByText('5·10')).toBeTruthy(); // Earth
  });

  it('highlights no station without solar-time situation', () => {
    const { queryByTestId } = render(<HeTuCardView context={createMockContext()} />);
    expect(queryByTestId('hetu-card-active')).toBeNull();
  });

  it('highlights the station for the frozen solar-time branch (zi → Water 1·6)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
    });
    const { getByTestId } = render(<HeTuCardView context={context} />);
    expect(getByTestId('hetu-card-active').textContent).toContain('1·6');
  });

  it('prefers inputData element over situations (fire → 2·7)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
      inputData: { type: 'element', value: 'fire' },
    });
    const { getByTestId } = render(<HeTuCardView context={context} />);
    expect(getByTestId('hetu-card-active').textContent).toContain('2·7');
  });

  it('shows no highlight when an adopted element is unmappable (never falls back to situations)', () => {
    const context = createMockContext({
      situations: { 'solar-time': { shichen: { branch: 'zi' } } },
      inputData: { type: 'element', value: 'plasma' },
    });
    const { queryByTestId } = render(<HeTuCardView context={context} />);
    expect(queryByTestId('hetu-card-active')).toBeNull();
  });
});
