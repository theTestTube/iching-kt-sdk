/**
 * HexagramCard Component Tests
 *
 * Tests the translation logic that HexagramCard uses to ensure:
 * 1. Hexagram names are correctly translated using user's translation source preference
 * 2. Component respects language settings
 * 3. Component properly handles different translation sources (wilhelm, legge, zhouyi)
 *
 * Framework: Jest
 * Run: npm test -- --testPathPattern=HexagramCard
 */

import { getHexagram, getHexagramTranslationBySource } from '@iching-kt/data-hexagrams';
import { getTranslationSourceForLanguage } from '@iching-kt/core';
import type { TranslationPreferences } from '@iching-kt/core';

describe('HexagramCard - Translation Source Behavior', () => {
  describe('Hexagram Translation Source Preference', () => {
    it('should select wilhelm translation for English (default)', () => {
      const prefs: TranslationPreferences = { en: 'wilhelm', es: 'wilhelm', zh: 'zhouyi' };
      const source = getTranslationSourceForLanguage('en', prefs);
      const translation = getHexagramTranslationBySource(23, 'en', source as any);

      expect(source).toBe('wilhelm');
      expect(translation?.name).toBe('Splitting Apart');
    });

    it('should select legge translation for English when preferred', () => {
      const prefs: TranslationPreferences = { en: 'legge', es: 'wilhelm', zh: 'zhouyi' };
      const source = getTranslationSourceForLanguage('en', prefs);
      const translation = getHexagramTranslationBySource(23, 'en', source as any);

      expect(source).toBe('legge');
      // Legge translation for hexagram 23
      expect(translation?.name).toBe('Decay');
    });

    it('should select wilhelm translation for Spanish (default)', () => {
      const prefs: TranslationPreferences = { en: 'wilhelm', es: 'wilhelm', zh: 'zhouyi' };
      const source = getTranslationSourceForLanguage('es', prefs);
      const translation = getHexagramTranslationBySource(23, 'es', source as any);

      expect(source).toBe('wilhelm');
      expect(translation?.name).toBe('La Desintegración');
    });

    it('should select legge translation for Spanish when preferred', () => {
      const prefs: TranslationPreferences = { en: 'wilhelm', es: 'legge', zh: 'zhouyi' };
      const source = getTranslationSourceForLanguage('es', prefs);
      const translation = getHexagramTranslationBySource(23, 'es', source as any);

      expect(source).toBe('legge');
      // Legge Spanish translation exists
      expect(translation?.name).toBeTruthy();
    });

    it('should select zhouyi translation for Spanish when preferred', () => {
      const prefs: TranslationPreferences = { en: 'wilhelm', es: 'zhouyi', zh: 'zhouyi' };
      const source = getTranslationSourceForLanguage('es', prefs);
      const translation = getHexagramTranslationBySource(23, 'es', source as any);

      expect(source).toBe('zhouyi');
      expect(translation?.name).toBeTruthy();
    });

    it('should use zhouyi translation for Chinese language', () => {
      const prefs: TranslationPreferences = { en: 'wilhelm', es: 'wilhelm', zh: 'zhouyi' };
      const source = getTranslationSourceForLanguage('zh', prefs);
      const translation = getHexagramTranslationBySource(23, 'zh', source as any);

      expect(source).toBe('zhouyi');
      expect(translation?.name).toBeTruthy();
    });
  });

  describe('Hexagram Data Availability', () => {
    it('should have valid hexagram data for #23', () => {
      const hexagram = getHexagram(23);

      expect(hexagram).toBeTruthy();
      expect(hexagram?.number).toBe(23);
      expect(hexagram?.unicode).toBe('䷖');
      expect(hexagram?.chinese).toBeTruthy();
      expect(hexagram?.pinyin).toBeTruthy();
    });

    it('should handle hexagram #1 correctly', () => {
      const hexagram = getHexagram(1);
      const translation = getHexagramTranslationBySource(1, 'en', 'wilhelm');

      expect(hexagram).toBeTruthy();
      expect(hexagram?.number).toBe(1);
      expect(translation?.name).toBe('The Creative');
    });

    it('should handle hexagram #64 correctly', () => {
      const hexagram = getHexagram(64);
      const translation = getHexagramTranslationBySource(64, 'en', 'wilhelm');

      expect(hexagram).toBeTruthy();
      expect(hexagram?.number).toBe(64);
      expect(translation?.name).toBe('Before Completion');
    });

    it('should return undefined for invalid hexagram numbers', () => {
      const hexagram = getHexagram(999);
      const translation = getHexagramTranslationBySource(999, 'en', 'wilhelm');

      expect(hexagram).toBeUndefined();
      expect(translation).toBeUndefined();
    });
  });

  describe('Multi-Language Support', () => {
    const testHexagrams = [
      { number: 1, en: 'The Creative', es: 'Lo Creativo' },
      { number: 23, en: 'Splitting Apart', es: 'La Desintegración' },
      { number: 64, en: 'Before Completion', es: 'Antes de la Completación' },
    ];

    testHexagrams.forEach(({ number, en, es }) => {
      it(`should translate hexagram #${number} correctly in English`, () => {
        const translation = getHexagramTranslationBySource(number, 'en', 'wilhelm');
        expect(translation?.name).toBe(en);
      });

      it(`should translate hexagram #${number} correctly in Spanish`, () => {
        const translation = getHexagramTranslationBySource(number, 'es', 'wilhelm');
        expect(translation?.name).toBe(es);
      });
    });
  });

  describe('Translation Source Priority', () => {
    it('should respect user preference over defaults', () => {
      const userPreferences: TranslationPreferences = { en: 'legge', es: 'zhouyi', zh: 'zhouyi' };

      const sourceEn = getTranslationSourceForLanguage('en', userPreferences);
      const sourceEs = getTranslationSourceForLanguage('es', userPreferences);
      const sourceZh = getTranslationSourceForLanguage('zh', userPreferences);

      expect(sourceEn).toBe('legge');
      expect(sourceEs).toBe('zhouyi');
      expect(sourceZh).toBe('zhouyi');
    });

    it('should use default when preference not specified', () => {
      const defaultPrefs: TranslationPreferences = { en: 'wilhelm', es: 'wilhelm', zh: 'zhouyi' };

      const sourceEn = getTranslationSourceForLanguage('en', defaultPrefs);
      const sourceEs = getTranslationSourceForLanguage('es', defaultPrefs);
      const sourceZh = getTranslationSourceForLanguage('zh', defaultPrefs);

      expect(sourceEn).toBe('wilhelm');
      expect(sourceEs).toBe('wilhelm');
      expect(sourceZh).toBe('zhouyi');
    });
  });

  describe('All Hexagrams Coverage', () => {
    it('should have translations for all 64 hexagrams in English', () => {
      for (let i = 1; i <= 64; i++) {
        const hexagram = getHexagram(i);
        const translation = getHexagramTranslationBySource(i, 'en', 'wilhelm');

        expect(hexagram).toBeTruthy();
        expect(translation).toBeTruthy();
        expect(translation?.name).toBeTruthy();
      }
    });

    it('should have translations for all 64 hexagrams in Spanish', () => {
      for (let i = 1; i <= 64; i++) {
        const translation = getHexagramTranslationBySource(i, 'es', 'wilhelm');
        expect(translation).toBeTruthy();
      }
    });

    it('should have translations for all 64 hexagrams in Chinese', () => {
      for (let i = 1; i <= 64; i++) {
        const translation = getHexagramTranslationBySource(i, 'zh', 'zhouyi');
        expect(translation).toBeTruthy();
      }
    });
  });

  describe('HexagramCard Component Logic', () => {
    it('should correctly determine translation for Spanish legge user viewing #23', () => {
      // Simulating HexagramCard logic
      const context = {
        language: 'es',
        translationPreferences: { en: 'wilhelm', es: 'legge', zh: 'zhouyi' } as TranslationPreferences,
      };

      const source = getTranslationSourceForLanguage(context.language, context.translationPreferences);
      const translation = getHexagramTranslationBySource(23, context.language, source as any);

      // User should see "Po" (Legge) instead of "La Desintegración" (Wilhelm)
      expect(source).toBe('legge');
      expect(translation?.name).not.toBe('La Desintegración');
    });

    it('should respect language changes', () => {
      const prefs: TranslationPreferences = { en: 'wilhelm', es: 'wilhelm', zh: 'zhouyi' };

      // English view
      const enSource = getTranslationSourceForLanguage('en', prefs);
      const enTranslation = getHexagramTranslationBySource(23, 'en', enSource as any);

      // Spanish view
      const esSource = getTranslationSourceForLanguage('es', prefs);
      const esTranslation = getHexagramTranslationBySource(23, 'es', esSource as any);

      // Chinese view
      const zhSource = getTranslationSourceForLanguage('zh', prefs);
      const zhTranslation = getHexagramTranslationBySource(23, 'zh', zhSource as any);

      expect(enTranslation?.name).toBe('Splitting Apart');
      expect(esTranslation?.name).toBe('La Desintegración');
      expect(zhTranslation?.name).toBeTruthy();
    });
  });
});
