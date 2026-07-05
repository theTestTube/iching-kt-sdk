import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getThemeColors, getAbstractColors } from '@iching-kt/core';
import type { KnowletCardViewProps } from '@iching-kt/core';
import { LO_SHU_GRID, LO_SHU_TRIGRAMS, BRANCH_TO_LOSHU } from '../views/LoShuView';
import { resolveCardHighlight } from './situationInputs';

/**
 * Compact Lo Shu card — miniature of the 3x3 magic square.
 * Adopted trigram input wins over (frozen or live) solar-time situations.
 */
export function LoShuCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  const activeNumber = resolveCardHighlight(
    context,
    'trigram',
    (trigramId) =>
      Object.keys(LO_SHU_TRIGRAMS)
        .map(Number)
        .find((num) => LO_SHU_TRIGRAMS[num].trigramId === trigramId),
    (branch) => BRANCH_TO_LOSHU[branch],
  );

  return (
    <View style={styles.grid}>
      {LO_SHU_GRID.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((num) => {
            const info = LO_SHU_TRIGRAMS[num];
            const isActive = num === activeNumber;
            const elementKey = info.element.toLowerCase() as keyof ReturnType<typeof getAbstractColors>['elements'];
            const activeColor = abstractColors.elements[elementKey]?.activeColor ?? colors.surfaceSecondary;

            return (
              <View
                key={num}
                testID={isActive ? 'loshu-card-active' : undefined}
                style={[
                  styles.cell,
                  compact && styles.cellCompact,
                  { backgroundColor: isActive ? activeColor : colors.surfaceSecondary },
                ]}
              >
                <Text style={[styles.trigram, compact && styles.trigramCompact, { color: isActive ? '#fff' : colors.text }]}>
                  {info.trigram}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 2,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 2,
  },
  cell: {
    width: 24,
    height: 24,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellCompact: {
    width: 18,
    height: 18,
  },
  trigram: {
    fontSize: 13,
  },
  trigramCompact: {
    fontSize: 10,
  },
});
