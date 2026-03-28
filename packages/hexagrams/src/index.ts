import { Knowlet } from '@iching-kt/core';
import { HexagramView } from './HexagramView';
import { HexagramCardView } from './HexagramCardView';
import { TrigramView } from './TrigramView';
import { TrigramCardView } from './TrigramCardView';

/**
 * Hexagrams Knowlet
 *
 * Translation source is controlled globally via Translation Sources in General Settings.
 * - Chinese (zh): Original 周易 text (untranslated)
 * - English (en): Wilhelm-Baynes or Legge (untranslated, direct from source)
 * - Spanish (es): Claude translations at build time from Chinese/Legge/Wilhelm
 */
export const hexagramsKnowlet: Knowlet = {
  meta: {
    id: 'hexagrams',
    name: 'Hexagram Details',
    names: {
      en: 'Hexagram Details',
      es: 'Detalles del Hexagrama',
      zh: '卦象詳情',
    },
    icon: '☰',
    description: 'View detailed information about a hexagram',
    descriptions: {
      en: 'View detailed information about a hexagram',
      es: 'Ver información detallada sobre un hexagrama',
      zh: '查看卦象的詳細信息',
    },
    requiredProviders: [],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['hexagram'],
    produces: ['trigram'],
    cardDescription: {
      en: 'Hexagram details',
      es: 'Detalles del hexagrama',
      zh: '卦象詳情',
    },
    category: 'board',
  },
  // No settingsSchema - source selection is in General Settings > Translation Sources
  View: HexagramView,
  CardView: HexagramCardView,
};

export const trigramsKnowlet: Knowlet = {
  meta: {
    id: 'trigrams',
    name: 'Trigram Details',
    names: {
      en: 'Trigram Details',
      es: 'Detalles del Trigrama',
      zh: '三畫卦詳情',
    },
    icon: '☳',
    description: 'View detailed information about a trigram',
    descriptions: {
      en: 'View detailed information about a trigram',
      es: 'Ver información detallada sobre un trigrama',
      zh: '查看三畫卦的詳細信息',
    },
    requiredProviders: [],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['trigram'],
    produces: [],
    category: 'board',
  },
  View: TrigramView,
  CardView: TrigramCardView,
};

export { HexagramView, HexagramCardView, TrigramView, TrigramCardView };
