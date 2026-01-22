import { Knowlet, KnowletSettings, KnowletSettingsSchema } from '@iching-kt/core';
import { HexagramView } from './HexagramView';
import { HexagramSettingsView } from './HexagramSettingsView';

const settingsSchema: KnowletSettingsSchema = {
  translationSource: {
    type: 'select',
    label: 'Translation Source',
    default: 'wilhelm',
    options: [
      { label: 'Wilhelm-Baynes (1950)', value: 'wilhelm' },
      { label: 'James Legge (1882)', value: 'legge' },
    ],
  },
};

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
    category: 'data',
  },
  settingsSchema,
  View: HexagramView,
  SettingsView: HexagramSettingsView,
};

export { HexagramView, HexagramSettingsView };
