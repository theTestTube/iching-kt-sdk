/**
 * Source guard for #422 (part of #402): no knowlet view draws a colour literal
 * over an active ground.
 *
 * An ink comes from the ground it is drawn on: the palette's `activeInk` or
 * `inkOn(ground)` (see `themeInk.test.ts`, which holds every declared pair to
 * 4.5:1 in both themes). That guard cannot see a view that bypasses the
 * palette, so this one reads the listed views and fails on a hard-coded
 * white/black/near-black or a scheme-branching hex.
 */
import * as fs from 'fs';
import * as path from 'path';

const PACKAGES = path.resolve(__dirname, '../../..');

const VIEWS = [
  'square/src/views/LoShuView.tsx',
  'square/src/views/HeTuView.tsx',
  'square/src/views/BranchesCircleView.tsx',
  'square/src/views/HexagramMatrixView.tsx',
  'square/src/cards/LoShuCardView.tsx',
  'square/src/cards/HeTuCardView.tsx',
  'compass/src/views/CompassView.tsx',
  'elements/src/ElementsView.tsx',
  'elements/src/ElementsCardView.tsx',
  'yinyang/src/YinYangView.tsx',
  'yinyang/src/YinYangCardView.tsx',
  'core/src/HexagramLineValues.tsx',
  'core/src/ActionableElement.tsx',
];

function code(file: string): string {
  return fs
    .readFileSync(path.join(PACKAGES, file), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

/**
 * Lines that keep colour literals outside an active ground, left as they are
 * (non-goal of #422): the matrix's sovereign cell and legend, which sit on the
 * legend surface or an inactive cell. Matched by exact trimmed text and removed
 * before the rules run, so every other line of the file is held to them.
 */
const ALLOWED_LINES: Record<string, string[]> = {
  'square/src/views/HexagramMatrixView.tsx': [
    "borderColor: context.colorScheme === 'dark' ? '#64b5f6' : '#1a73e8',",
    "backgroundColor: context.colorScheme === 'dark' ? colors.surface : '#e8f0fe',",
    "backgroundColor: context.colorScheme === 'dark' ? '#5dade2' : '#1a1a2e',",
  ],
};
/** ActionableElement still draws its shine and indicator overlays as rgba. */
const OVERLAYS = 'core/src/ActionableElement.tsx';

/** White, black or near-black in any hex spelling and any quote style, or a named white/black. */
const BAD_HEX = /['"`]#(?:fff|ffffff|000|000000|1a1a1a)(?:ff)?['"`]|['"`](?:white|black)['"`]/gi;
/** Any hex, named white/black or rgb(a) colour literal. */
const ANY_LITERAL = /['"`]#[0-9a-f]{3,8}['"`]|['"`](?:white|black)['"`]|rgba?\(/gi;
/** A branch on the colour scheme, however it is spelled. */
const SCHEME_BRANCH = /\bisDark\b|\bisLight\b|\bcolorScheme\b\s*[!=]==?|\bscheme\b\s*[!=]==?/g;

function checked(file: string): string {
  const allowed = ALLOWED_LINES[file] ?? [];
  return code(file)
    .split('\n')
    .filter((line) => !allowed.includes(line.trim()))
    .join('\n');
}

describe('no colour literal over an active ground', () => {
  it.each(VIEWS)('%s', (file) => {
    const src = checked(file);
    expect(src.match(BAD_HEX) ?? []).toEqual([]);
    if (file !== OVERLAYS) {
      expect(src.match(ANY_LITERAL) ?? []).toEqual([]);
      expect(src.match(SCHEME_BRANCH) ?? []).toEqual([]);
    }
  });

  it('the rules catch the spellings they exist for', () => {
    expect("color: x ? \"#FFF\" : c".match(BAD_HEX)).toHaveLength(1);
    expect("c = isDark ? '#e0e0e0' : '#333333'".match(SCHEME_BRANCH)).toHaveLength(1);
    expect("c = scheme !== 'light' ? a : b".match(SCHEME_BRANCH)).toHaveLength(1);
    expect("color: 'rgba(255,255,255,0.85)'".match(ANY_LITERAL)).toHaveLength(1);
    expect("color: isActive ? 'white' : c".match(BAD_HEX)).toHaveLength(1);
    expect('color: isActive ? "Black" : c'.match(BAD_HEX)).toHaveLength(1);
  });

  it('ActionableElement holds no copy of the palette hex values', () => {
    const src = code('core/src/ActionableElement.tsx');
    expect(src.match(/activeColor:\s*['"]#/g) ?? []).toEqual([]);
    expect(src.match(/defaultColor:\s*['"]#/g) ?? []).toEqual([]);
  });
});
