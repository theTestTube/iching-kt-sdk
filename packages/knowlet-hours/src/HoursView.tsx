import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.chinese}>{info.chinese}</Text>
      <Text style={styles.animal}>{info.animal}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>{t.labels.timeRange}</Text>
        <Text style={styles.value}>{info.timeRange}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>{t.labels.element}</Text>
        <View style={[styles.elementBadge, { backgroundColor: elementColor }]}>
          <Text style={styles.elementText}>{info.element}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${timeData.branchProgress * 100}%` }
            ]}
          />
        </View>
      </View>

      <Text style={styles.yinYang}>
        {info.yinYang === 'yang' ? '☯ Yang' : '☯ Yin'}
      </Text>
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
  loading: {
    fontSize: 16,
    color: '#666',
  },
  chinese: {
    fontSize: 72,
    fontWeight: '300',
    marginBottom: 8,
  },
  animal: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  elementBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  elementText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  progressContainer: {
    width: '80%',
    marginTop: 24,
    marginBottom: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#333',
    borderRadius: 2,
  },
  yinYang: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
});
