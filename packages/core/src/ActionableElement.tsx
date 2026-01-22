import React, { useRef, useCallback, useEffect } from 'react';
import {
  Pressable,
  Animated,
  StyleSheet,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native';
import { OutputType, ColorScheme } from './types';
import { getAbstractColors } from './theme';

/**
 * Action types for actionable elements
 */
export type ActionType = 'emit' | 'navigate' | 'detail';

export interface ActionableElementProps {
  /** The output type to emit on press */
  outputType: OutputType;
  /** The value to emit */
  value: unknown;
  /** Label for the element (for accessibility) */
  label?: string;
  /** Callback when element is pressed (short tap) */
  onPress?: (type: OutputType, value: unknown) => void;
  /** Callback when element is long-pressed */
  onLongPress?: (type: OutputType, value: unknown) => void;
  /** Whether the element is currently active/highlighted */
  isActive?: boolean;
  /** Active background color (overrides colorScheme default) */
  activeColor?: string;
  /** Default background color (overrides colorScheme default) */
  defaultColor?: string;
  /** Color scheme for theme-aware defaults */
  colorScheme?: ColorScheme;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
  /** Children to render */
  children: React.ReactNode;
  /** Disable interactions */
  disabled?: boolean;
  /** Whether the element has a circular shape (adjusts indicator position) */
  circular?: boolean;
}

/**
 * ActionableElement - A reusable component for interactive I-Ching elements
 *
 * Provides:
 * - Press action: Emits output for knowlet navigation/consumption
 * - Long-press action: Shows detail view or triggers special action
 * - Visual feedback: Animated press effect with shine/highlight
 *
 * Usage:
 * <ActionableElement
 *   outputType="hexagram"
 *   value={24}
 *   onPress={(type, val) => context.emitOutput(type, val)}
 *   onLongPress={(type, val) => context.pushView('hexagram-detail', { hexagramNumber: val })}
 *   isActive={currentHexagram === 24}
 *   activeColor="#333"
 * >
 *   <Text>䷗</Text>
 * </ActionableElement>
 */
export function ActionableElement({
  outputType,
  value,
  label,
  onPress,
  onLongPress,
  isActive = false,
  activeColor,
  defaultColor,
  colorScheme = 'light',
  style,
  children,
  disabled = false,
  circular = false,
}: ActionableElementProps) {
  // Get theme-aware default colors
  const abstractColors = getAbstractColors(colorScheme);
  const resolvedActiveColor = activeColor ?? abstractColors.hexagram.activeColor;
  const resolvedDefaultColor = defaultColor ?? abstractColors.hexagram.defaultColor;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Reset animation state when isActive changes to prevent stuck states
  useEffect(() => {
    scaleAnim.setValue(1);
    opacityAnim.setValue(0);
  }, [isActive, scaleAnim, opacityAnim]);

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress(outputType, value);
    }
  }, [disabled, onPress, outputType, value]);

  const handleLongPress = useCallback(() => {
    if (!disabled && onLongPress) {
      onLongPress(outputType, value);
    }
  }, [disabled, onLongPress, outputType, value]);

  const backgroundColor = isActive ? resolvedActiveColor : resolvedDefaultColor;

  // Calculate theme-aware overlay colors
  const shineOverlayColor = colorScheme === 'dark'
    ? 'rgba(255, 255, 255, 0.15)' // Subtle white shine in dark mode
    : 'rgba(255, 255, 255, 0.3)';  // Bright white shine in light mode

  const indicatorColor = colorScheme === 'dark'
    ? 'rgba(255, 255, 255, 0.3)'  // Light indicator in dark mode
    : 'rgba(0, 0, 0, 0.15)';       // Dark indicator in light mode

  const activeIndicatorColor = colorScheme === 'dark'
    ? 'rgba(255, 255, 255, 0.6)'  // Brighter light indicator in dark mode
    : 'rgba(255, 255, 255, 0.5)'; // Light indicator in light mode

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive, disabled }}
    >
      <Animated.View
        style={[
          styles.container,
          { backgroundColor, transform: [{ scale: scaleAnim }] },
          isActive && styles.activeContainer,
          style,
        ]}
      >
        {children}

        {/* Shine overlay effect */}
        <Animated.View
          style={[
            styles.shineOverlay,
            { opacity: opacityAnim, backgroundColor: shineOverlayColor },
          ]}
          pointerEvents="none"
        />

        {/* Actionable indicator dot */}
        <View style={[styles.actionIndicator, circular && styles.actionIndicatorCircular]}>
          <View style={[styles.indicatorDot, { backgroundColor: indicatorColor }, isActive && { backgroundColor: activeIndicatorColor }]} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

/**
 * Get theme-aware preset configurations for common actionable element types
 */
export function getActionablePresets(colorScheme: ColorScheme) {
  const colors = getAbstractColors(colorScheme);
  return {
    hexagram: colors.hexagram,
    trigram: colors.trigram,
    element: colors.elements,
    yinyang: colors.yinyang,
  };
}

/**
 * Preset configurations for common actionable element types (light theme, for backwards compatibility)
 * @deprecated Use getActionablePresets(colorScheme) for theme-aware colors
 */
export const ActionablePresets = {
  hexagram: {
    activeColor: '#1a1a2e',
    defaultColor: '#f0f4f8',
  },
  trigram: {
    activeColor: '#16213e',
    defaultColor: '#e8f0fe',
  },
  element: {
    water: { activeColor: '#1a73e8', defaultColor: '#e3f2fd' },
    wood: { activeColor: '#34a853', defaultColor: '#e8f5e9' },
    fire: { activeColor: '#ea4335', defaultColor: '#ffebee' },
    earth: { activeColor: '#a67c52', defaultColor: '#efebe9' },
    metal: { activeColor: '#757575', defaultColor: '#f5f5f5' },
  },
  yinyang: {
    yin: { activeColor: '#1a1a1a', defaultColor: '#e0e0e0' },
    yang: { activeColor: '#ffd700', defaultColor: '#fffde7' },
  },
} as const;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  activeContainer: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  shineOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  actionIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  actionIndicatorCircular: {
    top: 2,
    right: '50%',
    transform: [{ translateX: 3 }],
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeIndicatorDot: {
    // backgroundColor set dynamically based on colorScheme
  },
});
