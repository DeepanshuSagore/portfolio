/**
 * The three art directions, and the store that switches between them.
 *
 * There is no context provider here, for the same reason `lib/register.ts`
 * does not have one: the only thing the tree needs to agree on is a string,
 * and a provider would mean re-rendering everything between the root and each
 * consumer. `useSyncExternalStore` subscribes only the components that
 * actually branch on the theme.
 *
 * The DOM attribute is the single source of truth, not a React state atom.
 * An inline script in index.html writes it before first paint, so the page can
 * never flash the default theme on top of a stored choice - and because the
 * attribute is already correct by the time React boots, the store reads it
 * rather than trying to re-derive it from localStorage.
 */

import { useSyncExternalStore } from 'react';

export const THEMES = ['sketchbook', 'editorial', 'brutalist'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'sketchbook';

/** Must stay in sync with the inline bootstrap script in index.html. */
export const THEME_STORAGE_KEY = 'ds-theme';

export const THEME_META: Record<Theme, { label: string; note: string; themeColor: string }> = {
  sketchbook: {
    label: 'Sketchbook',
    note: 'Paper, tape and marker',
    themeColor: '#fbfaf6',
  },
  editorial: {
    label: 'Editorial',
    note: 'Swiss grid, type first',
    themeColor: '#ffffff',
  },
  brutalist: {
    label: 'Brutalist',
    note: 'Hard edges, hard shadows',
    themeColor: '#f2f0e9',
  },
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

const listeners = new Set<() => void>();

/**
 * Reads the attribute the bootstrap script wrote. Falls back to the default
 * rather than throwing, so a hand-edited or missing attribute degrades to a
 * styled page instead of an unstyled one.
 */
function readTheme(): Theme {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : DEFAULT_THEME;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/* The server renders the default. React hydrates against this snapshot and
   then immediately re-renders with the client value if the visitor had a
   different theme stored - which is what keeps the markup match exact rather
   than papering over a mismatch with suppressHydrationWarning. */
function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function setTheme(next: Theme): void {
  if (typeof document === 'undefined') return;
  if (readTheme() === next) return;

  document.documentElement.dataset.theme = next;

  /* The browser chrome colour belongs to the theme too - leaving it pinned to
     one value makes the switch stop at the edge of the viewport on mobile. */
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_META[next].themeColor);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* Private mode, or storage disabled. The switch still applies for this
       session; only persistence across reloads is lost, which is not worth
       failing the interaction over. */
  }

  for (const listener of listeners) listener();
}

/**
 * Subscribes a component to the active theme.
 *
 * Only call this where the component genuinely branches - composition,
 * decoration, a different layout. Anything that only needs different colours
 * or type should read a CSS variable instead and never re-render at all.
 */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, getServerSnapshot);
}

export { subscribe as subscribeToTheme, readTheme as getTheme };

