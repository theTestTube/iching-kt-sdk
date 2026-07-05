import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getThemeColors, getAbstractColors } from '@iching-kt/core';
import type { KnowletCardViewProps } from '@iching-kt/core';
import { ELEMENTS, getActiveElement } from '../views/HeTuView';
import { resolveCardHighlight } from './situationInputs';

/**
 * Compact He Tu card — miniature of the river-map cross (N water, W metal,
 * center earth, E wood, S fire), each station showing its inner·outer pair.
 * Adopted element input wins over (frozen or live) solar-time situations.
 */
export function HeTuCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  const activeElement = resolveCardHighlight(
    context,
    'element',
    (element) => (typeof element === 'string' && ELEMENTS[element] ? element : undefined),
    getActiveElement,
  );

  const renderStation = (elementKey: string) => {
    const data = ELEMENTS[elementKey];
    const isActive = elementKey === activeElement;
    const elementColors = abstractColors.elements[elementKey as keyof typeof abstractColors.elements];
    const activeColor = elementColors?.activeColor ?? colors.surfaceSecondary;

    return (
      <View
        key={elementKey}
        testID={isActive ? 'hetu-card-active' : undefined}
        style={[
          styles.station,
          compact && styles.stationCompact,
          { backgroundColor: isActive ? activeColor : colors.surfaceSecondary },
        ]}
      >
        <Text style={[styles.numbers, compact && styles.numbersCompact, { color: isActive ? '#fff' : colors.text }]}>
          {data.inner}·{data.outer}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.diagram}>
      {renderStation('water')}
      <View style={styles.middleRow}>
        {renderStation('metal')}
        {renderStation('earth')}
        {renderStation('wood')}
      </View>
      {renderStation('fire')}
    </View>
  );
}

const styles = StyleSheet.create({
  diagram: {
    alignItems: 'center',
    gap: 2,
  },
  middleRow: {
    flexDirection: 'row',
    gap: 2,
  },
  station: {
    minWidth: 26,
    height: 20,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  stationCompact: {
    minWidth: 20,
    height: 16,
  },
  numbers: {
    fontSize: 9,
    fontWeight: '600',
  },
  numbersCompact: {
    fontSize: 7,
  },
});
