import { describe, it, expect } from 'vitest';
import {
  hexagrams,
  getDefaultSourceForLanguage,
  getHexagramTranslation,
  getHexagramTranslationBySource,
  getTrigram,
  getTrigramTranslation,
} from '../index';
import type { TranslationSource } from '../types';

// Rights remediation (#197): the Wilhelm-Baynes English (1950, in copyright) and
// the Spanish derived from it are not shipped. Wilhelm keys return once they are
// re-derived from the 1924 German original (#277).
describe('shipped hexagram data carries no Baynes-derived text (#197)', () => {
  const all = Object.values(hexagrams);

  it('ships all 64 hexagrams', () => {
    expect(all).toHaveLength(64);
  });

  it.each(['en', 'en-wilhelm', 'es-wilhelm'])('has no %s key', (key) => {
    expect(all.filter((h) => key in h.translations).map((h) => h.number)).toEqual([]);
  });

  it.each(['en-legge', 'es-legge', 'es-zhouyi', 'zh-zhouyi'])('keeps %s for every hexagram', (key) => {
    expect(all.filter((h) => !(key in h.translations)).map((h) => h.number)).toEqual([]);
  });

  it.each([
    'Hidden dragon. Do not act.',
    'makes himself strong and untiring',
  ])('contains no Baynes marker "%s"', (marker) => {
    expect(JSON.stringify(hexagrams)).not.toContain(marker);
  });
});

describe('source resolution defaults to Legge (#197)', () => {
  it('defaults en and es to legge, zh to zhouyi', () => {
    expect(getDefaultSourceForLanguage('en')).toBe('legge');
    expect(getDefaultSourceForLanguage('es')).toBe('legge');
    expect(getDefaultSourceForLanguage('zh')).toBe('zhouyi');
  });

  it('falls back to legge for an unknown language', () => {
    expect(getDefaultSourceForLanguage('fr')).toBe('legge');
  });

  it('resolves a stale stored "wilhelm" source to the language default', () => {
    const stale = 'wilhelm' as unknown as TranslationSource;
    expect(getHexagramTranslationBySource(1, 'en', stale)).toBe(hexagrams[1].translations['en-legge']);
    expect(getHexagramTranslationBySource(1, 'es', stale)).toBe(hexagrams[1].translations['es-legge']);
  });

  it('getHexagramTranslation resolves a bare language through its default source', () => {
    expect(getHexagramTranslation(1, 'en')).toBe(hexagrams[1].translations['en-legge']);
    expect(getHexagramTranslation(1, 'es')).toBe(hexagrams[1].translations['es-legge']);
    expect(getHexagramTranslation(1, 'zh')).toBe(hexagrams[1].translations['zh-zhouyi']);
    expect(getHexagramTranslation(1, 'fr')).toBe(hexagrams[1].translations['en-legge']);
  });
});

describe('trigram epithets avoid distinctive third-party renderings (#197)', () => {
  it.each([
    ['thunder', 'es', 'Trueno / Lo Incitante'],
    ['mountain', 'es', 'Montaña / La Quietud'],
    ['lake', 'es', 'Lago / Lo Alegre'],
    ['thunder', 'en', 'Thunder / Inciting'],
    ['lake', 'en', 'Lake / Cheerful'],
  ] as const)('%s (%s) is "%s"', (id, lang, name) => {
    expect(getTrigramTranslation(id, lang)?.name).toBe(name);
  });
});

describe('structural conventions documented in CONTEXT.md', () => {
  it('hexagram binary reads top→bottom: the reverse of lower+upper trigram binaries (bottom→top)', () => {
    const mismatches = Object.values(hexagrams)
      .filter((h) => {
        const lower = getTrigram(h.lowerTrigram)!.binary;
        const upper = getTrigram(h.upperTrigram)!.binary;
        return h.binary !== [...(lower + upper)].reverse().join('');
      })
      .map((h) => h.number);
    expect(mismatches).toEqual([]);
  });
});
