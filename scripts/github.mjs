/**
 * Regenerates `src/data/github.ts` from the live GitHub REST API.
 *
 * This runs by hand (`npm run data:github`) and commits its output. It is
 * deliberately NOT part of `npm run build` and deliberately NOT a runtime
 * fetch:
 *
 *  - A runtime fetch would put a third-party request on the critical path of a
 *    page whose entire performance story is that it has none, and would make
 *    the numbers disappear the moment GitHub rate-limits an anonymous client
 *    (60 requests/hour, shared per IP).
 *  - A build-time fetch would make every deploy depend on api.github.com being
 *    up, and would silently ship different numbers on every rebuild.
 *
 * So the numbers are a committed artefact with the date they were taken
 * printed next to them on the page. That is the honest version: a measured
 * value with its timestamp, not a live counter that is really a cache.
 *
 * Unauthenticated by default. Set GITHUB_TOKEN to raise the rate limit.
 */
import { writeFileSync } from 'node:fs';

const USER = 'DeepanshuSagore';
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': `${USER}-portfolio-build`,
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function api(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`github: ${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
}

const user = await api(`https://api.github.com/users/${USER}`);
const repos = await api(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`);

/* Forks are somebody else's code. They count towards the public repo total
   GitHub shows, and they must not count towards anything this page claims. */
const authored = repos.filter((repo) => !repo.fork);

/* An empty repo is a reserved name, not a project. Counting them would inflate
   every figure below by four. */
const withCode = authored.filter((repo) => repo.size > 0);

const deployed = withCode.filter((repo) => Boolean(repo.homepage));

const bytes = new Map();
for (const repo of withCode) {
  const languages = await api(repo.languages_url);
  for (const [name, count] of Object.entries(languages)) {
    bytes.set(name, (bytes.get(name) ?? 0) + count);
  }
}

const total = [...bytes.values()].reduce((sum, n) => sum + n, 0);

/* Anything under 1% is noise on a stacked bar - it renders as a sliver too
   thin to read and too thin to hover. They are summed into one honest
   "Other" segment rather than dropped, so the bar still totals 100%. */
const ranked = [...bytes.entries()].sort((a, b) => b[1] - a[1]);
const major = ranked.filter(([, n]) => n / total >= 0.01);
const minor = total - major.reduce((sum, [, n]) => sum + n, 0);

const languages = [
  ...major.map(([name, n]) => ({ name, share: +((100 * n) / total).toFixed(1) })),
  ...(minor > 0 ? [{ name: 'Other', share: +((100 * minor) / total).toFixed(1) }] : []),
];

const lastPush = withCode
  .map((repo) => repo.pushed_at)
  .sort()
  .at(-1);

const file = `/**
 * GENERATED FILE - do not edit by hand.
 * Regenerate with \`npm run data:github\`. See scripts/github.mjs for why this
 * is a committed artefact rather than a runtime or build-time fetch.
 */

export const github = {
  handle: ${JSON.stringify(USER)},
  url: ${JSON.stringify(user.html_url)},
  /** Everything GitHub counts as public, forks included. */
  publicRepos: ${user.public_repos},
  /** Public repos this account actually wrote. */
  authoredRepos: ${authored.length},
  /** Authored repos that contain code, i.e. excluding reserved empty names. */
  repos: ${withCode.length},
  /** Repos carrying a homepage URL, which for this account means a deployment. */
  deployed: ${deployed.length},
  firstCommit: ${JSON.stringify(user.created_at.slice(0, 10))},
  lastPush: ${JSON.stringify(lastPush.slice(0, 10))},
  measuredOn: ${JSON.stringify(new Date().toISOString().slice(0, 10))},
  /** Share of bytes written across every authored repo, largest first. */
  languages: ${JSON.stringify(languages, null, 2).replace(/\n/g, '\n  ')},
} as const;

export type Language = (typeof github.languages)[number];
`;

writeFileSync(new URL('../src/data/github.ts', import.meta.url), file);
console.log(
  `github: ${withCode.length} repos, ${deployed.length} deployed, ${languages.length} languages`,
);
