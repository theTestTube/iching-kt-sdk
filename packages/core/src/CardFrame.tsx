import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from './theme';
import type { CardStyle, ColorScheme } from './types';

/** Fixed outer dimensions per card grammar. KnowletCard applies these to its press box. */
export const CARD_FRAME_DIMENSIONS: Record<CardStyle, { width: number; height: number; borderRadius: number }> = {
  tiles: { width: 100, height: 100, borderRadius: 14 },
  album: { width: 120, height: 160, borderRadius: 16 },
};

export interface CardFrameProps {
  /** Which visual grammar to render. */
  variant: CardStyle;
  /** Localized knowlet (board) name shown in the frame header/overlay. */
  name: string;
  /** Knowlet icon glyph. */
  icon: string;
  /** Color scheme for theme-aware text. */
  colorScheme: ColorScheme;
  /** The knowlet's CardView (or fallback) — rendered as the card body. */
  children: React.ReactNode;
}

/**
 * CardFrame — uniform header/overlay chrome around a knowlet's CardView body (#82).
 *
 * The frame owns the board identity (icon + localized name); the CardView body
 * owns the content. Two grammars, user-selectable and persisted:
 *
 * - `tiles`: header strip on top, body below — title always legible, square footprint.
 * - `album`: body fills the card, title floats on a translucent overlay at the bottom.
 *
 * Rendered inside ActionableElement, which supplies the card background, rounded
 * corners and press behaviour; CardFrame lays out only the interior. KnowletCard
 * sizes the outer box via CARD_FRAME_DIMENSIONS.
 */
export function CardFrame({ variant, name, icon, colorScheme, children }: CardFrameProps) {
  const colors = getThemeColors(colorScheme);

  if (variant === 'album') {
    return (
      <View style={styles.fill}>
        <View style={styles.albumBody}>{children}</View>
        <View style={[styles.albumOverlay, { backgroundColor: colors.background + 'CC' }]}>
          <Text style={[styles.overlayIcon, { color: colors.textSecondary }]}>{icon}</Text>
          <Text style={[styles.overlayName, { color: colors.text }]} numberOfLines={1}>
            {name}
          </Text>
        </View>
      </View>
    );
  }

  // tiles (default)
  return (
    <View style={styles.fill}>
      <View style={[styles.tileHeader, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerIcon, { color: colors.textSecondary }]}>{icon}</Text>
        <Text style={[styles.headerName, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
      </View>
      <View style={styles.tileBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  // tiles
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  headerIcon: {
    fontSize: 11,
  },
  headerName: {
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
  tileBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // album
  albumBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  albumOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 5,
  },
  overlayIcon: {
    fontSize: 12,
  },
  overlayName: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
});
