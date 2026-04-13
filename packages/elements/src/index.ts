import { Knowlet } from '@iching-kt/core';
import { ElementsView } from './ElementsView';
import { ElementsCardView } from './ElementsCardView';

export const elementsKnowlet: Knowlet = {
  meta: {
    id: 'elements',
    name: 'Five Elements',
    names: {
      en: 'Five Elements',
      es: 'Cinco Elementos',
      zh: '五行',
    },
    icon: '☯',
    description: 'Wu Xing — the five elemental phases and their correspondences',
    descriptions: {
      en: 'Wu Xing — the five elemental phases and their correspondences',
      es: 'Wu Xing — las cinco fases elementales y sus correspondencias',
      zh: '五行——五種元素相位及其對應關係',
    },
    cardDescription: {
      en: 'Elemental phase details',
      es: 'Detalles de la fase elemental',
      zh: '五行相位詳解',
    },
    requiredProviders: [],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['element'],
    produces: ['trigram', 'yinyang'],
    category: 'data',
  },
  View: ElementsView,
  CardView: ElementsCardView,
};

export { ElementsView, ElementsCardView };
export type { WuXingId, ElementInfo, ElementTranslations } from './data';
export { getTranslation, getElementName, WU_XING_ORDER } from './data';
