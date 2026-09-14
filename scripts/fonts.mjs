/**
 * Subsets the display and handwriting faces, and writes them into src/assets.
 *
 * Fontsource ships full Latin coverage - roughly 400 glyphs, plus every
 * variation axis the family has. This site sets four words of display type per
 * section and a handful of handwritten annotations, so most of that payload is
 * downloaded and never drawn. Archivo alone is 88KB with the width axis intact.
 *
 * Two operations, both from fonttools:
 *
 *   instancer  pins an axis the design never varies, which drops its delta
 *              data entirely. Only applied where a face genuinely has an axis
 *              this site does not move.
 *   pyftsubset cuts the glyph set to the characters this site can actually
 *              render, keeping kerning, ligatures and contextual alternates.
 *
 * Output is committed, so a clone does not need uv to build. Requires uv
 * (`brew install uv`) only when regenerating.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'src/assets/fonts';

/* Printable ASCII, non-breaking space, the Latin-1 accented block (Résumé),
   en and em dash, curly quotes and the ellipsis. Everything this site's copy
   can contain, and nothing else. */
const UNICODES =
  'U+0020-007E,U+00A0,U+00C0-00FF,U+2013-2014,U+2018-2019,U+201C-201D,U+2026';

const FACES = [
  {
    out: 'archivo-display.woff2',
    src: 'node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2',
    /* Both axes survive: sketchbook sets the display condensed and brutalist
       sets it wide, so wdth is doing real work across the directions. */
    pin: null,
  },
  {
    out: 'shantell-hand.woff2',
    src: 'node_modules/@fontsource-variable/shantell-sans/files/shantell-sans-latin-wght-normal.woff2',
    pin: null,
  },
  {
    /* The name face. The references set it in a blocky pixel type, which is
       the single most recognisable thing about that hero. */
    out: 'pixel-name.woff2',
    src: 'node_modules/@fontsource-variable/pixelify-sans/files/pixelify-sans-latin-wght-normal.woff2',
    pin: null,
  },
  {
    out: 'instrument-display.woff2',
    src: 'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
    /* Static face, single weight. Nothing to pin. */
    pin: null,
  },
];

const uvx = (args) => execFileSync('uvx', ['--from', 'fonttools[woff]', ...args], { stdio: 'pipe' });

mkdirSync(OUT_DIR, { recursive: true });

for (const face of FACES) {
  const before = statSync(face.src).size;
  let input = face.src;

  if (face.pin) {
    input = `/tmp/${face.out}.pinned.ttf`;
    uvx(['fonttools', 'varLib.instancer', face.src, face.pin, '-o', input]);
  }

  const output = join(OUT_DIR, face.out);
  uvx([
    'pyftsubset',
    input,
    `--unicodes=${UNICODES}`,
    '--layout-features=kern,liga,calt',
    '--flavor=woff2',
    `--output-file=${output}`,
  ]);

  const after = statSync(output).size;
  const saved = (100 - (after / before) * 100).toFixed(0);
  console.log(
    `${face.out.padEnd(26)} ${(before / 1024).toFixed(1)}KB -> ${(after / 1024).toFixed(1)}KB  (-${saved}%)`,
  );
}
