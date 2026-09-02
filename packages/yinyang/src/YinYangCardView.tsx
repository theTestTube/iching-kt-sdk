import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KnowletCardViewProps, getThemeColors, getAbstractColors, CARD_TYPOGRAPHY, CARD_SPACING } from '@iching-kt/core';
import { getTranslation, parseYinYangInput } from './data';

export function YinYangCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  const { polarity, explanation } = parseYinYangInput(context.inputData);
  const t = getTranslation(context.language);

  if (!polarity || !t.polarities[polarity]) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={styles.icon}>☯</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {context.language === 'zh' ? '陰陽' : context.language === 'es' ? 'Yin/Yang' : 'Yin/Yang'}
        </Text>
      </View>
    );
  }

  const info = t.polarities[polarity];
  const aColor = abstractColors.yinyang[polarity].activeColor;
  const textColor = polarity === 'yang' ? '#1a1a1a' : '#ffffff';

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.badge, { backgroundColor: aColor }]}>
        <Text style={[styles.chinese, { fontSize: compact ? 22 : 28, color: textColor }]}>
          {info.chinese}
        </Text>
      </View>
      <Text style={[styles.name, { color: colors.text }]}>{info.pinyin}</Text>
      {explanation && (
        <Text
          testID="yinyang-card-explanation"
          style={[styles.explanation, { color: colors.textSecondary }]}
          numberOfLines={compact ? 3 : undefined}
        >
          {explanation}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: CARD_SPACING.padding,
    gap: CARD_SPACING.gap,
  },
  icon: {
    ...CARD_TYPOGRAPHY.displayIcon,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Badge glyph sized to the 52px badge, not the content-text scale.
  chinese: {
    fontWeight: 'bold',
  },
  label: {
    ...CARD_TYPOGRAPHY.label,
  },
  name: {
    ...CARD_TYPOGRAPHY.title,
  },
  explanation: {
    ...CARD_TYPOGRAPHY.caption,
    lineHeight: 15,
    textAlign: 'center',
  },
});
