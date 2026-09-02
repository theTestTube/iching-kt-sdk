import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { KnowletContext, getThemeColors, getAbstractColors } from '@iching-kt/core';
import { YinYangId, YIN_YANG_ORDER, getTranslation, parseYinYangInput } from './data';

interface Props {
  context: KnowletContext;
}

export function YinYangView({ context }: Props) {
  const inputPolarity = parseYinYangInput(context.inputData).polarity;
  const [selected, setSelected] = useState<YinYangId>(inputPolarity ?? 'yin');

  const t = getTranslation(context.language);
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  const info = t.polarities[selected];
  const aColor = abstractColors.yinyang[selected].activeColor;
  const dColor = abstractColors.yinyang[selected].defaultColor;
  const headerTextColor = selected === 'yang' ? '#1a1a1a' : '#ffffff';

  const handlePolarityPress = (id: YinYangId) => {
    setSelected(id);
    context.emitOutput('yinyang', id);
  };

  const handleElementPress = () => {
    context.emitOutput('element', info.elementId);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Toggle */}
      <View style={[styles.toggle, { backgroundColor: colors.surface }]}>
        {YIN_YANG_ORDER.map((id) => {
          const isActive = id === selected;
          const ac = abstractColors.yinyang[id].activeColor;
          const tc = id === 'yang' ? '#1a1a1a' : '#ffffff';
          return (
            <Pressable
              key={id}
              style={[
                styles.toggleButton,
                { backgroundColor: isActive ? ac : colors.background, borderColor: ac },
              ]}
              onPress={() => handlePolarityPress(id)}
            >
              <Text style={[styles.toggleChar, { color: isActive ? tc : ac }]}>
                {t.polarities[id].chinese}
              </Text>
              <Text style={[styles.togglePinyin, { color: isActive ? tc : colors.textSecondary }]}>
                {t.polarities[id].pinyin}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: aColor }]}>
        <Text style={[styles.headerChinese, { color: headerTextColor }]}>{info.chinese}</Text>
        <Text style={[styles.headerPinyin, { color: headerTextColor, opacity: 0.85 }]}>
          {info.pinyin}
        </Text>
      </View>

      {/* Description */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.description, { color: colors.text }]}>{info.description}</Text>
      </View>

      {/* Qualities */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.labels.qualities}
        </Text>
        <View style={styles.qualitiesWrap}>
          {info.qualities.map((q, i) => (
            <View
              key={i}
              style={[
                styles.chip,
                {
                  backgroundColor: i < 3 ? aColor : dColor,
                  borderColor: aColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: i < 3
                      ? (selected === 'yang' ? '#1a1a1a' : '#ffffff')
                      : aColor,
                  },
                ]}
              >
                {q}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Element emit button */}
      <View style={[styles.section, styles.emitRow, { backgroundColor: colors.surface, marginBottom: 24 }]}>
        <Pressable
          style={[styles.emitButton, { backgroundColor: dColor, borderColor: aColor }]}
          onPress={handleElementPress}
          onLongPress={() => context.showKnowletSelector('element', info.elementId)}
        >
          <Text style={[styles.emitButtonText, { color: aColor }]}>
            {t.labels.element}: {info.elementLabel}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toggle: {
    flexDirection: 'row',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 10,
    overflow: 'hidden',
    gap: 12,
    padding: 8,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 2,
  },
  toggleChar: { fontSize: 22, fontWeight: 'bold' },
  togglePinyin: { fontSize: 13 },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  headerChinese: { fontSize: 72, fontWeight: 'bold' },
  headerPinyin: { fontSize: 20, marginTop: 4 },
  section: {
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  description: { fontSize: 15, lineHeight: 22, paddingVertical: 4 },
  qualitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: '500' },
  emitRow: { flexDirection: 'row' },
  emitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  emitButtonText: { fontSize: 14, fontWeight: '600' },
});
