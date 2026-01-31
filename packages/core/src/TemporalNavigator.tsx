import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export interface TemporalNavigationState {
  isTransitioning: boolean;
  /** Call to navigate to previous. Null when at boundary or transitioning. */
  onPrevious: (() => void) | null;
  /** Call to navigate to next. Null when at boundary or transitioning. */
  onNext: (() => void) | null;
  /** Animated opacity value (0→1) for content that should fade during transitions */
  fadeAnim: Animated.Value;
}

export interface TemporalNavigatorProps<T> {
  /** Current temporal value */
  current: T;

  /** Previous temporal value (null if at start of cycle) */
  previous: T | null;

  /** Next temporal value (null if at end of cycle) */
  next: T | null;

  /** Called when user navigates to previous */
  onPrevious?: () => void;

  /** Called when user navigates to next */
  onNext?: () => void;

  /** Render function - receives value and navigation state so content can place controls anywhere */
  renderContent: (value: T, navigation: TemporalNavigationState) => React.ReactNode;

  /** Animation duration in ms (default: 300) */
  animationDuration?: number;
}

export function TemporalNavigator<T>({
  current,
  previous,
  next,
  onPrevious,
  onNext,
  renderContent,
  animationDuration = 300,
}: TemporalNavigatorProps<T>) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingFadeIn, setPendingFadeIn] = useState(false);

  // Phase 3: After content swap renders, fade back in.
  // Separated from fade-out to avoid recursive animation callbacks.
  useEffect(() => {
    if (!pendingFadeIn) return;
    setPendingFadeIn(false);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animationDuration / 2,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsTransitioning(false);
      }
    });
  }, [pendingFadeIn]);

  const transitionTo = (direction: 'previous' | 'next') => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Phase 1: Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: animationDuration / 2,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        setIsTransitioning(false);
        return;
      }
      // Phase 2: Swap content and schedule fade-in
      if (direction === 'previous') {
        onPrevious?.();
      } else {
        onNext?.();
      }
      setPendingFadeIn(true);
    });
  };

  const navigation: TemporalNavigationState = {
    isTransitioning,
    onPrevious: previous !== null && !isTransitioning
      ? () => transitionTo('previous')
      : null,
    onNext: next !== null && !isTransitioning
      ? () => transitionTo('next')
      : null,
    fadeAnim,
  };

  return (
    <View style={styles.container}>
      {renderContent(current, navigation)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
