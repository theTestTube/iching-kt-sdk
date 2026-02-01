import { useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, ScrollView } from 'react-native';
import { KnowletContext, ActionableElement, getThemeColors, getAbstractColors, TemporalNavigator, AnimatedProgressBar } from '@iching-kt/core';
import type { TemporalNavigationState } from '@iching-kt/core';
import type { SolarTimeData } from '@iching-kt/provider-solar-time';
import type { EarthlyBranch } from '@iching-kt/provider-time';
import { getSovereignHexagram } from '@iching-kt/data-hexagrams';
import { getTranslation } from './data';
import { HexagramCard } from './HexagramCard';

interface Props {
  context: KnowletContext;
}

const ELEMENT_KEYS: Record<string, string> = {
  Water: 'water', Wood: 'wood', Fire: 'fire', Earth: 'earth', Metal: 'metal',
  Agua: 'water', Madera: 'wood', Fuego: 'fire', Tierra: 'earth',
};

/**
 * Solar time boundaries for each shichen (double-hour)
 * These are fixed astronomical boundaries based on mean solar time
 */
const SHICHEN_SOLAR_BOUNDARIES: Record<EarthlyBranch, { start: number; end: number }> = {
  zi:   { start: 23 * 60, end: 1 * 60 },   // 23:00 - 01:00 (crosses midnight)
  chou: { start: 1 * 60, end: 3 * 60 },    // 01:00 - 03:00
  yin:  { start: 3 * 60, end: 5 * 60 },    // 03:00 - 05:00
  mao:  { start: 5 * 60, end: 7 * 60 },    // 05:00 - 07:00
  chen: { start: 7 * 60, end: 9 * 60 },    // 07:00 - 09:00
  si:   { start: 9 * 60, end: 11 * 60 },   // 09:00 - 11:00
  wu:   { start: 11 * 60, end: 13 * 60 },  // 11:00 - 13:00
  wei:  { start: 13 * 60, end: 15 * 60 },  // 13:00 - 15:00
  shen: { start: 15 * 60, end: 17 * 60 },  // 15:00 - 17:00
  you:  { start: 17 * 60, end: 19 * 60 },  // 17:00 - 19:00
  xu:   { start: 19 * 60, end: 21 * 60 },  // 19:00 - 21:00
  hai:  { start: 21 * 60, end: 23 * 60 },  // 21:00 - 23:00
};

/**
 * Convert minutes to HH:MM format
 */
function formatTime(totalMinutes: number): string {
  // Normalize to 0-1440 range (24 hours)
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = Math.floor(normalized % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculate civil (clock) time range for a shichen based on solar offset
 * Civil time = Solar time - solarOffsetMinutes
 * (If solar is ahead, civil is behind, so we subtract)
 */
function getCivilTimeRange(branch: EarthlyBranch, solarOffsetMinutes: number): string {
  const solar = SHICHEN_SOLAR_BOUNDARIES[branch];
  const civilStart = solar.start - solarOffsetMinutes;
  const civilEnd = solar.end - solarOffsetMinutes;
  return `${formatTime(civilStart)}-${formatTime(civilEnd)}`;
}

// Order of earthly branches in the 12-hour cycle
const BRANCH_ORDER: EarthlyBranch[] = [
  'zi', 'chou', 'yin', 'mao', 'chen', 'si',
  'wu', 'wei', 'shen', 'you', 'xu', 'hai'
];

/**
 * Get the branch that comes N positions after/before the given branch
 * offset: positive = future, negative = past
 */
function getOffsetBranch(currentBranch: EarthlyBranch, offset: number): EarthlyBranch {
  const currentIndex = BRANCH_ORDER.indexOf(currentBranch);
  const targetIndex = (currentIndex + offset + 12) % 12; // +12 to handle negatives
  return BRANCH_ORDER[targetIndex];
}

/**
 * Calculate the progress within a given branch based on the offset from current time.
 * Past hours (negative offset) are fully elapsed, future hours (positive offset) are empty.
 */
function getBranchProgress(offset: number, currentProgress: number): number {
  if (offset === 0) return currentProgress;
  if (offset < 0) return 1;
  return 0;
}

export function HoursView({ context }: Props) {
  const [viewingOffset, setViewingOffset] = useState(0);
  const solarTimeData = context.situations['solar-time'] as SolarTimeData | undefined;
  const t = getTranslation(context.language);
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  if (!solarTimeData) {
    const loadingText = context.language === 'zh' ? '載入中...' : context.language === 'es' ? 'Cargando...' : 'Loading...';
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loading, { color: colors.textSecondary }]}>{loadingText}</Text>
      </View>
    );
  }

  const currentBranch = solarTimeData.earthlyBranch as EarthlyBranch;

  // Get data for current viewing offset
  const getHourData = (offset: number) => {
    const targetBranch = getOffsetBranch(currentBranch, offset);
    const progress = getBranchProgress(offset, solarTimeData.branchProgress);
    return {
      branch: targetBranch,
      progress,
      isCurrentHour: offset === 0,
    };
  };

  // Render content for a specific hour
  const renderHourContent = (hourData: ReturnType<typeof getHourData>, navigation: TemporalNavigationState) => {
    const { branch, progress, isCurrentHour } = hourData;
    const info = t.branches[branch];
    const elementKey = ELEMENT_KEYS[info.element] || 'earth';
    const elementColors = abstractColors.elements[elementKey as keyof typeof abstractColors.elements];
    const elementColor = elementColors.activeColor;

    const sovereignMapping = getSovereignHexagram(branch);

    const handleHexagramPress = () => {
      context.emitOutput('hexagram', sovereignMapping.hexagramNumber);
    };

    const handleHexagramLongPress = () => {
      context.showKnowletSelector('hexagram', sovereignMapping.hexagramNumber);
    };

    const handleElementPress = () => {
      context.emitOutput('element', elementKey);
    };

    const handleElementLongPress = () => {
      context.showKnowletSelector('element', elementKey);
    };

    const handleYinYangPress = () => {
      context.emitOutput('yinyang', info.yinYang);
    };

    const handleYinYangLongPress = () => {
      context.showKnowletSelector('yinyang', info.yinYang);
    };

    // Current branch index for day progress bar highlighting
    const viewingBranchIndex = BRANCH_ORDER.indexOf(branch);

    const { fadeAnim } = navigation;

    return (
      <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}>

      {/* Upper fading section: identity content */}
      <Animated.View style={[styles.fadingSection, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={[styles.chinese, { color: colors.text }]}>{info.chinese}</Text>
          <Text style={[styles.pinyin, { color: colors.textSecondary }]}>{info.pinyin} shí</Text>
        </View>

        <Text style={[styles.animal, { color: colors.text }]}>{info.animal}</Text>
      </Animated.View>

      {/* Static navigation group: arrows, time range, progress bars */}
      <View style={styles.timeRangeRow}>
        <Pressable
          onPress={navigation.onPrevious ?? undefined}
          disabled={!navigation.onPrevious}
          hitSlop={12}
          style={styles.arrowButton}
        >
          <Text style={[
            styles.arrow,
            { color: navigation.onPrevious ? colors.text : colors.textTertiary },
          ]}>
            ◀
          </Text>
        </Pressable>

        <Text style={[styles.timeRange, { color: colors.textSecondary }]}>
          {getCivilTimeRange(branch, solarTimeData.solarOffsetMinutes)}
        </Text>

        <Pressable
          onPress={navigation.onNext ?? undefined}
          disabled={!navigation.onNext}
          hitSlop={12}
          style={styles.arrowButton}
        >
          <Text style={[
            styles.arrow,
            { color: navigation.onNext ? colors.text : colors.textTertiary },
          ]}>
            ▶
          </Text>
        </Pressable>
      </View>

      <View style={styles.progressContainer}>
        <AnimatedProgressBar
          progress={progress}
          color={elementColor}
          trackColor={colors.border}
          height={6}
          borderRadius={3}
        />
      </View>

      <View style={styles.dayProgressContainer}>
        <View style={styles.dayProgressTrack}>
          {BRANCH_ORDER.map((b, i) => {
            const isViewing = i === viewingBranchIndex;
            const segmentInfo = t.branches[b];
            const segmentElementKey = (ELEMENT_KEYS[segmentInfo.element] || 'earth') as keyof typeof abstractColors.elements;
            const segmentElementColors = abstractColors.elements[segmentElementKey];
            const segmentColor = isViewing
              ? segmentElementColors.activeColor
              : segmentElementColors.defaultColor;
            return (
              <View
                key={b}
                style={[
                  styles.daySegment,
                  {
                    backgroundColor: segmentColor,
                  },
                  i === 0 && styles.daySegmentFirst,
                  i === 11 && styles.daySegmentLast,
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Lower fading section: details content */}
      <Animated.View style={[styles.fadingSection, { opacity: fadeAnim }]}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{info.description}</Text>

        <View style={styles.badgesRow}>
          <ActionableElement
            outputType="element"
            value={elementKey}
            label={info.element}
            onPress={handleElementPress}
            onLongPress={handleElementLongPress}
            isActive={true}
            activeColor={elementColor}
            style={styles.badge}
          >
            <Text style={[styles.badgeText, { color: colors.textInverse }]}>{info.element}</Text>
          </ActionableElement>

          <ActionableElement
            outputType="yinyang"
            value={info.yinYang}
            label={info.yinYang === 'yang' ? 'Yang' : 'Yin'}
            onPress={handleYinYangPress}
            onLongPress={handleYinYangLongPress}
            isActive={true}
            activeColor={info.yinYang === 'yang' ? abstractColors.yinyang.yang.activeColor : abstractColors.yinyang.yin.activeColor}
            style={styles.badge}
          >
            <Text style={[styles.badgeText, { color: colors.textInverse }]}>
              {info.yinYang === 'yang' ? '☯ Yang' : '☯ Yin'}
            </Text>
          </ActionableElement>
        </View>

        <HexagramCard
          context={context}
          hexagramNumber={sovereignMapping.hexagramNumber}
          label={t.labels.sovereignHexagram}
          onPress={handleHexagramPress}
          onLongPress={handleHexagramLongPress}
          style={styles.hexagramCard}
        />

        <View style={[styles.infoCard, { backgroundColor: colors.surfaceSecondary }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textTertiary }]}>{t.labels.organ}</Text>
            <Text style={[styles.value, { color: colors.text }]}>{info.organ}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textTertiary }]}>{t.labels.activity}</Text>
            <Text style={[styles.value, { color: colors.text }]}>{info.activity}</Text>
          </View>
        </View>
      </Animated.View>

      </ScrollView>
    );
  };

  return (
    <TemporalNavigator
      current={getHourData(viewingOffset)}
      previous={getHourData(viewingOffset - 1)}
      next={getHourData(viewingOffset + 1)}
      onPrevious={() => setViewingOffset(offset => offset - 1)}
      onNext={() => setViewingOffset(offset => offset + 1)}
      renderContent={renderHourContent}
      animationDuration={300}
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loading: {
    fontSize: 16,
  },
  fadingSection: {
    alignItems: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  chinese: {
    fontSize: 96,
    fontWeight: '200',
  },
  pinyin: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  animal: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
  timeRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  arrowButton: {
    padding: 4,
  },
  arrow: {
    fontSize: 18,
  },
  timeRange: {
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  progressContainer: {
    width: '80%',
    marginBottom: 6,
  },
  dayProgressContainer: {
    width: '80%',
    marginBottom: 20,
  },
  dayProgressTrack: {
    flexDirection: 'row',
    height: 6,
    gap: 2,
  },
  daySegment: {
    flex: 1,
    height: 6,
  },
  daySegmentFirst: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  daySegmentLast: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 14,
  },
  hexagramCard: {
    width: '100%',
    marginBottom: 16,
  },
  infoCard: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});
