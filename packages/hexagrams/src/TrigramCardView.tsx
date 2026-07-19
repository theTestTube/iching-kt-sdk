import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getThemeColors, CARD_TYPOGRAPHY, CARD_SPACING } from '@iching-kt/core';
import type { KnowletCardViewProps } from '@iching-kt/core';
import { getTrigram, getTrigramTranslation } from '@iching-kt/data-hexagrams';
import type { TrigramId } from '@iching-kt/data-hexagrams';

export function TrigramCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);

  const trigramId = context.inputData?.type === 'trigram'
    ? (context.inputData.value as TrigramId)
    : null;

  if (!trigramId) {
    return (
      <View style={styles.content}>
        <Text style={[styles.icon, compact && styles.iconCompact]}>☰</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {context.language === 'zh' ? '三畫卦' : context.language === 'es' ? 'Trigramas' : 'Trigrams'}
        </Text>
      </View>
    );
  }

  const trigram = getTrigram(trigramId);
  const translation = getTrigramTranslation(trigramId, context.language);
  if (!trigram) return null;

  return (
    <View style={styles.content}>
      <Text style={[styles.unicode, compact && styles.unicodeCompact, { color: colors.text }]}>
        {trigram.unicode}
      </Text>
      <Text style={[styles.name, { color: colors.text }, compact && styles.nameCompact]} numberOfLines={1}>
        {translation?.name ?? trigram.chinese}
      </Text>
      <Text style={[styles.chinese, { color: colors.textSecondary }]}>
        {trigram.chinese}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: CARD_SPACING.gapXs,
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
  unicode: {
    ...CARD_TYPOGRAPHY.displayIcon,
  },
  unicodeCompact: {
    ...CARD_TYPOGRAPHY.displayIconCompact,
  },
  name: {
    ...CARD_TYPOGRAPHY.title,
    textAlign: 'center',
  },
  nameCompact: {
    ...CARD_TYPOGRAPHY.titleCompact,
  },
  chinese: {
    ...CARD_TYPOGRAPHY.caption,
    textAlign: 'center',
  },
});
