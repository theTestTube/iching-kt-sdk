import { useRef, useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import type { EarthlyBranch } from '@iching-kt/provider-time';

interface BranchDisplayInfo {
  chinese: string;
  pinyin: string;
  animal: string;
}

interface Props {
  branch: EarthlyBranch;
  getBranchInfo: (branch: EarthlyBranch) => BranchDisplayInfo;
  textColor: string;
  textSecondaryColor: string;
}

const BRANCH_ORDER: EarthlyBranch[] = [
  'zi', 'chou', 'yin', 'mao', 'chen', 'si',
  'wu', 'wei', 'shen', 'you', 'xu', 'hai',
];

function getOffsetBranch(currentBranch: EarthlyBranch, offset: number): EarthlyBranch {
  const currentIndex = BRANCH_ORDER.indexOf(currentBranch);
  const targetIndex = (currentIndex + offset + 12) % 12;
  return BRANCH_ORDER[targetIndex];
}

const SLOTS = [-2, -1, 0, 1, 2];

function scaleForPosition(pos: number): number {
  return Math.abs(pos) === 0 ? 1 : 0.5;
}

function opacityForPosition(pos: number): number {
  return Math.abs(pos) <= 1 ? 1 : 0;
}

function pinyinOpacityForPosition(pos: number): number {
  return pos === 0 ? 1 : 0;
}

export function SlidingHourHeader({ branch, getBranchInfo, textColor, textSecondaryColor }: Props) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const prevBranchRef = useRef<EarthlyBranch | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (prevBranchRef.current === null) {
      prevBranchRef.current = branch;
      return;
    }
    if (prevBranchRef.current === branch) return;

    const oldIndex = BRANCH_ORDER.indexOf(prevBranchRef.current);
    const newIndex = BRANCH_ORDER.indexOf(branch);
    const diff = (newIndex - oldIndex + 12) % 12;
    // diff <= 6 means forward (next pressed), > 6 means backward (prev pressed)
    const startValue = diff <= 6 ? 1 : -1;

    slideAnim.setValue(startValue);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    prevBranchRef.current = branch;
  }, [branch, slideAnim]);

  const slotWidth = containerWidth / 3;

  const renderSlot = (slot: number) => {
    const slotBranch = getOffsetBranch(branch, slot);
    const info = getBranchInfo(slotBranch);

    // Each slot's effective position = slot + slideAnim
    // slideAnim ranges from -1 to 0 to 1
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

    const pinyinOp = slideAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [
        pinyinOpacityForPosition(slot - 1),
        pinyinOpacityForPosition(slot),
        pinyinOpacityForPosition(slot + 1),
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
        <Text style={[styles.chinese, { color: textColor }]}>{info.chinese}</Text>
        <Animated.View style={{ opacity: pinyinOp }}>
          <Text style={[styles.pinyin, { color: textSecondaryColor }]}>{info.pinyin} shí</Text>
        </Animated.View>
        <Text style={[styles.animal, { color: textColor }]}>{info.animal}</Text>
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
});
