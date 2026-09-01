import type { ReactNode } from 'react';

/**
 * SectionHeader.
 *
 * The previous version rendered an identical overline/heading pair five times
 * down the page, which made every chapter arrive at the same pitch - the
 * single biggest reason the page read as generated rather than designed. Two
 * things fix it here: a hollow chapter numeral set in the left margin, which
 * gives each section its own anchor and a running sense of position, and an
 * optional `lede` so a heading can be a short phrase instead of a full
 * declarative sentence carrying all the meaning.
 *
 * The numeral is `aria-hidden`: it is a position marker, and a screen reader
 * announcing "zero two" before every heading is noise, not orientation.
 */
export function SectionHeader({
  chapter,
  overline,
  title,
  lede,
  counter,
  id,
}: {
  chapter: string;
  overline: string;
  title: ReactNode;
  lede?: ReactNode;
  counter?: string;
  id?: string;
}) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 border-t border-rule pt-5 md:gap-x-10">
        <p aria-hidden="true" className="chapter-numeral">
          {chapter}
        </p>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="type-overline">{overline}</p>
            {counter && <p className="type-overline tabular-nums">{counter}</p>}
          </div>

          <h2 id={id} className="type-display-l mt-4 max-w-[16ch]">
            {title}
          </h2>

          {lede && <p className="mt-5 max-w-[54ch] text-text-3">{lede}</p>}
        </div>
      </div>
    </header>
  );
}
