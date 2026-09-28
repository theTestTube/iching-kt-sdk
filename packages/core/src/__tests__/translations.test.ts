import { describe, it, expect } from 'vitest';
import {
  DEFAULT_TRANSLATION_PREFERENCES,
  getTranslationSourceForLanguage,
  getTranslationKey,
} from '../translations';
import type { TranslationPreferences } from '../types';

describe('translation source preferences (#197)', () => {
  it('defaults en and es to legge', () => {
    expect(DEFAULT_TRANSLATION_PREFERENCES).toEqual({ en: 'legge', es: 'legge', zh: 'zhouyi' });
  });

  it('resolves a stale stored "wilhelm" preference to legge', () => {
    const stale = { en: 'wilhelm', es: 'wilhelm', zh: 'zhouyi' } as unknown as TranslationPreferences;
    expect(getTranslationSourceForLanguage('en', stale)).toBe('legge');
    expect(getTranslationSourceForLanguage('es', stale)).toBe('legge');
    expect(getTranslationKey('es', stale)).toBe('es-legge');
  });

  it('keeps valid stored preferences', () => {
    const prefs: TranslationPreferences = { en: 'legge', es: 'zhouyi', zh: 'zhouyi' };
    expect(getTranslationSourceForLanguage('es', prefs)).toBe('zhouyi');
  });

  it('falls back to legge for an unsupported language', () => {
    expect(getTranslationSourceForLanguage('fr')).toBe('legge');
    expect(getTranslationSourceForLanguage('fr', DEFAULT_TRANSLATION_PREFERENCES)).toBe('legge');
  });
});
