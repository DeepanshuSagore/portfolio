import { ArrowDown, Download } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../components/Button';
import { Annotation, CutLabel, Polaroid, RoughBox } from '../components/Material';
import { github } from '../data/github';
import { profile, projects } from '../data/content';
import { DUR, loadMotionEngine, prefersReducedMotion, resolveText, reveal } from '../lib/motion';
import type { Scope } from 'animejs';

/** Indore, to the same precision the rest of the readout carries. */
const COORDS = '22.7196°N 75.8577°E';

/** Indore local time - a real measured value, and the only figure on the page
 *  that changes while you read it. */
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

function IndexRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-2.5 first:border-t-0">
      <dt className="type-overline">{label}</dt>
      <dd className="type-mono-m text-right text-ink-soft">{children}</dd>
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
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
        reveal(engine, '.hero-stagger', {
          trigger: el,
          y: 18,
          each: 70,
          delay: 360,
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
      className="relative flex min-h-[100dvh] flex-col justify-center pt-32 pb-16 md:pt-36"
    >
      <div className="shell">
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)]">
          <div>
            <Annotation className="hero-stagger ml-1 text-base" tilt={-1}>
              my name is
            </Annotation>

            {/* The box is drawn around the name rather than the name being set
                inside a border: it is an annotation, so it overlaps the type
                slightly and sits at its own angle. */}
            {/* The size is set here rather than taken from display-xl. That
                step assumes the name owns the full measure; here it shares the
                row with a photograph, and at 11vw "Deepanshu" needs more width
                than the column has, so it broke inside the word. Sized so the
                only break is the space. Extra bottom padding clears the
                descender on the second line, which the rule otherwise cuts. */}
            <RoughBox accent={5} className="hero-stagger mt-1 px-4 pb-5 pt-2">
              <h1 ref={nameRef} className="type-display-xl text-[clamp(2.75rem,7.2vw,6.25rem)]">
                {profile.name}
              </h1>
            </RoughBox>

            <ul className="hero-stagger mt-7 flex flex-wrap items-center gap-2.5">
              <li>
                <CutLabel accent={1} tilt={-1}>
                  {profile.role}
                </CutLabel>
              </li>
              <li>
                <CutLabel accent={2} tilt={1}>
                  {profile.location}
                </CutLabel>
              </li>
              <li>
                <CutLabel accent={4} tilt={-1}>
                  <span aria-hidden="true" className="block size-1.5 rounded-full bg-a4-ink" />
                  Open to work
                </CutLabel>
              </li>
            </ul>

            <p className="hero-stagger type-display-m mt-9 max-w-[22ch] text-ink">
              {profile.tagline}
            </p>

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

          <div className="hero-stagger flex flex-col items-center gap-8 lg:items-end">
            <Polaroid
              src="/me/workspace.webp"
              alt="Two screens: a language model fine-tune reporting evaluation loss, and a notebook building a retrieval pipeline."
              caption="the actual desk"
              tilt={1}
              corners={['tl', 'br']}
              className="w-full max-w-[26rem] lg:max-w-none"
            />

            {/* The readout survives the redesign because it is the one place on
                the page carrying values rather than claims. It is an index card
                pinned beside the photograph now instead of an instrument
                panel. */}
            <div className="tilt w-full max-w-[26rem] border border-line bg-panel shadow-[var(--t-shadow)] lg:max-w-none">
              <div className="flex items-center justify-between gap-4 border-b border-line bg-canvas-2 px-4 py-2.5">
                <p className="type-overline">Readout</p>
                <p className="type-mono-s text-ink-faint">{COORDS}</p>
              </div>

              <dl>
                <IndexRow label="Local time">
                  <time>{time ?? '--:--:--'}</time> IST
                </IndexRow>
                <IndexRow label="Focus">Retrieval, evaluation</IndexRow>
                <IndexRow label="Last">Coding Specialist, Outlier</IndexRow>
                <IndexRow label="Shipped">
                  {projects.length} projects, {github.deployed} live
                </IndexRow>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue: a segment falling down a rule, which says "there is more
          below" without a bouncing arrow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-10 hidden justify-center md:flex"
      >
        <span className="relative block h-12 w-px overflow-hidden bg-line">
          <span className="scroll-cue-dot absolute inset-x-0 top-0 block h-3 bg-a5" />
        </span>
      </div>
    </section>
  );
}
