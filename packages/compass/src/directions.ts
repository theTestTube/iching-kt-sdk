/** Later Heaven Bagua direction → trigram → hexagram mapping */
export interface DirectionInfo {
  /** Sector center bearing (degrees) */
  bearing: number;
  /** Trigram unicode character */
  trigram: string;
  /** Trigram ID used for emitOutput / navigation */
  trigramId: string;
  /** Cardinal / intercardinal label */
  direction: string;
  /** Five-element key */
  element: 'water' | 'wood' | 'fire' | 'earth' | 'metal';
  /** Self-paired hexagram number */
  hexagramNumber: number;
  /** Localized trigram names */
  names: { en: string; es: string; zh: string };
}

export const COMPASS_DIRECTIONS: DirectionInfo[] = [
  {
    bearing: 0,
    trigram: '☵',
    trigramId: 'water',
    direction: 'N',
    element: 'water',
    hexagramNumber: 29,
    names: { en: 'Kan', es: 'Kan', zh: '坎' },
  },
  {
    bearing: 45,
    trigram: '☶',
    trigramId: 'mountain',
    direction: 'NE',
    element: 'earth',
    hexagramNumber: 52,
    names: { en: 'Gen', es: 'Gen', zh: '艮' },
  },
  {
    bearing: 90,
    trigram: '☳',
    trigramId: 'thunder',
    direction: 'E',
    element: 'wood',
    hexagramNumber: 51,
    names: { en: 'Zhen', es: 'Zhen', zh: '震' },
  },
  {
    bearing: 135,
    trigram: '☴',
    trigramId: 'wind',
    direction: 'SE',
    element: 'wood',
    hexagramNumber: 57,
    names: { en: 'Xun', es: 'Xun', zh: '巽' },
  },
  {
    bearing: 180,
    trigram: '☲',
    trigramId: 'fire',
    direction: 'S',
    element: 'fire',
    hexagramNumber: 30,
    names: { en: 'Li', es: 'Li', zh: '離' },
  },
  {
    bearing: 225,
    trigram: '☷',
    trigramId: 'earth',
    direction: 'SW',
    element: 'earth',
    hexagramNumber: 2,
    names: { en: 'Kun', es: 'Kun', zh: '坤' },
  },
  {
    bearing: 270,
    trigram: '☱',
    trigramId: 'lake',
    direction: 'W',
    element: 'metal',
    hexagramNumber: 58,
    names: { en: 'Dui', es: 'Dui', zh: '兌' },
  },
  {
    bearing: 315,
    trigram: '☰',
    trigramId: 'heaven',
    direction: 'NW',
    element: 'metal',
    hexagramNumber: 1,
    names: { en: 'Qian', es: 'Qian', zh: '乾' },
  },
];

/**
 * Returns the DirectionInfo whose sector contains the given heading.
 * Each sector spans ±22.5° around its bearing.
 */
export function getDirectionForHeading(heading: number): DirectionInfo {
  // Normalize heading to 0–360
  const h = ((heading % 360) + 360) % 360;
  // Find nearest sector (each sector is 45° wide)
  let nearest = COMPASS_DIRECTIONS[0];
  let minDiff = 360;
  for (const dir of COMPASS_DIRECTIONS) {
    let diff = Math.abs(h - dir.bearing);
    if (diff > 180) diff = 360 - diff;
    if (diff < minDiff) {
      minDiff = diff;
      nearest = dir;
    }
  }
  return nearest;
}
