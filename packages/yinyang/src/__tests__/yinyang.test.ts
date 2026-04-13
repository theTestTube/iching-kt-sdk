/**
 * @iching-kt/yinyang — Unit Tests
 *
 * Verifies:
 * 1. Content completeness: both polarities have required fields in all 3 languages
 * 2. Element mapping: yin→water, yang→fire
 * 3. Translation fallback to English
 *
 * Framework: Jest
 * Run: npm test -- --testPathPattern=yinyang
 */

import { getTranslation, YIN_YANG_ORDER } from '../data';
import type { YinYangId } from '../data';

const LANGUAGES = ['en', 'es', 'zh'] as const;

const EXPECTED_ELEMENTS: Record<YinYangId, 'water' | 'fire'> = {
  yin: 'water',
  yang: 'fire',
};

describe('YIN_YANG_ORDER', () => {
  it('contains exactly 2 polarities', () => {
    expect(YIN_YANG_ORDER).toHaveLength(2);
  });

  it('contains yin and yang', () => {
    expect(YIN_YANG_ORDER).toContain('yin');
    expect(YIN_YANG_ORDER).toContain('yang');
  });
});

describe('Content completeness', () => {
  for (const lang of LANGUAGES) {
    describe(`language: ${lang}`, () => {
      const t = getTranslation(lang);

      it('has both polarities', () => {
        expect(Object.keys(t.polarities)).toHaveLength(2);
        for (const id of YIN_YANG_ORDER) {
          expect(t.polarities[id]).toBeDefined();
        }
      });

      it('has required label keys', () => {
        expect(typeof t.labels.qualities).toBe('string');
        expect(t.labels.qualities.length).toBeGreaterThan(0);
        expect(typeof t.labels.element).toBe('string');
        expect(t.labels.element.length).toBeGreaterThan(0);
      });

      for (const id of YIN_YANG_ORDER) {
        describe(`polarity: ${id}`, () => {
          it('has required string fields', () => {
            const p = getTranslation(lang).polarities[id];
            expect(typeof p.chinese).toBe('string');
            expect(p.chinese.length).toBeGreaterThan(0);
            expect(typeof p.pinyin).toBe('string');
            expect(p.pinyin.length).toBeGreaterThan(0);
            expect(typeof p.description).toBe('string');
            expect(p.description.length).toBeGreaterThan(10);
            expect(typeof p.elementLabel).toBe('string');
            expect(p.elementLabel.length).toBeGreaterThan(0);
          });

          it('chinese character is a single CJK character', () => {
            const p = getTranslation(lang).polarities[id];
            expect(p.chinese).toMatch(/^[\u4e00-\u9fff]$/);
          });

          it('has non-empty qualities array with at least 5 entries', () => {
            const p = getTranslation(lang).polarities[id];
            expect(Array.isArray(p.qualities)).toBe(true);
            expect(p.qualities.length).toBeGreaterThanOrEqual(5);
            for (const q of p.qualities) {
              expect(typeof q).toBe('string');
              expect(q.length).toBeGreaterThan(0);
            }
          });
        });
      }
    });
  }
});

describe('Element mapping', () => {
  const t = getTranslation('en');

  it('yin maps to water', () => {
    expect(t.polarities.yin.elementId).toBe(EXPECTED_ELEMENTS.yin);
  });

  it('yang maps to fire', () => {
    expect(t.polarities.yang.elementId).toBe(EXPECTED_ELEMENTS.yang);
  });

  it('yin and yang map to different elements', () => {
    expect(t.polarities.yin.elementId).not.toBe(t.polarities.yang.elementId);
  });
});

describe('Chinese character accuracy', () => {
  it('yin is 陰 across all languages', () => {
    for (const lang of LANGUAGES) {
      expect(getTranslation(lang).polarities.yin.chinese).toBe('陰');
    }
  });

  it('yang is 陽 across all languages', () => {
    for (const lang of LANGUAGES) {
      expect(getTranslation(lang).polarities.yang.chinese).toBe('陽');
    }
  });
});

describe('getTranslation fallback', () => {
  it('falls back to English for unknown language', () => {
    const t = getTranslation('fr');
    expect(t.polarities.yin.elementLabel).toBe('Water');
    expect(t.polarities.yang.elementLabel).toBe('Fire');
  });
});
