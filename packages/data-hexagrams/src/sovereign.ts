/**
 * The Twelve Sovereign Hexagrams (十二消息卦)
 *
 * These hexagrams represent the waxing and waning of yin-yang
 * throughout the 12 months of the year and 12 double-hours of the day.
 *
 * Source: Liu Yiming, The Taoist I Ching (Public Domain)
 */

import { EarthlyBranch } from '@iching-kt/provider-time';
import { SovereignHexagramMapping } from './types';

/**
 * Mapping of earthly branches to sovereign hexagrams
 *
 * Waxing phase (yang increasing): zi → si
 * Waning phase (yin increasing): wu → hai
 */
export const sovereignHexagrams: Record<EarthlyBranch, SovereignHexagramMapping> = {
  // Waxing phase - Yang returns and grows
  zi: { hexagramNumber: 24, yangLines: 1, phase: 'waxing' },   // Return - first yang
  chou: { hexagramNumber: 19, yangLines: 2, phase: 'waxing' }, // Approach - 2 yang
  yin: { hexagramNumber: 11, yangLines: 3, phase: 'waxing' },  // Peace - 3 yang
  mao: { hexagramNumber: 34, yangLines: 4, phase: 'waxing' },  // Great Power - 4 yang
  chen: { hexagramNumber: 43, yangLines: 5, phase: 'waxing' }, // Breakthrough - 5 yang
  si: { hexagramNumber: 1, yangLines: 6, phase: 'waxing' },    // Creative - full yang

  // Waning phase - Yin returns and grows
  wu: { hexagramNumber: 44, yangLines: 5, phase: 'waning' },   // Coming to Meet - first yin
  wei: { hexagramNumber: 33, yangLines: 4, phase: 'waning' },  // Retreat - 2 yin
  shen: { hexagramNumber: 12, yangLines: 3, phase: 'waning' }, // Standstill - 3 yin
  you: { hexagramNumber: 20, yangLines: 2, phase: 'waning' },  // Contemplation - 4 yin
  xu: { hexagramNumber: 23, yangLines: 1, phase: 'waning' },   // Splitting Apart - 5 yin
  hai: { hexagramNumber: 2, yangLines: 0, phase: 'waning' },   // Receptive - full yin
};

/**
 * Get the sovereign hexagram for a given earthly branch
 */
export function getSovereignHexagram(branch: EarthlyBranch): SovereignHexagramMapping {
  return sovereignHexagrams[branch];
}

/**
 * The sequence of sovereign hexagram numbers in order
 */
export const sovereignSequence = [24, 19, 11, 34, 43, 1, 44, 33, 12, 20, 23, 2] as const;

/**
 * Branch order for iteration
 */
export const branchOrder: EarthlyBranch[] = [
  'zi', 'chou', 'yin', 'mao', 'chen', 'si',
  'wu', 'wei', 'shen', 'you', 'xu', 'hai',
];
