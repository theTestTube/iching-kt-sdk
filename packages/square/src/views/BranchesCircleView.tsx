import { View, Text, StyleSheet } from 'react-native';
import { KnowletContext, ActionableElement, getThemeColors } from '@iching-kt/core';
import type { SolarTimeData } from '@iching-kt/provider-solar-time';
import type { EarthlyBranch } from '@iching-kt/provider-time';
import { EARTHLY_BRANCHES } from '@iching-kt/provider-time';
import { getSovereignHexagram, getHexagram } from '@iching-kt/data-hexagrams';

interface Props {
  context: KnowletContext;
}

const BRANCH_INFO: Record<EarthlyBranch, { chinese: string; animal: string; animalEs: string }> = {
  zi: { chinese: '子', animal: 'Rat', animalEs: 'Rata' },
  chou: { chinese: '丑', animal: 'Ox', animalEs: 'Buey' },
  yin: { chinese: '寅', animal: 'Tiger', animalEs: 'Tigre' },
  mao: { chinese: '卯', animal: 'Rabbit', animalEs: 'Conejo' },
  chen: { chinese: '辰', animal: 'Dragon', animalEs: 'Dragón' },
  si: { chinese: '巳', animal: 'Snake', animalEs: 'Serpiente' },
  wu: { chinese: '午', animal: 'Horse', animalEs: 'Caballo' },
  wei: { chinese: '未', animal: 'Goat', animalEs: 'Cabra' },
  shen: { chinese: '申', animal: 'Monkey', animalEs: 'Mono' },
  you: { chinese: '酉', animal: 'Rooster', animalEs: 'Gallo' },
  xu: { chinese: '戌', animal: 'Dog', animalEs: 'Perro' },
  hai: { chinese: '亥', animal: 'Pig', animalEs: 'Cerdo' },
};

const CIRCLE_RADIUS = 120;

export function BranchesCircleView({ context }: Props) {
  const solarTimeData = context.situations['solar-time'] as SolarTimeData | undefined;
  const currentBranch = solarTimeData?.shichen as EarthlyBranch | undefined;
  const colors = getThemeColors(context.colorScheme);

  const handlePress = (branch: EarthlyBranch) => {
    const sovereign = getSovereignHexagram(branch);
    context.emitOutput('hexagram', sovereign.hexagramNumber);
  };

  const handleLongPress = (branch: EarthlyBranch) => {
    const sovereign = getSovereignHexagram(branch);
    context.showKnowletSelector('hexagram', sovereign.hexagramNumber);
  };

  const renderBranch = (branch: EarthlyBranch, index: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    const x = Math.cos(angle) * CIRCLE_RADIUS;
    const y = Math.sin(angle) * CIRCLE_RADIUS;

    const info = BRANCH_INFO[branch];
    const sovereign = getSovereignHexagram(branch);
    const hexagram = getHexagram(sovereign.hexagramNumber);
    const isActive = branch === currentBranch;

    return (
      <View
        key={branch}
        style={[styles.branchWrapper, { transform: [{ translateX: x }, { translateY: y }] }]}
      >
        <ActionableElement
          outputType="hexagram"
          value={sovereign.hexagramNumber}
          label={`${info.chinese} ${context.language === 'es' ? info.animalEs : info.animal}`}
          onPress={() => handlePress(branch)}
          onLongPress={() => handleLongPress(branch)}
          isActive={isActive}
          colorScheme={context.colorScheme}
          style={styles.branchItem}
          circular
        >
          <Text style={[styles.hexagram, { color: isActive ? '#fff' : colors.text }]}>
            {hexagram?.unicode}
          </Text>
          <Text style={[styles.chinese, { color: isActive ? '#fff' : colors.text }]}>
            {info.chinese}
          </Text>
          <Text style={[styles.animal, { color: isActive ? '#fff' : colors.textSecondary }]}>
            {context.language === 'es' ? info.animalEs : info.animal}
          </Text>
        </ActionableElement>
      </View>
    );
  };

  const currentSovereign = currentBranch ? getSovereignHexagram(currentBranch) : null;
  const currentHexagram = currentSovereign ? getHexagram(currentSovereign.hexagramNumber) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {context.language === 'es' ? 'Doce Ramas Terrestres' : 'Twelve Earthly Branches'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>十二地支</Text>

      <View style={styles.circleContainer}>
        <View style={styles.centerInfo}>
          {currentHexagram && (
            <>
              <Text style={[styles.centerHexagram, { color: colors.text }]}>{currentHexagram.unicode}</Text>
              <Text style={[styles.centerNumber, { color: colors.textSecondary }]}>#{currentHexagram.number}</Text>
            </>
          )}
        </View>
        {EARTHLY_BRANCHES.map((branch, index) => renderBranch(branch as EarthlyBranch, index))}
      </View>

      {currentBranch && currentSovereign && (
        <View style={[styles.legend, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[styles.legendTitle, { color: colors.textTertiary }]}>
            {context.language === 'es' ? 'Hora actual' : 'Current hour'}
          </Text>
          <Text style={[styles.legendText, { color: colors.text }]}>
            {BRANCH_INFO[currentBranch].chinese} ({currentBranch}) - {
              context.language === 'es'
                ? BRANCH_INFO[currentBranch].animalEs
                : BRANCH_INFO[currentBranch].animal
            }
          </Text>
          <Text style={[styles.legendPhase, { color: colors.textSecondary }]}>
            {currentSovereign.phase === 'waxing'
              ? (context.language === 'es' ? 'Yang creciente' : 'Yang waxing')
              : (context.language === 'es' ? 'Yin creciente' : 'Yin waxing')}
            {' '}{currentSovereign.yangLines}/6
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
  circleContainer: {
    width: CIRCLE_RADIUS * 2 + 100,
    height: CIRCLE_RADIUS * 2 + 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerInfo: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHexagram: {
    fontSize: 48,
  },
  centerNumber: {
    fontSize: 14,
    marginTop: 4,
  },
  branchWrapper: {
    position: 'absolute',
  },
  branchItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagram: {
    fontSize: 18,
  },
  chinese: {
    fontSize: 12,
    fontWeight: '600',
  },
  animal: {
    fontSize: 8,
  },
  legend: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  legendTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 16,
    fontWeight: '500',
  },
  legendPhase: {
    fontSize: 12,
    marginTop: 4,
  },
});
