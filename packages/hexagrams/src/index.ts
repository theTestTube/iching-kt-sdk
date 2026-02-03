import { Knowlet } from '@iching-kt/core';
import { HexagramView } from './HexagramView';

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
    category: 'board',
  },
  // No settingsSchema - source selection is in General Settings > Translation Sources
  View: HexagramView,
};

export { HexagramView };
