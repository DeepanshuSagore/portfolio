import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** DESIGN.md Section 5 — Button. Radius is 0 by system commitment. */
type Variant = 'signal' | 'outline' | 'ghost';

const base =
  'type-mono-s inline-flex items-center justify-center gap-2 uppercase rounded-none ' +
  'px-5 py-3 border transition-[background-color,border-color,color,translate] ' +
  'duration-[var(--dur-micro)] ease-[var(--ease-signal)] ' +
  'disabled:cursor-not-allowed disabled:translate-y-0';

const variants: Record<Variant, string> = {
  signal:
    'bg-signal-2 text-ink-0 border-signal-2 ' +
    'hover:bg-signal-1 hover:border-signal-1 hover:-translate-y-px ' +
    'active:bg-signal-3 active:border-signal-3 active:translate-y-0 ' +
    'disabled:bg-ink-4 disabled:text-text-4 disabled:border-ink-4',
  outline:
    'bg-transparent text-text-2 border-rule ' +
    'hover:text-text-1 hover:border-signal-2 hover:-translate-y-px ' +
    'active:bg-ink-4 active:translate-y-0 ' +
    'disabled:text-text-4 disabled:border-rule-subtle',
  ghost:
    'bg-transparent text-text-3 border-transparent ' +
    'hover:text-text-1 active:text-signal-2 ' +
    'disabled:text-text-4',
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
