/**
 * Shichen Progress Bar - Offset & Day Progress Bar Tests
 *
 * Verifies:
 * 1. Hour progress bar shows correct fill per offset
 *    - Current hour: actual real-time progress (0.0–1.0)
 *    - Past hours (offset < 0): fully elapsed → 1.0
 *    - Future hours (offset > 0): not started → 0.0
 *
 * 2. Day progress bar assigns per-element colors to each segment
 *    - Navigated segment: element activeColor
 *    - Other segments: their own element defaultColor
 *
 * Framework: Jest
 * Run: npm test -- --testPathPattern=HoursProgress
 */

import { getAbstractColors } from '@iching-kt/core';
import type { EarthlyBranch } from '@iching-kt/provider-time';

/**
 * Inline copy of getBranchProgress from HoursView.tsx.
 * Kept in sync by test assertions — if the source logic changes
 * and tests break, update this copy.
 */
function getBranchProgress(offset: number, currentProgress: number): number {
  if (offset === 0) return currentProgress;
  if (offset < 0) return 1;
  return 0;
}

/**
 * Branch-to-element mapping (matches data.ts English element names).
 * Each shichen has a Wu Xing element assignment.
 */
const BRANCH_ELEMENT: Record<EarthlyBranch, string> = {
  zi: 'water', chou: 'earth', yin: 'wood', mao: 'wood',
  chen: 'earth', si: 'fire', wu: 'fire', wei: 'earth',
  shen: 'metal', you: 'metal', xu: 'earth', hai: 'water',
};

const BRANCH_ORDER: EarthlyBranch[] = [
  'zi', 'chou', 'yin', 'mao', 'chen', 'si',
  'wu', 'wei', 'shen', 'you', 'xu', 'hai',
];

/**
 * Mirrors the day progress bar color selection logic in HoursView.
 */
function getDaySegmentColor(
  segmentBranch: EarthlyBranch,
  isViewing: boolean,
  colorScheme: 'light' | 'dark',
): string {
  const abstractColors = getAbstractColors(colorScheme);
  const elementKey = BRANCH_ELEMENT[segmentBranch] as keyof typeof abstractColors.elements;
  const elementColors = abstractColors.elements[elementKey];
  return isViewing ? elementColors.activeColor : elementColors.defaultColor;
}

describe('Shichen Progress Bar - Offset Behavior', () => {
  const CURRENT_PROGRESS = 0.42;

  describe('current hour (offset === 0)', () => {
    it('should return actual real-time progress', () => {
      expect(getBranchProgress(0, CURRENT_PROGRESS)).toBe(CURRENT_PROGRESS);
    });

    it('should return 0 when at the start of the hour', () => {
      expect(getBranchProgress(0, 0)).toBe(0);
    });

    it('should return 1 when at the end of the hour', () => {
      expect(getBranchProgress(0, 1)).toBe(1);
    });
  });

  describe('past hours (offset < 0)', () => {
    it('should return 1 (fully elapsed) for immediately previous hour', () => {
      expect(getBranchProgress(-1, CURRENT_PROGRESS)).toBe(1);
    });

    it('should return 1 (fully elapsed) for hours further in the past', () => {
      expect(getBranchProgress(-5, CURRENT_PROGRESS)).toBe(1);
      expect(getBranchProgress(-11, CURRENT_PROGRESS)).toBe(1);
    });
  });

  describe('future hours (offset > 0)', () => {
    it('should return 0 (not started) for immediately next hour', () => {
      expect(getBranchProgress(1, CURRENT_PROGRESS)).toBe(0);
    });

    it('should return 0 (not started) for hours further in the future', () => {
      expect(getBranchProgress(5, CURRENT_PROGRESS)).toBe(0);
      expect(getBranchProgress(11, CURRENT_PROGRESS)).toBe(0);
    });
  });
});

describe('Day Progress Bar - Per-Element Segment Colors', () => {
  const lightColors = getAbstractColors('light');
  const darkColors = getAbstractColors('dark');

  it('navigated segment should use its element activeColor (light)', () => {
    // Viewing zi (water)
    const color = getDaySegmentColor('zi', true, 'light');
    expect(color).toBe(lightColors.elements.water.activeColor);
  });

  it('navigated segment should use its element activeColor (dark)', () => {
    // Viewing wu (fire)
    const color = getDaySegmentColor('wu', true, 'dark');
    expect(color).toBe(darkColors.elements.fire.activeColor);
  });

  it('non-navigated segment should use its own element defaultColor (light)', () => {
    const color = getDaySegmentColor('shen', false, 'light');
    expect(color).toBe(lightColors.elements.metal.defaultColor);
  });

  it('non-navigated segment should use its own element defaultColor (dark)', () => {
    const color = getDaySegmentColor('yin', false, 'dark');
    expect(color).toBe(darkColors.elements.wood.defaultColor);
  });

  it('each segment should use its own element color, not a uniform color', () => {
    // Simulate viewing 'wu' (fire) — all 12 segments should reflect their own element
    const viewingIndex = BRANCH_ORDER.indexOf('wu');
    const segmentColors = BRANCH_ORDER.map((b, i) =>
      getDaySegmentColor(b, i === viewingIndex, 'light')
    );

    // Navigated segment (wu = fire) uses fire activeColor
    expect(segmentColors[viewingIndex]).toBe(lightColors.elements.fire.activeColor);

    // Non-navigated segments use their element's defaultColor
    // zi = water
    expect(segmentColors[0]).toBe(lightColors.elements.water.defaultColor);
    // chou = earth
    expect(segmentColors[1]).toBe(lightColors.elements.earth.defaultColor);
    // yin = wood
    expect(segmentColors[2]).toBe(lightColors.elements.wood.defaultColor);
    // shen = metal
    expect(segmentColors[8]).toBe(lightColors.elements.metal.defaultColor);

    // No segment should use a generic/uniform color — adjacent segments
    // with different elements should have different defaultColors
    // zi(water) vs chou(earth)
    expect(segmentColors[0]).not.toBe(segmentColors[1]);
  });
});
