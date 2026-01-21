import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { KnowletContext } from '@iching-kt/core';
import { TimeData, EarthlyBranch } from '@iching-kt/provider-time';
import { getTranslation } from './data';

interface Props {
  context: KnowletContext;
}

const ELEMENT_COLORS: Record<string, string> = {
  Water: '#1a73e8',
  Wood: '#34a853',
  Fire: '#ea4335',
  Earth: '#a67c52',
  Metal: '#9e9e9e',
  // Spanish
  Agua: '#1a73e8',
  Madera: '#34a853',
  Fuego: '#ea4335',
  Tierra: '#a67c52',
};

export function HoursView({ context }: Props) {
  const timeData = context.situations.time as TimeData | undefined;
  const t = getTranslation(context.language);

  if (!timeData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const branch = timeData.earthlyBranch as EarthlyBranch;
  const info = t.branches[branch];
  const elementColor = ELEMENT_COLORS[info.element] || '#666';

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.chinese}>{info.chinese}</Text>
        <Text style={styles.pinyin}>{info.pinyin} shí</Text>
      </View>

      <Text style={styles.animal}>{info.animal}</Text>
      <Text style={styles.timeRange}>{info.timeRange}</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${timeData.branchProgress * 100}%`, backgroundColor: elementColor }
            ]}
          />
        </View>
      </View>

      <Text style={styles.description}>{info.description}</Text>

      <View style={styles.badgesRow}>
        <View style={[styles.badge, { backgroundColor: elementColor }]}>
          <Text style={styles.badgeText}>{info.element}</Text>
        </View>
        <View style={[styles.badge, styles.yinYangBadge]}>
          <Text style={styles.badgeText}>
            {info.yinYang === 'yang' ? '☯ Yang' : '☯ Yin'}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t.labels.organ}</Text>
          <Text style={styles.value}>{info.organ}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t.labels.activity}</Text>
          <Text style={styles.value}>{info.activity}</Text>
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
    color: '#666',
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
    color: '#666',
    fontStyle: 'italic',
  },
  animal: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeRange: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  progressContainer: {
    width: '80%',
    marginBottom: 20,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  description: {
    fontSize: 16,
    color: '#444',
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
  yinYangBadge: {
    backgroundColor: '#333',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
});
