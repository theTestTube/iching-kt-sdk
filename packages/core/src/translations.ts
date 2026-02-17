/**
 * Translation utilities for I-Ching content
 */

import type { TranslationPreferences, EnglishSource, SpanishSource, ChineseSource } from './types';

/**
 * Default translation sources for each language (first-time user experience)
 */
export const DEFAULT_TRANSLATION_PREFERENCES: TranslationPreferences = {
  en: 'wilhelm',
  es: 'wilhelm',
  zh: 'zhouyi',
};

/**
 * Gets the translation source for a given language from user preferences.
 * Falls back to defaults if preferences not set.
 */
export function getTranslationSourceForLanguage(
  language: string,
  preferences?: TranslationPreferences
): string {
  if (!preferences) {
    // Use defaults if no preferences provided
    return DEFAULT_TRANSLATION_PREFERENCES[language as keyof TranslationPreferences] || 'wilhelm';
  }

  switch (language) {
    case 'en':
      return preferences.en || DEFAULT_TRANSLATION_PREFERENCES.en;
    case 'es':
      return preferences.es || DEFAULT_TRANSLATION_PREFERENCES.es;
    case 'zh':
      return preferences.zh || DEFAULT_TRANSLATION_PREFERENCES.zh;
    default:
      return 'wilhelm'; // Fallback for unsupported languages
  }
}

/**
 * Returns true when the UI language is the origin language of I-Ching terminology (Chinese).
 * Used to conditionally hide supplementary Chinese/pinyin reference labels
 * that would be redundant when the user is already reading in Chinese.
 */
export function isOriginLanguage(language: string): boolean {
  return language === 'zh';
}

/**
 * Constructs the translation key for hexagram data lookup.
 * Format: `${language}-${source}` (e.g., 'en-wilhelm', 'es-legge', 'zh-zhouyi')
 */
export function getTranslationKey(
  language: string,
  preferences?: TranslationPreferences
): string {
  const source = getTranslationSourceForLanguage(language, preferences);
  return `${language}-${source}`;
}
