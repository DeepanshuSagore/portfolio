import type { ReactNode } from 'react';

/**
 * Marquee - mechanism ported from the Magic UI `marquee` registry component
 * (https://magicui.design/r/marquee.json).
 *
 * Kept from the original: the repeat-N-copies-and-translate-one-copy-width
 * trick, which is what makes the loop seamless without measuring anything.
 *
 * Changed: the original depends on `cn`/clsx and on Tailwind arbitrary values
 * (`[--duration:40s]`) that bypass the token layer. Here the timing and gap are
 * real custom properties, the styling lives in `.marquee` / `.marquee-row`
 * (tokens.css), and the repeated copies are hidden from assistive technology
 * so a screen reader reads the list once rather than three times.
 *
 * `gapRem` has to be handed to the keyframe as well as to the flex row: the
 * translation is `-100% - gap`, and a gap the animation does not know about is
 * exactly the size of the stutter it produces on each loop.
 */
export function Marquee({
  children,
  repeat = 3,
  durationSeconds = 48,
  gapRem = 0,
  reverse = false,
  className = '',
}: {
  children: ReactNode;
  repeat?: number;
  durationSeconds?: number;
  gapRem?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`marquee ${className}`}
      data-reverse={reverse ? 'true' : undefined}
      style={
        {
          '--marquee-duration': `${durationSeconds}s`,
          '--marquee-gap': `${gapRem}rem`,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div key={i} className="marquee-row" aria-hidden={i > 0 ? 'true' : undefined}>
          {children}
        </div>
      ))}
    </div>
  );
}
