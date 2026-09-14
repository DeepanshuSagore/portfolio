import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** DESIGN.md Section 5 - Button. Radius is 0 by system commitment. */
type Variant = 'solid' | 'signal' | 'outline' | 'ghost';

const base =
  'type-mono-s inline-flex items-center justify-center gap-2 uppercase ' +
  'px-5 py-3 border transition-[background-color,border-color,color,translate,box-shadow] ' +
  'duration-[var(--dur-micro)] ease-[var(--ease-signal)] ' +
  'disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none';

/**
 * Filled buttons take the accent's OWN ink, not a page colour.
 *
 * The previous signal variant paired `bg-signal-2` with `text-ink-0`, and once
 * the bridge pointed ink-0 at the desk behind the sheet that became grey type
 * on vermilion at roughly 1.5:1. Each accent ships the text colour it is
 * legible against, which is the whole reason those tokens exist.
 */
const variants: Record<Variant, string> = {
  /* The references' primary action is the darkest thing on the paper, not the
     brightest. Vermilion stays for actions that are genuinely a signal. */
  solid:
    'bg-panel-ink text-panel-ink-text border-panel-ink shadow-[var(--t-shadow)] ' +
    'hover:-translate-y-px hover:shadow-[var(--t-shadow-lift)] ' +
    'active:translate-y-0 active:shadow-none ' +
    'disabled:bg-canvas-2 disabled:text-ink-faint disabled:border-line',
  signal:
    'bg-a5 text-a5-ink border-a5 shadow-[var(--t-shadow)] ' +
    'hover:-translate-y-px hover:shadow-[var(--t-shadow-lift)] ' +
    'active:translate-y-0 active:shadow-none ' +
    'disabled:bg-canvas-2 disabled:text-ink-faint disabled:border-line',
  outline:
    'bg-panel text-ink border-ink shadow-[var(--t-shadow)] ' +
    'hover:-translate-y-px hover:shadow-[var(--t-shadow-lift)] ' +
    'active:translate-y-0 active:shadow-none ' +
    'disabled:bg-canvas-2 disabled:text-ink-faint disabled:border-line',
  ghost:
    'bg-transparent text-ink-faint border-transparent ' +
    'hover:text-ink active:text-a5 ' +
    'disabled:text-ink-faint',
};

type CommonProps = {
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'className'>;
type AnchorProps = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<'a'>,
    'children' | 'className' | 'href'
  >;

export function Button({ variant = 'outline', icon, children, className = '', ...rest }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
      {icon}
    </button>
  );
}

export function ButtonLink({ variant = 'outline', icon, children, className = '', href, ...rest }: AnchorProps) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      {...rest}
    >
      {children}
      {icon}
    </a>
  );
}
