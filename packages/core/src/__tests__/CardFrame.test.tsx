/**
 * CardFrame tests — the uniform header/overlay chrome for knowlet cards (#82).
 *
 * Verifies both grammars render the board identity (icon + name) and the body,
 * and that fixed dimensions are exported per variant.
 *
 * Framework: Vitest + @testing-library/react (via react-native-web)
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Text } from 'react-native';
import { CardFrame, CARD_FRAME_DIMENSIONS } from '../CardFrame';

const Body = () => <Text testID="body">body-content</Text>;

describe('CardFrame', () => {
  it('tiles: renders header icon + name and the body', () => {
    const { getByText, getByTestId } = render(
      <CardFrame variant="tiles" name="Hexagrams" icon="☯" colorScheme="light">
        <Body />
      </CardFrame>,
    );
    expect(getByText('☯')).toBeTruthy();
    expect(getByText('Hexagrams')).toBeTruthy();
    expect(getByTestId('body')).toBeTruthy();
  });

  it('album: renders overlay icon + name and the body', () => {
    const { getByText, getByTestId } = render(
      <CardFrame variant="album" name="Moon" icon="🌙" colorScheme="dark">
        <Body />
      </CardFrame>,
    );
    expect(getByText('🌙')).toBeTruthy();
    expect(getByText('Moon')).toBeTruthy();
    expect(getByTestId('body')).toBeTruthy();
  });

  it('exposes a fixed footprint per grammar (tiles square, album portrait)', () => {
    expect(CARD_FRAME_DIMENSIONS.tiles).toEqual({ width: 100, height: 100, borderRadius: 14 });
    expect(CARD_FRAME_DIMENSIONS.album).toEqual({ width: 120, height: 160, borderRadius: 16 });
    // album is taller than it is wide; tiles is square
    expect(CARD_FRAME_DIMENSIONS.album.height).toBeGreaterThan(CARD_FRAME_DIMENSIONS.album.width);
    expect(CARD_FRAME_DIMENSIONS.tiles.width).toBe(CARD_FRAME_DIMENSIONS.tiles.height);
  });
});
