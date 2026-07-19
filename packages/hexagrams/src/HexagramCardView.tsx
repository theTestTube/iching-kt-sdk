import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  HexagramLines,
  getThemeColors,
  getTranslationSourceForLanguage,
  isOriginLanguage,
  CARD_TYPOGRAPHY,
  CARD_SPACING,
} from '@iching-kt/core';
import type { KnowletCardViewProps } from '@iching-kt/core';
import { getHexagram, getHexagramTranslationBySource } from '@iching-kt/data-hexagrams';

/**
 * HexagramCardView - Compact card for hexagram display in conversations.
 *
 * Shows:
 * - Unicode symbol + hexagram number + translated name
 * - HexagramLines visualization
 * - For toss-originated hexagrams: notation (e.g., "24.3.1"), changing line dots,
 *   and relating hexagram ("→ #44 Coming to Meet")
 */
export function HexagramCardView({ context, compact, hexagramData }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);
  const hexNumber = hexagramData?.hexagramNumber;

  if (!hexNumber) {
    return (
      <View style={styles.content}>
        <Text style={[styles.icon, compact && styles.iconCompact]}>🔀</Text>
        <Text style={[styles.label, { color: colors.text }]}>
          {context.language === 'zh' ? '卦象' : context.language === 'es' ? 'Hexagrama' : 'Hexagram'}
        </Text>
      </View>
    );
  }

  const hex = getHexagram(hexNumber);
  if (!hex) return null;

  const source = getTranslationSourceForLanguage(context.language, context.translationPreferences);
  const translation = getHexagramTranslationBySource(hexNumber, context.language, source as any);
  const name = translation?.name ?? hex.chinese;
  const changingLines = hexagramData.changingLines ?? [];
  const relatingNumber = hexagramData.relatingHexagram;

  return (
    <View style={styles.content}>
      {/* Primary hexagram */}
      <View style={styles.primaryRow}>
        <Text style={[styles.unicode, compact && styles.unicodeCompact, { color: colors.text }]}>
          {hex.unicode}
        </Text>
        <View style={styles.info}>
          <Text style={[styles.number, { color: colors.textTertiary }]}>#{hexNumber}</Text>
          <Text
            style={[styles.name, { color: colors.text }, compact && styles.nameCompact]}
            numberOfLines={1}
          >
            {name}
          </Text>
          {!isOriginLanguage(context.language) && !compact && (
            <Text style={[styles.chinese, { color: colors.textSecondary }]}>
              {hex.chinese}
            </Text>
          )}
        </View>
        <HexagramLines binary={hex.binary} size={compact ? 20 : 28} colorScheme={context.colorScheme} />
      </View>

      {/* Notation + changing lines */}
      {hexagramData.notation && (
        <Text style={[styles.notation, { color: colors.textSecondary }]}>
          {hexagramData.notation}
        </Text>
      )}

      {changingLines.length > 0 && !hexagramData.notation && (
        <View style={styles.changingRow}>
          <Text style={[styles.changingLabel, { color: colors.textTertiary }]}>
            {context.language === 'zh' ? '變爻' : context.language === 'es' ? 'Líneas' : 'Lines'}
          </Text>
          <View style={styles.changingDots}>
            {[1, 2, 3, 4, 5, 6].map((line) => (
              <View
                key={line}
                style={[
                  styles.dot,
                  {
                    backgroundColor: changingLines.includes(line)
                      ? colors.accent
                      : colors.borderLight,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Relating hexagram */}
      {relatingNumber != null && (
        <RelatingHexagramRow
          relatingNumber={relatingNumber}
          language={context.language}
          translationPreferences={context.translationPreferences}
          colors={colors}
          colorScheme={context.colorScheme}
          compact={compact}
        />
      )}
    </View>
  );
}

function RelatingHexagramRow({
  relatingNumber,
  language,
  translationPreferences,
  colors,
  colorScheme,
  compact,
}: {
  relatingNumber: number;
  language: string;
  translationPreferences: any;
  colors: any;
  colorScheme: 'light' | 'dark';
  compact?: boolean;
}) {
  const relHex = getHexagram(relatingNumber);
  if (!relHex) return null;

  const source = getTranslationSourceForLanguage(language, translationPreferences);
  const relTranslation = getHexagramTranslationBySource(relatingNumber, language, source as any);
  const relName = relTranslation?.name ?? relHex.chinese;

  return (
    <View style={styles.relatingRow}>
      <Text style={[styles.relatingArrow, { color: colors.textTertiary }]}>→</Text>
      <Text style={[styles.relatingUnicode, { color: colors.textSecondary }]}>
        {relHex.unicode}
      </Text>
      <Text style={[styles.relatingInfo, { color: colors.textSecondary }]} numberOfLines={1}>
        #{relatingNumber} {relName}
      </Text>
      {!compact && (
        <HexagramLines binary={relHex.binary} size={16} colorScheme={colorScheme} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: CARD_SPACING.gapSm,
  },
  icon: {
    ...CARD_TYPOGRAPHY.displayIcon,
    textAlign: 'center',
  },
  iconCompact: {
    ...CARD_TYPOGRAPHY.displayIconCompact,
  },
  label: {
    ...CARD_TYPOGRAPHY.label,
    textAlign: 'center',
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unicode: {
    ...CARD_TYPOGRAPHY.displayIcon,
  },
  unicodeCompact: {
    ...CARD_TYPOGRAPHY.displayIconCompact,
  },
  info: {
    flex: 1,
  },
  number: {
    ...CARD_TYPOGRAPHY.micro,
  },
  name: {
    ...CARD_TYPOGRAPHY.title,
  },
  nameCompact: {
    ...CARD_TYPOGRAPHY.titleCompact,
  },
  chinese: {
    ...CARD_TYPOGRAPHY.caption,
  },
  notation: {
    ...CARD_TYPOGRAPHY.caption,
    fontFamily: 'monospace',
  },
  changingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CARD_SPACING.gap,
  },
  changingLabel: {
    ...CARD_TYPOGRAPHY.micro,
  },
  changingDots: {
    flexDirection: 'row',
    gap: 3,
  },
  // Changing-line dots sized as geometry, not text.
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  relatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CARD_SPACING.gapSm,
    paddingTop: 2,
  },
  // Connector arrow + mini relating glyph sized to the relating row, not the text scale.
  relatingArrow: {
    fontSize: 12,
    fontWeight: '600',
  },
  relatingUnicode: {
    fontSize: 14,
  },
  relatingInfo: {
    ...CARD_TYPOGRAPHY.caption,
    flex: 1,
  },
});
