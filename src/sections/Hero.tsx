import { ArrowDown, Download } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../components/Button';
import { GridPattern } from '../components/GridPattern';
import { github } from '../data/github';
import { profile, projects } from '../data/content';
import {
  DUR,
  drawLines,
  loadMotionEngine,
  prefersReducedMotion,
  resolveText,
  reveal,
  useSpotlight,
} from '../lib/motion';
import type { Scope } from 'animejs';

/** Indore, to the same precision the rest of the readout carries. */
const COORDS = '22.7196°N 75.8577°E';

/** Indore local time - a real measured value, which is the only thing the
 *  signal colour is allowed to mark. */
function useLocalTime() {
  // Starts null so the prerendered HTML and the first client render agree;
  // a real clock in the initial render would be a guaranteed hydration
  // mismatch, since the two are produced at different instants.
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(formatIST());
    const id = setInterval(() => setTime(formatIST()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatIST() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

/**
 * Printer's registration marks at the four corners of the content column.
 *
 * Cheap, and it does real work: it declares where the measure begins and ends,
 * which is what makes the rest of the page read as set on a plate rather than
 * floated in the middle of a viewport.
 */
function CropMarks() {
  const corners = [
    'left-[var(--shell-inset)] top-28 -translate-x-1/2 -translate-y-1/2',
    'right-[var(--shell-inset)] top-28 translate-x-1/2 -translate-y-1/2',
    'left-[var(--shell-inset)] bottom-14 -translate-x-1/2 translate-y-1/2',
    'right-[var(--shell-inset)] bottom-14 translate-x-1/2 translate-y-1/2',
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
      {corners.map((position) => (
        <span key={position} className={`type-mono-s absolute leading-none text-text-4 ${position}`}>
          +
        </span>
      ))}
    </div>
  );
}

function ReadoutRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-rule-subtle px-5 py-3.5 first:border-t-0">
      <dt className="type-overline">{label}</dt>
      <dd className="type-mono-m text-right text-text-2">{children}</dd>
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useSpotlight<HTMLDivElement>();
  const time = useLocalTime();

  useEffect(() => {
    const el = root.current;
    const name = nameRef.current;
    // Under reduced motion nothing here runs and the engine is never fetched -
    // the hero is already fully rendered and legible without it.
    if (!el || !name || prefersReducedMotion()) return;

    const cleanups: Array<() => void> = [];
    let scope: Scope | null = null;
    let cancelled = false;

    // Fonts must be resolved before splitting, or the per-character boxes are
    // measured against the fallback face and jump when the real one swaps in.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    void Promise.all([fontsReady, loadMotionEngine()]).then(([, engine]) => {
      if (cancelled || !root.current) return;
      scope = engine.createScope({ root: el }).add(() => {
        cleanups.push(resolveText(engine, name, { delay: 120 }));
        drawLines(engine, '.hero-line', { each: 110, duration: 1100, delay: 60 });
        reveal(engine, '.hero-stagger', {
          trigger: el,
          y: 18,
          each: 70,
          delay: 420,
          duration: DUR.emphasis,
        });
      });
    });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      scope?.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-28 pb-14"
    >
      {/* Ambient light - the single source of dimension on the canvas
          (DESIGN.md Section 7). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[38%] top-[42%] -z-20 h-[46vw] w-[76vw] max-w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-[90px]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--color-signal-wash) 0%, var(--color-signal-feint) 45%, transparent 70%)',
        }}
      />

      {/* Plot field. Two layers, and the pairing is the point: a fine static
          grid gives the canvas a measure, and a handful of lit cells turns it
          from decoration into something that reads as plotted. Masked at the
          edges so it dissolves rather than stopping at a hard line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 text-rule opacity-60 [mask-image:radial-gradient(95%_70%_at_60%_38%,#000_0%,transparent_72%)]"
      >
        <GridPattern
          size={64}
          squares={[
            [15, 1],
            [18, 4],
            [12, 7],
            [20, 8],
          ]}
          squareClassName="text-signal-wash"
        />
      </div>

      {/* Registration frame. These rules bound the same box the crop marks sit
          on, so the four `+` glyphs land exactly on its corners and the two
          read as one plate rather than as decoration that happens to share a
          section.

          This is the signature moment from DESIGN.md Section 6, and it is why
          it is worth keeping: the frame arrives by being DRAWN, edge by edge,
          so the first thing the page does is state its own measure. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-28 bottom-14 left-[var(--shell-inset)] right-[var(--shell-inset)] -z-10 hidden overflow-visible md:block"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {[
          { key: 'top', d: 'M0 0 H100' },
          { key: 'bottom', d: 'M0 100 H100' },
          { key: 'split', d: 'M60.3 0 V100' },
        ].map(({ key, d }) => (
          <path
            key={key}
            className="hero-line"
            d={d}
            fill="none"
            stroke="var(--color-rule)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <CropMarks />

      <div className="shell">
        <p className="hero-stagger type-overline flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{profile.role}</span>
          <span aria-hidden="true" className="text-text-4">
            /
          </span>
          <span>{profile.roleSecondary}</span>
          <span aria-hidden="true" className="text-text-4">
            /
          </span>
          <span>{profile.location}</span>
        </p>

        {/* Ultra-wide container so the name flows horizontally and never
            stacks into a text wall (max 2 lines at every breakpoint). */}
        <h1 ref={nameRef} className="type-display-xl mt-6 w-full max-w-[16ch]">
          {profile.name}
        </h1>

        {/* The intro and the readout share one row. Before, the readout was a
            four-across strip pinned to the bottom of the section and the whole
            right half of the fold was empty; putting the panel beside the
            paragraph closes that void and lets the two halves brace each
            other, which is what a spec sheet actually looks like. */}
        <div className="mt-10 grid gap-x-12 gap-y-10 md:mt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.78fr)]">
          <div>
            <p className="hero-stagger type-body-l max-w-[52ch] text-text-2">{profile.intro}</p>

            <div className="hero-stagger mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink
                href="#work"
                variant="signal"
                icon={<ArrowDown aria-hidden="true" className="size-4" />}
              >
                View work
              </ButtonLink>
              <ButtonLink
                href={profile.resume}
                variant="outline"
                download
                icon={<Download aria-hidden="true" className="size-4" />}
              >
                Résumé
              </ButtonLink>
            </div>
          </div>

          {/* Instrument readout - the panel that makes the page read as a
              measuring surface rather than a landing page. */}
          <div ref={panelRef} className="hero-stagger spot border border-rule bg-ink-2/70 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 border-b border-rule bg-ink-3/60 px-5 py-3">
              <p className="type-overline">Readout</p>
              <p className="type-mono-s text-text-4">{COORDS}</p>
            </div>

            <dl>
              <ReadoutRow label="Status">
                <span className="inline-flex items-center gap-2 text-live">
                  <span aria-hidden="true" className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-live" />
                  </span>
                  Open to work
                </span>
              </ReadoutRow>
              <ReadoutRow label="Local time">
                <time>{time ?? '--:--:--'}</time> IST
              </ReadoutRow>
              <ReadoutRow label="Focus">GenAI / Analytics</ReadoutRow>
              <ReadoutRow label="Now">LLM post-training, Ethara.ai</ReadoutRow>
              <ReadoutRow label="Shipped">
                {projects.length} projects, {github.deployed} live
              </ReadoutRow>
            </dl>
          </div>
        </div>
      </div>

      {/* Scroll cue: a segment falling down a rule, which says "there is more
          below" without a bouncing arrow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-24 hidden justify-center md:flex"
      >
        <span className="relative block h-12 w-px overflow-hidden bg-rule">
          <span className="scroll-cue-dot absolute inset-x-0 top-0 block h-3 bg-signal-2" />
        </span>
      </div>
    </section>
  );
}
