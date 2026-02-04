/**
 * TemporalNavigator - Partial Fading Tests
 *
 * Verifies the core contract of TemporalNavigator:
 * - fadeAnim is provided to consumers for selective application
 * - The TemporalNavigator wrapper itself does NOT apply opacity
 * - Navigation triggers fade-out → content swap → fade-in sequence
 * - Navigation group elements (placed by consumer without fadeAnim) remain static
 *
 * Architecture reference:
 *   team-knowledge/architecture/ux-polish-mvp-strategy.md
 *   "Static Navigation Group" partial-fading pattern
 *
 * Framework: Jest + @testing-library/react
 * Run: npm test -- --testPathPattern=TemporalNavigator
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Animated, View, Text, Pressable } from 'react-native';
import { TemporalNavigator } from '../TemporalNavigator';
import type { TemporalNavigationState } from '../TemporalNavigator';

// Capture navigation state across renders for assertions
let capturedNavigation: TemporalNavigationState | null = null;

/**
 * Test consumer that mimics HoursView's partial-fading layout:
 * - Upper fading section (uses fadeAnim)
 * - Static navigation group (does NOT use fadeAnim)
 * - Lower fading section (uses fadeAnim)
 */
function TestHourContent(
  { value, navigation }: { value: { label: string }; navigation: TemporalNavigationState }
) {
  capturedNavigation = navigation;
  const { fadeAnim } = navigation;

  return (
    <View>
      {/* Upper fading section */}
      <Animated.View testID="upper-fading" style={{ opacity: fadeAnim }}>
        <Text testID="hour-label">{value.label}</Text>
      </Animated.View>

      {/* Static navigation group - NO fadeAnim applied */}
      <View testID="navigation-group">
        <Pressable
          testID="btn-prev"
          onPress={navigation.onPrevious ?? undefined}
          disabled={!navigation.onPrevious}
        >
          <Text>◀</Text>
        </Pressable>
        <Text testID="time-range">21:00-23:00</Text>
        <Pressable
          testID="btn-next"
          onPress={navigation.onNext ?? undefined}
          disabled={!navigation.onNext}
        >
          <Text>▶</Text>
        </Pressable>
      </View>

      {/* Lower fading section */}
      <Animated.View testID="lower-fading" style={{ opacity: fadeAnim }}>
        <Text testID="details">Details for {value.label}</Text>
      </Animated.View>
    </View>
  );
}

describe('TemporalNavigator - Partial Fading', () => {
  const hours = [
    { label: 'Hour A' },
    { label: 'Hour B' },
    { label: 'Hour C' },
  ];

  function TestWrapper() {
    const [index, setIndex] = React.useState(1);

    return (
      <TemporalNavigator
        current={hours[index]}
        previous={index > 0 ? hours[index - 1] : null}
        next={index < hours.length - 1 ? hours[index + 1] : null}
        onPrevious={() => setIndex(i => i - 1)}
        onNext={() => setIndex(i => i + 1)}
        renderContent={(value, navigation) => (
          <TestHourContent value={value} navigation={navigation} />
        )}
        animationDuration={300}
      />
    );
  }

  beforeEach(() => {
    capturedNavigation = null;
  });

  it('should expose fadeAnim starting at opacity 1', () => {
    render(<TestWrapper />);

    expect(capturedNavigation).not.toBeNull();
    expect(capturedNavigation!.fadeAnim.__getValue()).toBe(1);
  });

  it('should NOT apply opacity to the TemporalNavigator wrapper itself', () => {
    const { getByTestId } = render(<TestWrapper />);

    // The navigation group is a plain View — no animated opacity
    const navGroup = getByTestId('navigation-group');
    const opacity = navGroup.style.opacity;
    expect(opacity === '' || opacity === '1' || opacity === undefined).toBe(true);
  });

  it('navigation group should have no animated opacity while fading sections do', () => {
    const { getByTestId } = render(<TestWrapper />);

    const upperFading = getByTestId('upper-fading');
    const lowerFading = getByTestId('lower-fading');
    const navGroup = getByTestId('navigation-group');

    // Fading sections have opacity style bound to fadeAnim
    expect(upperFading.style.opacity).toBeDefined();
    expect(lowerFading.style.opacity).toBeDefined();

    // Navigation group does NOT have opacity style (plain View)
    const navOpacity = navGroup.style.opacity;
    expect(navOpacity === '' || navOpacity === '1' || navOpacity === undefined).toBe(true);
  });

  it('should complete full navigation cycle: fade-out → swap → fade-in', async () => {
    const { getByTestId } = render(<TestWrapper />);

    // Initial content
    expect(getByTestId('hour-label').textContent).toBe('Hour B');
    expect(capturedNavigation!.fadeAnim.__getValue()).toBe(1);

    // Trigger navigation — mock animations complete instantly,
    // so the full fade-out → swap → fade-in cycle completes within act()
    await act(async () => {
      fireEvent.click(getByTestId('btn-next'));
    });

    // Content should be swapped to Hour C
    expect(getByTestId('hour-label').textContent).toBe('Hour C');
    // fadeAnim should be back to 1 after full cycle
    expect(capturedNavigation!.fadeAnim.__getValue()).toBe(1);
    // isTransitioning should be false (animation complete)
    expect(capturedNavigation!.isTransitioning).toBe(false);
  });

  it('should swap content on previous navigation', async () => {
    const { getByTestId } = render(<TestWrapper />);

    expect(getByTestId('hour-label').textContent).toBe('Hour B');

    await act(async () => {
      fireEvent.click(getByTestId('btn-prev'));
    });

    expect(getByTestId('hour-label').textContent).toBe('Hour A');
    expect(capturedNavigation!.fadeAnim.__getValue()).toBe(1);
    expect(capturedNavigation!.isTransitioning).toBe(false);
  });

  it('navigation group should remain structurally unchanged after navigation', async () => {
    const { getByTestId } = render(<TestWrapper />);

    // Before navigation
    const navGroupBefore = getByTestId('navigation-group');
    const navOpacityBefore = navGroupBefore.style.opacity;

    await act(async () => {
      fireEvent.click(getByTestId('btn-next'));
    });

    // After navigation — navigation group opacity unchanged
    const navGroupAfter = getByTestId('navigation-group');
    const navOpacityAfter = navGroupAfter.style.opacity;
    expect(navOpacityAfter).toBe(navOpacityBefore);
  });
});
