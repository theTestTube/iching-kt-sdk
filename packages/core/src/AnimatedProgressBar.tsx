import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

export interface AnimatedProgressBarProps {
  /** Progress value 0.0 to 1.0 */
  progress: number;

  /** Fill color */
  color: string;

  /** Track color */
  trackColor: string;

  /** Height in pixels */
  height?: number;

  /** Animation duration for progress changes (ms) */
  animationDuration?: number;

  /** Border radius */
  borderRadius?: number;

  /** Container style */
  style?: any;
}

export function AnimatedProgressBar({
  progress,
  color,
  trackColor,
  height = 6,
  animationDuration = 500,
  borderRadius = 3,
  style,
}: AnimatedProgressBarProps) {
  const widthAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: animationDuration,
      useNativeDriver: false, // width can't use native driver
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [progress, animationDuration]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: animatedWidth,
            height,
            borderRadius,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});
