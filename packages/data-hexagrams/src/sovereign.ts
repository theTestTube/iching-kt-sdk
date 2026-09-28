/**
 * The Twelve Sovereign Hexagrams (十二消息卦)
 *
 * These hexagrams represent the waxing and waning of yin-yang
 * throughout the 12 months of the year and 12 double-hours of the day.
 *
 * Source: the twelve sovereign ("waxing and waning") hexagrams 十二消息卦 of
 * Han-dynasty guaqi 卦氣 doctrine, associated with Meng Xi 孟喜 and Jing Fang
 * 京房 (1st century BCE). A structural correspondence, public domain.
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
  zi: { hexagramNumber: 24, yangLines: 1, phase: 'waxing' },   // 復 fù - first yang
  chou: { hexagramNumber: 19, yangLines: 2, phase: 'waxing' }, // 臨 lín - 2 yang
  yin: { hexagramNumber: 11, yangLines: 3, phase: 'waxing' },  // 泰 tài - 3 yang
  mao: { hexagramNumber: 34, yangLines: 4, phase: 'waxing' },  // 大壯 dà zhuàng - 4 yang
  chen: { hexagramNumber: 43, yangLines: 5, phase: 'waxing' }, // 夬 guài - 5 yang
  si: { hexagramNumber: 1, yangLines: 6, phase: 'waxing' },    // 乾 qián - full yang

  // Waning phase - Yin returns and grows
  wu: { hexagramNumber: 44, yangLines: 5, phase: 'waning' },   // 姤 gòu - first yin
  wei: { hexagramNumber: 33, yangLines: 4, phase: 'waning' },  // 遯 dùn - 2 yin
  shen: { hexagramNumber: 12, yangLines: 3, phase: 'waning' }, // 否 pǐ - 3 yin
  you: { hexagramNumber: 20, yangLines: 2, phase: 'waning' },  // 觀 guān - 4 yin
  xu: { hexagramNumber: 23, yangLines: 1, phase: 'waning' },   // 剝 bō - 5 yin
  hai: { hexagramNumber: 2, yangLines: 0, phase: 'waning' },   // 坤 kūn - full yin
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
