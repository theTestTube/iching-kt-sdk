/**
 * @iching-kt/elements — Unit Tests
 *
 * Verifies:
 * 1. Content completeness: all 5 elements have required fields in all 3 languages
 * 2. Cycle integrity: generates/overcomes/overcomeBy form valid closed cycles
 * 3. Trigram assignments match issue specification
 *
 * Framework: Jest
 * Run: npm test -- --testPathPattern=elements
 */

import { getTranslation, WU_XING_ORDER } from '../data';
import type { WuXingId } from '../data';

const LANGUAGES = ['en', 'es', 'zh'] as const;

// Expected generates cycle: wood→fire→earth→metal→water→wood
const EXPECTED_GENERATES: Record<WuXingId, WuXingId> = {
  wood:  'fire',
  fire:  'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

// Expected overcomes cycle: wood→earth, earth→water, water→fire, fire→metal, metal→wood
const EXPECTED_OVERCOMES: Record<WuXingId, WuXingId> = {
  wood:  'earth',
  fire:  'metal',
  earth: 'water',
  metal: 'wood',
  water: 'fire',
};

// Expected overcomeBy (inverse of overcomes)
const EXPECTED_OVERCOME_BY: Record<WuXingId, WuXingId> = {
  wood:  'metal',
  fire:  'water',
  earth: 'wood',
  metal: 'fire',
  water: 'earth',
};

// Expected primary trigrams from issue spec
const EXPECTED_TRIGRAMS: Record<WuXingId, string> = {
  wood:  'thunder',
  fire:  'fire',
  earth: 'earth',
  metal: 'heaven',
  water: 'water',
};

describe('WU_XING_ORDER', () => {
  it('contains exactly 5 elements', () => {
    expect(WU_XING_ORDER).toHaveLength(5);
  });

  it('contains all 5 element ids', () => {
    const ids = new Set(WU_XING_ORDER);
    expect(ids.has('wood')).toBe(true);
    expect(ids.has('fire')).toBe(true);
    expect(ids.has('earth')).toBe(true);
    expect(ids.has('metal')).toBe(true);
    expect(ids.has('water')).toBe(true);
  });
});

describe('Content completeness', () => {
  for (const lang of LANGUAGES) {
    describe(`language: ${lang}`, () => {
      const t = getTranslation(lang);

      it('has all 5 elements', () => {
        expect(Object.keys(t.elements)).toHaveLength(5);
        for (const id of WU_XING_ORDER) {
          expect(t.elements[id]).toBeDefined();
        }
      });

      for (const id of WU_XING_ORDER) {
        describe(`element: ${id}`, () => {
          it('has required string fields', () => {
            const el = getTranslation(lang).elements[id];
            expect(typeof el.chinese).toBe('string');
            expect(el.chinese.length).toBeGreaterThan(0);
            expect(typeof el.pinyin).toBe('string');
            expect(el.pinyin.length).toBeGreaterThan(0);
            expect(typeof el.direction).toBe('string');
            expect(el.direction.length).toBeGreaterThan(0);
            expect(typeof el.season).toBe('string');
            expect(el.season.length).toBeGreaterThan(0);
            expect(typeof el.organ).toBe('string');
            expect(el.organ.length).toBeGreaterThan(0);
            expect(typeof el.emotion).toBe('string');
            expect(el.emotion.length).toBeGreaterThan(0);
            expect(typeof el.taste).toBe('string');
            expect(el.taste.length).toBeGreaterThan(0);
            expect(typeof el.description).toBe('string');
            expect(el.description.length).toBeGreaterThan(10);
          });

          it('chinese character is a single CJK character', () => {
            const el = getTranslation(lang).elements[id];
            expect(el.chinese).toMatch(/^[\u4e00-\u9fff]$/);
          });
        });
      }

      it('has all required label keys', () => {
        const required = [
          'direction', 'season', 'organ', 'emotion', 'taste',
          'generates', 'overcomes', 'overcomeBy', 'trigram',
          'generatingCycle', 'overcomingCycle',
        ];
        for (const key of required) {
          expect(t.labels[key as keyof typeof t.labels]).toBeDefined();
          expect(typeof t.labels[key as keyof typeof t.labels]).toBe('string');
        }
      });
    });
  }
});

describe('Generating cycle (生) integrity', () => {
  const t = getTranslation('en');

  it('forms a closed cycle: each element generates the next', () => {
    for (const id of WU_XING_ORDER) {
      expect(t.elements[id].generates).toBe(EXPECTED_GENERATES[id]);
    }
  });

  it('cycle visits all 5 elements exactly once', () => {
    const visited = new Set<WuXingId>();
    let current: WuXingId = 'wood';
    for (let i = 0; i < 5; i++) {
      expect(visited.has(current)).toBe(false);
      visited.add(current);
      current = t.elements[current].generates as WuXingId;
    }
    expect(current).toBe('wood'); // must close back to start
    expect(visited.size).toBe(5);
  });
});

describe('Overcoming cycle (克) integrity', () => {
  const t = getTranslation('en');

  it('each element overcomes the expected target', () => {
    for (const id of WU_XING_ORDER) {
      expect(t.elements[id].overcomes).toBe(EXPECTED_OVERCOMES[id]);
    }
  });

  it('overcomeBy is inverse of overcomes', () => {
    for (const id of WU_XING_ORDER) {
      expect(t.elements[id].overcomeBy).toBe(EXPECTED_OVERCOME_BY[id]);
    }
  });

  it('if A overcomes B, then B.overcomeBy === A', () => {
    for (const id of WU_XING_ORDER) {
      const target = t.elements[id].overcomes as WuXingId;
      expect(t.elements[target].overcomeBy).toBe(id);
    }
  });

  it('cycle visits all 5 elements (star pattern)', () => {
    const visited = new Set<WuXingId>();
    let current: WuXingId = 'wood';
    for (let i = 0; i < 5; i++) {
      expect(visited.has(current)).toBe(false);
      visited.add(current);
      current = t.elements[current].overcomes as WuXingId;
    }
    expect(current).toBe('wood');
    expect(visited.size).toBe(5);
  });
});

describe('Trigram assignments', () => {
  const t = getTranslation('en');

  for (const id of WU_XING_ORDER) {
    it(`${id} → ${EXPECTED_TRIGRAMS[id]}`, () => {
      expect(t.elements[id].primaryTrigram).toBe(EXPECTED_TRIGRAMS[id]);
    });
  }
});

describe('getTranslation fallback', () => {
  it('falls back to English for unknown language', () => {
    const t = getTranslation('fr');
    expect(t.elements.wood.direction).toBe('East');
  });
});
