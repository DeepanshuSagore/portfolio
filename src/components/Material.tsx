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

const vars = (values: CSSVars): CSSProperties => values;

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
  children,
}: {
  accent: Accent;
  tilt?: number;
  children: ReactNode;
}) {
  return (
    <span
      className={`chip-cut tilt ${ACCENT_FILL[accent]}`}
      style={vars({ '--tilt': tilt })}
    >
      {children}
    </span>
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
