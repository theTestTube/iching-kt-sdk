import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getThemeColors, CARD_TYPOGRAPHY, CARD_SPACING } from '@iching-kt/core';
import type { KnowletCardViewProps } from '@iching-kt/core';
import type { MoonPhaseData } from '@iching-kt/provider-moon-phase';
import { getTranslation } from './data';

const PHASE_EMOJIS: Record<string, string> = {
  new_moon: '🌑',
  waxing_crescent: '🌒',
  first_quarter: '🌓',
  waxing_gibbous: '🌔',
  full_moon: '🌕',
  waning_gibbous: '🌖',
  last_quarter: '🌗',
  waning_crescent: '🌘',
};

export function MoonCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);
  const moonData = context.situations['moon-phase'] as MoonPhaseData | undefined;

  if (!moonData?.phaseName) {
    return (
      <View style={styles.content}>
        <Text style={[styles.icon, compact && styles.iconCompact]}>🌙</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {context.language === 'zh' ? '月相' : context.language === 'es' ? 'Luna' : 'Moon'}
        </Text>
      </View>
    );
  }

  const t = getTranslation(context.language);
  const phaseInfo = t.phases[moonData.phaseName];
  const emoji = PHASE_EMOJIS[moonData.phaseName] ?? '🌙';

  return (
    <View style={styles.content}>
      <View style={styles.row}>
        <Text style={[styles.emoji, compact && styles.emojiCompact]}>{emoji}</Text>
        <View style={styles.info}>
          <Text style={[styles.phaseName, { color: colors.text }, compact && styles.phaseNameCompact]} numberOfLines={1}>
            {phaseInfo.phaseName}
          </Text>
          {phaseInfo.trigramSymbol && (
            <Text style={[styles.trigram, { color: colors.textSecondary }]}>
              {phaseInfo.trigramSymbol} {phaseInfo.chinese}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: CARD_SPACING.gapSm,
  },
  icon: {
    ...CARD_TYPOGRAPHY.displayIcon,
    textAlign: 'center',
  },
  iconCompact: {
    ...CARD_TYPOGRAPHY.displayIconCompact,
  },
  label: {
    ...CARD_TYPOGRAPHY.label,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CARD_SPACING.gap,
  },
  // In-row phase emoji sized to the info row, not the display-icon role.
  emoji: {
    fontSize: 24,
  },
  emojiCompact: {
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  phaseName: {
    ...CARD_TYPOGRAPHY.title,
  },
  phaseNameCompact: {
    ...CARD_TYPOGRAPHY.titleCompact,
  },
  trigram: {
    ...CARD_TYPOGRAPHY.caption,
  },
});
