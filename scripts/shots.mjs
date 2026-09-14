/**
 * Captures a real screenshot of every project that has a live deployment.
 *
 * The repository shipped no project imagery at all, and the redesign presents
 * work as case studies rather than text rows. Rather than reach for stock, the
 * deployments are photographed: twelve of the fifteen projects are live, and a
 * screenshot of the running thing is the most honest visual a portfolio can
 * carry.
 *
 * Like `data:github`, the output is a COMMITTED ARTEFACT. Nothing here runs at
 * build time - a deploy that depended on thirteen third-party sites being up
 * would fail for reasons that have nothing to do with this repository.
 *
 * Requires `cwebp` on PATH (`brew install webp`), the same way `fonts:build`
 * requires `uv`. Playwright captures PNG and has no WebP encoder; converting
 * costs nothing here and roughly halves what a visitor downloads.
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SOURCE = 'src/data/content.ts';
const OUT_DIR = 'public/shots';

/* 1440 wide renders the desktop composition these sites were designed for, and
   is still 2x the ~720px slot the largest card gives an image. */
const VIEWPORT = { width: 1440, height: 900 };
const QUALITY = 76;

function readProjects() {
  const source = readFileSync(SOURCE, 'utf8');
  const start = source.indexOf('export const projects');
  const end = source.indexOf('export type Experience');
  if (start < 0 || end < 0) throw new Error(`${SOURCE}: could not locate the projects array`);

  return source
    .slice(start, end)
    .split(/\n  \{\n/)
    .slice(1)
    .map((block) => ({
      id: block.match(/id: '([^']+)'/)?.[1],
      title: block.match(/title: '([^']+)'/)?.[1],
      live: block.match(/live: '([^']+)'/)?.[1] ?? null,
    }))
    .filter((project) => project.id);
}

function toWebp(pngPath, webpPath) {
  execFileSync('cwebp', ['-quiet', '-q', String(QUALITY), pngPath, '-o', webpPath]);
}

const projects = readProjects();
const targets = projects.filter((project) => project.live);
if (!targets.length) throw new Error(`${SOURCE}: parsed ${projects.length} projects, none with a live URL`);

console.log(`${projects.length} projects, ${targets.length} with a live deployment\n`);

mkdirSync(OUT_DIR, { recursive: true });
const scratch = mkdtempSync(join(tmpdir(), 'shots-'));

const browser = await chromium.launch();
/* Reduced motion is what makes a capture reproducible: without it a landing
   page with an entrance animation photographs at whatever frame it happened to
   reach, and no two runs agree. */
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
  colorScheme: 'dark',
});

/**
 * A screenshot of a splash screen or a stack trace is worse than no screenshot,
 * and both are the right size and shape to pass unnoticed. The first pass here
 * caught a site mid-preloader at 64% and another rendering a database
 * connection error, so every capture is now read back before it is kept.
 */
function diagnose(text) {
  const head = text.slice(0, 300);
  if (/could not connect|database .*(issue|error)|application error|internal server error|failed to (load|fetch)|\b404\b|not found/i.test(text)) return 'error';
  if (/loading|preparing your experience|please wait|initialising|initializing/i.test(head)) return 'loading';
  if (text.replace(/\s+/g, ' ').trim().length < 120) return 'blank';
  return 'ok';
}

async function settle(page, url, extraMs) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  /* Plenty of these poll on an interval and never reach networkidle, so it is
     a best effort rather than a gate. */
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(extraMs);
  return (await page.evaluate(() => document.body.innerText)).trim();
}

const failed = [];
const suspect = [];

for (const project of targets) {
  const page = await context.newPage();
  try {
    let text = await settle(page, project.live, 4000);
    let verdict = diagnose(text);

    /* A preloader is the one failure worth waiting out rather than reporting. */
    if (verdict === 'loading' || verdict === 'blank') {
      await page.waitForTimeout(9000);
      text = (await page.evaluate(() => document.body.innerText)).trim();
      verdict = diagnose(text);
    }

    await page.addStyleTag({
      content: '*::-webkit-scrollbar{display:none!important}*{scrollbar-width:none!important}',
    });

    const png = join(scratch, `${project.id}.png`);
    await page.screenshot({ path: png, type: 'png' });
    const webp = join(OUT_DIR, `${project.id}.webp`);
    toWebp(png, webp);

    const size = `${(statSync(webp).size / 1024).toFixed(0)}KB`.padStart(6);
    if (verdict === 'ok') {
      console.log(`  ok      ${project.id.padEnd(20)}${size}`);
    } else {
      suspect.push({ id: project.id, verdict, live: project.live });
      console.log(`  ${verdict.toUpperCase().padEnd(8)}${project.id.padEnd(20)}${size}`);
    }
  } catch (error) {
    failed.push({ id: project.id, reason: error.message.split('\n')[0] });
    console.log(`  FAIL    ${project.id.padEnd(20)} ${error.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await context.close();
await browser.close();
rmSync(scratch, { recursive: true, force: true });

const written = readdirSync(OUT_DIR).filter((f) => f.endsWith('.webp'));
const bytes = written.reduce((sum, f) => sum + statSync(join(OUT_DIR, f)).size, 0);
console.log(`\n${written.length} shots, ${(bytes / 1024).toFixed(0)}KB total`);

/* A missing shot is a card that renders without an image, not a broken build,
   so neither a failure nor a rejection is thrown. */
if (failed.length) {
  console.log(`\n${failed.length} could not be captured:`);
  for (const { id, reason } of failed) console.log(`  ${id}: ${reason}`);
}

if (suspect.length) {
  console.log(`\n${suspect.length} captured something that is not the product:`);
  for (const { id, verdict, live } of suspect) console.log(`  ${id} (${verdict}): ${live}`);
  console.log('\nSet shot: null for these, or fix the deployment. A screenshot of');
  console.log('a stack trace is worse for a portfolio than no screenshot at all.');
}
