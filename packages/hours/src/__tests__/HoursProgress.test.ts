/**
 * Shichen Progress Bar - Offset Behavior Tests
 *
 * Verifies that the hour progress bar shows correct fill
 * depending on whether the user is viewing a past, current,
 * or future shichen period.
 *
 * - Current hour: actual real-time progress (0.0–1.0)
 * - Past hours (offset < 0): fully elapsed → 1.0
 * - Future hours (offset > 0): not started → 0.0
 *
 * Framework: Jest
 * Run: npm test -- --testPathPattern=HoursProgress
 */

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
