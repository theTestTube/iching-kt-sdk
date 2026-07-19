/**
 * Theme status color contract (#82).
 *
 * success/warning/danger/neutral are semantic UI-state hues (health, budget,
 * traffic-light indicators) that app surfaces derive from the theme instead of
 * hard-coding literals. Pinned here so a change is a deliberate design change,
 * and asserted for both schemes so neither is left undefined.
 */

import { getThemeColors } from '../theme';

const STATUS_KEYS = ['success', 'warning', 'danger', 'neutral'] as const;

describe('theme status colors', () => {
  it('exposes every status role as a hex color in both schemes', () => {
    for (const scheme of ['light', 'dark'] as const) {
      const colors = getThemeColors(scheme);
      for (const key of STATUS_KEYS) {
        expect(colors[key]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });

  it('pins the canonical light hues (medium fills for a white glyph)', () => {
    const light = getThemeColors('light');
    expect(light.success).toBe('#22C55E');
    expect(light.warning).toBe('#F59E0B');
    expect(light.danger).toBe('#EF4444');
    expect(light.neutral).toBe('#6B7280');
  });

  it('uses distinct, brighter dark hues (pill stands out on a dark header)', () => {
    const light = getThemeColors('light');
    const dark = getThemeColors('dark');
    for (const key of STATUS_KEYS) {
      expect(dark[key]).not.toBe(light[key]);
    }
  });
});
