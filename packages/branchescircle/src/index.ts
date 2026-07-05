import { Knowlet } from '@iching-kt/core';
import { BranchesCircleView, BranchesCircleCardView } from '@iching-kt/square';

export const branchesCircleKnowlet: Knowlet = {
  meta: {
    id: 'branchescircle',
    name: 'Branches Circle',
    names: {
      en: 'Branches Circle',
      es: 'Círculo de Ramas',
      zh: '地支圓',
    },
    icon: '🐉',
    description: 'The twelve Earthly Branches arranged in a circle',
    descriptions: {
      en: 'The twelve Earthly Branches arranged in a circle',
      es: 'Las doce Ramas Terrestres dispuestas en un círculo',
      zh: '排列成圓形的十二個地支',
    },
    requiredProviders: ['solar-time'],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['hexagram', 'time'],
    produces: ['hexagram', 'trigram'],
    category: 'board',
  },
  View: BranchesCircleView,
  CardView: BranchesCircleCardView,
};

export { BranchesCircleView };
