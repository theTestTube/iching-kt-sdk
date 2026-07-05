/**
 * Hexagram reductions — tendency (yin/yang polarity) and trigram extraction.
 *
 * Doctrine: team-knowledge decision 2026-07-04 "hexagram tendency (yin/yang
 * polarity reduction)" — dominant polarity by line count, lower (inner)
 * trigram Shuogua gender as the 3-3 tie-break. Main hexagram only: 9 stays
 * yang, 6 stays yin (no changing-line transformation).
 *
 * Lines arrays are bottom→top (index 0 = line 1).
 */

import {
  getTendency,
  getLowerTrigram,
  getUpperTrigram,
  getTendencyExplanation,
  tendencyCaveat,
} from '../reductions';
import type { CastLineValue, CastLines } from '../reductions';

describe('getTendency — dominant polarity by line count', () => {
  it('reduces 1 乾 (six yang lines) to yang by majority', () => {
    const result = getTendency([7, 7, 7, 7, 7, 7]);
    expect(result.tendency).toBe('yang');
    expect(result.rationale).toBe('majority');
    expect(result.yangCount).toBe(6);
  });

  it('reduces 2 坤 (six yin lines) to yin by majority', () => {
    const result = getTendency([8, 8, 8, 8, 8, 8]);
    expect(result.tendency).toBe('yin');
    expect(result.rationale).toBe('majority');
    expect(result.yangCount).toBe(0);
  });

  it('reduces 44 姤 (one yin below five yang) to yang — dominance, not 消息 momentum', () => {
    const result = getTendency([8, 7, 7, 7, 7, 7]);
    expect(result.tendency).toBe('yang');
    expect(result.rationale).toBe('majority');
  });

  it('reduces 24 復 (one yang below five yin) to yin', () => {
    const result = getTendency([7, 8, 8, 8, 8, 8]);
    expect(result.tendency).toBe('yin');
    expect(result.rationale).toBe('majority');
  });

  it('treats changing lines as their primary polarity (9 stays yang, 6 stays yin)', () => {
    // Same shape as 44 姤 but fully cast with changing lines
    const result = getTendency([6, 9, 9, 9, 9, 9]);
    expect(result.tendency).toBe('yang');
    expect(result.yangCount).toBe(5);
  });
});

describe('getTendency — 3-3 tie-break by lower trigram Shuogua gender', () => {
  it('reduces 11 泰 (Qian below, Kun above) to yang — the father decides', () => {
    const result = getTendency([7, 7, 7, 8, 8, 8]);
    expect(result.tendency).toBe('yang');
    expect(result.rationale).toBe('tie-lower-trigram');
    expect(result.lowerTrigram).toBe('heaven');
  });

  it('reduces 12 否 (Kun below, Qian above) to yin — the mother decides', () => {
    const result = getTendency([8, 8, 8, 7, 7, 7]);
    expect(result.tendency).toBe('yin');
    expect(result.rationale).toBe('tie-lower-trigram');
    expect(result.lowerTrigram).toBe('earth');
  });

  it('reduces 64 未濟 (Kan below — a son, one yang line) to yang', () => {
    const result = getTendency([8, 7, 8, 7, 8, 7]);
    expect(result.tendency).toBe('yang');
    expect(result.rationale).toBe('tie-lower-trigram');
    expect(result.lowerTrigram).toBe('water');
  });

  it('reduces 63 既濟 (Li below — a daughter, two yang lines) to yin', () => {
    const result = getTendency([7, 8, 7, 8, 7, 8]);
    expect(result.tendency).toBe('yin');
    expect(result.rationale).toBe('tie-lower-trigram');
    expect(result.lowerTrigram).toBe('fire');
  });

  it('never reports the tie rationale off the 3-3 split', () => {
    expect(getTendency([7, 7, 7, 7, 8, 8]).rationale).toBe('majority');
    expect(getTendency([8, 8, 7, 8, 8, 8]).rationale).toBe('majority');
  });
});

describe('getTendency — sovereign (消息) cycle sweep', () => {
  /** Sovereign lines, bottom→top: `count` lines of `grows` rising from the bottom. */
  const sovereignLines = (grows: CastLineValue, count: number, rest: CastLineValue): CastLines =>
    [...Array(6).keys()].map((i) => (i < count ? grows : rest)) as unknown as CastLines;

  it('flips to yang exactly at 11 泰 on the yang-waxing arm (24 → 19 → 11 → 34 → 43 → 1)', () => {
    const waxing = [24, 19, 11, 34, 43, 1].map((_, i) => getTendency(sovereignLines(7, i + 1, 8)));
    expect(waxing.map((r) => r.tendency)).toEqual(['yin', 'yin', 'yang', 'yang', 'yang', 'yang']);
  });

  it('flips to yin exactly at 12 否 on the yang-waning arm (44 → 33 → 12 → 20 → 23 → 2)', () => {
    const waning = [44, 33, 12, 20, 23, 2].map((_, i) => getTendency(sovereignLines(8, i + 1, 7)));
    expect(waning.map((r) => r.tendency)).toEqual(['yang', 'yang', 'yin', 'yin', 'yin', 'yin']);
  });
});

describe('trigram extraction from cast lines', () => {
  it('extracts 11 泰 as heaven below, earth above', () => {
    const lines: CastLines = [7, 7, 7, 8, 8, 8];
    expect(getLowerTrigram(lines)).toBe('heaven');
    expect(getUpperTrigram(lines)).toBe('earth');
  });

  it('extracts 64 未濟 as water below, fire above', () => {
    const lines: CastLines = [8, 7, 8, 7, 8, 7];
    expect(getLowerTrigram(lines)).toBe('water');
    expect(getUpperTrigram(lines)).toBe('fire');
  });

  it('reads changing lines by primary polarity (63 既濟 fully old-cast)', () => {
    const lines: CastLines = [9, 6, 9, 6, 9, 6];
    expect(getLowerTrigram(lines)).toBe('fire');
    expect(getUpperTrigram(lines)).toBe('water');
  });
});

describe('getTendencyExplanation — recorded sentences from decision 2026-07-04', () => {
  it('renders the majority sentence with count and line kind (en)', () => {
    const explained = getTendencyExplanation(getTendency([8, 7, 7, 7, 7, 7]), 'en');
    expect(explained).toBe(
      "Adopted yang because 5 of the main hexagram's 6 lines are solid (yang) — the dominant polarity.",
    );
  });

  it('counts the dominant polarity, not always yang (yin majority, es)', () => {
    const explained = getTendencyExplanation(getTendency([7, 8, 8, 8, 8, 8]), 'es');
    expect(explained).toBe(
      'Adopto yin porque 5 de las 6 lineas del hexagrama principal son partidas (yin) — la polaridad dominante.',
    );
  });

  it('renders the tie sentence naming the deciding lower trigram (en)', () => {
    const explained = getTendencyExplanation(getTendency([7, 7, 7, 8, 8, 8]), 'en');
    expect(explained).toBe(
      'Adopted yang because the 6 lines are evenly split, so the lower (inner) trigram qián decides.',
    );
  });

  it('renders the tie sentence in traditional Chinese with the trigram character', () => {
    const explained = getTendencyExplanation(getTendency([8, 8, 8, 7, 7, 7]), 'zh');
    expect(explained).toBe('採用陰，因六爻陰陽各半，故由下卦（內卦）坤定其極性。');
  });

  it('renders the majority sentence in traditional Chinese', () => {
    const explained = getTendencyExplanation(getTendency([8, 8, 8, 8, 8, 8]), 'zh');
    expect(explained).toBe('採用陰，因主卦六爻中有6爻為陰（虛線），屬多數之極性。');
  });

  it('falls back to English for unknown languages', () => {
    const explained = getTendencyExplanation(getTendency([7, 7, 7, 7, 7, 7]), 'fr');
    expect(explained).toContain('Adopted yang');
  });

  it('ships the doctrinal caveat in all three languages', () => {
    expect(tendencyCaveat.en).toContain('not the ruling line (卦主)');
    expect(tendencyCaveat.es).toContain('no la línea regente (卦主)');
    expect(tendencyCaveat.zh).toContain('非卦主');
  });
});
