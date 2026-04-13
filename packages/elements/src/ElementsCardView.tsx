import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KnowletCardViewProps, getThemeColors, getAbstractColors } from '@iching-kt/core';
import { WuXingId, getTranslation } from './data';

export function ElementsCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  const element = context.inputData?.value as WuXingId | undefined;
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
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
