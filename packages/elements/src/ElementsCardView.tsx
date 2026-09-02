import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KnowletCardViewProps, getThemeColors, getAbstractColors, CARD_TYPOGRAPHY, CARD_SPACING } from '@iching-kt/core';
import { getTranslation, parseElementInput } from './data';

export function ElementsCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  const element = parseElementInput(context.inputData);
  const t = getTranslation(context.language);

  if (!element || !t.elements[element]) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.icon]}>☯</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {context.language === 'zh' ? '五行' : context.language === 'es' ? 'Elemento' : 'Element'}
        </Text>
      </View>
    );
  }

  const info = t.elements[element];
  const aColor = abstractColors.elements[element].activeColor;
  const dColor = abstractColors.elements[element].defaultColor;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.badge, { backgroundColor: aColor }]}>
        <Text style={[styles.chinese, { fontSize: compact ? 22 : 28 }]}>{info.chinese}</Text>
      </View>
      <Text style={[styles.name, { color: colors.text }]}>
        {element.charAt(0).toUpperCase() + element.slice(1)}
      </Text>
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
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    ...CARD_TYPOGRAPHY.label,
  },
  name: {
    ...CARD_TYPOGRAPHY.title,
    textTransform: 'capitalize',
  },
});
