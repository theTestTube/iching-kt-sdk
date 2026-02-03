import { Knowlet } from '@iching-kt/core';
import { BranchesCircleView } from '@iching-kt/square';

export const branchesCircleKnowlet: Knowlet = {
  meta: {
    id: 'branchescircle',
    name: 'Branches Circle',
    names: {
      en: 'Branches Circle',
      es: 'Círculo de Ramas',
      zh: '地支圓',
    },
    description: 'The twelve Earthly Branches arranged in a circle',
    descriptions: {
      en: 'The twelve Earthly Branches arranged in a circle',
      es: 'Las doce Ramas Terrestres dispuestas en un círculo',
      zh: '排列成圓形的十二個地支',
    },
    requiredProviders: ['solar-time'],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['hexagram', 'trigram', 'time'],
    produces: ['hexagram', 'trigram'],
    category: 'board',
  },
  View: BranchesCircleView,
};

export { BranchesCircleView };
