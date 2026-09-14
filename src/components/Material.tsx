import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * The paper vocabulary as components: tape, prints, cut labels, marker
 * strokes, stamped labels.
 *
 * None of these ask which direction is live. The CSS they sit on resolves
 * rotation, tape and shadow through the token contract, so an editorial
 * visitor gets the same markup rendered as a plain framed image.
 */

/**
 * React types `style` as CSSProperties, which has no room for custom
 * properties. Intersecting rather than casting keeps the rest type-checked.
 *
 * It has to be applied to a variable, not with `satisfies` on the literal:
 * the literal is contextually typed by `style?: CSSProperties` first, so
 * excess-property checking rejects every `--custom` key before `satisfies`
 * is consulted. A typed reference is not excess-checked.
 */
type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

export const vars = (values: CSSVars): CSSProperties => values;

export type Accent = 1 | 2 | 3 | 4 | 5;

/* Written out because Tailwind scans source text: `bg-a${accent}` compiles to
   nothing at all. */
const ACCENT_FILL: Record<Accent, string> = {
  1: 'bg-a1 text-a1-ink',
  2: 'bg-a2 text-a2-ink',
  3: 'bg-a3 text-a3-ink',
  4: 'bg-a4 text-a4-ink',
  5: 'bg-a5 text-a5-ink',
};

type Corner = 'tl' | 'tr' | 'bl' | 'br';

/* Each corner gets its own angle so the four strips never read as a pattern. */
const CORNER: Record<Corner, { pos: string; rot: string }> = {
  tl: { pos: '-top-3 -left-5', rot: '-24deg' },
  tr: { pos: '-top-3 -right-5', rot: '26deg' },
  bl: { pos: '-bottom-3 -left-5', rot: '22deg' },
  br: { pos: '-bottom-3 -right-5', rot: '-25deg' },
};

export function Tape({ corner }: { corner: Corner }) {
  const { pos, rot } = CORNER[corner];
  return (
    <span
      aria-hidden="true"
      className={`tape ${pos}`}
      style={vars({ '--tape-rot': rot })}
    />
  );
}

/**
 * A print, taped to the page.
 *
 * `tilt` is a multiplier on the direction's own tilt, not an angle. Callers
 * alternate its sign along a row, which is what keeps a group of photographs
 * from reading as a grid that slipped.
 */
export function Polaroid({
  src,
  alt,
  caption,
  tilt = 1,
  corners = ['tl', 'br'],
  className = '',
}: {
  src: string;
  alt: string;
  caption?: string;
  tilt?: number;
  corners?: readonly Corner[];
  className?: string;
}) {
  return (
    <figure
      className={`polaroid tilt ${className}`}
      style={vars({ '--tilt': tilt })}
    >
      {corners.map((corner) => (
        <Tape key={corner} corner={corner} />
      ))}
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** A hand-cut label. The colour reports a category, so it comes from data. */
export function CutLabel({
  accent,
  tilt = 1,
  hand = false,
  children,
}: {
  accent: Accent;
  tilt?: number;
  /** Set for the small flags pinned around the name, which the references
      write out by hand rather than setting. */
  hand?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`chip-cut tilt ${ACCENT_FILL[accent]} ${hand ? 'font-hand text-[0.95rem] font-normal' : ''}`}
      style={vars({ '--tilt': tilt })}
    >
      {children}
    </span>
  );
}

/** Distinct from CutLabel: a pale fill with no cut edge, for asides rather
    than categories. Tinted from the accent so it never competes with one. */
export function Pill({
  accent,
  tilt = 1,
  className = '',
  children,
}: {
  accent: Accent;
  tilt?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`type-mono-s tilt inline-block whitespace-nowrap rounded-full px-3 py-1.5 uppercase ${className}`}
      style={vars({
        '--tilt': tilt,
        backgroundColor: `color-mix(in oklab, var(--color-a${accent}) 42%, var(--color-panel))`,
        color: 'var(--color-ink)',
      })}
    >
      {children}
    </span>
  );
}

/**
 * A short drawn arrow, of the kind the references use to tie a flag back to
 * the thing it labels.
 *
 * The head is two strokes off the tip rather than a filled triangle, because a
 * solid head reads as a UI control and this has to read as pen.
 */
export function Arrow({ flip = false, className = '' }: { flip?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 34"
      className={`h-7 w-8 text-ink-soft ${flip ? '-scale-x-100' : ''} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 31C8 22 14 13 25 6" />
      <path d="M25 6 17.5 8.5" />
      <path d="M25 6 26.5 14" />
    </svg>
  );
}

/** The double underline scribbled beneath the kicker in the references. */
export function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 90 12"
      className={`h-2.5 w-[5.5rem] text-ink-faint ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M3 4.4C18 2.1 42 6.2 61 3.4 72 1.8 81 3 87 4.6" />
      <path d="M6 8.6C22 6.9 45 9.8 63 7.9 73 6.9 80 7.6 85 8.8" />
    </svg>
  );
}

/**
 * A round photograph with a drawn ring, of the kind pinned either side of the
 * headline in the references.
 *
 * Decorative: the same person is described in words a few hundred pixels
 * below, so an alt text here would only repeat it to a screen reader.
 */
export function AvatarRing({
  src,
  accent = 5,
  tilt = 1,
  className = '',
}: {
  src: string;
  accent?: Accent;
  tilt?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`tilt block size-14 overflow-hidden rounded-full border-2 bg-panel p-0.5 ${className}`}
      style={vars({ '--tilt': tilt, borderColor: `var(--color-a${accent})` })}
    >
      <img src={src} alt="" loading="lazy" decoding="async" className="size-full rounded-full object-cover" />
    </span>
  );
}

/**
 * The long, almost flat arc the references draw under the hero.
 *
 * `preserveAspectRatio="none"` lets it span any width while staying a few
 * pixels tall; the stroke is held at one pixel by vector-effect so stretching
 * the box never thickens the line.
 */
export function HandCurve({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`h-10 w-full text-line-strong ${className}`}
      fill="none"
    >
      <path
        d="M4 31C160 13 372 5 604 7c214 2 404 10 592 25"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A marker stroke under a run of text. Wraps inline, so it survives a break. */
export function Marker({ accent = 1, children }: { accent?: Accent; children: ReactNode }) {
  return (
    <span className="marker" style={vars({ '--marker': `var(--color-a${accent})` })}>
      {children}
    </span>
  );
}

/**
 * A rule drawn around something by hand.
 *
 * The wobble is a turbulence displacement filter rather than a hand-plotted
 * path, which is what lets one component box a word or a paragraph at any size
 * without the irregularity stretching with it. `useId` keeps the filter
 * reference unique, since two instances on a page would otherwise both resolve
 * to whichever definition rendered last.
 *
 * Decorative: it frames content that is already in the document.
 */
export function RoughBox({
  accent = 5,
  className = '',
  children,
}: {
  accent?: Accent;
  className?: string;
  children: ReactNode;
}) {
  const id = useId().replace(/:/g, '');

  return (
    <span className={`relative inline-block ${className}`}>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
        style={vars({ color: `var(--color-a${accent})` })}
      >
        <defs>
          <filter id={`rough-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.019" numOctaves="2" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
          </filter>
        </defs>
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          filter={`url(#rough-${id})`}
        />
      </svg>
      {children}
    </span>
  );
}

/** A short label inside a hairline rule, stamped onto the page. */
export function Boxed({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`boxed type-mono-s uppercase ${className}`}>{children}</span>;
}

/**
 * A handwritten note in the margin.
 *
 * Decorative by default: annotations in the references repeat something the
 * layout already says. Pass `informative` where the note carries a fact of its
 * own, and it joins the accessibility tree instead of being hidden from it.
 */
export function Annotation({
  children,
  tilt = -1,
  informative = false,
  className = '',
}: {
  children: ReactNode;
  tilt?: number;
  informative?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden={informative ? undefined : 'true'}
      className={`type-hand tilt block text-ink-faint ${className}`}
      style={vars({ '--tilt': tilt })}
    >
      {children}
    </span>
  );
}
