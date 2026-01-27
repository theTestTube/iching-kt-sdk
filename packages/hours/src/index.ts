import { Knowlet, KnowletContext } from '@iching-kt/core';
import { HoursView } from './HoursView';
import { HexagramDetailView } from './HexagramDetailView';
import { HexagramCard } from './HexagramCard';

/**
 * Main view component that handles internal navigation
 */
function HoursKnowletView({ context }: { context: KnowletContext }) {
  // Route to detail view if hexagram-detail is selected
  if (context.currentView?.id === 'hexagram-detail') {
    const hexagramNumber = context.currentView.params?.hexagramNumber as number;
    return HexagramDetailView({ context, hexagramNumber });
  }

  // Default to main hours view
  return HoursView({ context });
}

export const hoursKnowlet: Knowlet = {
  meta: {
    id: 'hours',
    name: 'Hours of the Day',
    names: {
      en: 'Hours of the Day',
      es: 'Horas del Día',
      zh: '十二時辰',
    },
    description: 'Explore the 12 double-hours (Shichen) and their sovereign hexagrams',
    descriptions: {
      en: 'Explore the 12 double-hours (Shichen) and their sovereign hexagrams',
      es: 'Explora las 12 horas dobles (Shichen) y sus hexagramas soberanos',
      zh: '探索十二時辰及其消息卦',
    },
    requiredProviders: ['solar-time'],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['time'],
    produces: ['hexagram', 'trigram', 'element', 'yinyang'],
    category: 'board',
  },
  View: HoursKnowletView,
};

export { HoursView, HexagramDetailView, HexagramCard };
