import { Knowlet } from '@iching-kt/core';
import { HoursView } from './HoursView';

export const hoursKnowlet: Knowlet = {
  meta: {
    id: 'hours',
    name: 'Hours of the Day',
    names: {
      en: 'Hours of the Day',
      es: 'Horas del Día',
      zh: '十二時辰',
    },
    description: 'Explore the 12 double-hours (Shichen) of traditional Chinese timekeeping',
    descriptions: {
      en: 'Explore the 12 double-hours (Shichen) of traditional Chinese timekeeping',
      es: 'Explora las 12 horas dobles (Shichen) del sistema tradicional chino',
      zh: '探索中國傳統的十二時辰',
    },
    requiredProviders: ['time'],
    supportedLanguages: ['en', 'es'],
  },
  View: HoursView,
};

export { HoursView };
