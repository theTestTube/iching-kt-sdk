/**
 * Contrast guard for the ground/ink rule (#421, part of #402).
 *
 * A control takes its colours from the ground it is drawn on and an ink chosen
 * to contrast that ground, never from a global token or a colour literal: `accent`
 * flips lightness between themes, so no fixed colour contrasts it in both.
 *
 * Runs against the REAL palette, so it fails when a palette edit leaves a
 * pairing unreadable, not only when a call site regresses.
 */
import {
  bubbleInk,
  getAbstractColors,
  getThemeColors,
  inkOn,
  BRAND,
  type AbstractColors,
  type ElementColorPair,
} from '../theme';
import type { ColorScheme } from '../types';

/** WCAG 2.1 relative luminance. */
function luminance(hex: string): number {
  let s = hex.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s.slice(0, 6), 16);
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const SCHEMES: ColorScheme[] = ['light', 'dark'];
/** Text and glyphs on a ground (WCAG 1.4.3). */
const TEXT_CONTRAST = 4.5;
/** Non-text UI against its surroundings (WCAG 1.4.11). */
const UI_CONTRAST = 3;

/** Every active pair of the abstract palette, labelled. */
function activePairs(abstract: AbstractColors): Array<[string, ElementColorPair]> {
  return [
    ...Object.entries(abstract.elements).map(
      ([name, pair]) => [`elements.${name}`, pair] as [string, ElementColorPair],
    ),
    ['yinyang.yin', abstract.yinyang.yin],
    ['yinyang.yang', abstract.yinyang.yang],
    ['trigram', abstract.trigram],
    ['hexagram', abstract.hexagram],
  ];
}

describe('brand tokens', () => {
  it('names the five brand colours', () => {
    expect(BRAND).toEqual({
      ink: '#000000',
      paper: '#ffffff',
      night: '#1a1a2e',
      gold: '#ffd700',
      goldOnLight: '#8a6d00',
    });
  });

  it('light accent and hexagram are night; yang is gold in dark, goldOnLight in light', () => {
    expect(getThemeColors('light').accent).toBe(BRAND.night);
    expect(getAbstractColors('light').hexagram.activeColor).toBe(BRAND.night);
    expect(getAbstractColors('light').yinyang.yang.activeColor).toBe(BRAND.goldOnLight);
    expect(getAbstractColors('dark').yinyang.yang.activeColor).toBe(BRAND.gold);
  });
});

describe('bubbleInk — on-bubble control contrast', () => {
  it('sanity: the luminance helper expands 3-digit hex', () => {
    expect(luminance('#fff')).toBeCloseTo(luminance('#ffffff'), 10);
    expect(contrastRatio('#fff', '#000')).toBeCloseTo(21, 1);
  });

  describe.each(SCHEMES)('%s mode', (scheme) => {
    const colors = getThemeColors(scheme);

    it.each([
      { isSystem: true, label: 'app bubble' },
      { isSystem: false, label: 'user bubble' },
    ])('$label: ink reads against its own ground', ({ isSystem }) => {
      const { ground, ink } = bubbleInk(colors, isSystem);
      expect(contrastRatio(ink, ground)).toBeGreaterThanOrEqual(TEXT_CONTRAST);
    });
  });

  it('regression: a hardcoded #fff checkmark fails on dark accent', () => {
    // Guards the reasoning: if this ever passes, `accent` stopped flipping and the
    // rule deserves a fresh look rather than silent inheritance.
    expect(contrastRatio('#fff', getThemeColors('dark').accent)).toBeLessThan(TEXT_CONTRAST);
  });
});

describe.each(SCHEMES)('abstract palette — %s mode', (scheme) => {
  const abstract = getAbstractColors(scheme);
  const { background } = getThemeColors(scheme);

  it.each(activePairs(abstract))('%s: declared ink reads on its active fill', (_name, pair) => {
    expect([BRAND.ink, BRAND.paper]).toContain(pair.activeInk);
    expect(contrastRatio(pair.activeInk, pair.activeColor)).toBeGreaterThanOrEqual(TEXT_CONTRAST);
  });

  it.each(activePairs(abstract))('%s: active fill stands out from the background', (_name, pair) => {
    expect(contrastRatio(pair.activeColor, background)).toBeGreaterThanOrEqual(UI_CONTRAST);
  });
});

describe.each(SCHEMES)('inkOn — %s mode', (scheme) => {
  const colors = getThemeColors(scheme);
  const abstract = getAbstractColors(scheme);
  const grounds = [
    ...Object.values(colors).filter((c) => /^#[0-9a-f]{6}$/i.test(c)),
    ...activePairs(abstract).flatMap(([, p]) => [p.activeColor, p.defaultColor]),
  ];

  it.each(grounds)('returns ink or paper at 4.5:1 over %s', (ground) => {
    const ink = inkOn(ground);
    expect([BRAND.ink, BRAND.paper]).toContain(ink);
    expect(contrastRatio(ink, ground)).toBeGreaterThanOrEqual(TEXT_CONTRAST);
  });
});
