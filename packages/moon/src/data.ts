import type { MoonPhaseId } from '@iching-kt/provider-moon-phase';

/**
 * Moon Phase Info — per-phase data for the Cantong qi 8-trigram lunar system.
 *
 * Doctrinal source: Wei Boyang, Cantong qi (周易參同契, ~147 CE)
 * Phase-hexagram pairing: Twelve Sovereign Hexagrams (十二消息卦)
 *
 * Phases 4 (waxing gibbous) and 8 (waning crescent) are transitional:
 * they lack a single trigram assignment and have no Later Heaven Bagua element.
 */
export interface MoonPhaseInfo {
  /** Chinese phase name */
  chinese: string;
  /** Pinyin romanization */
  pinyin: string;
  /** Localized phase name */
  phaseName: string;
  /** Trigram symbol (☰☱☳☴☶☷) — null for transitional phases */
  trigramSymbol: string | null;
  /** Trigram name — null for transitional phases */
  trigramName: string | null;
  /** Sovereign hexagram number (1-64) */
  hexagramNumber: number;
  /** Wu Xing element — null for transitional phases 4 and 8 */
  element: string | null;
  /** Yin/Yang quality label (more nuanced than simple yin/yang) */
  yinYangLabel: string;
  /** Yin/Yang base value for badge coloring */
  yinYang: 'yin' | 'yang';
  /** Approximate lunar day range */
  lunarDayRange: string;
  /** Phase description */
  description: string;
  /** Symbolic meaning for the info card */
  symbolicMeaning: string;
}

type MoonTranslations = {
  [lang: string]: {
    phases: Record<MoonPhaseId, MoonPhaseInfo>;
    labels: {
      currentPhase: string;
      lunarDay: string;
      element: string;
      trigram: string;
      symbolicMeaning: string;
      sovereignHexagram: string;
      previousPhase: string;
      nextPhase: string;
    };
  };
};

export const translations: MoonTranslations = {
  en: {
    labels: {
      currentPhase: 'Current Phase',
      lunarDay: 'Lunar Day',
      element: 'Element',
      trigram: 'Trigram',
      symbolicMeaning: 'Symbolic Meaning',
      sovereignHexagram: 'Sovereign Hexagram',
      previousPhase: '◀ Previous',
      nextPhase: 'Next ▶',
    },
    phases: {
      new_moon: {
        chinese: '朔',
        pinyin: 'shuò',
        phaseName: 'New Moon',
        trigramSymbol: '☷',
        trigramName: 'Kun / Earth',
        hexagramNumber: 2,
        element: 'Earth',
        yinYangLabel: 'Pure Yin',
        yinYang: 'yin',
        lunarDayRange: 'Day 29-1',
        description: 'The moon is hidden, yin at its fullest. A time of stillness and potential, the seed of renewal lies within darkness.',
        symbolicMeaning: 'Complete receptivity, the void before creation',
      },
      waxing_crescent: {
        chinese: '眉月',
        pinyin: 'méiyuè',
        phaseName: 'Waxing Crescent',
        trigramSymbol: '☳',
        trigramName: 'Zhen / Thunder',
        hexagramNumber: 24,
        element: 'Wood',
        yinYangLabel: 'Yang Emerging',
        yinYang: 'yang',
        lunarDayRange: 'Day 2-6',
        description: 'First light appears as yang returns from the depths. The thunder of awakening stirs beneath the earth.',
        symbolicMeaning: 'The return of light, yang stirring from below',
      },
      first_quarter: {
        chinese: '上弦月',
        pinyin: 'shàngxiányuè',
        phaseName: 'First Quarter',
        trigramSymbol: '☱',
        trigramName: 'Dui / Lake',
        hexagramNumber: 19,
        element: 'Metal',
        yinYangLabel: 'Yang Growing',
        yinYang: 'yang',
        lunarDayRange: 'Day 7-10',
        description: 'Half illuminated, yang grows with joyful momentum. The lake reflects increasing light with openness and clarity.',
        symbolicMeaning: 'Joyful expansion, growing illumination',
      },
      waxing_gibbous: {
        chinese: '盈凸月',
        pinyin: 'yíngtūyuè',
        phaseName: 'Waxing Gibbous',
        trigramSymbol: null,
        trigramName: null,
        hexagramNumber: 11,
        element: null,
        yinYangLabel: 'Balance → Yang',
        yinYang: 'yang',
        lunarDayRange: 'Day 11-14',
        description: 'Yang nearly full, harmony approaches. The transitional balance between equal forces shifts toward maximum illumination.',
        symbolicMeaning: 'Harmony and peace, balance tilting to fullness',
      },
      full_moon: {
        chinese: '望',
        pinyin: 'wàng',
        phaseName: 'Full Moon',
        trigramSymbol: '☰',
        trigramName: 'Qian / Heaven',
        hexagramNumber: 1,
        element: 'Metal',
        yinYangLabel: 'Pure Yang',
        yinYang: 'yang',
        lunarDayRange: 'Day 14-16',
        description: 'Maximum illumination, creative power at its zenith. Heaven\'s three solid lines reflect the moon\'s complete brilliance.',
        symbolicMeaning: 'Creative power at peak, full illumination',
      },
      waning_gibbous: {
        chinese: '亏凸月',
        pinyin: 'kuītūyuè',
        phaseName: 'Waning Gibbous',
        trigramSymbol: '☴',
        trigramName: 'Xun / Wind',
        hexagramNumber: 44,
        element: 'Wood',
        yinYangLabel: 'Yin Emerging',
        yinYang: 'yin',
        lunarDayRange: 'Day 16-20',
        description: 'First darkness enters gently, like wind penetrating. The yin begins its subtle return from below.',
        symbolicMeaning: 'Gentle penetration, yin\'s subtle return',
      },
      last_quarter: {
        chinese: '下弦月',
        pinyin: 'xiàxiányuè',
        phaseName: 'Last Quarter',
        trigramSymbol: '☶',
        trigramName: 'Gen / Mountain',
        hexagramNumber: 33,
        element: 'Earth',
        yinYangLabel: 'Yin Growing',
        yinYang: 'yin',
        lunarDayRange: 'Day 21-24',
        description: 'Half in shadow, stillness and withdrawal deepen. The mountain stands firm as darkness grows around it.',
        symbolicMeaning: 'Stillness and retreat, keeping still',
      },
      waning_crescent: {
        chinese: '残月',
        pinyin: 'cányuè',
        phaseName: 'Waning Crescent',
        trigramSymbol: null,
        trigramName: null,
        hexagramNumber: 23,
        element: null,
        yinYangLabel: 'Balance → Yin',
        yinYang: 'yin',
        lunarDayRange: 'Day 25-28',
        description: 'Yang nearly gone, a time of release before renewal. The old form dissolves to make way for what comes next.',
        symbolicMeaning: 'Letting go, dissolution before renewal',
      },
    },
  },
  es: {
    labels: {
      currentPhase: 'Fase Actual',
      lunarDay: 'Día Lunar',
      element: 'Elemento',
      trigram: 'Trigrama',
      symbolicMeaning: 'Significado Simbólico',
      sovereignHexagram: 'Hexagrama Soberano',
      previousPhase: '◀ Anterior',
      nextPhase: 'Siguiente ▶',
    },
    phases: {
      new_moon: {
        chinese: '朔',
        pinyin: 'shuò',
        phaseName: 'Luna Nueva',
        trigramSymbol: '☷',
        trigramName: 'Kun / Tierra',
        hexagramNumber: 2,
        element: 'Tierra',
        yinYangLabel: 'Yin Puro',
        yinYang: 'yin',
        lunarDayRange: 'Día 29-1',
        description: 'La luna se oculta, el yin alcanza su plenitud. Tiempo de quietud y potencial, la semilla de renovación yace en la oscuridad.',
        symbolicMeaning: 'Receptividad total, el vacío antes de la creación',
      },
      waxing_crescent: {
        chinese: '眉月',
        pinyin: 'méiyuè',
        phaseName: 'Creciente',
        trigramSymbol: '☳',
        trigramName: 'Zhen / Trueno',
        hexagramNumber: 24,
        element: 'Madera',
        yinYangLabel: 'Yang Emergente',
        yinYang: 'yang',
        lunarDayRange: 'Día 2-6',
        description: 'La primera luz aparece cuando el yang retorna desde las profundidades. El trueno del despertar se agita bajo la tierra.',
        symbolicMeaning: 'El retorno de la luz, el yang agitándose desde abajo',
      },
      first_quarter: {
        chinese: '上弦月',
        pinyin: 'shàngxiányuè',
        phaseName: 'Cuarto Creciente',
        trigramSymbol: '☱',
        trigramName: 'Dui / Lago',
        hexagramNumber: 19,
        element: 'Metal',
        yinYangLabel: 'Yang Creciente',
        yinYang: 'yang',
        lunarDayRange: 'Día 7-10',
        description: 'Mitad iluminada, el yang crece con impulso gozoso. El lago refleja la luz creciente con apertura y claridad.',
        symbolicMeaning: 'Expansión gozosa, iluminación creciente',
      },
      waxing_gibbous: {
        chinese: '盈凸月',
        pinyin: 'yíngtūyuè',
        phaseName: 'Gibosa Creciente',
        trigramSymbol: null,
        trigramName: null,
        hexagramNumber: 11,
        element: null,
        yinYangLabel: 'Balance → Yang',
        yinYang: 'yang',
        lunarDayRange: 'Día 11-14',
        description: 'El yang casi pleno, la armonía se aproxima. El equilibrio transitorio entre fuerzas iguales se inclina hacia la máxima iluminación.',
        symbolicMeaning: 'Armonía y paz, el equilibrio inclinándose a la plenitud',
      },
      full_moon: {
        chinese: '望',
        pinyin: 'wàng',
        phaseName: 'Luna Llena',
        trigramSymbol: '☰',
        trigramName: 'Qian / Cielo',
        hexagramNumber: 1,
        element: 'Metal',
        yinYangLabel: 'Yang Puro',
        yinYang: 'yang',
        lunarDayRange: 'Día 14-16',
        description: 'Máxima iluminación, el poder creativo en su cénit. Las tres líneas continuas del Cielo reflejan la brillantez completa de la luna.',
        symbolicMeaning: 'Poder creativo en su apogeo, iluminación plena',
      },
      waning_gibbous: {
        chinese: '亏凸月',
        pinyin: 'kuītūyuè',
        phaseName: 'Gibosa Menguante',
        trigramSymbol: '☴',
        trigramName: 'Xun / Viento',
        hexagramNumber: 44,
        element: 'Madera',
        yinYangLabel: 'Yin Emergente',
        yinYang: 'yin',
        lunarDayRange: 'Día 16-20',
        description: 'La primera oscuridad entra suavemente, como el viento penetrante. El yin inicia su sutil retorno desde abajo.',
        symbolicMeaning: 'Penetración suave, el sutil retorno del yin',
      },
      last_quarter: {
        chinese: '下弦月',
        pinyin: 'xiàxiányuè',
        phaseName: 'Cuarto Menguante',
        trigramSymbol: '☶',
        trigramName: 'Gen / Montaña',
        hexagramNumber: 33,
        element: 'Tierra',
        yinYangLabel: 'Yin Creciente',
        yinYang: 'yin',
        lunarDayRange: 'Día 21-24',
        description: 'Mitad en sombra, la quietud y el retiro se profundizan. La montaña permanece firme mientras la oscuridad crece a su alrededor.',
        symbolicMeaning: 'Quietud y retiro, mantenerse inmóvil',
      },
      waning_crescent: {
        chinese: '残月',
        pinyin: 'cányuè',
        phaseName: 'Menguante',
        trigramSymbol: null,
        trigramName: null,
        hexagramNumber: 23,
        element: null,
        yinYangLabel: 'Balance → Yin',
        yinYang: 'yin',
        lunarDayRange: 'Día 25-28',
        description: 'El yang casi se ha ido, tiempo de soltar antes de la renovación. La forma antigua se disuelve para dar paso a lo que viene.',
        symbolicMeaning: 'Soltar, disolución antes de la renovación',
      },
    },
  },
  zh: {
    labels: {
      currentPhase: '當前月相',
      lunarDay: '月日',
      element: '五行',
      trigram: '八卦',
      symbolicMeaning: '象徵意義',
      sovereignHexagram: '消息卦',
      previousPhase: '◀ 上一個',
      nextPhase: '下一個 ▶',
    },
    phases: {
      new_moon: {
        chinese: '朔',
        pinyin: 'shuò',
        phaseName: '朔月',
        trigramSymbol: '☷',
        trigramName: '坤 / 地',
        hexagramNumber: 2,
        element: '土',
        yinYangLabel: '純陰',
        yinYang: 'yin',
        lunarDayRange: '廿九至初一',
        description: '月隱無光，陰氣至盛。靜寂之中蘊藏新生之機，暗處潛伏復始之種。',
        symbolicMeaning: '至柔至順，虛空待創',
      },
      waxing_crescent: {
        chinese: '眉月',
        pinyin: 'méiyuè',
        phaseName: '眉月',
        trigramSymbol: '☳',
        trigramName: '震 / 雷',
        hexagramNumber: 24,
        element: '木',
        yinYangLabel: '陽生',
        yinYang: 'yang',
        lunarDayRange: '初二至初六',
        description: '初光乍現，一陽來復。震雷動於地下，萬物始蘇，陽氣自深處回歸。',
        symbolicMeaning: '光明復歸，陽氣始動',
      },
      first_quarter: {
        chinese: '上弦月',
        pinyin: 'shàngxiányuè',
        phaseName: '上弦月',
        trigramSymbol: '☱',
        trigramName: '兌 / 澤',
        hexagramNumber: 19,
        element: '金',
        yinYangLabel: '陽長',
        yinYang: 'yang',
        lunarDayRange: '初七至初十',
        description: '半輪明月，陽氣漸盛。澤水映照漸增之光，悅澤開朗，清明通達。',
        symbolicMeaning: '悅澤開張，光明漸盛',
      },
      waxing_gibbous: {
        chinese: '盈凸月',
        pinyin: 'yíngtūyuè',
        phaseName: '盈凸月',
        trigramSymbol: null,
        trigramName: null,
        hexagramNumber: 11,
        element: null,
        yinYangLabel: '趨陽',
        yinYang: 'yang',
        lunarDayRange: '十一至十四',
        description: '陽氣將滿，和諧漸至。陰陽二氣交泰平衡，漸趨圓滿光明之境。',
        symbolicMeaning: '天地交泰，和諧趨滿',
      },
      full_moon: {
        chinese: '望',
        pinyin: 'wàng',
        phaseName: '望月',
        trigramSymbol: '☰',
        trigramName: '乾 / 天',
        hexagramNumber: 1,
        element: '金',
        yinYangLabel: '純陽',
        yinYang: 'yang',
        lunarDayRange: '十四至十六',
        description: '滿月當空，至明至盛。乾天三陽，剛健中正，創造之力臻於極致。',
        symbolicMeaning: '剛健中正，光明極盛',
      },
      waning_gibbous: {
        chinese: '亏凸月',
        pinyin: 'kuītūyuè',
        phaseName: '虧凸月',
        trigramSymbol: '☴',
        trigramName: '巽 / 風',
        hexagramNumber: 44,
        element: '木',
        yinYangLabel: '陰生',
        yinYang: 'yin',
        lunarDayRange: '十六至二十',
        description: '初暗輕入，如風之柔。陰氣始自下方潛入，巽風徐來，陽漸消退。',
        symbolicMeaning: '巽風柔入，陰氣始歸',
      },
      last_quarter: {
        chinese: '下弦月',
        pinyin: 'xiàxiányuè',
        phaseName: '下弦月',
        trigramSymbol: '☶',
        trigramName: '艮 / 山',
        hexagramNumber: 33,
        element: '土',
        yinYangLabel: '陰長',
        yinYang: 'yin',
        lunarDayRange: '廿一至廿四',
        description: '半暗半明，靜止退藏。艮山巍然不動，暗色漸深，萬物收斂歸藏。',
        symbolicMeaning: '止而不動，退藏收斂',
      },
      waning_crescent: {
        chinese: '残月',
        pinyin: 'cányuè',
        phaseName: '殘月',
        trigramSymbol: null,
        trigramName: null,
        hexagramNumber: 23,
        element: null,
        yinYangLabel: '趨陰',
        yinYang: 'yin',
        lunarDayRange: '廿五至廿八',
        description: '陽氣將盡，舊形消融。剝落之際，放下執著，為新生讓路。',
        symbolicMeaning: '剝落歸虛，待復始新',
      },
    },
  },
};

export function getTranslation(lang: string) {
  return translations[lang] || translations.en;
}
