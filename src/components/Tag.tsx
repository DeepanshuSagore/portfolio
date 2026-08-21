import type { ReactNode } from 'react';

/** DESIGN.md Section 5 — Tag. */
type Variant = 'default' | 'signal' | 'live';

const variants: Record<Variant, string> = {
  default: 'text-text-3 border-rule bg-transparent',
  signal: 'text-signal-1 border-signal-edge bg-signal-wash',
  live: 'text-live border-live-edge bg-transparent',
};

export function Tag({
  children,
  variant = 'default',
  className = '',
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`type-mono-s inline-flex items-center gap-1.5 rounded-[var(--radius-1)] border px-2 py-1 uppercase ${variants[variant]} ${className}`}
    >
      {/* Status is never color alone — the dot always sits beside a text label. */}
      {variant === 'live' && (
        <span aria-hidden="true" className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-live" />
        </span>
      )}
      {children}
    </span>
  );
}
