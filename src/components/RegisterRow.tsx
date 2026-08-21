import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * DESIGN.md Section 5 — RegisterRow, the core primitive.
 *
 * Harvested from the Minimal Gallery portfolio and the anime.js docs shell:
 * label-left / meta-right rows separated by hairlines, instead of a card grid.
 * The whole row is one tab stop; the arrow is decorative.
 */
const rowBase =
  'group relative grid w-full items-baseline gap-x-4 gap-y-2 border-t border-rule ' +
  'px-2 py-6 text-left transition-[background-color,border-color] ' +
  'duration-[var(--dur-standard)] ease-[var(--ease-signal)] ' +
  'grid-cols-[2.5rem_1fr] md:grid-cols-[3rem_minmax(0,1fr)_auto_1.5rem]';

const interactive =
  'hover:bg-signal-feint hover:border-signal-2 ' +
  'focus-visible:bg-signal-feint focus-visible:border-signal-2 ' +
  'active:bg-ink-4';

type Props = {
  index?: string;
  label: string;
  description?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  href?: string;
};

function Inner({ index, label, description, meta, children, href }: Props) {
  const isLink = Boolean(href);
  return (
    <>
      {index && (
        <span
          className={`type-mono-s self-start pt-1 text-text-3 transition-colors duration-[var(--dur-standard)] ease-[var(--ease-signal)] ${
            isLink ? 'group-hover:text-signal-2 group-focus-visible:text-signal-2' : ''
          }`}
        >
          {index}
        </span>
      )}

      <div
        className={`min-w-0 transition-transform duration-[var(--dur-standard)] ease-[var(--ease-signal)] ${
          isLink ? 'group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5' : ''
        }`}
      >
        <h3 className="type-h3 text-text-1">{label}</h3>
        {description && <div className="mt-2 max-w-[60ch] text-sm text-text-3">{description}</div>}
        {children && <div className="mt-4">{children}</div>}
      </div>

      {meta && (
        <div className="type-mono-m col-start-2 text-text-3 md:col-start-3 md:text-right">{meta}</div>
      )}

      {isLink && (
        <ArrowUpRight
          aria-hidden="true"
          className="hidden size-4 self-start justify-self-end text-text-4 transition-[translate,color] duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-signal-2 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:text-signal-2 md:block"
        />
      )}
    </>
  );
}

export function RegisterRow(props: Props & { href: string }) {
  const external = props.href.startsWith('http');
  return (
    <a
      href={props.href}
      className={`${rowBase} ${interactive}`}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      <Inner {...props} />
    </a>
  );
}

export function StaticRow(props: Props) {
  return (
    <div className={rowBase}>
      <Inner {...props} />
    </div>
  );
}

/** Empty state — DESIGN.md requires every register to have one. */
export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <p className="type-mono-m border-t border-rule px-2 py-10 text-center text-text-3">{children}</p>
  );
}
