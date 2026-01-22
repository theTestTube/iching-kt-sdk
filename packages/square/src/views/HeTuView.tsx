import { View, Text, StyleSheet } from 'react-native';
import { KnowletContext, ActionableElement, getThemeColors, getAbstractColors } from '@iching-kt/core';
import type { SolarTimeData } from '@iching-kt/provider-solar-time';
import type { EarthlyBranch } from '@iching-kt/provider-time';

interface Props {
  context: KnowletContext;
}

interface ElementData {
  name: string;
  nameEs: string;
  inner: number;
  outer: number;
  branches: EarthlyBranch[];
}

const ELEMENTS: Record<string, ElementData> = {
  water: {
    name: 'Water', nameEs: 'Agua',
    inner: 1, outer: 6,
    branches: ['zi', 'hai'],
  },
  fire: {
    name: 'Fire', nameEs: 'Fuego',
    inner: 2, outer: 7,
    branches: ['wu', 'si'],
  },
  wood: {
    name: 'Wood', nameEs: 'Madera',
    inner: 3, outer: 8,
    branches: ['yin', 'mao'],
  },
  metal: {
    name: 'Metal', nameEs: 'Metal',
    inner: 4, outer: 9,
    branches: ['shen', 'you'],
  },
  earth: {
    name: 'Earth', nameEs: 'Tierra',
    inner: 5, outer: 10,
    branches: ['chen', 'xu', 'chou', 'wei'],
  },
};

function getActiveElement(branch?: EarthlyBranch): string | undefined {
  if (!branch) return undefined;
  for (const [key, data] of Object.entries(ELEMENTS)) {
    if (data.branches.includes(branch)) return key;
  }
  return undefined;
}

export function HeTuView({ context }: Props) {
  const solarTimeData = context.situations['solar-time'] as SolarTimeData | undefined;
  const currentBranch = solarTimeData?.shichen as EarthlyBranch | undefined;
  const activeElement = getActiveElement(currentBranch);
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  const handlePress = (elementKey: string) => {
    // Element detail view could be added later
    context.emitOutput('element', elementKey);
  };

  const handleLongPress = (elementKey: string) => {
    context.showKnowletSelector('element', elementKey);
  };

  const renderElement = (elementKey: string) => {
    const data = ELEMENTS[elementKey];
    const isActive = elementKey === activeElement;
    const elementColors = abstractColors.elements[elementKey as keyof typeof abstractColors.elements];
    const activeColor = elementColors?.activeColor || colors.surfaceSecondary;

    return (
      <ActionableElement
        key={elementKey}
        outputType="element"
        value={elementKey}
        label={context.language === 'es' ? data.nameEs : data.name}
        onPress={() => handlePress(elementKey)}
        onLongPress={() => handleLongPress(elementKey)}
        isActive={isActive}
        activeColor={activeColor}
        colorScheme={context.colorScheme}
        style={styles.hetuElement}
      >
        <Text style={[styles.elementName, { color: colors.text }, isActive && styles.activeText]}>
          {context.language === 'es' ? data.nameEs : data.name}
        </Text>
        <Text style={[styles.numbers, { color: colors.text }, isActive && styles.activeText]}>
          {data.inner} · {data.outer}
        </Text>
        <View style={styles.dotsRow}>
          {Array(data.inner).fill(0).map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: colors.text }, isActive && styles.activeDot]} />
          ))}
        </View>
      </ActionableElement>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {context.language === 'es' ? 'Mapa del Río' : 'River Map'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>河圖 He Tu</Text>

      <View style={styles.diagram}>
        <View style={styles.north}>{renderElement('water')}</View>
        <View style={styles.middleRow}>
          <View style={styles.west}>{renderElement('metal')}</View>
          <View style={styles.centerPos}>{renderElement('earth')}</View>
          <View style={styles.east}>{renderElement('wood')}</View>
        </View>
        <View style={styles.south}>{renderElement('fire')}</View>
      </View>

      {currentBranch && activeElement && (
        <View style={[styles.legend, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[styles.legendText, { color: colors.text }]}>
            {context.language === 'es' ? 'Elemento activo: ' : 'Active element: '}
            {context.language === 'es'
              ? ELEMENTS[activeElement].nameEs
              : ELEMENTS[activeElement].name}
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
  diagram: {
    alignItems: 'center',
    gap: 16,
  },
  north: { alignItems: 'center' },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  west: {},
  centerPos: {},
  east: {},
  south: { alignItems: 'center' },
  hetuElement: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elementName: {
    fontSize: 12,
    fontWeight: '600',
  },
  numbers: {
    fontSize: 14,
    marginTop: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  yangDot: {
    // backgroundColor set dynamically based on theme
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  activeText: {
    color: '#fff',
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
