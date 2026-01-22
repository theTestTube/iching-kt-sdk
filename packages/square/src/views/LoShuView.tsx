import { View, Text, StyleSheet } from 'react-native';
import { KnowletContext, ActionableElement, getThemeColors, getAbstractColors } from '@iching-kt/core';
import type { SolarTimeData, EarthlyBranch } from '@iching-kt/provider-solar-time';

interface Props {
  context: KnowletContext;
}

/**
 * Lo Shu Magic Square (洛書)
 *
 * Traditional 3x3 arrangement:
 *   4  9  2
 *   3  5  7
 *   8  1  6
 *
 * Mapped to trigrams and directions
 */
const LO_SHU_GRID = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

const LO_SHU_TRIGRAMS: Record<number, { trigram: string; trigramId: string; direction: string; element: string }> = {
  1: { trigram: '☵', trigramId: 'water', direction: 'N', element: 'Water' },
  2: { trigram: '☷', trigramId: 'earth', direction: 'SW', element: 'Earth' },
  3: { trigram: '☳', trigramId: 'thunder', direction: 'E', element: 'Wood' },
  4: { trigram: '☴', trigramId: 'wind', direction: 'SE', element: 'Wood' },
  5: { trigram: '☯', trigramId: 'center', direction: 'Center', element: 'Earth' },
  6: { trigram: '☰', trigramId: 'heaven', direction: 'NW', element: 'Metal' },
  7: { trigram: '☱', trigramId: 'lake', direction: 'W', element: 'Metal' },
  8: { trigram: '☶', trigramId: 'mountain', direction: 'NE', element: 'Earth' },
  9: { trigram: '☲', trigramId: 'fire', direction: 'S', element: 'Fire' },
};

const BRANCH_TO_LOSHU: Record<EarthlyBranch, number> = {
  zi: 1, chou: 8, yin: 3, mao: 3, chen: 4, si: 9,
  wu: 9, wei: 2, shen: 7, you: 7, xu: 6, hai: 1,
};

// Map element names to abstract color keys
const ELEMENT_TO_KEY: Record<string, 'water' | 'wood' | 'fire' | 'earth' | 'metal'> = {
  Water: 'water',
  Wood: 'wood',
  Fire: 'fire',
  Earth: 'earth',
  Metal: 'metal',
};

export function LoShuView({ context }: Props) {
  const solarTimeData = context.situations['solar-time'] as SolarTimeData | undefined;
  const currentBranch = solarTimeData?.earthlyBranch;
  const activeLoshu = currentBranch ? BRANCH_TO_LOSHU[currentBranch] : undefined;
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  const handlePress = (num: number) => {
    const info = LO_SHU_TRIGRAMS[num];
    if (info && num !== 5) {
      // Trigram detail view could be added later
      context.emitOutput('trigram', info.trigramId);
    }
  };

  const handleLongPress = (num: number) => {
    const info = LO_SHU_TRIGRAMS[num];
    if (info && num !== 5) {
      context.showKnowletSelector('trigram', info.trigramId);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {context.language === 'es' ? 'Cuadrado Lo Shu' : 'Lo Shu Square'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>洛書</Text>

      <View style={styles.grid}>
        {LO_SHU_GRID.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((num) => {
              const info = LO_SHU_TRIGRAMS[num];
              const isActive = num === activeLoshu;
              const elementKey = ELEMENT_TO_KEY[info.element];
              const bgColor = elementKey ? abstractColors.elements[elementKey].activeColor : colors.surfaceSecondary;

              return (
                <ActionableElement
                  key={num}
                  outputType="trigram"
                  value={info.trigramId}
                  label={`${info.trigram} ${info.direction}`}
                  onPress={() => handlePress(num)}
                  onLongPress={() => handleLongPress(num)}
                  isActive={isActive}
                  activeColor={bgColor}
                  colorScheme={context.colorScheme}
                  disabled={num === 5}
                  style={styles.cell}
                >
                  <Text style={[styles.trigram, { color: isActive ? '#fff' : colors.text }]}>
                    {info.trigram}
                  </Text>
                  <Text style={[styles.number, { color: isActive ? '#fff' : colors.text }]}>
                    {num}
                  </Text>
                  <Text style={[styles.direction, { color: isActive ? '#fff' : colors.textSecondary }]}>
                    {info.direction}
                  </Text>
                </ActionableElement>
              );
            })}
          </View>
        ))}
      </View>

      {currentBranch && (
        <View style={[styles.legend, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[styles.legendText, { color: colors.text }]}>
            {context.language === 'es' ? 'Hora actual: ' : 'Current hour: '}
            {currentBranch} ({activeLoshu})
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  grid: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trigram: {
    fontSize: 28,
    marginBottom: 4,
  },
  number: {
    fontSize: 18,
    fontWeight: '600',
  },
  direction: {
    fontSize: 11,
    marginTop: 2,
  },
  legend: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
  },
});
