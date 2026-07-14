import React from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ActionableElement } from './ActionableElement';
import { CardFrame, CARD_FRAME_DIMENSIONS } from './CardFrame';
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
  const cardStyle = context.cardStyle ?? 'tiles';
  const dims = CARD_FRAME_DIMENSIONS[cardStyle];

  const handlePress = onPress
    ? () => onPress(meta.id)
    : undefined;

  const handleLongPress = onLongPress
    ? () => onLongPress(meta.id)
    : undefined;

  // Body: the knowlet's CardView if available, else a large fallback icon.
  const body = knowlet.CardView ? (
    <knowlet.CardView context={context} compact={compact} hexagramData={hexagramData} />
  ) : (
    <Text style={styles.fallbackIcon}>{icon}</Text>
  );

  return (
    <ActionableElement
      outputType="hexagram"
      value={meta.id}
      label={name}
      onPress={handlePress ? () => handlePress() : undefined}
      onLongPress={handleLongPress ? () => handleLongPress() : undefined}
      defaultColor={colors.surface}
      colorScheme={context.colorScheme}
      style={[
        { width: dims.width, height: dims.height, borderRadius: dims.borderRadius },
        style,
      ]}
    >
      <CardFrame variant={cardStyle} name={name} icon={icon} colorScheme={context.colorScheme}>
        {body}
      </CardFrame>
    </ActionableElement>
  );
}

const styles = StyleSheet.create({
  fallbackIcon: {
    fontSize: 28,
  },
});
