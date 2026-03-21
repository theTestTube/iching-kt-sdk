import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ActionableElement } from './ActionableElement';
import { getThemeColors } from './theme';
import type { Knowlet, KnowletContext, KnowletCardViewProps } from './types';

export interface KnowletCardProps {
  /** The knowlet to render a card for */
  knowlet: Knowlet;
  /** Context for rendering the card */
  context: KnowletContext;
  /** Callback when card is pressed */
  onPress?: (knowletId: string) => void;
  /** Callback when card is long-pressed */
  onLongPress?: (knowletId: string) => void;
  /** Whether to render in compact mode */
  compact?: boolean;
  /** Optional hexagram data (for toss-originated cards) */
  hexagramData?: KnowletCardViewProps['hexagramData'];
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

/**
 * KnowletCard - Generic compact card for any knowlet.
 *
 * Renders the knowlet's CardView if available, otherwise falls back to
 * an icon + localized name display. Wraps content in ActionableElement
 * for press/longPress behavior and animation.
 *
 * Designed for inline display in conversation flows (~120px wide).
 */
export function KnowletCard({
  knowlet,
  context,
  onPress,
  onLongPress,
  compact = false,
  hexagramData,
  style,
}: KnowletCardProps) {
  const colors = getThemeColors(context.colorScheme);
  const { meta } = knowlet;
  const name = meta.names?.[context.language] ?? meta.name;
  const icon = meta.icon ?? '☯';

  const handlePress = onPress
    ? () => onPress(meta.id)
    : undefined;

  const handleLongPress = onLongPress
    ? () => onLongPress(meta.id)
    : undefined;

  // Use the knowlet's CardView if available
  if (knowlet.CardView) {
    return (
      <ActionableElement
        outputType="hexagram"
        value={meta.id}
        label={name}
        onPress={handlePress ? () => handlePress() : undefined}
        onLongPress={handleLongPress ? () => handleLongPress() : undefined}
        defaultColor={colors.surface}
        colorScheme={context.colorScheme}
        style={[styles.card, compact && styles.cardCompact, style]}
      >
        <knowlet.CardView
          context={context}
          compact={compact}
          hexagramData={hexagramData}
        />
      </ActionableElement>
    );
  }

  // Fallback: icon + name
  return (
    <ActionableElement
      outputType="hexagram"
      value={meta.id}
      label={name}
      onPress={handlePress ? () => handlePress() : undefined}
      onLongPress={handleLongPress ? () => handleLongPress() : undefined}
      defaultColor={colors.surface}
      colorScheme={context.colorScheme}
      style={[styles.card, compact && styles.cardCompact, style]}
    >
      <View style={styles.fallbackContent}>
        <Text style={[styles.icon, compact && styles.iconCompact]}>{icon}</Text>
        <Text
          style={[styles.name, { color: colors.text }, compact && styles.nameCompact]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
    </ActionableElement>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    padding: 12,
    alignItems: 'center',
  },
  cardCompact: {
    width: 90,
    padding: 8,
  },
  fallbackContent: {
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 28,
  },
  iconCompact: {
    fontSize: 20,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  nameCompact: {
    fontSize: 10,
  },
});
