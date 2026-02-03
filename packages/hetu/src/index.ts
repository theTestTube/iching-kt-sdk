import { Knowlet } from '@iching-kt/core';
import { HeTuView } from '@iching-kt/square';

export const hetuKnowlet: Knowlet = {
  meta: {
    id: 'hetu',
    name: 'He Tu Diagram',
    names: {
      en: 'He Tu Diagram',
      es: 'Diagrama He Tu',
      zh: '河圖',
    },
    description: 'The River Map showing the five elemental cycles',
    descriptions: {
      en: 'The River Map showing the five elemental cycles',
      es: 'El Mapa del Río que muestra los cinco ciclos elementales',
      zh: '顯示五個元素週期的河圖',
    },
    requiredProviders: ['solar-time'],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['hexagram', 'trigram', 'time'],
    produces: ['hexagram', 'trigram'],
    category: 'board',
  },
  View: HeTuView,
};

export { HeTuView };
