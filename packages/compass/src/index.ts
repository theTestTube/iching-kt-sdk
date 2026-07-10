import type { Knowlet } from '@iching-kt/core';
import { CompassView } from './views/CompassView';
import { CompassCardView } from './views/CompassCardView';

export const compassKnowlet: Knowlet = {
  meta: {
    id: 'compass',
    name: 'Compass',
    names: {
      en: 'Compass',
      es: 'Brújula',
      zh: '羅盤',
    },
    icon: '🧭',
    description: 'Live NSEW compass board powered by device magnetometer',
    descriptions: {
      en: 'Live NSEW compass board powered by device magnetometer',
      es: 'Tablero de brújula NSOE impulsado por el magnetómetro del dispositivo',
      zh: '由設備磁力計驅動的實時羅盤面板',
    },
    requiredProviders: ['rotation'],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['gps', 'rotation'],
    produces: ['trigram'],
    category: 'board',
  },
  View: CompassView,
  CardView: CompassCardView,
};

export { CompassView, CompassCardView };
export type { CompassLocationState, CompassLocationInput } from './views/CompassCardView';
export { COMPASS_DIRECTIONS, getDirectionForHeading } from './directions';
export type { DirectionInfo } from './directions';
