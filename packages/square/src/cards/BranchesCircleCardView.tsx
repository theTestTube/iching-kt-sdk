import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '@iching-kt/core';
import type { KnowletCardViewProps } from '@iching-kt/core';
import type { EarthlyBranch } from '@iching-kt/provider-time';
import { EARTHLY_BRANCHES } from '@iching-kt/provider-time';
import { getSovereignHexagram, getHexagram } from '@iching-kt/data-hexagrams';
import { BRANCH_INFO } from '../views/BranchesCircleView';
import { resolveCardHighlight } from './situationInputs';

const CARD_RADIUS = 38;

function branchForSovereignHexagram(hexagramNumber: unknown): EarthlyBranch | undefined {
  if (typeof hexagramNumber !== 'number') return undefined;
  return (EARTHLY_BRANCHES as readonly EarthlyBranch[]).find(
    (branch) => getSovereignHexagram(branch).hexagramNumber === hexagramNumber,
  );
}

/**
 * Compact Branches Circle card — miniature ring of the 12 earthly branches
 * with the active branch's sovereign hexagram at the center.
 * An adopted sovereign-hexagram input wins over (frozen or live) situations.
 */
export function BranchesCircleCardView({ context, compact }: KnowletCardViewProps) {
  const colors = getThemeColors(context.colorScheme);

  const activeBranch = resolveCardHighlight(
    context,
    'hexagram',
    branchForSovereignHexagram,
    (branch) => branch,
  );

  const centerHexagram = activeBranch
    ? getHexagram(getSovereignHexagram(activeBranch).hexagramNumber)
    : null;

  const radius = compact ? CARD_RADIUS * 0.75 : CARD_RADIUS;

  return (
    <View style={[styles.circle, { width: radius * 2 + 20, height: radius * 2 + 20 }]}>
      <View style={styles.center} testID="branches-card-center">
        {centerHexagram && (
          <Text style={[styles.centerHexagram, { color: colors.text }]}>{centerHexagram.unicode}</Text>
        )}
      </View>
      {(EARTHLY_BRANCHES as readonly EarthlyBranch[]).map((branch, index) => {
        const angle = (index * 30 - 90) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isActive = branch === activeBranch;

        return (
          <View
            key={branch}
            testID={isActive ? 'branches-card-active' : undefined}
            style={[
              styles.branch,
              { transform: [{ translateX: x }, { translateY: y }] },
              isActive && { backgroundColor: colors.text },
            ]}
          >
            <Text style={[styles.branchChar, { color: isActive ? colors.background : colors.textSecondary }]}>
              {BRANCH_INFO[branch].chinese}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHexagram: {
    fontSize: 20,
  },
  branch: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchChar: {
    fontSize: 9,
    fontWeight: '600',
  },
});
