import { Knowlet, KnowletContext } from '@iching-kt/core';
import { HexagramDetailView } from '@iching-kt/hours';
import { MoonView } from './MoonView';
import { MoonCardView } from './MoonCardView';

function MoonKnowletView({ context }: { context: KnowletContext }) {
  if (context.currentView?.id === 'hexagram-detail') {
    const hexagramNumber = context.currentView.params?.hexagramNumber as number;
    return HexagramDetailView({ context, hexagramNumber });
  }

  return MoonView({ context });
}

export const moonKnowlet: Knowlet = {
  meta: {
    id: 'moon',
    name: 'Moon Phases',
    names: {
      en: 'Moon Phases',
      es: 'Fases Lunares',
      zh: '月相',
    },
    icon: '🌙',
    description: 'Explore the 8 lunar phases and their trigram correspondences from the Cantong qi',
    descriptions: {
      en: 'Explore the 8 lunar phases and their trigram correspondences from the Cantong qi',
      es: 'Explora las 8 fases lunares y sus correspondencias trigramáticas del Cantong qi',
      zh: '探索八個月相及其參同契三元對應',
    },
    requiredProviders: ['moon-phase'],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['time'],
    produces: ['hexagram', 'trigram', 'element', 'yinyang'],
    category: 'board',
  },
  View: MoonKnowletView,
  CardView: MoonCardView,
};

export { MoonView } from './MoonView';
export { getTranslation, translations } from './data';
export type { MoonPhaseInfo } from './data';
