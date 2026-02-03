import { Knowlet } from '@iching-kt/core';
import { LoShuView } from '@iching-kt/square';

export const loshuKnowlet: Knowlet = {
  meta: {
    id: 'loshu',
    name: 'Lo Shu Square',
    names: {
      en: 'Lo Shu Square',
      es: 'Cuadrado Lo Shu',
      zh: '洛書',
    },
    description: 'The ancient 3x3 magic square diagram of I-Ching cosmology',
    descriptions: {
      en: 'The ancient 3x3 magic square diagram of I-Ching cosmology',
      es: 'El antiguo diagrama cuadrado mágico 3x3 de la cosmología del I-Ching',
      zh: '易經宇宙論的古代3×3幻方圖',
    },
    requiredProviders: ['solar-time'],
    supportedLanguages: ['en', 'es', 'zh'],
    consumes: ['hexagram', 'trigram', 'time'],
    produces: ['hexagram', 'trigram'],
    category: 'board',
  },
  View: LoShuView,
};

export { LoShuView };
