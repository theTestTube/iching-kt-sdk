/**
 * Pure hexagram reductions computed from the six cast line values.
 *
 * Doctrine: team-knowledge decision 2026-07-04 "hexagram tendency (yin/yang
 * polarity reduction)" — dominant polarity by line count; at a 3-3 split the
 * lower (inner) trigram's classical Shuogua gender decides. Main hexagram
 * only: 9 stays yang and 6 stays yin (no changing-line transformation), and
 * lines are read directly from the cast values, never round-tripped through
 * a hexagram-number→binary table.
 */

import type { TrigramId } from './types';
import { getTrigram, getTrigramIdByBinary } from './trigrams';

/** A cast line value: 6 old yin, 7 young yang, 8 young yin, 9 old yang. */
export type CastLineValue = 6 | 7 | 8 | 9;

/** Six cast line values, bottom→top (index 0 = line 1). */
export type CastLines = readonly [
  CastLineValue,
  CastLineValue,
  CastLineValue,
  CastLineValue,
  CastLineValue,
  CastLineValue,
];

export type Polarity = 'yin' | 'yang';

/** Primary-hexagram polarity of a single cast line (no changing-line flip). */
export function linePolarity(value: CastLineValue): Polarity {
  return value === 7 || value === 9 ? 'yang' : 'yin';
}

export type TendencyRationale = 'majority' | 'tie-lower-trigram';

export interface HexagramTendency {
  tendency: Polarity;
  /** Yang lines among the six (0-6). */
  yangCount: number;
  /** Which rule decided: line-count majority, or the 3-3 tie-break. */
  rationale: TendencyRationale;
  /** Lower (inner) trigram — the tie-breaker, reported for explanations. */
  lowerTrigram: TrigramId;
}

function countYang(lines: readonly CastLineValue[]): number {
  return lines.filter((value) => linePolarity(value) === 'yang').length;
}

function trigramOf(lines: readonly CastLineValue[]): TrigramId {
  const binary = lines.map((value) => (linePolarity(value) === 'yang' ? '1' : '0')).join('');
  const id = getTrigramIdByBinary(binary);
  if (!id) throw new Error(`No trigram for binary ${binary}`);
  return id;
}

/** Lower (inner) trigram of a hexagram — lines 1-3. */
export function getLowerTrigram(lines: CastLines): TrigramId {
  return trigramOf(lines.slice(0, 3));
}

/** Upper (outer) trigram of a hexagram — lines 4-6. */
export function getUpperTrigram(lines: CastLines): TrigramId {
  return trigramOf(lines.slice(3, 6));
}

/** Reduce a main hexagram to its dominant yin/yang polarity. */
export function getTendency(lines: CastLines): HexagramTendency {
  const yangCount = countYang(lines);
  const lowerTrigram = getLowerTrigram(lines);

  if (yangCount !== 3) {
    return {
      tendency: yangCount >= 4 ? 'yang' : 'yin',
      yangCount,
      rationale: 'majority',
      lowerTrigram,
    };
  }

  // 3-3 split: the lower trigram's classical Shuogua gender decides.
  // Odd yang count (Qian or a son) → yang; even (Kun or a daughter) → yin.
  const lowerYang = countYang(lines.slice(0, 3));
  return {
    tendency: lowerYang % 2 === 1 ? 'yang' : 'yin',
    yangCount,
    rationale: 'tie-lower-trigram',
    lowerTrigram,
  };
}

/**
 * Sentence templates recorded in decision 2026-07-04. Placeholders:
 * {tendency} adopted polarity, {count} dominant-line count, {lines} the
 * dominant line kind, {trigram} the deciding lower trigram's name.
 */
export const tendencyExplanations: Record<TendencyRationale, Record<string, string>> = {
  majority: {
    en: "Adopted {tendency} because {count} of the main hexagram's 6 lines are {lines} — the dominant polarity.",
    es: 'Adopto {tendency} porque {count} de las 6 lineas del hexagrama principal son {lines} — la polaridad dominante.',
    zh: '採用{tendency}，因主卦六爻中有{count}爻為{lines}，屬多數之極性。',
  },
  'tie-lower-trigram': {
    en: 'Adopted {tendency} because the 6 lines are evenly split, so the lower (inner) trigram {trigram} decides.',
    es: 'Adopto {tendency} porque las 6 lineas estan igualadas, asi que decide el trigrama inferior (interior) {trigram}.',
    zh: '採用{tendency}，因六爻陰陽各半，故由下卦（內卦）{trigram}定其極性。',
  },
};

/**
 * Doctrinal caveat for settings/info surfaces, from decision 2026-07-04:
 * the tendency is a simplification, exact only for the twelve sovereign
 * hexagrams, and is not the ruling line (卦主).
 */
export const tendencyCaveat: Record<string, string> = {
  en: "Shows the hexagram's dominant polarity (more yin vs more yang lines) — a simplification, exact for the twelve sovereign hexagrams, and not the ruling line (卦主).",
  es: 'Muestra la polaridad dominante del hexagrama (más líneas yin o yang) — una simplificación, exacta para los doce hexagramas soberanos, no la línea regente (卦主).',
  zh: '顯示主卦之多數極性（陰爻多或陽爻多）——為簡化，僅對十二消息卦精確，非卦主。',
};

const POLARITY_WORDS: Record<string, Record<Polarity, string>> = {
  en: { yang: 'yang', yin: 'yin' },
  es: { yang: 'yang', yin: 'yin' },
  zh: { yang: '陽', yin: '陰' },
};

const LINE_KIND_WORDS: Record<string, Record<Polarity, string>> = {
  en: { yang: 'solid (yang)', yin: 'broken (yin)' },
  es: { yang: 'enteras (yang)', yin: 'partidas (yin)' },
  zh: { yang: '陽（實線）', yin: '陰（虛線）' },
};

/** Render the recorded explanation sentence for a tendency result. Falls back to English. */
export function getTendencyExplanation(result: HexagramTendency, language: string): string {
  const lang = language in tendencyExplanations[result.rationale] ? language : 'en';
  const dominantCount = result.tendency === 'yang' ? result.yangCount : 6 - result.yangCount;
  const trigram = getTrigram(result.lowerTrigram);
  const trigramName = lang === 'zh' ? trigram?.chinese : trigram?.pinyin;

  return tendencyExplanations[result.rationale][lang]
    .replace('{tendency}', POLARITY_WORDS[lang][result.tendency])
    .replace('{count}', String(dominantCount))
    .replace('{lines}', LINE_KIND_WORDS[lang][result.tendency])
    .replace('{trigram}', trigramName ?? result.lowerTrigram);
}
