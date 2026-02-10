import { useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, ScrollView } from 'react-native';
import { KnowletContext, ActionableElement, getThemeColors, getAbstractColors, TemporalNavigator, AnimatedProgressBar } from '@iching-kt/core';
import type { TemporalNavigationState } from '@iching-kt/core';
import type { MoonPhaseData, MoonPhaseId } from '@iching-kt/provider-moon-phase';
import { PHASE_ORDER } from '@iching-kt/provider-moon-phase';
import { getHexagram } from '@iching-kt/data-hexagrams';
import { getTranslation } from './data';
import { HexagramCard } from '@iching-kt/hours';
import { SlidingMoonHeader } from './SlidingMoonHeader';

interface Props {
  context: KnowletContext;
}

const ELEMENT_KEYS: Record<string, string> = {
  Water: 'water', Wood: 'wood', Fire: 'fire', Earth: 'earth', Metal: 'metal',
  Agua: 'water', Madera: 'wood', Fuego: 'fire', Tierra: 'earth',
  '水': 'water', '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal',
};

/**
 * Get the phase that comes N positions after/before the given phase.
 * Wraps cyclically (phase 7 + 1 = phase 0).
 */
function getOffsetPhase(currentPhase: MoonPhaseId, offset: number): MoonPhaseId {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  const targetIndex = ((currentIndex + offset) % 8 + 8) % 8;
  return PHASE_ORDER[targetIndex];
}

/**
 * Calculate the progress within a given phase based on the offset from current.
 * Past phases (negative offset) are fully elapsed, future phases (positive offset) are empty.
 */
function getPhaseProgressForOffset(offset: number, currentProgress: number): number {
  if (offset === 0) return currentProgress;
  if (offset < 0) return 1;
  return 0;
}

export function MoonView({ context }: Props) {
  const [viewingOffset, setViewingOffset] = useState(0);
  const moonData = context.situations['moon-phase'] as MoonPhaseData | undefined;
  const t = getTranslation(context.language);
  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);

  if (!moonData) {
    const loadingText = context.language === 'zh' ? '載入中...' : context.language === 'es' ? 'Cargando...' : 'Loading...';
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loading, { color: colors.textSecondary }]}>{loadingText}</Text>
      </View>
    );
  }

  const currentPhase = moonData.phaseName;

  const getPhaseData = (offset: number) => {
    const targetPhase = getOffsetPhase(currentPhase, offset);
    const progress = getPhaseProgressForOffset(offset, moonData.phaseProgress);
    return {
      phaseId: targetPhase,
      progress,
      isCurrentPhase: offset === 0,
    };
  };

  const renderPhaseContent = (phaseData: ReturnType<typeof getPhaseData>, navigation: TemporalNavigationState) => {
    const { phaseId, progress } = phaseData;
    const info = t.phases[phaseId];
    const phaseIndex = PHASE_ORDER.indexOf(phaseId);

    // Element color: use trigram fallback for transitional phases
    const hasElement = info.element !== null;
    const elementKey = hasElement ? (ELEMENT_KEYS[info.element!] || 'earth') : null;
    const elementColors = elementKey
      ? abstractColors.elements[elementKey as keyof typeof abstractColors.elements]
      : null;
    const phaseColor = elementColors?.activeColor ?? abstractColors.trigram.activeColor;

    const handleHexagramPress = () => {
      context.emitOutput('hexagram', info.hexagramNumber);
    };

    const handleHexagramLongPress = () => {
      context.showKnowletSelector('hexagram', info.hexagramNumber);
    };

    const handleElementPress = () => {
      if (elementKey) context.emitOutput('element', elementKey);
    };

    const handleElementLongPress = () => {
      if (elementKey) context.showKnowletSelector('element', elementKey);
    };

    const handleYinYangPress = () => {
      context.emitOutput('yinyang', info.yinYang);
    };

    const handleYinYangLongPress = () => {
      context.showKnowletSelector('yinyang', info.yinYang);
    };

    // Get hero symbol for header display
    const getPhaseDisplay = (id: MoonPhaseId) => {
      const phaseInfo = t.phases[id];
      // Use trigram symbol for non-transitional, hexagram unicode for transitional
      const hex = getHexagram(phaseInfo.hexagramNumber);
      const heroSymbol = phaseInfo.trigramSymbol ?? hex?.unicode ?? '?';
      return {
        heroSymbol,
        phaseName: phaseInfo.phaseName,
        chinese: `${phaseInfo.chinese} ${phaseInfo.pinyin}`,
      };
    };

    const { fadeAnim } = navigation;

    return (
      <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}>

        {/* Sliding header carousel: trigram symbol + phase name */}
        <SlidingMoonHeader
          phaseId={phaseId}
          getPhaseDisplay={getPhaseDisplay}
          textColor={colors.text}
          textSecondaryColor={colors.textSecondary}
        />

        {/* Static navigation group: arrows, lunar day range, progress bars */}
        <View style={styles.navRow}>
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

          <Text style={[styles.lunarDayRange, { color: colors.textSecondary }]}>
            {info.lunarDayRange}
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

        {/* Phase progress bar */}
        <View style={styles.progressContainer}>
          <AnimatedProgressBar
            progress={progress}
            color={phaseColor}
            trackColor={colors.border}
            height={6}
            borderRadius={3}
          />
        </View>

        {/* Cycle progress bar: 8 colored segments */}
        <View style={styles.cycleProgressContainer}>
          <View style={styles.cycleProgressTrack}>
            {PHASE_ORDER.map((pId, i) => {
              const isViewing = i === phaseIndex;
              const segmentInfo = t.phases[pId];
              const segmentHasElement = segmentInfo.element !== null;
              const segmentElementKey = segmentHasElement
                ? (ELEMENT_KEYS[segmentInfo.element!] || 'earth') as keyof typeof abstractColors.elements
                : null;
              const segmentElementColors = segmentElementKey
                ? abstractColors.elements[segmentElementKey]
                : null;
              const segmentColor = isViewing
                ? (segmentElementColors?.activeColor ?? abstractColors.trigram.activeColor)
                : (segmentElementColors?.defaultColor ?? abstractColors.trigram.defaultColor);
              return (
                <View
                  key={pId}
                  style={[
                    styles.cycleSegment,
                    { backgroundColor: segmentColor },
                    i === 0 && styles.cycleSegmentFirst,
                    i === 7 && styles.cycleSegmentLast,
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
            {hasElement && elementKey && (
              <ActionableElement
                outputType="element"
                value={elementKey}
                label={info.element!}
                onPress={handleElementPress}
                onLongPress={handleElementLongPress}
                isActive={true}
                activeColor={elementColors!.activeColor}
                style={styles.badge}
              >
                <Text style={[styles.badgeText, { color: colors.textInverse }]}>{info.element}</Text>
              </ActionableElement>
            )}

            <ActionableElement
              outputType="yinyang"
              value={info.yinYang}
              label={info.yinYangLabel}
              onPress={handleYinYangPress}
              onLongPress={handleYinYangLongPress}
              isActive={true}
              activeColor={info.yinYang === 'yang' ? abstractColors.yinyang.yang.activeColor : abstractColors.yinyang.yin.activeColor}
              style={styles.badge}
            >
              <Text style={[styles.badgeText, { color: colors.textInverse }]}>
                ☯ {info.yinYangLabel}
              </Text>
            </ActionableElement>
          </View>

          <HexagramCard
            context={context}
            hexagramNumber={info.hexagramNumber}
            label={t.labels.sovereignHexagram}
            onPress={handleHexagramPress}
            onLongPress={handleHexagramLongPress}
            style={styles.hexagramCard}
          />

          <View style={[styles.infoCard, { backgroundColor: colors.surfaceSecondary }]}>
            {info.trigramName && (
              <>
                <View style={styles.infoRow}>
                  <Text style={[styles.label, { color: colors.textTertiary }]}>{t.labels.trigram}</Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {info.trigramSymbol} {info.trigramName}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </>
            )}
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: colors.textTertiary }]}>{t.labels.symbolicMeaning}</Text>
              <Text style={[styles.value, { color: colors.text }]}>{info.symbolicMeaning}</Text>
            </View>
          </View>
        </Animated.View>

      </ScrollView>
    );
  };

  return (
    <TemporalNavigator
      current={getPhaseData(viewingOffset)}
      previous={getPhaseData(viewingOffset - 1)}
      next={getPhaseData(viewingOffset + 1)}
      onPrevious={() => setViewingOffset(offset => offset - 1)}
      onNext={() => setViewingOffset(offset => offset + 1)}
      renderContent={renderPhaseContent}
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
    width: '100%',
    alignSelf: 'stretch',
  },
  navRow: {
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
  lunarDayRange: {
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  progressContainer: {
    width: '100%',
    marginBottom: 6,
  },
  cycleProgressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  cycleProgressTrack: {
    flexDirection: 'row',
    height: 12,
    gap: 2,
  },
  cycleSegment: {
    flex: 1,
    height: 12,
  },
  cycleSegmentFirst: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  cycleSegmentLast: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    alignSelf: 'center',
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
