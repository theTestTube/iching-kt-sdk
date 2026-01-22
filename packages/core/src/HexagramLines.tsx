import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { ColorScheme } from './types';
import { getAbstractColors } from './theme';

interface HexagramLinesProps {
  /** Binary string representation (e.g., '111111' for hexagram 1) */
  binary: string;
  /** Size of the hexagram (width) */
  size?: number;
  /** Line color for yang lines (overrides colorScheme default) */
  yangColor?: string;
  /** Line color for yin lines (overrides colorScheme default) */
  yinColor?: string;
  /** Gap color (for yin line middle gap) */
  gapColor?: string;
  /** Color scheme for theme-aware defaults */
  colorScheme?: ColorScheme;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

/**
 * HexagramLines - Renders the six lines of a hexagram
 *
 * Displays yang (solid) and yin (broken) lines based on binary representation.
 * Binary string: position 0 = bottom line, position 5 = top line
 * '1' = yang (solid line), '0' = yin (broken line with gap)
 */
export function HexagramLines({
  binary,
  size = 24,
  yangColor,
  yinColor,
  gapColor = 'transparent',
  colorScheme = 'light',
  style,
}: HexagramLinesProps) {
  // Get theme-aware default colors
  const abstractColors = getAbstractColors(colorScheme);
  const resolvedYangColor = yangColor ?? abstractColors.lines.yang;
  const resolvedYinColor = yinColor ?? abstractColors.lines.yin;
  const lineHeight = Math.max(1, Math.floor(size / 9));
  const lineGap = Math.max(1, Math.floor(size / 12));
  const yinGapWidth = Math.max(2, Math.floor(size / 6));

  // Reverse to render from top to bottom (binary[5] = top line)
  const lines = binary.split('').reverse();

  return (
    <View style={[styles.container, { width: size }, style]}>
      {lines.map((bit, index) => {
        const isYang = bit === '1';
        const color = isYang ? resolvedYangColor : resolvedYinColor;

        return (
          <View
            key={index}
            style={[
              styles.lineRow,
              { height: lineHeight, marginBottom: index < 5 ? lineGap : 0 },
            ]}
          >
            {isYang ? (
              // Yang line: solid
              <View style={[styles.solidLine, { backgroundColor: color }]} />
            ) : (
              // Yin line: broken with gap
              <>
                <View style={[styles.yinSegment, { backgroundColor: color }]} />
                <View style={[styles.yinGap, { width: yinGapWidth, backgroundColor: gapColor }]} />
                <View style={[styles.yinSegment, { backgroundColor: color }]} />
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}

/**
 * Get binary representation for a hexagram based on upper and lower trigrams
 */
export function getHexagramBinary(upperTrigram: string, lowerTrigram: string): string {
  const TRIGRAM_BINARY: Record<string, string> = {
    heaven: '111',
    lake: '110',
    fire: '101',
    thunder: '100',
    wind: '011',
    water: '010',
    mountain: '001',
    earth: '000',
  };

  const upper = TRIGRAM_BINARY[upperTrigram] || '000';
  const lower = TRIGRAM_BINARY[lowerTrigram] || '000';

  return upper + lower;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  solidLine: {
    flex: 1,
    height: '100%',
  },
  yinSegment: {
    flex: 1,
    height: '100%',
  },
  yinGap: {
    height: '100%',
  },
});
