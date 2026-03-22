import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ColorScheme } from './types';
import { getAbstractColors } from './theme';
import { getThemeColors } from './theme';

interface HexagramLineValuesProps {
  /** Array of 6 line values (index 0 = line 1 bottom). Values: 6|7|8|9|null */
  lines: (number | null)[];
  /** 0-5: highlights that row as the currently active line */
  activeIndex?: number;
  /** Width of the graphical line area (default 40) */
  size?: number;
  /** Color scheme for theme-aware defaults */
  colorScheme?: ColorScheme;
  /** Custom style for the outer container */
  style?: StyleProp<ViewStyle>;
}

/**
 * HexagramLineValues - Renders six hexagram lines from coin-toss values (6/7/8/9/null).
 *
 * Displays lines from top (index 5) to bottom (index 0), matching traditional I Ching convention.
 * - 7 (young yang): solid bar, stable color
 * - 8 (young yin): broken line with gap, stable color
 * - 9 (old yang): solid bar with × marker, changing/accent color
 * - 6 (old yin): broken line with × marker, changing/accent color
 * - null: placeholder (greyed-out broken line)
 *
 * Optional activeIndex highlights the row being set.
 */
export function HexagramLineValues({
  lines,
  activeIndex,
  size = 40,
  colorScheme = 'light',
  style,
}: HexagramLineValuesProps) {
  const abstractColors = getAbstractColors(colorScheme);
  const themeColors = getThemeColors(colorScheme);

  const lineHeight = Math.max(2, Math.floor(size / 8));
  const lineGap = Math.max(2, Math.floor(size / 10));
  const yinGapWidth = Math.max(3, Math.floor(size / 5));
  const slotHeight = lineHeight + lineGap;
  const markerFontSize = Math.floor(slotHeight * 0.8);

  // Render from top to bottom (index 5 first, index 0 last)
  const displayOrder = [5, 4, 3, 2, 1, 0];

  return (
    <View style={[styles.container, { width: size }, style]}>
      {displayOrder.map((lineIdx, displayIdx) => {
        const value = lines[lineIdx] ?? null;
        const isActive = lineIdx === activeIndex;
        const isChanging = value === 6 || value === 9;
        const isYang = value === 7 || value === 9;
        const isNull = value === null;

        const lineColor = isNull
          ? abstractColors.lines.yin + '4D' // 30% opacity for placeholder
          : isChanging
            ? themeColors.accent
            : isYang
              ? abstractColors.lines.yang
              : abstractColors.lines.yin;

        const markerChar = value === 9 ? '×' : value === 6 ? '○' : null;

        // Line segments shared between normal and changing render paths
        const lineSegments = isYang || isNull ? (
          <View style={[styles.solidLine, { backgroundColor: lineColor, height: lineHeight }]} />
        ) : (
          <>
            <View style={[styles.yinSegment, { backgroundColor: lineColor, height: lineHeight }]} />
            <View style={{ width: yinGapWidth }} />
            <View style={[styles.yinSegment, { backgroundColor: lineColor, height: lineHeight }]} />
          </>
        );

        return (
          <View
            key={lineIdx}
            style={[
              styles.lineRow,
              { height: slotHeight },
              isActive && { backgroundColor: themeColors.surface },
            ]}
          >
            <View style={[StyleSheet.absoluteFill, styles.lineArea]}>
              {lineSegments}
            </View>
            {isChanging && (
              <Text
                style={[
                  styles.markerText,
                  {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    color: '#fff',
                    fontSize: markerFontSize,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    textShadowColor: '#000',
                    textShadowRadius: 6,
                    textShadowOffset: { width: 0, height: 0 },
                  },
                ]}
              >
                {markerChar}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  lineRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineArea: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  solidLine: {
    flex: 1,
  },
  yinSegment: {
    flex: 1,
  },
  markerText: {
    fontWeight: '700',
    includeFontPadding: false,
  },
});
