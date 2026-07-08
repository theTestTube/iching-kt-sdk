import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  HexagramLines,
  getThemeColors,
  getTranslationSourceForLanguage,
  isOriginLanguage,
} from '@iching-kt/core';
import type { KnowletCardViewProps } from '@iching-kt/core';
import type { SolarTimeData } from '@iching-kt/provider-solar-time';
import type { EarthlyBranch } from '@iching-kt/provider-time';
import { getSovereignHexagram } from '@iching-kt/data-hexagrams';
import { getHexagram, getHexagramTranslationBySource } from '@iching-kt/data-hexagrams';
import { getTranslation } from './data';

/** Map solar time minutes to earthly branch */
const BRANCHES: EarthlyBranch[] = ['zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai'];

function getBranchForMinutes(totalMinutes: number): EarthlyBranch {
  // Each shichen = 120 minutes, starting at 23:00 (minute 1380)
  const adjusted = (totalMinutes + 60) % 1440; // shift so zi starts at 0
  const index = Math.floor(adjusted / 120);
  return BRANCHES[index];
}

/**
 * HoursCardView - Compact card showing the current hour's sovereign hexagram.
 */
export function HoursCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);
  const solarTime = context.situations['solar-time'] as SolarTimeData | undefined;

  // Fallback when no solar time data. Guard on the snapshot itself, not on a
  // derived minute value — solar midnight is minute 0, which a truthiness check
  // would wrongly read as "no data".
  if (!solarTime) {
    return (
      <View style={styles.content}>
        <Text style={[styles.icon, compact && styles.iconCompact]}>⏰</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {context.language === 'zh' ? '時辰' : context.language === 'es' ? 'Hora' : 'Hour'}
        </Text>
      </View>
    );
  }

  // SolarTimeData exposes solarHour/solarMinute; derive minutes-of-day from
  // those real fields (the provider never emits a `solarTimeMinutes` field).
  const solarTimeMinutes = solarTime.solarHour * 60 + solarTime.solarMinute;
  const branch = getBranchForMinutes(solarTimeMinutes);
  const sovereign = getSovereignHexagram(branch);
  const hex = getHexagram(sovereign.hexagramNumber);
  if (!hex) return null;

  const source = getTranslationSourceForLanguage(context.language, context.translationPreferences);
  const translation = getHexagramTranslationBySource(sovereign.hexagramNumber, context.language, source as any);
  const name = translation?.name ?? hex.chinese;
  const t = getTranslation(context.language);
  const branchInfo = t.branches[branch];

  return (
    <View style={styles.content}>
      <View style={styles.row}>
        <Text style={[styles.unicode, compact && styles.unicodeCompact, { color: colors.text }]}>
          {hex.unicode}
        </Text>
        <View style={styles.info}>
          <Text style={[styles.branchName, { color: colors.textTertiary }]}>
            {branchInfo.chinese} {branchInfo.timeRange}
          </Text>
          <Text
            style={[styles.name, { color: colors.text }, compact && styles.nameCompact]}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
        <HexagramLines binary={hex.binary} size={compact ? 18 : 24} colorScheme={context.colorScheme} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 28,
    textAlign: 'center',
  },
  iconCompact: {
    fontSize: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unicode: {
    fontSize: 24,
  },
  unicodeCompact: {
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  branchName: {
    fontSize: 10,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
  },
  nameCompact: {
    fontSize: 10,
  },
});
