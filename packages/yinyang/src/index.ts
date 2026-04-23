import { Knowlet } from '@iching-kt/core';
import { YinYangView } from './YinYangView';
import { YinYangCardView } from './YinYangCardView';

export const yinYangKnowlet: Knowlet = {
  meta: {
    id: 'yinyang',
    name: 'Yin/Yang',
    names: {
      en: 'Yin/Yang',
      es: 'Yin/Yang',
      zh: '陰陽',
    },
    icon: '☯',
    description: 'Yin and yang — the two fundamental polarities of existence',
    descriptions: {
      en: 'Yin and yang — the two fundamental polarities of existence',
      es: 'Yin y yang — las dos polaridades fundamentales de la existencia',
      zh: '陰陽——存在的兩種基本極性',
    },
    cardDescription: {
      en: 'Polarity details',
      es: 'Detalles de polaridad',
      zh: '極性詳解',
    },
    requiredProviders: [],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['yinyang'],
    produces: ['element'],
    category: 'data',
  },
  View: YinYangView,
  CardView: YinYangCardView,
};

export { YinYangView, YinYangCardView };
export type { YinYangId, PolarityInfo, PolarityTranslations } from './data';
export { getTranslation, YIN_YANG_ORDER } from './data';
