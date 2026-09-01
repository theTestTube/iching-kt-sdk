export type YinYangId = 'yin' | 'yang';

export interface PolarityInfo {
  chinese: string;
  pinyin: string;
  qualities: string[];
  description: string;
  elementId: 'water' | 'fire';
  elementLabel: string;
}

export type PolarityTranslations = {
  polarities: Record<YinYangId, PolarityInfo>;
  labels: {
    qualities: string;
    element: string;
  };
};

export const YIN_YANG_ORDER: YinYangId[] = ['yin', 'yang'];

const translations: Record<string, PolarityTranslations> = {
  en: {
    labels: {
      qualities: 'Qualities',
      element: 'Element',
    },
    polarities: {
      yin: {
        chinese: '陰',
        pinyin: 'yīn',
        qualities: [
          'passive', 'receptive', 'dark', 'cold', 'descending',
          'contracting', 'feminine', 'moon', 'earth', 'water',
          'night', 'rest', 'interior',
        ],
        description:
          'Yin represents the receptive, yielding aspect of existence. Like the moon that reflects rather than shines, yin gathers, nurtures, and conserves. It is the valley that receives water, the earth that holds seed, the night that restores. Without yin, yang has nothing to act upon.',
        elementId: 'water',
        elementLabel: 'Water',
      },
      yang: {
        chinese: '陽',
        pinyin: 'yáng',
        qualities: [
          'active', 'creative', 'light', 'warm', 'ascending',
          'expanding', 'masculine', 'sun', 'heaven', 'fire',
          'day', 'movement', 'exterior',
        ],
        description:
          'Yang represents the active, initiating aspect of existence. Like the sun that radiates outward, yang moves, creates, and transforms. It is the mountain that rises, the fire that illuminates, the impulse that begins all things. Without yang, yin has nothing to receive.',
        elementId: 'fire',
        elementLabel: 'Fire',
      },
    },
  },
  es: {
    labels: {
      qualities: 'Cualidades',
      element: 'Elemento',
    },
    polarities: {
      yin: {
        chinese: '陰',
        pinyin: 'yīn',
        qualities: [
          'pasivo', 'receptivo', 'oscuro', 'frío', 'descendente',
          'contrayente', 'femenino', 'luna', 'tierra', 'agua',
          'noche', 'reposo', 'interior',
        ],
        description:
          'Yin representa el aspecto receptivo y cedente de la existencia. Como la luna que refleja en lugar de brillar, yin recoge, nutre y conserva. Es el valle que recibe el agua, la tierra que sostiene la semilla, la noche que restaura. Sin yin, yang no tiene nada sobre lo que actuar.',
        elementId: 'water',
        elementLabel: 'Agua',
      },
      yang: {
        chinese: '陽',
        pinyin: 'yáng',
        qualities: [
          'activo', 'creativo', 'luminoso', 'cálido', 'ascendente',
          'expansivo', 'masculino', 'sol', 'cielo', 'fuego',
          'día', 'movimiento', 'exterior',
        ],
        description:
          'Yang representa el aspecto activo e iniciador de la existencia. Como el sol que irradia hacia afuera, yang se mueve, crea y transforma. Es la montaña que se eleva, el fuego que ilumina, el impulso que inicia todas las cosas. Sin yang, yin no tiene nada que recibir.',
        elementId: 'fire',
        elementLabel: 'Fuego',
      },
    },
  },
  zh: {
    labels: {
      qualities: '特質',
      element: '元素',
    },
    polarities: {
      yin: {
        chinese: '陰',
        pinyin: 'yīn',
        qualities: [
          '被動', '接受', '暗', '冷', '下降',
          '收縮', '陰性', '月', '地', '水',
          '夜', '靜', '內',
        ],
        description:
          '陰代表存在的接受性、順從的一面。如月亮反射而非發光，陰聚集、滋養、保存。它是接受水的山谷，承載種子的大地，恢復精力的夜晚。沒有陰，陽便無所作用。',
        elementId: 'water',
        elementLabel: '水',
      },
      yang: {
        chinese: '陽',
        pinyin: 'yáng',
        qualities: [
          '主動', '創造', '明', '熱', '上升',
          '擴展', '陽性', '日', '天', '火',
          '晝', '動', '外',
        ],
        description:
          '陽代表存在的主動性、創始的一面。如太陽向外輻射，陽運動、創造、轉化。它是升起的山，照耀的火，開啟萬物的衝動。沒有陽，陰便無所接受。',
        elementId: 'fire',
        elementLabel: '火',
      },
    },
  },
};

export function getTranslation(language: string): PolarityTranslations {
  return translations[language] ?? translations.en;
}

export interface YinYangInput {
  polarity?: YinYangId;
  explanation?: string;
}

/**
 * Read this board's polarity out of the SHARED global `inputData` slot.
 *
 * Two accepted shapes: a plain polarity id, and the `{ polarity, explanation }`
 * object a pinned card adopts from a toss (#65). Anything else — including the
 * foreign types that share the slot — yields an empty result rather than a
 * payload that makes `abstractColors.yinyang[...]` throw on `.activeColor`.
 */
export function parseYinYangInput(inputData?: { type: string; value: unknown }): YinYangInput {
  if (inputData?.type !== 'yinyang') return {};
  const value = inputData.value;
  if (value === 'yin' || value === 'yang') return { polarity: value };
  if (typeof value === 'object' && value !== null && 'polarity' in value) {
    const obj = value as { polarity?: unknown; explanation?: unknown };
    if (obj.polarity === 'yin' || obj.polarity === 'yang') {
      return {
        polarity: obj.polarity,
        explanation: typeof obj.explanation === 'string' ? obj.explanation : undefined,
      };
    }
  }
  return {};
}
