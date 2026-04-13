export type WuXingId = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

/** Subset of TrigramId relevant to Wu Xing primary trigrams */
type ElementTrigramId = 'thunder' | 'fire' | 'earth' | 'heaven' | 'water';

export interface ElementInfo {
  chinese: string;
  pinyin: string;
  direction: string;
  season: string;
  organ: string;
  emotion: string;
  taste: string;
  generates: WuXingId;
  overcomes: WuXingId;
  overcomeBy: WuXingId;
  primaryTrigram: ElementTrigramId;
  description: string;
}

export type ElementTranslations = {
  elements: Record<WuXingId, ElementInfo>;
  labels: {
    direction: string;
    season: string;
    organ: string;
    emotion: string;
    taste: string;
    generates: string;
    overcomes: string;
    overcomeBy: string;
    trigram: string;
    generatingCycle: string;
    overcomingCycle: string;
  };
};

export const WU_XING_ORDER: WuXingId[] = ['wood', 'fire', 'earth', 'metal', 'water'];

const translations: Record<string, ElementTranslations> = {
  en: {
    labels: {
      direction: 'Direction',
      season: 'Season',
      organ: 'Organ',
      emotion: 'Emotion',
      taste: 'Taste',
      generates: 'Generates',
      overcomes: 'Overcomes',
      overcomeBy: 'Overcome by',
      trigram: 'Trigram',
      generatingCycle: 'Generating cycle (生)',
      overcomingCycle: 'Overcoming cycle (克)',
    },
    elements: {
      wood: {
        chinese: '木',
        pinyin: 'mù',
        direction: 'East',
        season: 'Spring',
        organ: 'Liver',
        emotion: 'Anger',
        taste: 'Sour',
        generates: 'fire',
        overcomes: 'earth',
        overcomeBy: 'metal',
        primaryTrigram: 'thunder',
        description:
          'Wood embodies upward growth, flexibility, and the vital force of new beginnings. Like a young tree pushing through frozen soil, it represents the power of life asserting itself.',
      },
      fire: {
        chinese: '火',
        pinyin: 'huǒ',
        direction: 'South',
        season: 'Summer',
        organ: 'Heart',
        emotion: 'Joy',
        taste: 'Bitter',
        generates: 'earth',
        overcomes: 'metal',
        overcomeBy: 'water',
        primaryTrigram: 'fire',
        description:
          'Fire radiates warmth, light, and transformation. It represents the peak of yang energy — passionate, expansive, and illuminating, yet requiring fuel to sustain itself.',
      },
      earth: {
        chinese: '土',
        pinyin: 'tǔ',
        direction: 'Center',
        season: 'Transitions',
        organ: 'Spleen',
        emotion: 'Worry',
        taste: 'Sweet',
        generates: 'metal',
        overcomes: 'water',
        overcomeBy: 'wood',
        primaryTrigram: 'earth',
        description:
          'Earth is the stable center that nourishes and mediates between all other elements. It governs the transitions between seasons and represents groundedness, receptivity, and nurturing.',
      },
      metal: {
        chinese: '金',
        pinyin: 'jīn',
        direction: 'West',
        season: 'Autumn',
        organ: 'Lungs',
        emotion: 'Grief',
        taste: 'Pungent',
        generates: 'water',
        overcomes: 'wood',
        overcomeBy: 'fire',
        primaryTrigram: 'heaven',
        description:
          'Metal embodies precision, contraction, and refinement. Like ore extracted from earth, it represents the harvest of experience and the clarity that emerges through letting go.',
      },
      water: {
        chinese: '水',
        pinyin: 'shuǐ',
        direction: 'North',
        season: 'Winter',
        organ: 'Kidneys',
        emotion: 'Fear',
        taste: 'Salty',
        generates: 'wood',
        overcomes: 'fire',
        overcomeBy: 'earth',
        primaryTrigram: 'water',
        description:
          'Water flows downward, yields to obstacles, yet wears away stone. It represents the deepest yin — stillness, introspection, and the hidden potential that rests before renewal.',
      },
    },
  },
  es: {
    labels: {
      direction: 'Dirección',
      season: 'Estación',
      organ: 'Órgano',
      emotion: 'Emoción',
      taste: 'Sabor',
      generates: 'Genera',
      overcomes: 'Vence',
      overcomeBy: 'Vencido por',
      trigram: 'Trigrama',
      generatingCycle: 'Ciclo generador (生)',
      overcomingCycle: 'Ciclo controlador (克)',
    },
    elements: {
      wood: {
        chinese: '木',
        pinyin: 'mù',
        direction: 'Este',
        season: 'Primavera',
        organ: 'Hígado',
        emotion: 'Ira',
        taste: 'Ácido',
        generates: 'fire',
        overcomes: 'earth',
        overcomeBy: 'metal',
        primaryTrigram: 'thunder',
        description:
          'La Madera encarna el crecimiento ascendente, la flexibilidad y la fuerza vital de los nuevos comienzos. Como un árbol joven que empuja el suelo helado, representa el poder de la vida afirmándose.',
      },
      fire: {
        chinese: '火',
        pinyin: 'huǒ',
        direction: 'Sur',
        season: 'Verano',
        organ: 'Corazón',
        emotion: 'Alegría',
        taste: 'Amargo',
        generates: 'earth',
        overcomes: 'metal',
        overcomeBy: 'water',
        primaryTrigram: 'fire',
        description:
          'El Fuego irradia calor, luz y transformación. Representa el pico de la energía yang — apasionado, expansivo e iluminador, aunque requiere combustible para sostenerse.',
      },
      earth: {
        chinese: '土',
        pinyin: 'tǔ',
        direction: 'Centro',
        season: 'Transiciones',
        organ: 'Bazo',
        emotion: 'Preocupación',
        taste: 'Dulce',
        generates: 'metal',
        overcomes: 'water',
        overcomeBy: 'wood',
        primaryTrigram: 'earth',
        description:
          'La Tierra es el centro estable que nutre y media entre todos los demás elementos. Gobierna las transiciones entre estaciones y representa la solidez, la receptividad y el cuidado.',
      },
      metal: {
        chinese: '金',
        pinyin: 'jīn',
        direction: 'Oeste',
        season: 'Otoño',
        organ: 'Pulmones',
        emotion: 'Tristeza',
        taste: 'Picante',
        generates: 'water',
        overcomes: 'wood',
        overcomeBy: 'fire',
        primaryTrigram: 'heaven',
        description:
          'El Metal encarna la precisión, la contracción y el refinamiento. Como el mineral extraído de la tierra, representa la cosecha de la experiencia y la claridad que emerge al soltar.',
      },
      water: {
        chinese: '水',
        pinyin: 'shuǐ',
        direction: 'Norte',
        season: 'Invierno',
        organ: 'Riñones',
        emotion: 'Miedo',
        taste: 'Salado',
        generates: 'wood',
        overcomes: 'fire',
        overcomeBy: 'earth',
        primaryTrigram: 'water',
        description:
          'El Agua fluye hacia abajo, cede ante los obstáculos, pero desgasta la roca. Representa el yin más profundo — quietud, introspección y el potencial oculto que descansa antes de la renovación.',
      },
    },
  },
  zh: {
    labels: {
      direction: '方位',
      season: '季節',
      organ: '臟腑',
      emotion: '情志',
      taste: '五味',
      generates: '相生',
      overcomes: '相克',
      overcomeBy: '被克',
      trigram: '主卦',
      generatingCycle: '相生（生）',
      overcomingCycle: '相克（克）',
    },
    elements: {
      wood: {
        chinese: '木',
        pinyin: 'mù',
        direction: '東',
        season: '春',
        organ: '肝',
        emotion: '怒',
        taste: '酸',
        generates: 'fire',
        overcomes: 'earth',
        overcomeBy: 'metal',
        primaryTrigram: 'thunder',
        description:
          '木象徵向上生長、柔韌以及新生的生命力。如嫩芽破土而出，代表生命奮力伸展的力量。',
      },
      fire: {
        chinese: '火',
        pinyin: 'huǒ',
        direction: '南',
        season: '夏',
        organ: '心',
        emotion: '喜',
        taste: '苦',
        generates: 'earth',
        overcomes: 'metal',
        overcomeBy: 'water',
        primaryTrigram: 'fire',
        description:
          '火散發溫暖、光明與轉化之力，代表陽氣之極盛——熱情、擴張、光耀，卻需薪火不斷以維持。',
      },
      earth: {
        chinese: '土',
        pinyin: 'tǔ',
        direction: '中央',
        season: '四季末',
        organ: '脾',
        emotion: '思',
        taste: '甘',
        generates: 'metal',
        overcomes: 'water',
        overcomeBy: 'wood',
        primaryTrigram: 'earth',
        description:
          '土為穩定之中心，滋養萬物，調和五行。主宰四季更迭，象徵厚重、包容與養育之德。',
      },
      metal: {
        chinese: '金',
        pinyin: 'jīn',
        direction: '西',
        season: '秋',
        organ: '肺',
        emotion: '悲',
        taste: '辛',
        generates: 'water',
        overcomes: 'wood',
        overcomeBy: 'fire',
        primaryTrigram: 'heaven',
        description:
          '金象徵精準、收斂與精煉。如礦石從地中提取，代表歷練的收穫與放下之後呈現的清明。',
      },
      water: {
        chinese: '水',
        pinyin: 'shuǐ',
        direction: '北',
        season: '冬',
        organ: '腎',
        emotion: '恐',
        taste: '鹹',
        generates: 'wood',
        overcomes: 'fire',
        overcomeBy: 'earth',
        primaryTrigram: 'water',
        description:
          '水向下流淌，遇阻則繞行，卻能滴水穿石。代表最深沉的陰——靜謐、內省，以及萬物更新前蘊藏的潛能。',
      },
    },
  },
};

export function getTranslation(language: string): ElementTranslations {
  return translations[language] ?? translations.en;
}

export function getElementName(id: WuXingId, language: string): string {
  const t = getTranslation(language);
  return t.elements[id].chinese;
}
