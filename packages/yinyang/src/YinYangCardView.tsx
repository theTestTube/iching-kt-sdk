import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KnowletCardViewProps, getThemeColors, getAbstractColors } from '@iching-kt/core';
import { YinYangId, getTranslation } from './data';

export function YinYangCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  const polarity = context.inputData?.value as YinYangId | undefined;
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 6,
  },
  icon: {
    fontSize: 28,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chinese: {
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
  },
});
