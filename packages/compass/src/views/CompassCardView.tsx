import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getThemeColors, getAbstractColors } from '@iching-kt/core';
import type { KnowletCardViewProps } from '@iching-kt/core';
import type { RotationData } from '@iching-kt/provider-rotation';
import { getDirectionForHeading } from '../directions';

/**
 * Compass CardView — rotation-presence model (#66), two states:
 *  live:     a `rotation` situation is present → stable current-heading trigram
 *            + N orbits (inside rotating layer, no counter-rotation → feet toward center)
 *            + ^ fixed at 12 o'clock outside rotating layer (device front)
 *            + heading readout.
 *  degraded: no `rotation` situation → heading-less, north-up static rose (US 22).
 *            Default Kan (☵ / N) trigram, no needle, no heading readout.
 *
 * N orbit: container rotates -heading. N sits at 12 o'clock (top), no counter-rotation.
 *   → At heading=0: N at top (feet toward center = downward) ✓
 *   → At heading=90: container rotates -90° → N moves to 9 o'clock (feet still toward center) ✓
 *
 * ^ is OUTSIDE rotating layer, absolutely positioned at 12 o'clock → always device front.
 */
export function CompassCardView({ context, compact }: KnowletCardViewProps) {
  const rotationData = context.situations['rotation'] as RotationData | undefined;
  const hasRotation = rotationData !== undefined;

  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);
  const lang = context.language as 'en' | 'es' | 'zh';

  const currentDir = rotationData
    ? getDirectionForHeading(rotationData.heading)
    : getDirectionForHeading(0); // N (Kan) default

  const elementColor = abstractColors.elements[currentDir.element].activeColor;

  // Sizes
  const ROSE = compact ? 36 : 48;
  const ORBIT_R = ROSE * 0.62; // orbit radius for N and ^
  const TRIGRAM_SIZE = ROSE * 0.88; // fits within ROSE box (borderRadius clips overflow on Android)
  // N indicator size
  const N_FONT = ROSE * 0.32;
  // ^ indicator size
  const CARET_FONT = ROSE * 0.36;

  // N orbit animation — cumulative to avoid 359→0 wrap-around jump
  const nOrbitAnim = useRef(new Animated.Value(0)).current;
  const cumRotRef = useRef(0);
  const prevHeadingRef = useRef<number | null>(null);

  useEffect(() => {
    // Degraded (no rotation): leave rose at rotate:0 → north-up, static.
    if (!rotationData) return;
    const h = rotationData.heading;
    if (prevHeadingRef.current === null) {
      cumRotRef.current = -h;
      nOrbitAnim.setValue(cumRotRef.current);
    } else {
      let delta = h - prevHeadingRef.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      cumRotRef.current -= delta;
      Animated.timing(nOrbitAnim, {
        toValue: cumRotRef.current,
        duration: 80,
        useNativeDriver: true,
      }).start();
    }
    prevHeadingRef.current = h;
  }, [rotationData?.heading]);

  const nOrbitDeg = nOrbitAnim.interpolate({
    inputRange: [-3600, 3600],
    outputRange: ['-3600deg', '3600deg'],
    extrapolate: 'extend',
  });

  const DEGRADED_LABEL: Record<string, string> = {
    en: 'No compass',
    es: 'Sin brújula',
    zh: '無羅盤',
  };

  // N/^ use transform:translateY to reach orbit — layout stays within ROSE bounds
  // (negative `top` causes Android layout expansion even in position:absolute)
  const nLayoutTop = ROSE / 2 - N_FONT / 2;
  const nLayoutLeft = ROSE / 2 - N_FONT * 0.4;
  const caretLayoutTop = ROSE / 2 - CARET_FONT / 2;
  const caretLayoutLeft = ROSE / 2 - CARET_FONT * 0.38;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ]}
    >
      {/* Rose: fixed ROSE×ROSE container */}
      <View style={{ width: ROSE, height: ROSE }}>

        {/* ── N orbit layer (rotating) — only when live ── */}
        {hasRotation && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { transform: [{ rotate: nOrbitDeg }] },
            ]}
          >
            {/* N at orbit via translateY — layout stays in bounds, transform doesn't affect layout */}
            <Text
              style={[
                styles.orbitN,
                {
                  top: nLayoutTop,
                  left: nLayoutLeft,
                  fontSize: N_FONT,
                  color: colors.primary,
                  transform: [{ translateY: -ORBIT_R }],
                },
              ]}
            >
              N
            </Text>
          </Animated.View>
        )}

        {/* ── ^ fixed at device front (outside rotating layer, translateY to orbit) ── */}
        {hasRotation && (
          <Text
            style={[
              styles.orbitCaret,
              {
                top: caretLayoutTop,
                left: caretLayoutLeft,
                fontSize: CARET_FONT,
                color: colors.primary,
                transform: [{ translateY: -ORBIT_R }],
              },
            ]}
          >
            ^
          </Text>
        )}

        {/* ── Stable trigram (always centered) ── */}
        <Text
          style={[
            styles.trigram,
            {
              fontSize: TRIGRAM_SIZE,
              lineHeight: ROSE,
              color: hasRotation ? elementColor : colors.textTertiary,
            },
          ]}
        >
          {currentDir.trigram}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        {hasRotation && rotationData ? (
          <>
            <Text testID="compass-card-heading" style={[styles.heading, { color: colors.text }]}>
              {Math.round(rotationData.heading)}°
            </Text>
            <Text style={[styles.direction, { color: colors.textSecondary }]}>
              {currentDir.direction} · {currentDir.names[lang]}
            </Text>
          </>
        ) : (
          <Text testID="compass-card-degraded" style={[styles.disabledLabel, { color: colors.textTertiary }]}>
            {DEGRADED_LABEL[lang] ?? DEGRADED_LABEL.en}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
    gap: 10,
  },
  orbitN: {
    position: 'absolute',
    fontWeight: '700',
    textAlign: 'center',
  },
  orbitCaret: {
    position: 'absolute',
    fontWeight: '900',
    textAlign: 'center',
  },
  trigram: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '300',
  },
  info: {
    flex: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
  },
  direction: {
    fontSize: 13,
    marginTop: 2,
  },
  disabledLabel: {
    fontSize: 13,
  },
});
