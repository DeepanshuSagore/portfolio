/**
 * Motion layer — anime.js v4.5.0.
 *
 * Signatures here are taken from the installed type definitions, not from
 * memory: `splitText(target, params)` is positional, `onScroll(params)` takes
 * `target` (singular) and is passed to `autoplay`, and
 * `svg.createDrawable(selector)` returns an array.
 *
 * Three invariants hold everywhere in this file:
 *
 *  1. The engine is loaded LAZILY. anime.js is 22.5KB gzipped and nothing it
 *     does is needed for first paint, so it must never sit on the critical
 *     path. `loadMotionEngine()` is the only entry point, and under reduced
 *     motion it is never called at all.
 *  2. Content is authored VISIBLE in markup and CSS. A reveal hides its
 *     targets in JS immediately before animating them in. If JS never runs, if
 *     the engine fails to load, or if reduced motion is on, the content is
 *     simply there — motion can never gate content.
 *  3. Every animation is created inside a `createScope({ root })` and torn
 *     down by `scope.revert()`. React 19 StrictMode double-mounts in dev, and
 *     this is the only cleanup path that reverts animations *and* the inline
 *     styles they wrote.
 */
import type { Scope } from 'animejs';
import { useEffect, useRef, type DependencyList, type RefObject } from 'react';

export type MotionEngine = typeof import('animejs');

let enginePromise: Promise<MotionEngine> | null = null;

export function loadMotionEngine(): Promise<MotionEngine> {
  enginePromise ??= import('animejs');
  return enginePromise;
}

/**
 * DESIGN.md Section 6 — Timing.
 *
 * anime.js v4.5 removed the `"cubicBezier(...)"` STRING form from the core: it
 * warns and falls back to the default ease, silently discarding the curve. The
 * curve must be built with the engine's own `cubicBezier`, and because the
 * engine is lazy this is a memoised factory rather than a plain constant.
 * Keep the control points in sync with `--ease-signal` in tokens.css.
 */
let signalEase: ReturnType<MotionEngine['cubicBezier']> | null = null;

export function easeSignal(engine: MotionEngine) {
  signalEase ??= engine.cubicBezier(0.16, 1, 0.3, 1);
  return signalEase;
}

export const DUR = {
  micro: 140,
  standard: 240,
  emphasis: 620,
  signature: 1400,
} as const;

/** DESIGN.md Section 6 — Stagger. */
export const STAGGER = {
  char: 14,
  row: 28,
  block: 60,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type ScopeSetup = (self: Scope, engine: MotionEngine) => void;

export function useAnimeScope<T extends HTMLElement = HTMLDivElement>(
  setup: ScopeSetup,
  deps: DependencyList = [],
): RefObject<T | null> {
  const root = useRef<T>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    let scope: Scope | null = null;
    let cancelled = false;

    void loadMotionEngine().then((engine) => {
      if (cancelled || !root.current) return;
      scope = engine.createScope({ root: el }).add((self) => {
        if (self) setupRef.current(self, engine);
      });
    });

    return () => {
      cancelled = true;
      scope?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return root;
}

type RevealOptions = {
  /** Element whose entry triggers the reveal. Defaults to the targets. */
  trigger?: HTMLElement | string | null;
  y?: number;
  each?: number;
  delay?: number;
  duration?: number;
};

export function reveal(
  engine: MotionEngine,
  targets: string | HTMLElement | HTMLElement[],
  options: RevealOptions = {},
) {
  if (prefersReducedMotion()) return;

  const { animate, stagger, onScroll, utils } = engine;
  const { trigger, y = 26, each = STAGGER.row, delay = 0, duration = DUR.emphasis } = options;

  utils.set(targets, { opacity: 0, translateY: y });

  animate(targets, {
    opacity: 1,
    translateY: 0,
    duration,
    ease: easeSignal(engine),
    delay: stagger(each, { start: delay }),
    autoplay: onScroll({
      target: (trigger ?? targets) as never,
      // Fire once the element is 90px into the viewport, and never re-run — a
      // reveal that replays on every scroll-back is decoration, not signal.
      enter: 'bottom-=90 top',
      repeat: false,
    }),
  });
}

export function useReveal<T extends HTMLElement = HTMLElement>(
  selector = '[data-reveal]',
  options: Omit<RevealOptions, 'trigger'> = {},
): RefObject<T | null> {
  return useAnimeScope<T>((self, engine) => {
    const root = self.root as HTMLElement;
    // anime.js throws on an empty target set; sections may render zero rows.
    if (!root.querySelector(selector)) return;
    reveal(engine, selector, { ...options, trigger: root });
  });
}

// ASCII only: the display face is subset to latin, so a glyph outside that
// range would render as tofu mid-scramble.
const SCRAMBLE_GLYPHS = '#$%&*+=/<>?@[]{}|~^0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * The signature moment (DESIGN.md Section 6): the name resolves character by
 * character out of a scramble. Returns a cleanup that reverts the split.
 */
export function resolveText(
  engine: MotionEngine,
  el: HTMLElement,
  options: { each?: number; delay?: number } = {},
) {
  const { animate, splitText, stagger, utils } = engine;
  const { each = STAGGER.char, delay = 0 } = options;

  const split = splitText(el, {
    chars: { wrap: 'clip' },
    // The original string stays in the accessibility tree, so a screen reader
    // reads "Deepanshu Sagore" and never a pile of individual span glyphs.
    accessible: true,
  } as never);

  const chars = split.chars as HTMLElement[];
  const finals = chars.map((c) => c.textContent ?? '');
  const scrambleUntil = chars.map((_, i) => delay + i * each + 260);

  // Lock each character to its final advance width BEFORE any glyph swapping.
  // Substituted glyphs have different widths, so an unlocked scramble reflows
  // the whole hero on every frame — measured at CLS 2.96 before this.
  const widths = chars.map((c) => c.getBoundingClientRect().width);
  chars.forEach((c, i) => {
    c.style.display = 'inline-block';
    c.style.width = `${widths[i]}px`;
    c.style.textAlign = 'center';
  });

  utils.set(chars, { opacity: 0, translateY: '110%' });

  animate(chars, {
    opacity: 1,
    translateY: '0%',
    duration: DUR.emphasis,
    ease: easeSignal(engine),
    delay: stagger(each, { start: delay }),
  });

  // Glyph churn runs on its own clock so each character can settle
  // independently of the transform timeline above.
  const started = performance.now();
  let raf = 0;
  const churn = () => {
    const t = performance.now() - started;
    let settling = false;
    for (let i = 0; i < chars.length; i++) {
      const final = finals[i];
      if (final.trim() === '') continue;
      if (t < scrambleUntil[i]) {
        settling = true;
        if (t > delay + i * each - 120) {
          chars[i].textContent = SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0];
        }
      } else if (chars[i].textContent !== final) {
        chars[i].textContent = final;
      }
    }
    if (settling) raf = requestAnimationFrame(churn);
    else chars.forEach((c, i) => (c.textContent = finals[i]));
  };
  raf = requestAnimationFrame(churn);

  return () => {
    cancelAnimationFrame(raf);
    chars.forEach((c, i) => (c.textContent = finals[i]));
    split.revert();
  };
}

export function drawLines(
  engine: MotionEngine,
  selector: string,
  options: { each?: number; duration?: number; delay?: number } = {},
) {
  const { animate, stagger, svg } = engine;
  const { each = 40, duration = 900, delay = 0 } = options;

  const drawables = svg.createDrawable(selector);
  if (!drawables.length) return;

  animate(drawables, {
    draw: ['0 0', '0 1'],
    duration,
    ease: easeSignal(engine),
    delay: stagger(each, { start: delay }),
  });
}

/** Count-up for the stat register. Traced to the beui.dev `number` pattern. */
export function countUp(
  engine: MotionEngine,
  el: HTMLElement,
  to: number,
  options: { duration?: number } = {},
) {
  const { animate, onScroll } = engine;
  const state = { value: 0 };
  el.textContent = '0';

  animate(state, {
    value: to,
    duration: options.duration ?? 1200,
    ease: easeSignal(engine),
    onUpdate: () => {
      el.textContent = String(Math.round(state.value));
    },
    autoplay: onScroll({ target: el as never, enter: 'bottom-=40 top', repeat: false }),
  });
}
