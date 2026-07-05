import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '@iching-kt/core';
import type { KnowletCardViewProps } from '@iching-kt/core';
import { getSovereignHexagram, getHexagram } from '@iching-kt/data-hexagrams';
import { HEXAGRAM_MATRIX } from '../views/HexagramMatrixView';
import { resolveCardHighlight } from './situationInputs';

/**
 * Compact Hexagram Matrix card — miniature 8x8 dot grid with the active
 * hexagram accented and its glyph shown alongside.
 * An adopted hexagram input wins over (frozen or live) solar-time situations.
 */
export function HexagramMatrixCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);

  const activeHexagram = resolveCardHighlight(
    context,
    'hexagram',
    (value) => (typeof value === 'number' ? value : undefined),
    (branch) => getSovereignHexagram(branch).hexagramNumber,
  );

  const activeData = activeHexagram ? getHexagram(activeHexagram) : null;
  const dotSize = compact ? 4 : 6;

  return (
    <View style={styles.content}>
      <View style={styles.grid}>
        {HEXAGRAM_MATRIX.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((hexNum) => {
              const isActive = hexNum === activeHexagram;
              return (
                <View
                  key={hexNum}
                  testID={isActive ? 'matrix-card-active' : 'matrix-card-cell'}
                  style={[
                    styles.cell,
                    { width: dotSize, height: dotSize },
                    { backgroundColor: isActive ? colors.text : colors.surfaceSecondary },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
      {activeData && (
        <Text testID="matrix-card-glyph" style={[styles.glyph, { color: colors.text }]}>
          {activeData.unicode}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  grid: {
    gap: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 1,
  },
  cell: {
    borderRadius: 1,
  },
  glyph: {
    fontSize: 22,
  },
});
