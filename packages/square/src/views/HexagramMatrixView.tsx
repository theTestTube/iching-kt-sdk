import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { KnowletContext, ActionableElement, getThemeColors } from '@iching-kt/core';
import { getHexagram } from '@iching-kt/data-hexagrams';
import type { SolarTimeData } from '@iching-kt/provider-solar-time';
import type { EarthlyBranch } from '@iching-kt/provider-time';
import { getSovereignHexagram, sovereignSequence } from '@iching-kt/data-hexagrams';

interface Props {
  context: KnowletContext;
}

const TRIGRAM_ORDER = ['heaven', 'lake', 'fire', 'thunder', 'wind', 'water', 'mountain', 'earth'];
const TRIGRAM_SYMBOLS: Record<string, string> = {
  heaven: '☰', lake: '☱', fire: '☲', thunder: '☳',
  wind: '☴', water: '☵', mountain: '☶', earth: '☷',
};

const HEXAGRAM_MATRIX: number[][] = [
  [1, 43, 14, 34, 9, 5, 26, 11],
  [10, 58, 38, 54, 61, 60, 41, 19],
  [13, 49, 30, 55, 37, 63, 22, 36],
  [25, 17, 21, 51, 42, 3, 27, 24],
  [44, 28, 50, 32, 57, 48, 18, 46],
  [6, 47, 64, 40, 59, 29, 4, 7],
  [33, 31, 56, 62, 53, 39, 52, 15],
  [12, 45, 35, 16, 20, 8, 23, 2],
];

export function HexagramMatrixView({ context }: Props) {
  const solarTimeData = context.situations['solar-time'] as SolarTimeData | undefined;
  const currentBranch = solarTimeData?.shichen as EarthlyBranch | undefined;
  const currentSovereign = currentBranch ? getSovereignHexagram(currentBranch) : null;
  const activeHexagram = currentSovereign?.hexagramNumber;
  const colors = getThemeColors(context.colorScheme);

  const handlePress = (hexNum: number) => {
    context.emitOutput('hexagram', hexNum);
  };

  const handleLongPress = (hexNum: number) => {
    context.showKnowletSelector('hexagram', hexNum);
  };

  const isSovereign = (hexNum: number) =>
    sovereignSequence.includes(hexNum as typeof sovereignSequence[number]);

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {context.language === 'es' ? 'Matriz de Hexagramas' : 'Hexagram Matrix'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>六十四卦 (64 Hexagrams)</Text>

      {/* Column headers */}
      <View style={styles.headerRow}>
        <View style={styles.cornerCell} />
        {TRIGRAM_ORDER.map((trigram) => (
          <View key={trigram} style={styles.headerCell}>
            <Text style={[styles.trigramSymbol, { color: colors.text }]}>{TRIGRAM_SYMBOLS[trigram]}</Text>
          </View>
        ))}
      </View>

      {/* Matrix rows */}
      {HEXAGRAM_MATRIX.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.matrixRow}>
          <View style={styles.rowHeader}>
            <Text style={[styles.trigramSymbol, { color: colors.text }]}>{TRIGRAM_SYMBOLS[TRIGRAM_ORDER[rowIdx]]}</Text>
          </View>

          {row.map((hexNum, colIdx) => {
            const isActive = hexNum === activeHexagram;
            const isSov = isSovereign(hexNum);

            // Get Unicode character for the hexagram (all 64)
            let unicodeChar = '';
            const hexData = getHexagram(hexNum);
            if (hexData && hexData.unicode) {
              unicodeChar = hexData.unicode;
            } else if (hexNum >= 1 && hexNum <= 64) {
              // Unicode range U+4DC0 to U+4DFF (hexagram 1 = U+4DC0)
              unicodeChar = String.fromCodePoint(0x4DC0 + (hexNum - 1));
            }

            // Theme-aware sovereign cell styling
            const sovereignCellStyle = isSov && !isActive ? {
              borderWidth: 1,
              borderColor: context.colorScheme === 'dark' ? '#64b5f6' : '#1a73e8',
              backgroundColor: context.colorScheme === 'dark' ? colors.surface : '#e8f0fe',
            } : {};

            return (
              <ActionableElement
                key={`${rowIdx}-${colIdx}`}
                outputType="hexagram"
                value={hexNum}
                label={`Hexagram ${hexNum}`}
                onPress={() => handlePress(hexNum)}
                onLongPress={() => handleLongPress(hexNum)}
                isActive={isActive}
                colorScheme={context.colorScheme}
                style={[styles.cell, sovereignCellStyle]}
              >
                <Text style={{ fontSize: 22, textAlign: 'center', color: isActive ? '#fff' : colors.text }}>
                  {unicodeChar}
                </Text>
                <Text style={[styles.hexagramNumber, { color: isActive ? '#fff' : colors.textTertiary }]}>
                  {hexNum}
                </Text>
              </ActionableElement>
            );
          })}
        </View>
      ))}

      <View style={[styles.legend, { backgroundColor: colors.surfaceSecondary }]}>
        <View style={styles.legendItem}>
          <View style={[
            styles.legendDot,
            {
              backgroundColor: context.colorScheme === 'dark' ? '#5dade2' : '#1a1a2e',
            }
          ]} />
          <Text style={[styles.legendText, { color: colors.text }]}>
            {context.language === 'es' ? 'Actual' : 'Current'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[
            styles.legendDot,
            {
              backgroundColor: context.colorScheme === 'dark' ? colors.surface : '#e8f0fe',
              borderWidth: 1,
              borderColor: context.colorScheme === 'dark' ? '#64b5f6' : '#1a73e8',
            }
          ]} />
          <Text style={[styles.legendText, { color: colors.text }]}>
            {context.language === 'es' ? 'Soberano' : 'Sovereign'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  cornerCell: {
    width: 32,
    height: 32,
  },
  headerCell: {
    width: 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trigramSymbol: {
    fontSize: 16,
  },
  matrixRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  rowHeader: {
    width: 32,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
    borderRadius: 4,
  },
  hexagramNumber: {
    fontSize: 8,
  },
  legend: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
  },
});
