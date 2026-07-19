import type { TextStyle } from 'react-native';
import { ColorScheme } from './types';

export interface ThemeColors {
  // Base colors
  background: string;
  surface: string;
  surfaceSecondary: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Border colors
  border: string;
  borderLight: string;

  // Semantic colors
  primary: string;
  accent: string;

  // Overlay
  overlay: string;
}

/** Color pair for interactive elements (active and default states) */
export interface ElementColorPair {
  activeColor: string;
  defaultColor: string;
}

/** Abstract I-Ching type colors */
export interface AbstractColors {
  // Five Elements (Wu Xing)
  elements: {
    water: ElementColorPair;
    wood: ElementColorPair;
    fire: ElementColorPair;
    earth: ElementColorPair;
    metal: ElementColorPair;
  };
  // Yin/Yang
  yinyang: {
    yin: ElementColorPair;
    yang: ElementColorPair;
  };
  // Trigrams
  trigram: ElementColorPair;
  // Hexagrams
  hexagram: ElementColorPair;
  // Line colors for HexagramLines component
  lines: {
    yang: string;
    yin: string;
  };
}

const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#f8f8f8',
  surfaceSecondary: '#f0f4f8',

  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#888888',
  textInverse: '#ffffff',

  border: '#e0e0e0',
  borderLight: '#f0f0f0',

  primary: '#007AFF',
  accent: '#1a1a2e',

  overlay: 'rgba(0, 0, 0, 0.5)',
};

const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1e1e1e',
  surfaceSecondary: '#2a2a2a',

  text: '#e0e0e0',
  textSecondary: '#a0a0a0',
  textTertiary: '#808080',
  textInverse: '#121212',

  border: '#3a3a3a',
  borderLight: '#2a2a2a',

  primary: '#0A84FF',
  accent: '#e0e0e0',

  overlay: 'rgba(0, 0, 0, 0.7)',
};

const lightAbstractColors: AbstractColors = {
  elements: {
    water: { activeColor: '#1a73e8', defaultColor: '#e3f2fd' },
    wood: { activeColor: '#34a853', defaultColor: '#e8f5e9' },
    fire: { activeColor: '#ea4335', defaultColor: '#ffebee' },
    earth: { activeColor: '#a67c52', defaultColor: '#efebe9' },
    metal: { activeColor: '#757575', defaultColor: '#f5f5f5' },
  },
  yinyang: {
    yin: { activeColor: '#1a1a1a', defaultColor: '#e0e0e0' },
    yang: { activeColor: '#ffd700', defaultColor: '#fffde7' },
  },
  trigram: { activeColor: '#16213e', defaultColor: '#e8f0fe' },
  hexagram: { activeColor: '#1a1a2e', defaultColor: '#f0f4f8' },
  lines: { yang: '#333333', yin: '#333333' },
};

const darkAbstractColors: AbstractColors = {
  elements: {
    water: { activeColor: '#64b5f6', defaultColor: '#1a3a5c' },
    wood: { activeColor: '#81c784', defaultColor: '#1b3d1b' },
    fire: { activeColor: '#ef5350', defaultColor: '#4a1a1a' },
    earth: { activeColor: '#bcaaa4', defaultColor: '#3d2e26' },
    metal: { activeColor: '#b0b0b0', defaultColor: '#2a2a2a' },
  },
  yinyang: {
    yin: { activeColor: '#e0e0e0', defaultColor: '#2a2a2a' },
    yang: { activeColor: '#ffd700', defaultColor: '#3a3a2e' },
  },
  trigram: { activeColor: '#a8c0ff', defaultColor: '#1a2a4e' },
  hexagram: { activeColor: '#5dade2', defaultColor: '#1e2a3e' },
  lines: { yang: '#e0e0e0', yin: '#e0e0e0' },
};

export function getThemeColors(colorScheme: ColorScheme): ThemeColors {
  return colorScheme === 'dark' ? darkColors : lightColors;
}

export function useThemeColors(colorScheme: ColorScheme): ThemeColors {
  return getThemeColors(colorScheme);
}

export function getAbstractColors(colorScheme: ColorScheme): AbstractColors {
  return colorScheme === 'dark' ? darkAbstractColors : lightAbstractColors;
}

export function useAbstractColors(colorScheme: ColorScheme): AbstractColors {
  return getAbstractColors(colorScheme);
}

/** A card text role: font size + optional weight + optional line height. */
export interface CardTextStyle {
  fontSize: number;
  fontWeight?: TextStyle['fontWeight'];
  lineHeight?: number;
}

/**
 * Shared typography scale for knowlet card **content** (#82). Text-content
 * CardViews derive their font sizes/weights from these roles instead of
 * hard-coding literals, so cards read as one system. `*Compact` variants apply
 * when a CardView renders in `compact` mode. Sizes are color-scheme independent.
 *
 * Deliberately NOT governed by this scale (see CARD_TYPOGRAPHY consumers):
 * - Glyphs sized to fixed geometry: the square boards' cell glyphs
 *   (LoShu/HeTu/matrix/branches) and the compass rose derive their sizes from
 *   their own cell/rose dimensions, not from body-text roles.
 * - CardFrame chrome: the frame header/overlay is tuned to the fixed 100/120px
 *   card footprint, a separate concern from CardView body content.
 */
export const CARD_TYPOGRAPHY = {
  /** Large placeholder glyph when a card has no content yet (☯ / 🔀 / ⏰). */
  displayIcon: { fontSize: 28 } as CardTextStyle,
  displayIconCompact: { fontSize: 20 } as CardTextStyle,
  /** Content name / heading (hexagram, trigram, phase, element name). */
  title: { fontSize: 13, fontWeight: '600' } as CardTextStyle,
  titleCompact: { fontSize: 11, fontWeight: '600' } as CardTextStyle,
  /** Placeholder caption under the display icon (board label fallback). */
  label: { fontSize: 12, fontWeight: '500' } as CardTextStyle,
  /** Secondary text: Chinese gloss, explanation, notation, relating info. */
  caption: { fontSize: 11 } as CardTextStyle,
  /** Smallest meta: numbers, tiny labels. */
  micro: { fontSize: 10 } as CardTextStyle,
} as const;

/** Shared inner spacing scale for card content (#82). */
export const CARD_SPACING = {
  /** Tight gap between stacked glyph + label. */
  gapXs: 2,
  gapSm: 4,
  gap: 6,
  /** Inner padding for content that paints its own surface. */
  padding: 8,
} as const;
