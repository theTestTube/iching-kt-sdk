/**
 * Translation utilities for I-Ching content
 */

import type { TranslationPreferences, EnglishSource, SpanishSource, ChineseSource } from './types';

/**
 * Default translation sources for each language (first-time user experience)
 */
export const DEFAULT_TRANSLATION_PREFERENCES: TranslationPreferences = {
  en: 'legge',
  es: 'legge',
  zh: 'zhouyi',
};

/** Sources with shipped data, per language */
const AVAILABLE_SOURCES: Record<keyof TranslationPreferences, readonly string[]> = {
  en: ['legge'] satisfies EnglishSource[],
  es: ['legge', 'zhouyi'] satisfies SpanishSource[],
  zh: ['zhouyi'] satisfies ChineseSource[],
};

/**
 * Gets the translation source for a given language from user preferences.
 * Falls back to defaults if preferences are not set, or hold a source with no
 * shipped data (e.g. 'wilhelm', stored before #197 removed it).
 */
export function getTranslationSourceForLanguage(
  language: string,
  preferences?: TranslationPreferences
): string {
  if (!(language in AVAILABLE_SOURCES)) return 'legge'; // Fallback for unsupported languages
  const lang = language as keyof TranslationPreferences;
  const stored: string | undefined = preferences?.[lang];
  return stored && AVAILABLE_SOURCES[lang].includes(stored) ? stored : DEFAULT_TRANSLATION_PREFERENCES[lang];
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
 * Format: `${language}-${source}` (e.g., 'en-legge', 'es-zhouyi', 'zh-zhouyi')
 */
export function getTranslationKey(
  language: string,
  preferences?: TranslationPreferences
): string {
  const source = getTranslationSourceForLanguage(language, preferences);
  return `${language}-${source}`;
}
