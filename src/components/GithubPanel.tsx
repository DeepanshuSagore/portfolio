import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { github } from '../data/github';
import { countUp, drawBars, useAnimeScope } from '../lib/motion';

/** `2024-10-20` → `Oct 2024`. Parsed as UTC so it cannot slip a day westward. */
function month(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Segment fills, largest share first.
 *
 * The system allows exactly one chromatic value in interface chrome, and
 * DESIGN.md Section 2 licenses it for "measured values". A language share is a
 * measured value, so the dominant one carries the signal and everything behind
 * it steps down the warm ramp. The bar is therefore readable as a ranking even
 * in greyscale, and it introduces no colour the rest of the page does not have.
 */
const FILLS = ['bg-signal-2', 'bg-text-2', 'bg-text-4', 'bg-ink-5', 'bg-ink-4'];

const fillFor = (i: number) => FILLS[i] ?? 'bg-ink-4';

/**
 * The evidence panel that closes the work register.
 *
 * Every number here is read from the GitHub REST API by `npm run data:github`
 * and committed as `src/data/github.ts`. It is not fetched at runtime - that
 * would put a third-party request on the critical path of a page whose whole
 * performance argument is that it has none, and would blank the panel the
 * moment an anonymous client hit GitHub's 60-per-hour limit. It is not fetched
 * at build time either, because then every deploy would depend on GitHub being
 * up and would silently ship different numbers.
 *
 * So it is a measured value with the date it was measured printed beside it,
 * which is the honest form. The page never claims to be live.
 */
export function GithubPanel() {
  const [hovered, setHovered] = useState<string | null>(null);

  const root = useAnimeScope<HTMLDivElement>((self, engine) => {
    const el = self.root as HTMLElement;
    el.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
      countUp(engine, node, Number(node.dataset.count));
    });

    const bars = [...el.querySelectorAll<HTMLElement>('[data-bar]')];
    if (bars.length) drawBars(engine, bars, { each: 80, duration: 820 });
  });

  const metrics = [
    { value: github.repos, label: 'Repos with code' },
    { value: github.deployed, label: 'Live deployments' },
    { value: github.publicRepos, label: 'Public repos' },
  ];

  return (
    <div ref={root} className="mt-20 md:mt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule pt-5">
        <p className="type-overline">Measured on GitHub</p>
        <a
          href={github.url}
          target="_blank"
          rel="noreferrer noopener"
          className="type-mono-s link-wipe inline-flex items-center gap-1.5 text-text-3 transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:text-signal-1"
        >
          github.com/{github.handle}
          <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
        </a>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-y-8 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dd className="type-display-m tabular-nums text-text-1">
              <span data-count={metric.value}>{metric.value}</span>
            </dd>
            <dt className="type-overline mt-3">{metric.label}</dt>
          </div>
        ))}
        <div>
          <dd className="type-display-m text-text-1">{month(github.firstCommit)}</dd>
          <dt className="type-overline mt-3">First commit</dt>
        </div>
      </dl>

      {/* Stacked share of every byte written across the authored repos.
          Segments are sized by flex-grow and animated with scaleX, so the
          track is laid out once and the fill is the only thing that moves. */}
      <div className="mt-12">
        <div className="flex h-2.5 w-full gap-px overflow-hidden">
          {github.languages.map((language, i) => (
            <span
              key={language.name}
              data-bar
              onPointerEnter={() => setHovered(language.name)}
              onPointerLeave={() => setHovered(null)}
              style={{ flexGrow: language.share, transformOrigin: 'left' }}
              className={`block h-full origin-left transition-opacity duration-[var(--dur-standard)] ease-[var(--ease-signal)] ${fillFor(i)} ${
                hovered && hovered !== language.name ? 'opacity-30' : 'opacity-100'
              }`}
            />
          ))}
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2.5">
          {github.languages.map((language, i) => (
            <li key={language.name}>
              <button
                type="button"
                onPointerEnter={() => setHovered(language.name)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(language.name)}
                onBlur={() => setHovered(null)}
                className="type-mono-s flex items-center gap-2.5 transition-opacity duration-[var(--dur-standard)] ease-[var(--ease-signal)]"
                style={{ opacity: hovered && hovered !== language.name ? 0.4 : 1 }}
              >
                <span aria-hidden="true" className={`block size-2 shrink-0 ${fillFor(i)}`} />
                <span className="text-text-2">{language.name}</span>
                <span className="tabular-nums text-text-3">{language.share}%</span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-7 max-w-[76ch] text-sm text-text-3">
          Share of bytes across {github.repos} authored repositories, read from the GitHub API on{' '}
          {github.measuredOn} and committed with the site. Forks and empty repositories are
          excluded, so these are not the same as the {github.publicRepos} public repos GitHub
          counts.
        </p>
      </div>
    </div>
  );
}
