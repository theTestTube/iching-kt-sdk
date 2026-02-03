import { Knowlet } from '@iching-kt/core';
import { HexagramMatrixView } from '@iching-kt/square';

export const hexagramMatrixKnowlet: Knowlet = {
  meta: {
    id: 'hexagrammatrix',
    name: 'Hexagram Matrix',
    names: {
      en: 'Hexagram Matrix',
      es: 'Matriz de Hexagramas',
      zh: '卦象矩陣',
    },
    description: 'The 8x8 matrix of all 64 hexagrams',
    descriptions: {
      en: 'The 8x8 matrix of all 64 hexagrams',
      es: 'La matriz 8x8 de los 64 hexagramas',
      zh: '所有64個卦象的8×8矩陣',
    },
    requiredProviders: ['solar-time'],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['hexagram', 'trigram', 'time'],
    produces: ['hexagram', 'trigram'],
    category: 'board',
  },
  View: HexagramMatrixView,
};

export { HexagramMatrixView };
