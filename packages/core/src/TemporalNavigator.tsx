import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import type { ColorScheme } from './types';
import { getThemeColors } from './theme';

export interface TemporalNavigatorProps<T> {
  /** Current temporal value (e.g., current hour data) */
  current: T;

  /** Previous temporal value (null if at start of cycle) */
  previous: T | null;

  /** Next temporal value (null if at end of cycle) */
  next: T | null;

  /** Called when user navigates to previous */
  onPrevious?: () => void;

  /** Called when user navigates to next */
  onNext?: () => void;

  /** Label for previous button */
  previousLabel?: string;

  /** Label for next button */
  nextLabel?: string;

  /** Render function for content */
  renderContent: (value: T, isTransitioning: boolean) => React.ReactNode;

  /** Color scheme */
  colorScheme?: ColorScheme;

  /** Animation duration in ms (default: 300) */
  animationDuration?: number;
}

export function TemporalNavigator<T>({
  current,
  previous,
  next,
  onPrevious,
  onNext,
  previousLabel = '◀ Previous',
  nextLabel = 'Next ▶',
  renderContent,
  colorScheme = 'light',
  animationDuration = 300,
}: TemporalNavigatorProps<T>) {
  const colors = getThemeColors(colorScheme);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = (direction: 'previous' | 'next') => {
    if (isTransitioning) return; // Prevent concurrent transitions

    setIsTransitioning(true);

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: animationDuration / 2,
      useNativeDriver: true,
    }).start(() => {
      // Update content
      if (direction === 'previous') {
        onPrevious?.();
      } else {
        onNext?.();
      }

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration / 2,
        useNativeDriver: true,
      }).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const handlePrevious = () => {
    if (previous !== null) {
      transitionTo('previous');
    }
  };

  const handleNext = () => {
    if (next !== null) {
      transitionTo('next');
    }
  };

  const isPreviousDisabled = previous === null || isTransitioning;
  const isNextDisabled = next === null || isTransitioning;

  return (
    <View style={styles.container}>
      {/* Navigation Controls */}
      <View style={styles.controls}>
        <Pressable
          onPress={handlePrevious}
          disabled={isPreviousDisabled}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: isPreviousDisabled
                ? colors.surfaceSecondary
                : pressed
                ? colors.primary
                : colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: isPreviousDisabled ? colors.textTertiary : colors.text,
              },
            ]}
          >
            {previousLabel}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          disabled={isNextDisabled}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: isNextDisabled
                ? colors.surfaceSecondary
                : pressed
                ? colors.primary
                : colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: isNextDisabled ? colors.textTertiary : colors.text,
              },
            ]}
          >
            {nextLabel}
          </Text>
        </Pressable>
      </View>

      {/* Animated Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {renderContent(current, isTransitioning)}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    width: '100%',
  },
});
