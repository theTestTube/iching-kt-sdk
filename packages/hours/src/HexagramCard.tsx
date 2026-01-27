import { View, Text, StyleSheet } from 'react-native';
import { KnowletContext, ActionableElement, getThemeColors } from '@iching-kt/core';
import { getHexagram, getHexagramTranslationBySource } from '@iching-kt/data-hexagrams';
import { getTranslationSourceForLanguage } from '@iching-kt/core';

interface Props {
  context: KnowletContext;
  hexagramNumber: number;
  label?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: any;
}

/**
 * Miniaturized hexagram card component used for displaying hexagram information
 * in compact views like HoursView.
 *
 * Uses the user's translation source preferences to ensure consistent translations
 * across the application.
 */
export function HexagramCard({
  context,
  hexagramNumber,
  label,
  onPress,
  onLongPress,
  style,
}: Props) {
  const colors = getThemeColors(context.colorScheme);
  const hexagram = getHexagram(hexagramNumber);

  // Get translation using the user's preferred source for their language
  const translationSource = getTranslationSourceForLanguage(
    context.language,
    context.translationPreferences
  );
  const translation = getHexagramTranslationBySource(
    hexagramNumber,
    context.language,
    translationSource as any
  );

  if (!hexagram || !translation) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.error, { color: colors.textSecondary }]}>Hexagram not found</Text>
      </View>
    );
  }

  return (
    <ActionableElement
      outputType="hexagram"
      value={hexagramNumber}
      label={`Hexagram ${hexagram.number}: ${translation.name}`}
      onPress={onPress}
      onLongPress={onLongPress}
      isActive={false}
      defaultColor={colors.surfaceSecondary}
      style={[styles.card, style]}
    >
      {label && (
        <View style={styles.header}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.unicode, { color: colors.text }]}>{hexagram.unicode}</Text>
        <View style={styles.info}>
          <Text style={[styles.number, { color: colors.textTertiary }]}>#{hexagram.number}</Text>
          <Text style={[styles.name, { color: colors.text }]}>{translation.name}</Text>
          <Text style={[styles.chinese, { color: colors.textSecondary }]}>
            {hexagram.chinese} ({hexagram.pinyin})
          </Text>
        </View>
      </View>
    </ActionableElement>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  error: {
    fontSize: 14,
  },
  card: {
    width: '100%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unicode: {
    fontSize: 64,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  number: {
    fontSize: 12,
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  chinese: {
    fontSize: 14,
  },
});
