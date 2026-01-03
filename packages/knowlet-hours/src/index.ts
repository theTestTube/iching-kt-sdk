import { Knowlet } from '@iching-kt/core';
import { HoursView } from './HoursView';

export const hoursKnowlet: Knowlet = {
  meta: {
    id: 'hours',
    name: 'Hours of the Day',
    description: 'Explore the 12 double-hours (Shi Chen) of the I-Ching',
    requiredProviders: ['time'],
    supportedLanguages: ['en', 'es'],
  },
  View: HoursView,
};

export { HoursView };
