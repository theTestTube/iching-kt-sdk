import { EarthlyBranch } from '@iching-kt/provider-time';

interface BranchInfo {
  chinese: string;
  animal: string;
  timeRange: string;
  element: string;
  yinYang: 'yin' | 'yang';
}

type Translations = {
  [lang: string]: {
    branches: Record<EarthlyBranch, BranchInfo>;
    labels: {
      currentHour: string;
      timeRange: string;
      element: string;
      animal: string;
    };
  };
};

export const translations: Translations = {
  en: {
    labels: {
      currentHour: 'Current Hour',
      timeRange: 'Time Range',
      element: 'Element',
      animal: 'Animal',
    },
    branches: {
      zi: { chinese: '子', animal: 'Rat', timeRange: '23:00-01:00', element: 'Water', yinYang: 'yang' },
      chou: { chinese: '丑', animal: 'Ox', timeRange: '01:00-03:00', element: 'Earth', yinYang: 'yin' },
      yin: { chinese: '寅', animal: 'Tiger', timeRange: '03:00-05:00', element: 'Wood', yinYang: 'yang' },
      mao: { chinese: '卯', animal: 'Rabbit', timeRange: '05:00-07:00', element: 'Wood', yinYang: 'yin' },
      chen: { chinese: '辰', animal: 'Dragon', timeRange: '07:00-09:00', element: 'Earth', yinYang: 'yang' },
      si: { chinese: '巳', animal: 'Snake', timeRange: '09:00-11:00', element: 'Fire', yinYang: 'yin' },
      wu: { chinese: '午', animal: 'Horse', timeRange: '11:00-13:00', element: 'Fire', yinYang: 'yang' },
      wei: { chinese: '未', animal: 'Goat', timeRange: '13:00-15:00', element: 'Earth', yinYang: 'yin' },
      shen: { chinese: '申', animal: 'Monkey', timeRange: '15:00-17:00', element: 'Metal', yinYang: 'yang' },
      you: { chinese: '酉', animal: 'Rooster', timeRange: '17:00-19:00', element: 'Metal', yinYang: 'yin' },
      xu: { chinese: '戌', animal: 'Dog', timeRange: '19:00-21:00', element: 'Earth', yinYang: 'yang' },
      hai: { chinese: '亥', animal: 'Pig', timeRange: '21:00-23:00', element: 'Water', yinYang: 'yin' },
    },
  },
  es: {
    labels: {
      currentHour: 'Hora Actual',
      timeRange: 'Rango Horario',
      element: 'Elemento',
      animal: 'Animal',
    },
    branches: {
      zi: { chinese: '子', animal: 'Rata', timeRange: '23:00-01:00', element: 'Agua', yinYang: 'yang' },
      chou: { chinese: '丑', animal: 'Buey', timeRange: '01:00-03:00', element: 'Tierra', yinYang: 'yin' },
      yin: { chinese: '寅', animal: 'Tigre', timeRange: '03:00-05:00', element: 'Madera', yinYang: 'yang' },
      mao: { chinese: '卯', animal: 'Conejo', timeRange: '05:00-07:00', element: 'Madera', yinYang: 'yin' },
      chen: { chinese: '辰', animal: 'Dragón', timeRange: '07:00-09:00', element: 'Tierra', yinYang: 'yang' },
      si: { chinese: '巳', animal: 'Serpiente', timeRange: '09:00-11:00', element: 'Fuego', yinYang: 'yin' },
      wu: { chinese: '午', animal: 'Caballo', timeRange: '11:00-13:00', element: 'Fuego', yinYang: 'yang' },
      wei: { chinese: '未', animal: 'Cabra', timeRange: '13:00-15:00', element: 'Tierra', yinYang: 'yin' },
      shen: { chinese: '申', animal: 'Mono', timeRange: '15:00-17:00', element: 'Metal', yinYang: 'yang' },
      you: { chinese: '酉', animal: 'Gallo', timeRange: '17:00-19:00', element: 'Metal', yinYang: 'yin' },
      xu: { chinese: '戌', animal: 'Perro', timeRange: '19:00-21:00', element: 'Tierra', yinYang: 'yang' },
      hai: { chinese: '亥', animal: 'Cerdo', timeRange: '21:00-23:00', element: 'Agua', yinYang: 'yin' },
    },
  },
};

export function getTranslation(lang: string) {
  return translations[lang] || translations.en;
}
