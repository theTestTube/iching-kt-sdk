import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
  Animated,
} from 'react-native';
import { getThemeColors, getAbstractColors } from '@iching-kt/core';
import type { KnowletContext } from '@iching-kt/core';
import type { RotationData } from '@iching-kt/provider-rotation';
import { COMPASS_DIRECTIONS, getDirectionForHeading } from '../directions';

interface Props {
  context: KnowletContext;
}

const ELEMENT_CONCEPT: Record<string, { en: string; es: string; zh: string }> = {
  water:  { en: 'Water',  es: 'Agua',   zh: '水' },
  wood:   { en: 'Wood',   es: 'Madera', zh: '木' },
  fire:   { en: 'Fire',   es: 'Fuego',  zh: '火' },
  earth:  { en: 'Earth',  es: 'Tierra', zh: '土' },
  metal:  { en: 'Metal',  es: 'Metal',  zh: '金' },
};

// Shown when no rotation situation is present (magnetometer unavailable) —
// the rose still renders heading-less, north-up (US 22 degraded mode).
const DEGRADED_LABEL: Record<string, string> = {
  en: 'Compass unavailable — showing fixed north',
  es: 'Brújula no disponible — norte fijo',
  zh: '羅盤不可用 — 顯示固定北方',
};

const SIN_22_5 = Math.sin((22.5 * Math.PI) / 180);

export function CompassView({ context }: Props) {
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const rotAnim = useRef(new Animated.Value(0)).current;
  // Cumulative rotation — unbounded, avoids 359→0 wrap-around jump
  const cumRotRef = useRef(0);
  const prevHeadingRef = useRef<number | null>(null);

  const rotationData = context.situations['rotation'] as RotationData | undefined;
  const hasRotation = rotationData !== undefined;

  const colors = getThemeColors(context.colorScheme);
  const abstractColors = getAbstractColors(context.colorScheme);
  const lang = (context.language in DEGRADED_LABEL ? context.language : 'en') as 'en' | 'es' | 'zh';

  const currentDir = rotationData
    ? getDirectionForHeading(rotationData.heading)
    : COMPASS_DIRECTIONS[0];

  useEffect(() => {
    // Degraded (no rotation): leave rose at rotate:0 → north-up, static.
    if (!rotationData) return;
    const h = rotationData.heading;
    if (prevHeadingRef.current === null) {
      // First reading: snap without animation
      cumRotRef.current = -h;
      rotAnim.setValue(cumRotRef.current);
    } else {
      // Shortest-path delta: normalise to [-180, 180]
      let delta = h - prevHeadingRef.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      cumRotRef.current -= delta;
      Animated.timing(rotAnim, {
        toValue: cumRotRef.current,
        duration: 80,
        useNativeDriver: true,
      }).start();
    }
    prevHeadingRef.current = h;
  }, [rotationData?.heading]);

  const rotDeg = rotAnim.interpolate({
    inputRange: [-3600, 3600],
    outputRange: ['-3600deg', '3600deg'],
    extrapolate: 'extend',
  });

  // Geometry
  const roseSize = Math.min(containerSize.w, containerSize.h) * 0.92;
  const center = roseSize / 2;
  // orbitR: where N and ^ sit — just inside the container edge
  const orbitR = center * 0.88;
  // outerR: octagon circumscribed radius — smaller than orbitR to leave room for indicators
  const outerR = center * 0.74;
  const innerR = center * 0.28;
  const apothem = outerR * Math.cos((22.5 * Math.PI) / 180);
  const midR = (apothem + innerR) / 2;
  const sectorH = apothem - innerR;
  const sectorW = 2 * midR * SIN_22_5;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ w: width, h: height });
  };

  const handleSectorPress = (trigramId: string) => context.emitOutput('trigram', trigramId);
  const handleSectorLongPress = (trigramId: string) => context.showKnowletSelector('trigram', trigramId);

  const elementConcept = ELEMENT_CONCEPT[currentDir.element]?.[lang] ?? currentDir.element;
  const descriptionParts = hasRotation && rotationData
    ? [
        currentDir.direction,
        `${currentDir.trigram} ${currentDir.names.zh}${lang !== 'zh' ? ` ${currentDir.names[lang]}` : ''}`,
        elementConcept,
      ]
    : [];

  // N indicator layout (positioned at 12 o'clock inside rotating layer)
  // When rotating layer turns by -heading, N orbits to the North direction.
  // N is NOT counter-rotated → it rotates with the layer → feet point toward center.
  const nFontSize = roseSize * 0.05;
  const nTop = center - orbitR - nFontSize;
  const nLeft = center - nFontSize * 0.4;

  // ^ indicator layout (FIXED at 12 o'clock, outside rotating layer = device front)
  const caretFontSize = roseSize * 0.06;
  const caretTop = center - orbitR - caretFontSize;
  const caretLeft = center - caretFontSize * 0.38;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} onLayout={onLayout}>
      {roseSize > 0 && (
        <View style={{ width: roseSize, height: roseSize }}>

          {/* ── Rotating layer: octagon sectors + N indicator ── */}
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: rotDeg }] }]}>

            {/* 8 sectors */}
            {COMPASS_DIRECTIONS.map((dir, i) => {
              const angleDeg = i * 45;
              const angleRad = (angleDeg - 90) * (Math.PI / 180);
              const cx = center + midR * Math.cos(angleRad);
              const cy = center + midR * Math.sin(angleRad);
              const isActive = hasRotation && dir.trigramId === currentDir.trigramId;
              const elementColor = abstractColors.elements[dir.element].activeColor;
              return (
                <TouchableWithoutFeedback
                  key={dir.trigramId}
                  onPress={() => handleSectorPress(dir.trigramId)}
                  onLongPress={() => handleSectorLongPress(dir.trigramId)}
                >
                  <View
                    style={[
                      styles.sector,
                      {
                        width: sectorW,
                        height: sectorH,
                        left: cx - sectorW / 2,
                        top: cy - sectorH / 2,
                        backgroundColor: isActive ? elementColor : elementColor + '66',
                        transform: [{ rotate: `${angleDeg}deg` }],
                      },
                    ]}
                  >
                    <Text style={[styles.sectorTrigram, { color: isActive ? '#fff' : colors.text, fontSize: sectorH * 0.44 }]}>
                      {dir.trigram}
                    </Text>
                    <Text style={[styles.sectorDir, { color: isActive ? '#fff' : colors.text, fontSize: sectorH * 0.24 }]}>
                      {dir.direction}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}

            {/* N indicator at 12 o'clock — NOT counter-rotated → feet always toward center */}
            <Text
              style={[
                styles.orbitN,
                {
                  top: nTop,
                  left: nLeft,
                  fontSize: nFontSize,
                  color: colors.primary,
                },
              ]}
            >
              N
            </Text>
          </Animated.View>

          {/* ── ^ fixed at 12 o'clock (device front, outside rotating layer) ── */}
          <Text
            style={[
              styles.orbitCaret,
              {
                top: caretTop,
                left: caretLeft,
                fontSize: caretFontSize,
                color: colors.primary,
              },
            ]}
          >
            ^
          </Text>

          {/* ── Center circle: stable current-direction trigram ── */}
          <View
            style={[
              styles.centerCircle,
              {
                width: innerR * 2,
                height: innerR * 2,
                borderRadius: innerR,
                left: center - innerR,
                top: center - innerR,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.centerTrigram, { color: colors.text, fontSize: innerR * 0.85 }]}>
              {currentDir.trigram}
            </Text>
          </View>
        </View>
      )}

      {/* Description: "N · ☵ 坎 Kan · Water" when live, degraded caption otherwise */}
      {hasRotation ? (
        descriptionParts.length > 0 && (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {descriptionParts.join(' · ')}
          </Text>
        )
      ) : (
        <Text style={[styles.description, { color: colors.textTertiary }]}>
          {DEGRADED_LABEL[lang]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  sector: {
    position: 'absolute',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sectorTrigram: {
    fontWeight: '500',
  },
  sectorDir: {
    fontWeight: '600',
    marginTop: 1,
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
  centerCircle: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  centerTrigram: {
    fontWeight: '300',
  },
  description: {
    marginTop: 14,
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
