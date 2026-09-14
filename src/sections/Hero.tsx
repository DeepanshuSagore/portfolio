import { Download } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ButtonLink } from '../components/Button';
import {
  Annotation,
  Arrow,
  AvatarRing,
  CutLabel,
  HandCurve,
  Pill,
  RoughBox,
  Squiggle,
} from '../components/Material';
import { profile } from '../data/content';
import { DUR, loadMotionEngine, prefersReducedMotion, resolveText, reveal } from '../lib/motion';
import type { Scope } from 'animejs';

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

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
        {/* Centred, the way the references build it: the two pills sit either
            side of the kicker, the name is boxed underneath, and the flags
            pinned below it read left to right as role, availability, place. */}
        <div className="flex flex-col items-center text-center">
          <span className="hero-stagger flex flex-col items-center">
            <Annotation className="whitespace-nowrap text-base" tilt={0}>
              my name is
            </Annotation>
            <Squiggle className="-mt-1" />
          </span>

          {/* The pills hang off the box's own corners rather than off the
              container's, which is what keeps them reading as stuck to the
              name instead of parked at the edges of the page. They need the
              box's width to do that, so they are positioned against it. */}
          <div className="hero-stagger relative mx-auto mt-2 w-fit max-w-full">
            <Pill accent={4} tilt={-2} className="absolute left-0 top-0 z-10 hidden -translate-x-[62%] -translate-y-[135%] lg:block">
              Made things
            </Pill>
            <Pill accent={1} tilt={2} className="absolute right-0 top-0 z-10 hidden translate-x-[62%] -translate-y-[135%] lg:block">
              Broke models
            </Pill>

            <RoughBox accent={5} className="px-5 pb-6 pt-3">
              <h1
                ref={nameRef}
                className="font-name text-[clamp(1.9rem,6.6vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.01em] text-ink"
              >
                {profile.name}
              </h1>
            </RoughBox>
          </div>

          {/* Each flag points back at the box it belongs to, the way the
              references tie theirs on. The arrows are decoration and go at the
              breakpoint where the flags stop sitting under the box. */}
          <ul className="hero-stagger mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5">
            <li className="flex items-end gap-1">
              <CutLabel accent={1} tilt={-1} hand>
                {profile.role}
              </CutLabel>
              <Arrow className="mb-1 hidden sm:block" />
            </li>
            <li className="type-mono-s inline-flex items-center gap-2 uppercase text-ink-soft">
              <span aria-hidden="true" className="block size-2 rounded-full bg-a2" />
              Open to new work and good problems
            </li>
            <li className="flex items-end gap-1">
              <Arrow flip className="mb-1 hidden sm:block" />
              <CutLabel accent={2} tilt={1} hand>
                {profile.location}
              </CutLabel>
            </li>
          </ul>

          {/* The prints flank the statement rather than the name, which is what
              keeps the widest element on the page from being decoration. */}
          <div className="hero-stagger mt-12 flex w-full items-center justify-center gap-6 md:gap-12">
            <AvatarRing src="/me/portrait.webp" accent={5} tilt={-1} className="hidden shrink-0 sm:block" />

            <p className="type-display-m max-w-[20ch] text-balance text-ink md:max-w-[24ch]">
              {profile.tagline}
            </p>

            <AvatarRing src="/me/offhours.webp" accent={5} tilt={1} className="hidden shrink-0 sm:block" />
          </div>

          {/* One button. The references give the hero a single filled call to
              action, and the résumé stays reachable as a written aside rather
              than as a second thing competing with it. */}
          <div className="hero-stagger mt-10 flex flex-col items-center gap-3">
            <ButtonLink href="#contact" variant="solid">
              Contact me
            </ButtonLink>

            <a
              href={profile.resume}
              download
              className="type-hand inline-flex items-center gap-1.5 text-[0.95rem] text-ink-faint underline-offset-4 transition-colors duration-[var(--dur-micro)] hover:text-ink hover:underline"
            >
              or take the résumé
              <Download aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="hero-stagger mt-20 w-full">
        <HandCurve />
      </div>

    </section>
  );
}
