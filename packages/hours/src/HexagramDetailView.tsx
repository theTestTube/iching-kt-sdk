import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { KnowletContext, ActionableElement, getThemeColors } from '@iching-kt/core';
import { getHexagram, getHexagramTranslation } from '@iching-kt/data-hexagrams';

interface Props {
  context: KnowletContext;
  hexagramNumber: number;
}

const TRIGRAM_SYMBOLS: Record<string, string> = {
  heaven: '☰', lake: '☱', fire: '☲', thunder: '☳',
  wind: '☴', water: '☵', mountain: '☶', earth: '☷',
};

export function HexagramDetailView({ context, hexagramNumber }: Props) {
  const colors = getThemeColors(context.colorScheme);

  // Handle Android hardware back button to go back in knowlet history
  useEffect(() => {
    const onBackPress = () => {
      if (context.popView) {
        context.popView();
        return true; // prevent default exit
      }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      subscription.remove();
    };
  }, [context]);
  const hexagram = getHexagram(hexagramNumber);
  const translation = getHexagramTranslation(hexagramNumber, context.language);

  if (!hexagram || !translation) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.textSecondary }]}>Hexagram not found</Text>
      </View>
    );
  }

  const handleTrigramPress = (trigramId: string) => {
    // Trigram detail view could be added later
    context.emitOutput('trigram', trigramId);
  };

  const handleTrigramLongPress = (trigramId: string) => {
    context.showKnowletSelector('trigram', trigramId);
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => context.popView?.()} style={[styles.backButton, { backgroundColor: colors.surfaceSecondary }]} accessibilityLabel="Go back" accessibilityRole="button">
          <Text style={[styles.backIcon, { color: colors.primary }]}>←</Text>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>
            {context.language === 'es' ? 'Atrás' : 'Back'}
          </Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>#{hexagram.number}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={[styles.unicode, { color: colors.text }]}>{hexagram.unicode}</Text>
          <Text style={[styles.chinese, { color: colors.text }]}>{hexagram.chinese}</Text>
          <Text style={[styles.pinyin, { color: colors.textSecondary }]}>{hexagram.pinyin}</Text>
        </View>

        <Text style={[styles.name, { color: colors.text }]}>{translation.name}</Text>
        <Text style={[styles.meaning, { color: colors.textSecondary }]}>{translation.meaning}</Text>

        {/* Actionable trigrams */}
        <View style={styles.trigramRow}>
          <ActionableElement
            outputType="trigram"
            value={hexagram.upperTrigram}
            label={`Upper trigram: ${hexagram.upperTrigram}`}
            onPress={() => handleTrigramPress(hexagram.upperTrigram)}
            onLongPress={() => handleTrigramLongPress(hexagram.upperTrigram)}
            isActive={false}
            colorScheme={context.colorScheme}
            style={styles.trigramBox}
          >
            <Text style={[styles.trigramLabel, { color: colors.textTertiary }]}>
              {context.language === 'es' ? 'Superior' : 'Upper'}
            </Text>
            <Text style={[styles.trigramSymbol, { color: colors.text }]}>{TRIGRAM_SYMBOLS[hexagram.upperTrigram]}</Text>
            <Text style={[styles.trigramValue, { color: colors.text }]}>{hexagram.upperTrigram}</Text>
          </ActionableElement>

          <ActionableElement
            outputType="trigram"
            value={hexagram.lowerTrigram}
            label={`Lower trigram: ${hexagram.lowerTrigram}`}
            onPress={() => handleTrigramPress(hexagram.lowerTrigram)}
            onLongPress={() => handleTrigramLongPress(hexagram.lowerTrigram)}
            isActive={false}
            colorScheme={context.colorScheme}
            style={styles.trigramBox}
          >
            <Text style={[styles.trigramLabel, { color: colors.textTertiary }]}>
              {context.language === 'es' ? 'Inferior' : 'Lower'}
            </Text>
            <Text style={[styles.trigramSymbol, { color: colors.text }]}>{TRIGRAM_SYMBOLS[hexagram.lowerTrigram]}</Text>
            <Text style={[styles.trigramValue, { color: colors.text }]}>{hexagram.lowerTrigram}</Text>
          </ActionableElement>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
            {context.language === 'es' ? 'El Dictamen' : 'The Judgment'}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>{translation.judgment}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
            {context.language === 'es' ? 'La Imagen' : 'The Image'}
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>{translation.image}</Text>
        </View>

        <View style={[styles.binarySection, { borderTopColor: colors.border }]}>
          <Text style={[styles.binaryLabel, { color: colors.textTertiary }]}>Binary</Text>
          <Text style={[styles.binaryValue, { color: colors.text }]}>{hexagram.binary}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 16,
    paddingLeft: 4,
    borderRadius: 6,
  },
  backIcon: {
    fontSize: 20,
    marginRight: 6,
    fontWeight: 'bold',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 8,
  },
  meaning: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  trigramRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  trigramBox: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  trigramLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trigramSymbol: {
    fontSize: 32,
    marginVertical: 4,
  },
  trigramValue: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  binarySection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
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
