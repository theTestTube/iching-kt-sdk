/**
 * Card typography/spacing token contract (#82).
 *
 * These tokens are the shared vocabulary that text-content CardViews derive
 * their font sizes/weights and inner spacing from, so cards read as one system.
 * Pinning them here documents the contract and guards accidental drift — a
 * change to a role's value is a deliberate, reviewable design change.
 */

import { CARD_TYPOGRAPHY, CARD_SPACING } from '../theme';

describe('CARD_TYPOGRAPHY', () => {
  it('exposes every card text role', () => {
    expect(Object.keys(CARD_TYPOGRAPHY).sort()).toEqual(
      [
        'caption',
        'displayIcon',
        'displayIconCompact',
        'label',
        'micro',
        'title',
        'titleCompact',
      ].sort(),
    );
  });

  it('pins the canonical size/weight per role', () => {
    expect(CARD_TYPOGRAPHY.displayIcon).toEqual({ fontSize: 28 });
    expect(CARD_TYPOGRAPHY.displayIconCompact).toEqual({ fontSize: 20 });
    expect(CARD_TYPOGRAPHY.title).toEqual({ fontSize: 13, fontWeight: '600' });
    expect(CARD_TYPOGRAPHY.titleCompact).toEqual({ fontSize: 11, fontWeight: '600' });
    expect(CARD_TYPOGRAPHY.label).toEqual({ fontSize: 12, fontWeight: '500' });
    expect(CARD_TYPOGRAPHY.caption).toEqual({ fontSize: 11 });
    expect(CARD_TYPOGRAPHY.micro).toEqual({ fontSize: 10 });
  });

  it('keeps the type scale monotonic (display ≥ title ≥ label ≥ caption ≥ micro)', () => {
    const { displayIcon, title, label, caption, micro } = CARD_TYPOGRAPHY;
    expect(displayIcon.fontSize).toBeGreaterThanOrEqual(title.fontSize);
    expect(title.fontSize).toBeGreaterThanOrEqual(label.fontSize);
    expect(label.fontSize).toBeGreaterThanOrEqual(caption.fontSize);
    expect(caption.fontSize).toBeGreaterThanOrEqual(micro.fontSize);
  });

  it('shrinks the compact variants below their base', () => {
    expect(CARD_TYPOGRAPHY.displayIconCompact.fontSize).toBeLessThan(CARD_TYPOGRAPHY.displayIcon.fontSize);
    expect(CARD_TYPOGRAPHY.titleCompact.fontSize).toBeLessThan(CARD_TYPOGRAPHY.title.fontSize);
  });
});

describe('CARD_SPACING', () => {
  it('exposes an ascending inner spacing scale', () => {
    expect(CARD_SPACING.gapXs).toBeLessThan(CARD_SPACING.gapSm);
    expect(CARD_SPACING.gapSm).toBeLessThan(CARD_SPACING.gap);
    expect(CARD_SPACING.gap).toBeLessThanOrEqual(CARD_SPACING.padding);
    expect(CARD_SPACING).toEqual({ gapXs: 2, gapSm: 4, gap: 6, padding: 8 });
  });
});
