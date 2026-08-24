import { ArrowDown, Download } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../components/Button';
import { profile } from '../data/content';
import { DUR, drawLines, loadMotionEngine, prefersReducedMotion, resolveText, reveal } from '../lib/motion';
import type { Scope } from 'animejs';

const GRID_COLS = 7;
const GRID_ROWS = 4;

/** Indore local time — a real measured value, which is the only thing the
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

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const time = useLocalTime();

  useEffect(() => {
    const el = root.current;
    const name = nameRef.current;
    // Under reduced motion nothing here runs and the engine is never fetched —
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
        drawLines(engine, '.hero-line', { each: 34, duration: 900, delay: 60 });
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
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-28 pb-12"
    >
      {/* Ambient light — the single source of dimension on the canvas
          (DESIGN.md Section 7). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[42vw] w-[80vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[80px]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--color-signal-wash) 0%, var(--color-signal-feint) 45%, transparent 70%)',
        }}
      />

      {/* Hairline plot grid — drawn on, not faded in. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {Array.from({ length: GRID_COLS }, (_, i) => {
          const x = ((i + 1) / (GRID_COLS + 1)) * 100;
          return (
            <line
              key={`v${i}`}
              className="hero-line"
              x1={x}
              y1="0"
              x2={x}
              y2="100"
              stroke="var(--color-rule)"
              strokeWidth="0.1"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {Array.from({ length: GRID_ROWS }, (_, i) => {
          const y = ((i + 1) / (GRID_ROWS + 1)) * 100;
          return (
            <line
              key={`h${i}`}
              className="hero-line"
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="var(--color-rule)"
              strokeWidth="0.1"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      <div className="shell">
        <p className="hero-stagger type-overline flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{profile.role}</span>
          <span aria-hidden="true" className="text-text-3">
            /
          </span>
          <span>{profile.roleSecondary}</span>
          <span aria-hidden="true" className="text-text-3">
            /
          </span>
          <span>{profile.location}</span>
        </p>

        {/* Ultra-wide container so the name flows horizontally and never
            stacks into a text wall (max 2 lines at every breakpoint). */}
        <h1 ref={nameRef} className="type-display-xl mt-6 w-full max-w-[16ch]">
          {profile.name}
        </h1>

        <p className="hero-stagger type-body-l mt-8 max-w-[54ch] text-text-2">{profile.intro}</p>

        <div className="hero-stagger mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href="#work" variant="signal" icon={<ArrowDown aria-hidden="true" className="size-4" />}>
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

      {/* Instrument readout — the strip that makes the page read as a panel. */}
      <div className="shell hero-stagger mt-16 md:mt-24">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-rule pt-5 md:grid-cols-4 md:gap-y-0">
          <div>
            <dt className="type-overline">Status</dt>
            <dd className="type-mono-m mt-2 flex items-center gap-2 text-live">
              <span aria-hidden="true" className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-live" />
              </span>
              Open to work
            </dd>
          </div>
          <div>
            <dt className="type-overline">Local time</dt>
            <dd className="type-mono-m mt-2 text-text-2">
              <time>{time ?? '--:--:--'}</time> IST
            </dd>
          </div>
          <div>
            <dt className="type-overline">Focus</dt>
            <dd className="type-mono-m mt-2 text-text-2">GenAI / Analytics</dd>
          </div>
          <div>
            <dt className="type-overline">Latest</dt>
            <dd className="type-mono-m mt-2 text-text-2">LLM post-training</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
