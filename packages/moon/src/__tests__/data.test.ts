/**
 * Moon Knowlet Data Model Tests
 *
 * Verifies the Cantong qi 8-phase data model:
 * 1. All 8 phases have complete data in all 3 languages
 * 2. Phase-hexagram mappings match doctrinal specification
 * 3. Transitional phases (4 and 8) have null trigram/element
 * 4. Non-transitional phases have valid trigram symbols and elements
 *
 * Framework: Jest
 * Run: npm test -- --testPathPattern=data
 */

import { translations, getTranslation } from '../data';
import { PHASE_ORDER } from '@iching-kt/provider-moon-phase';

/** Expected hexagram numbers per Cantong qi + Sovereign Hexagram mapping */
const EXPECTED_HEXAGRAMS: Record<string, number> = {
  new_moon: 2,          // Kun / Receptive
  waxing_crescent: 24,  // Fu / Return
  first_quarter: 19,    // Lin / Approach
  waxing_gibbous: 11,   // Tai / Peace
  full_moon: 1,         // Qian / Creative
  waning_gibbous: 44,   // Gou / Coming to Meet
  last_quarter: 33,     // Dun / Retreat
  waning_crescent: 23,  // Bo / Splitting Apart
};

/** Trigram symbols from Cantong qi */
const EXPECTED_TRIGRAMS: Record<string, string | null> = {
  new_moon: '☷',         // Kun
  waxing_crescent: '☳',  // Zhen
  first_quarter: '☱',    // Dui
  waxing_gibbous: null,  // transitional
  full_moon: '☰',        // Qian
  waning_gibbous: '☴',   // Xun
  last_quarter: '☶',     // Gen
  waning_crescent: null,  // transitional
};

const SUPPORTED_LANGUAGES = ['en', 'es', 'zh'];

describe('Moon Knowlet Data Model', () => {
  describe('Phase completeness', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      it(`should have all 8 phases in ${lang}`, () => {
        const t = getTranslation(lang);
        expect(Object.keys(t.phases)).toHaveLength(8);

        PHASE_ORDER.forEach((phaseId) => {
          expect(t.phases[phaseId]).toBeDefined();
        });
      });

      it(`should have all labels in ${lang}`, () => {
        const t = getTranslation(lang);
        expect(t.labels.currentPhase).toBeTruthy();
        expect(t.labels.lunarDay).toBeTruthy();
        expect(t.labels.element).toBeTruthy();
        expect(t.labels.trigram).toBeTruthy();
        expect(t.labels.symbolicMeaning).toBeTruthy();
        expect(t.labels.sovereignHexagram).toBeTruthy();
        expect(t.labels.previousPhase).toBeTruthy();
        expect(t.labels.nextPhase).toBeTruthy();
      });
    });
  });

  describe('Phase-hexagram mapping', () => {
    PHASE_ORDER.forEach((phaseId) => {
      it(`should map ${phaseId} to hexagram #${EXPECTED_HEXAGRAMS[phaseId]}`, () => {
        const enPhase = translations.en.phases[phaseId];
        expect(enPhase.hexagramNumber).toBe(EXPECTED_HEXAGRAMS[phaseId]);
      });
    });

    it('should have consistent hexagram numbers across all languages', () => {
      PHASE_ORDER.forEach((phaseId) => {
        const enHex = translations.en.phases[phaseId].hexagramNumber;
        const esHex = translations.es.phases[phaseId].hexagramNumber;
        const zhHex = translations.zh.phases[phaseId].hexagramNumber;
        expect(esHex).toBe(enHex);
        expect(zhHex).toBe(enHex);
      });
    });
  });

  describe('Trigram assignments (Cantong qi)', () => {
    PHASE_ORDER.forEach((phaseId) => {
      it(`should have correct trigram for ${phaseId}`, () => {
        const phase = translations.en.phases[phaseId];
        expect(phase.trigramSymbol).toBe(EXPECTED_TRIGRAMS[phaseId]);
      });
    });

    it('transitional phases (waxing_gibbous, waning_crescent) should have null trigram and element', () => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        const t = getTranslation(lang);
        expect(t.phases.waxing_gibbous.trigramSymbol).toBeNull();
        expect(t.phases.waxing_gibbous.trigramName).toBeNull();
        expect(t.phases.waxing_gibbous.element).toBeNull();
        expect(t.phases.waning_crescent.trigramSymbol).toBeNull();
        expect(t.phases.waning_crescent.trigramName).toBeNull();
        expect(t.phases.waning_crescent.element).toBeNull();
      });
    });

    it('non-transitional phases should have trigram symbols and elements', () => {
      const nonTransitional: string[] = [
        'new_moon', 'waxing_crescent', 'first_quarter',
        'full_moon', 'waning_gibbous', 'last_quarter',
      ];
      nonTransitional.forEach((phaseId) => {
        const phase = translations.en.phases[phaseId as keyof typeof translations.en.phases];
        expect(phase.trigramSymbol).toBeTruthy();
        expect(phase.trigramName).toBeTruthy();
        expect(phase.element).toBeTruthy();
      });
    });
  });

  describe('Yin/Yang quality', () => {
    it('waxing phases should be yang', () => {
      const waxing = ['waxing_crescent', 'first_quarter', 'waxing_gibbous', 'full_moon'] as const;
      waxing.forEach((phaseId) => {
        expect(translations.en.phases[phaseId].yinYang).toBe('yang');
      });
    });

    it('waning phases should be yin', () => {
      const waning = ['waning_gibbous', 'last_quarter', 'waning_crescent'] as const;
      waning.forEach((phaseId) => {
        expect(translations.en.phases[phaseId].yinYang).toBe('yin');
      });
    });

    it('new moon should be yin (pure yin)', () => {
      expect(translations.en.phases.new_moon.yinYang).toBe('yin');
    });
  });

  describe('getTranslation fallback', () => {
    it('should return English for unsupported language', () => {
      const t = getTranslation('fr');
      expect(t).toBe(translations.en);
    });

    it('should return requested language when available', () => {
      expect(getTranslation('en')).toBe(translations.en);
      expect(getTranslation('es')).toBe(translations.es);
      expect(getTranslation('zh')).toBe(translations.zh);
    });
  });

  describe('Data field completeness', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      PHASE_ORDER.forEach((phaseId) => {
        it(`${lang}/${phaseId} should have all required fields`, () => {
          const phase = translations[lang].phases[phaseId];
          expect(phase.chinese).toBeTruthy();
          expect(phase.pinyin).toBeTruthy();
          expect(phase.phaseName).toBeTruthy();
          expect(phase.hexagramNumber).toBeGreaterThanOrEqual(1);
          expect(phase.hexagramNumber).toBeLessThanOrEqual(64);
          expect(phase.yinYangLabel).toBeTruthy();
          expect(['yin', 'yang']).toContain(phase.yinYang);
          expect(phase.lunarDayRange).toBeTruthy();
          expect(phase.description).toBeTruthy();
          expect(phase.symbolicMeaning).toBeTruthy();
        });
      });
    });
  });
});
