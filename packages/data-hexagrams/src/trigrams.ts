/**
 * Trigram data with multilingual translations.
 *
 * Sources:
 * - Canonical glossary (docs/i18n/glossary.md)
 * - Wilhelm-Baynes (Public Domain)
 * - Zhouyi 周易 (Classical Chinese)
 *
 * No numbering is assigned — no universally accepted trigram numbering
 * standard exists (unlike hexagrams' King Wen 1-64 sequence).
 * Binary representation (3-bit) is shown as a structural property.
 */

import type { TrigramId } from './types';

export interface TrigramTranslation {
  name: string;
  description: string;
}

export interface TrigramData {
  id: TrigramId;
  unicode: string;
  binary: string;
  chinese: string;
  pinyin: string;
  translations: Record<string, TrigramTranslation>;
}

const TRIGRAMS: Record<TrigramId, TrigramData> = {
  heaven: {
    id: 'heaven',
    unicode: '☰',
    binary: '111',
    chinese: '乾',
    pinyin: 'qián',
    translations: {
      en: { name: 'Heaven / Creative', description: 'The creative principle, pure yang energy. Strength, initiative, and perseverance.' },
      es: { name: 'Cielo / Lo Creativo', description: 'El principio creativo, energía yang pura. Fuerza, iniciativa y perseverancia.' },
      zh: { name: '天 / 創造', description: '創造之本，純陽之氣。剛健、主動、恆久。' },
    },
  },
  earth: {
    id: 'earth',
    unicode: '☷',
    binary: '000',
    chinese: '坤',
    pinyin: 'kūn',
    translations: {
      en: { name: 'Earth / Receptive', description: 'The receptive principle, pure yin energy. Devotion, yielding, and nourishment.' },
      es: { name: 'Tierra / Lo Receptivo', description: 'El principio receptivo, energía yin pura. Devoción, docilidad y sustento.' },
      zh: { name: '地 / 順承', description: '順承之本，純陰之氣。柔順、承載、滋養。' },
    },
  },
  thunder: {
    id: 'thunder',
    unicode: '☳',
    binary: '100',
    chinese: '震',
    pinyin: 'zhèn',
    translations: {
      en: { name: 'Thunder / Arousing', description: 'Shock and movement. Initiative that springs from below, the first stirring of yang.' },
      es: { name: 'Trueno / Lo Suscitativo', description: 'Conmoción y movimiento. Iniciativa que surge desde abajo, la primera agitación del yang.' },
      zh: { name: '雷 / 震動', description: '震動而起。陽氣初動，自下而生之力。' },
    },
  },
  water: {
    id: 'water',
    unicode: '☵',
    binary: '010',
    chinese: '坎',
    pinyin: 'kǎn',
    translations: {
      en: { name: 'Water / Abysmal', description: 'Danger and depth. The yang line trapped between yin, flowing through difficulty.' },
      es: { name: 'Agua / Lo Abismal', description: 'Peligro y profundidad. La línea yang atrapada entre yin, fluyendo a través de la dificultad.' },
      zh: { name: '水 / 坎險', description: '險陷之象。陽爻陷於陰中，涉險而行。' },
    },
  },
  mountain: {
    id: 'mountain',
    unicode: '☶',
    binary: '001',
    chinese: '艮',
    pinyin: 'gèn',
    translations: {
      en: { name: 'Mountain / Stillness', description: 'Keeping still, meditation. Yang rests atop yin, marking a natural boundary.' },
      es: { name: 'Montaña / El Aquietamiento', description: 'Quietud, meditación. El yang descansa sobre el yin, marcando un límite natural.' },
      zh: { name: '山 / 止靜', description: '止而不動，靜定之象。陽居陰上，界限分明。' },
    },
  },
  wind: {
    id: 'wind',
    unicode: '☴',
    binary: '011',
    chinese: '巽',
    pinyin: 'xùn',
    translations: {
      en: { name: 'Wind / Gentle', description: 'Gentle penetration. Yin enters beneath yang, influence through persistence.' },
      es: { name: 'Viento / Lo Suave', description: 'Penetración suave. El yin entra debajo del yang, influencia a través de la persistencia.' },
      zh: { name: '風 / 巽入', description: '柔順而入，漸進之象。陰入陽下，以柔克剛。' },
    },
  },
  fire: {
    id: 'fire',
    unicode: '☲',
    binary: '101',
    chinese: '離',
    pinyin: 'lí',
    translations: {
      en: { name: 'Fire / Clinging', description: 'Clarity and dependence. Yin clings between yang lines, illumination that needs fuel.' },
      es: { name: 'Fuego / Lo Adherente', description: 'Claridad y dependencia. El yin se adhiere entre líneas yang, iluminación que necesita combustible.' },
      zh: { name: '火 / 附麗', description: '光明附麗之象。陰爻居陽中，明而有依。' },
    },
  },
  lake: {
    id: 'lake',
    unicode: '☱',
    binary: '110',
    chinese: '兌',
    pinyin: 'duì',
    translations: {
      en: { name: 'Lake / Joyous', description: 'Joy and openness. Yin opens above yang, pleasure through expression.' },
      es: { name: 'Lago / Lo Sereno', description: 'Alegría y apertura. El yin se abre sobre el yang, placer a través de la expresión.' },
      zh: { name: '澤 / 兌悅', description: '喜悅開朗之象。陰開於陽上，和悅以達。' },
    },
  },
};

export function getTrigram(id: TrigramId): TrigramData | undefined {
  return TRIGRAMS[id];
}

/** Look a trigram up by its 3-bit binary (bottom→top, '1' = yang). */
export function getTrigramIdByBinary(binary: string): TrigramId | undefined {
  return (Object.keys(TRIGRAMS) as TrigramId[]).find((id) => TRIGRAMS[id].binary === binary);
}

export function getTrigramTranslation(id: TrigramId, language: string): TrigramTranslation | undefined {
  const trigram = TRIGRAMS[id];
  if (!trigram) return undefined;
  return trigram.translations[language] || trigram.translations['en'];
}
