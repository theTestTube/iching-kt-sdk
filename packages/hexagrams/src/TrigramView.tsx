import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { KnowletContext, getThemeColors, isOriginLanguage } from '@iching-kt/core';
import { getTrigram, getTrigramTranslation } from '@iching-kt/data-hexagrams';
import type { TrigramId } from '@iching-kt/data-hexagrams';

interface Props {
  context: KnowletContext;
}

export function TrigramView({ context }: Props) {
  const trigramId = context.inputData?.type === 'trigram'
    ? (context.inputData.value as TrigramId)
    : 'heaven';

  const colors = getThemeColors(context.colorScheme);
  const hideOriginRef = isOriginLanguage(context.language);
  const trigram = getTrigram(trigramId);
  const translation = getTrigramTranslation(trigramId, context.language);

  if (!trigram || !translation) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.textSecondary }]}>
          {context.language === 'es' ? 'Trigrama no encontrado' :
           context.language === 'zh' ? '未找到三畫卦' :
           'Trigram not found'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}>
      <View style={styles.heroSection}>
        <Text style={[styles.unicode, { color: colors.text }]}>{trigram.unicode}</Text>
      </View>
      {!hideOriginRef && (
        <Text style={[styles.chinese, { color: colors.text }]}>{trigram.chinese}</Text>
      )}
      {!hideOriginRef && (
        <Text style={[styles.pinyin, { color: colors.textSecondary }]}>{trigram.pinyin}</Text>
      )}
      <Text style={[styles.name, { color: colors.text }]}>{translation.name}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{translation.description}</Text>

      <View style={[styles.binarySection, { borderTopColor: colors.border }]}>
        <Text style={[styles.binaryLabel, { color: colors.textTertiary }]}>Binary</Text>
        <Text style={[styles.binaryValue, { color: colors.text }]}>{trigram.binary}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
  },
  unicode: {
    fontSize: 120,
    lineHeight: 140,
  },
  chinese: {
    fontSize: 48,
    fontWeight: '300',
    marginTop: -8,
  },
  pinyin: {
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  binarySection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    width: '100%',
  },
  binaryLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  binaryValue: {
    fontSize: 24,
    fontFamily: 'monospace',
    letterSpacing: 4,
    marginTop: 4,
  },
});
