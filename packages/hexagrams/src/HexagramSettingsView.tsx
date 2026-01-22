import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { KnowletSettings } from '@iching-kt/core';

interface Props {
  settings: KnowletSettings;
  onChange: (settings: KnowletSettings) => void;
}

const TRANSLATION_SOURCES = [
  { label: 'Wilhelm-Baynes (1950)', value: 'wilhelm' },
  { label: 'James Legge (1882)', value: 'legge' },
];

export function HexagramSettingsView({ settings, onChange }: Props) {
  const currentSource = (settings.translationSource as string) || 'wilhelm';

  const handleSourceChange = (source: string) => {
    onChange({ ...settings, translationSource: source });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Translation Source</Text>
      <Text style={styles.description}>
        Choose which translation to display for hexagram interpretations
      </Text>

      <View style={styles.optionsContainer}>
        {TRANSLATION_SOURCES.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              currentSource === option.value && styles.optionSelected,
            ]}
            onPress={() => handleSourceChange(option.value)}
          >
            <View style={styles.radioButton}>
              {currentSource === option.value && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.infoText}>
        Wilhelm-Baynes is a modern, accessible translation. James Legge is a
        classical, scholarly translation from the 19th century.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.7,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  optionSelected: {
    borderColor: '#000',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 12,
    opacity: 0.6,
    lineHeight: 18,
  },
});
