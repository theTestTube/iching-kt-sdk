import { useRef, useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import type { MoonPhaseId } from '@iching-kt/provider-moon-phase';
import { PHASE_ORDER } from '@iching-kt/provider-moon-phase';
import type { MoonPhaseInfo } from './data';

interface PhaseDisplayInfo {
  /** Hero character: trigram symbol or hexagram unicode for transitional phases */
  heroSymbol: string;
  /** Phase name (localized) */
  phaseName: string;
  /** Chinese phase name */
  chinese: string;
  /** Pinyin romanization */
  pinyin: string;
}

interface Props {
  phaseId: MoonPhaseId;
  getPhaseDisplay: (phaseId: MoonPhaseId) => PhaseDisplayInfo;
  hideOriginRef: boolean;
  textColor: string;
  textSecondaryColor: string;
}

function getOffsetPhase(currentPhase: MoonPhaseId, offset: number): MoonPhaseId {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  // Wrapping navigation: 8-phase cycle
  const targetIndex = ((currentIndex + offset) % 8 + 8) % 8;
  return PHASE_ORDER[targetIndex];
}

const SLOTS = [-2, -1, 0, 1, 2];

function scaleForPosition(pos: number): number {
  return Math.abs(pos) === 0 ? 1 : 0.5;
}

function opacityForPosition(pos: number): number {
  return Math.abs(pos) <= 1 ? 1 : 0;
}

function chineseOpacityForPosition(pos: number): number {
  return pos === 0 ? 1 : 0;
}

export function SlidingMoonHeader({ phaseId, getPhaseDisplay, hideOriginRef, textColor, textSecondaryColor }: Props) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const prevPhaseRef = useRef<MoonPhaseId | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (prevPhaseRef.current === null) {
      prevPhaseRef.current = phaseId;
      return;
    }
    if (prevPhaseRef.current === phaseId) return;

    const oldIndex = PHASE_ORDER.indexOf(prevPhaseRef.current);
    const newIndex = PHASE_ORDER.indexOf(phaseId);
    const diff = ((newIndex - oldIndex) + 8) % 8;
    // diff <= 4 means forward, > 4 means backward
    const startValue = diff <= 4 ? 1 : -1;

    slideAnim.setValue(startValue);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    prevPhaseRef.current = phaseId;
  }, [phaseId, slideAnim]);

  const slotWidth = containerWidth / 3;

  const renderSlot = (slot: number) => {
    const slotPhase = getOffsetPhase(phaseId, slot);
    const display = getPhaseDisplay(slotPhase);

    const translateX = slideAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [
        (slot - 1) * slotWidth,
        slot * slotWidth,
        (slot + 1) * slotWidth,
      ],
    });

    const scale = slideAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [
        scaleForPosition(slot - 1),
        scaleForPosition(slot),
        scaleForPosition(slot + 1),
      ],
    });

    const opacity = slideAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [
        opacityForPosition(slot - 1),
        opacityForPosition(slot),
        opacityForPosition(slot + 1),
      ],
    });

    const chineseOp = slideAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [
        chineseOpacityForPosition(slot - 1),
        chineseOpacityForPosition(slot),
        chineseOpacityForPosition(slot + 1),
      ],
    });

    return (
      <Animated.View
        key={slot}
        style={[
          styles.slot,
          {
            opacity,
            transform: [
              { translateX },
              { scale },
            ],
          },
        ]}
      >
        <Text style={[styles.heroSymbol, { color: textColor }]}>{display.heroSymbol}</Text>
        {!hideOriginRef && (
          <Animated.View style={{ opacity: chineseOp, alignItems: 'center' }}>
            <Text style={[styles.chinese, { color: textSecondaryColor }]}>{display.chinese}</Text>
            <Text style={[styles.pinyin, { color: textSecondaryColor }]}>{display.pinyin}</Text>
          </Animated.View>
        )}
        <Text style={[styles.phaseName, { color: textColor }]}>{display.phaseName}</Text>
      </Animated.View>
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && SLOTS.map(renderSlot)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSymbol: {
    fontSize: 96,
    fontWeight: '200',
  },
  chinese: {
    fontSize: 18,
    fontWeight: '600',
  },
  pinyin: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 2,
  },
  phaseName: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
});
