import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { KnowletContext, ActionableElement, getThemeColors, getAbstractColors } from '@iching-kt/core';
import type { SolarTimeData } from '@iching-kt/provider-solar-time';
import type { EarthlyBranch } from '@iching-kt/provider-time';
import { getSovereignHexagram, getHexagram, getHexagramTranslation } from '@iching-kt/data-hexagrams';
import { getTranslation } from './data';

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

export function HoursView({ context }: Props) {
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

  const branch = solarTimeData.earthlyBranch as EarthlyBranch;
  const info = t.branches[branch];
  const elementKey = ELEMENT_KEYS[info.element] || 'earth';
  const elementColors = abstractColors.elements[elementKey as keyof typeof abstractColors.elements];
  const elementColor = elementColors.activeColor;

  const sovereignMapping = getSovereignHexagram(branch);
  const hexagram = getHexagram(sovereignMapping.hexagramNumber);
  const hexTranslation = getHexagramTranslation(sovereignMapping.hexagramNumber, context.language);

  const handleHexagramPress = () => {    
    context.emitOutput('hexagram', sovereignMapping.hexagramNumber);
    // @todo pushView? context.pushView('hexagram-detail', { hexagramNumber: sovereignMapping.hexagramNumber });
  };

  const handleHexagramLongPress = () => {
    context.showKnowletSelector('hexagram', sovereignMapping.hexagramNumber);
  };

  const handleElementPress = () => {
    // Element detail view could be added later
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

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.chinese, { color: colors.text }]}>{info.chinese}</Text>
        <Text style={[styles.pinyin, { color: colors.textSecondary }]}>{info.pinyin} shí</Text>
      </View>

      <Text style={[styles.animal, { color: colors.text }]}>{info.animal}</Text>

      {/* User's clock time range for this shichen */}
      <Text style={[styles.timeRange, { color: colors.textSecondary }]}>
        {getCivilTimeRange(branch, solarTimeData.solarOffsetMinutes)}
      </Text>

      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${solarTimeData.branchProgress * 100}%`, backgroundColor: elementColor }
            ]}
          />
        </View>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]}>{info.description}</Text>

      {/* Actionable badges for element and yin/yang */}
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

      {/* Sovereign Hexagram Section */}
      {hexagram && hexTranslation && (
        <ActionableElement
          outputType="hexagram"
          value={sovereignMapping.hexagramNumber}
          label={`Hexagram ${hexagram.number}: ${hexTranslation.name}`}
          onPress={handleHexagramPress}
          onLongPress={handleHexagramLongPress}
          isActive={false}
          defaultColor={colors.surfaceSecondary}
          style={styles.hexagramCard}
        >
          <View style={styles.hexagramHeader}>
            <Text style={[styles.hexagramLabel, { color: colors.textSecondary }]}>{t.labels.sovereignHexagram}</Text>
          </View>
          <View style={styles.hexagramContent}>
            <Text style={[styles.hexagramUnicode, { color: colors.text }]}>{hexagram.unicode}</Text>
            <View style={styles.hexagramInfo}>
              <Text style={[styles.hexagramNumber, { color: colors.textTertiary }]}>#{hexagram.number}</Text>
              <Text style={[styles.hexagramName, { color: colors.text }]}>{hexTranslation.name}</Text>
              <Text style={[styles.hexagramChinese, { color: colors.textSecondary }]}>
                {hexagram.chinese} ({hexagram.pinyin})
              </Text>
              <View style={styles.phaseRow}>
                <Text style={[styles.phaseBadge, { color: colors.text, backgroundColor: colors.border }]}>
                  {sovereignMapping.phase === 'waxing'
                    ? (context.language === 'zh' ? '☀ 息' : context.language === 'es' ? '☀ Creciente' : '☀ Waxing')
                    : (context.language === 'zh' ? '☾ 消' : context.language === 'es' ? '☾ Menguante' : '☾ Waning')}
                </Text>
                <Text style={[styles.yangLines, { color: colors.textTertiary }]}>
                  {sovereignMapping.yangLines}/6 yang
                </Text>
              </View>
            </View>
          </View>
        </ActionableElement>
      )}

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
    </ScrollView>
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
  timeRange: {
    fontSize: 18,
    fontVariant: ['tabular-nums'],
    marginBottom: 16,
  },
  progressContainer: {
    width: '80%',
    marginBottom: 20,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
    padding: 16,
    marginBottom: 16,
  },
  hexagramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hexagramLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  hexagramContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hexagramUnicode: {
    fontSize: 64,
    marginRight: 16,
  },
  hexagramInfo: {
    flex: 1,
  },
  hexagramNumber: {
    fontSize: 12,
    marginBottom: 2,
  },
  hexagramName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  hexagramChinese: {
    fontSize: 14,
    marginBottom: 8,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phaseBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  yangLines: {
    fontSize: 12,
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
