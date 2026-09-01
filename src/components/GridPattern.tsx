import { useId } from 'react';

/**
 * GridPattern - ported from the Magic UI `grid-pattern` registry component
 * (https://magicui.design/r/grid-pattern.json).
 *
 * Kept from the original: an SVG `<pattern>` of `M.5 h V.5 H w` corner strokes
 * tiled over a full-bleed `<rect>`, plus the `squares` prop that fills named
 * cells. That second feature is why this component was chosen over a CSS
 * background-image grid - a handful of lit cells turns a decorative grid into
 * something that reads as plotted, which is the whole conceit of the page.
 *
 * Changed: the original hard-codes `fill-gray-400/30 stroke-gray-400/30` and
 * relies on `cn`. Colour here is inherited (`currentColor`) so a caller sets it
 * with a token class, `squares` take a separate class so lit cells can carry
 * the signal while the grid stays a hairline, and the whole thing is masked so
 * it dissolves instead of ending at a hard edge.
 */
export function GridPattern({
  size = 56,
  x = -1,
  y = -1,
  squares,
  className = '',
  squareClassName = '',
}: {
  size?: number;
  x?: number;
  y?: number;
  /** `[column, row]` cells to fill, in pattern units from the pattern origin. */
  squares?: ReadonlyArray<readonly [number, number]>;
  className?: string;
  squareClassName?: string;
}) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${size}V.5H${size}`} fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />

      {squares && (
        <svg x={x} y={y} className={`overflow-visible ${squareClassName}`}>
          {squares.map(([col, row]) => (
            <rect
              key={`${col}-${row}`}
              strokeWidth="0"
              width={size - 1}
              height={size - 1}
              x={col * size + 1}
              y={row * size + 1}
              fill="currentColor"
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
