import { EarthlyBranch } from '@iching-kt/provider-time';

interface BranchInfo {
  chinese: string;
  pinyin: string;
  animal: string;
  timeRange: string;
  element: string;
  yinYang: 'yin' | 'yang';
  organ: string;
  description: string;
  activity: string;
}

type Translations = {
  [lang: string]: {
    branches: Record<EarthlyBranch, BranchInfo>;
    labels: {
      currentHour: string;
      timeRange: string;
      element: string;
      animal: string;
      organ: string;
      activity: string;
      description: string;
      shichen: string;
      sovereignHexagram: string;
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
      organ: 'Meridian',
      activity: 'Auspicious Activity',
      description: 'Description',
      shichen: 'Shichen',
      sovereignHexagram: 'Sovereign Hexagram',
    },
    branches: {
      zi: {
        chinese: '子',
        pinyin: 'zǐ',
        animal: 'Rat',
        timeRange: '23:00-01:00',
        element: 'Water',
        yinYang: 'yang',
        organ: 'Gallbladder',
        description: 'The Rat thrives in midnight stillness. Qi begins its cycle anew.',
        activity: 'Deep rest, dream work, meditation',
      },
      chou: {
        chinese: '丑',
        pinyin: 'chǒu',
        animal: 'Ox',
        timeRange: '01:00-03:00',
        element: 'Earth',
        yinYang: 'yin',
        organ: 'Liver',
        description: 'The Ox works steadily in darkness. The liver cleanses and restores blood.',
        activity: 'Deep sleep, liver detoxification',
      },
      yin: {
        chinese: '寅',
        pinyin: 'yín',
        animal: 'Tiger',
        timeRange: '03:00-05:00',
        element: 'Wood',
        yinYang: 'yang',
        organ: 'Lungs',
        description: 'The Tiger awakens before dawn. Lungs distribute Qi throughout the body.',
        activity: 'Deep breathing, early rising for monks',
      },
      mao: {
        chinese: '卯',
        pinyin: 'mǎo',
        animal: 'Rabbit',
        timeRange: '05:00-07:00',
        element: 'Wood',
        yinYang: 'yin',
        organ: 'Large Intestine',
        description: 'The Rabbit emerges at dawn. Time for elimination and cleansing.',
        activity: 'Wake naturally, bowel movement, light exercise',
      },
      chen: {
        chinese: '辰',
        pinyin: 'chén',
        animal: 'Dragon',
        timeRange: '07:00-09:00',
        element: 'Earth',
        yinYang: 'yang',
        organ: 'Stomach',
        description: 'The Dragon brings morning energy. Stomach Qi is at its peak.',
        activity: 'Eat a hearty breakfast, begin important work',
      },
      si: {
        chinese: '巳',
        pinyin: 'sì',
        animal: 'Snake',
        timeRange: '09:00-11:00',
        element: 'Fire',
        yinYang: 'yin',
        organ: 'Spleen',
        description: 'The Snake coils in warming sun. Spleen transforms food into energy.',
        activity: 'Mental work, study, decision-making',
      },
      wu: {
        chinese: '午',
        pinyin: 'wǔ',
        animal: 'Horse',
        timeRange: '11:00-13:00',
        element: 'Fire',
        yinYang: 'yang',
        organ: 'Heart',
        description: 'The Horse gallops at midday peak. Heart Qi and Yang reach maximum.',
        activity: 'Light lunch, brief rest, social interaction',
      },
      wei: {
        chinese: '未',
        pinyin: 'wèi',
        animal: 'Goat',
        timeRange: '13:00-15:00',
        element: 'Earth',
        yinYang: 'yin',
        organ: 'Small Intestine',
        description: 'The Goat grazes peacefully. Small intestine sorts pure from impure.',
        activity: 'Digest and absorb, gentle activities',
      },
      shen: {
        chinese: '申',
        pinyin: 'shēn',
        animal: 'Monkey',
        timeRange: '15:00-17:00',
        element: 'Metal',
        yinYang: 'yang',
        organ: 'Bladder',
        description: 'The Monkey is most alert now. Bladder stores and releases fluids.',
        activity: 'Peak efficiency, exercise, study retention',
      },
      you: {
        chinese: '酉',
        pinyin: 'yǒu',
        animal: 'Rooster',
        timeRange: '17:00-19:00',
        element: 'Metal',
        yinYang: 'yin',
        organ: 'Kidneys',
        description: 'The Rooster calls day\'s end. Kidneys store vital essence.',
        activity: 'Light dinner, complete work, socializing',
      },
      xu: {
        chinese: '戌',
        pinyin: 'xū',
        animal: 'Dog',
        timeRange: '19:00-21:00',
        element: 'Earth',
        yinYang: 'yang',
        organ: 'Pericardium',
        description: 'The Dog guards the home at dusk. Pericardium protects the heart.',
        activity: 'Relaxation, intimacy, emotional connection',
      },
      hai: {
        chinese: '亥',
        pinyin: 'hài',
        animal: 'Pig',
        timeRange: '21:00-23:00',
        element: 'Water',
        yinYang: 'yin',
        organ: 'Triple Burner',
        description: 'The Pig rests contentedly. Triple Burner balances all systems.',
        activity: 'Prepare for sleep, quiet reflection',
      },
    },
  },
  es: {
    labels: {
      currentHour: 'Hora Actual',
      timeRange: 'Rango Horario',
      element: 'Elemento',
      animal: 'Animal',
      organ: 'Meridiano',
      activity: 'Actividad Propicia',
      description: 'Descripción',
      shichen: 'Shichen',
      sovereignHexagram: 'Hexagrama Soberano',
    },
    branches: {
      zi: {
        chinese: '子',
        pinyin: 'zǐ',
        animal: 'Rata',
        timeRange: '23:00-01:00',
        element: 'Agua',
        yinYang: 'yang',
        organ: 'Vesícula Biliar',
        description: 'La Rata prospera en la quietud de medianoche. El Qi inicia su ciclo.',
        activity: 'Descanso profundo, trabajo onírico, meditación',
      },
      chou: {
        chinese: '丑',
        pinyin: 'chǒu',
        animal: 'Buey',
        timeRange: '01:00-03:00',
        element: 'Tierra',
        yinYang: 'yin',
        organ: 'Hígado',
        description: 'El Buey trabaja en la oscuridad. El hígado limpia y restaura la sangre.',
        activity: 'Sueño profundo, desintoxicación hepática',
      },
      yin: {
        chinese: '寅',
        pinyin: 'yín',
        animal: 'Tigre',
        timeRange: '03:00-05:00',
        element: 'Madera',
        yinYang: 'yang',
        organ: 'Pulmones',
        description: 'El Tigre despierta antes del alba. Los pulmones distribuyen el Qi.',
        activity: 'Respiración profunda, despertar temprano',
      },
      mao: {
        chinese: '卯',
        pinyin: 'mǎo',
        animal: 'Conejo',
        timeRange: '05:00-07:00',
        element: 'Madera',
        yinYang: 'yin',
        organ: 'Intestino Grueso',
        description: 'El Conejo emerge al alba. Tiempo de eliminación y limpieza.',
        activity: 'Despertar natural, evacuación, ejercicio suave',
      },
      chen: {
        chinese: '辰',
        pinyin: 'chén',
        animal: 'Dragón',
        timeRange: '07:00-09:00',
        element: 'Tierra',
        yinYang: 'yang',
        organ: 'Estómago',
        description: 'El Dragón trae energía matutina. El Qi del estómago está en su pico.',
        activity: 'Desayuno abundante, iniciar trabajo importante',
      },
      si: {
        chinese: '巳',
        pinyin: 'sì',
        animal: 'Serpiente',
        timeRange: '09:00-11:00',
        element: 'Fuego',
        yinYang: 'yin',
        organ: 'Bazo',
        description: 'La Serpiente se enrosca al sol. El bazo transforma alimento en energía.',
        activity: 'Trabajo mental, estudio, toma de decisiones',
      },
      wu: {
        chinese: '午',
        pinyin: 'wǔ',
        animal: 'Caballo',
        timeRange: '11:00-13:00',
        element: 'Fuego',
        yinYang: 'yang',
        organ: 'Corazón',
        description: 'El Caballo galopa en el pico del día. El Qi del corazón es máximo.',
        activity: 'Almuerzo ligero, breve descanso, socializar',
      },
      wei: {
        chinese: '未',
        pinyin: 'wèi',
        animal: 'Cabra',
        timeRange: '13:00-15:00',
        element: 'Tierra',
        yinYang: 'yin',
        organ: 'Intestino Delgado',
        description: 'La Cabra pasta tranquila. El intestino delgado separa lo puro.',
        activity: 'Digerir y absorber, actividades suaves',
      },
      shen: {
        chinese: '申',
        pinyin: 'shēn',
        animal: 'Mono',
        timeRange: '15:00-17:00',
        element: 'Metal',
        yinYang: 'yang',
        organ: 'Vejiga',
        description: 'El Mono está más alerta ahora. La vejiga almacena y libera fluidos.',
        activity: 'Máxima eficiencia, ejercicio, retención de estudio',
      },
      you: {
        chinese: '酉',
        pinyin: 'yǒu',
        animal: 'Gallo',
        timeRange: '17:00-19:00',
        element: 'Metal',
        yinYang: 'yin',
        organ: 'Riñones',
        description: 'El Gallo anuncia el fin del día. Los riñones guardan la esencia vital.',
        activity: 'Cena ligera, completar trabajo, socializar',
      },
      xu: {
        chinese: '戌',
        pinyin: 'xū',
        animal: 'Perro',
        timeRange: '19:00-21:00',
        element: 'Tierra',
        yinYang: 'yang',
        organ: 'Pericardio',
        description: 'El Perro guarda el hogar al anochecer. El pericardio protege el corazón.',
        activity: 'Relajación, intimidad, conexión emocional',
      },
      hai: {
        chinese: '亥',
        pinyin: 'hài',
        animal: 'Cerdo',
        timeRange: '21:00-23:00',
        element: 'Agua',
        yinYang: 'yin',
        organ: 'Triple Calentador',
        description: 'El Cerdo descansa contento. El Triple Calentador equilibra todos los sistemas.',
        activity: 'Prepararse para dormir, reflexión tranquila',
      },
    },
  },
};

export function getTranslation(lang: string) {
  return translations[lang] || translations.en;
}
