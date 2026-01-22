/**
 * Hexagram data types
 * Translations sourced from:
 * - Wilhelm-Baynes (Public Domain since 2020)
 * - James Legge (Public Domain since 1882)
 */

export type TranslationSource = 'wilhelm' | 'legge';

export interface HexagramTranslation {
  name: string;
  meaning: string;
  judgment: string;
  image: string;
}

export type TrigramId = 'heaven' | 'earth' | 'thunder' | 'water' | 'mountain' | 'wind' | 'fire' | 'lake';

export interface Hexagram {
  number: number;
  chinese: string;
  pinyin: string;
  unicode: string;
  binary: string;
  upperTrigram: TrigramId;
  lowerTrigram: TrigramId;
  /** Translations by language code, with optional source suffix (e.g., 'en', 'en-legge', 'es', 'zh') */
  translations: Record<string, HexagramTranslation>;
}

export interface SovereignHexagramMapping {
  hexagramNumber: number;
  yangLines: number;
  phase: 'waxing' | 'waning';
}

export type HexagramNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
  11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
  21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
  31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
  41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 |
  51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 |
  61 | 62 | 63 | 64;
