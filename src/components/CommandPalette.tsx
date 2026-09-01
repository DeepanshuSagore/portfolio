import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, CornerDownLeft, FileDown, Github, Hash, Linkedin, Mail, Search } from 'lucide-react';
import { navLinks, profile, projects } from '../data/content';
import { loadMotionEngine, prefersReducedMotion } from '../lib/motion';
import { openProject } from '../lib/register';

type Item = {
  id: string;
  group: 'Sections' | 'Projects' | 'Elsewhere';
  label: string;
  meta: string;
  keywords: string;
  Icon: typeof Hash;
  run: () => void;
};

/** Anchors are scrolled to by hand so the URL hash does not enter history for
 *  what is really a viewport move. */
function goTo(hash: string) {
  document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function useItems(close: () => void): Item[] {
  return useMemo(() => {
    const sections: Item[] = navLinks.map((link) => ({
      id: `section:${link.href}`,
      group: 'Sections',
      label: link.label,
      meta: link.href,
      keywords: link.label,
      Icon: Hash,
      run: () => {
        close();
        goTo(link.href.slice(1));
      },
    }));

    const work: Item[] = projects.map((project) => ({
      id: `project:${project.id}`,
      group: 'Projects',
      label: project.title,
      meta: project.live ? 'Live' : project.repo ? 'Source' : 'Private',
      keywords: `${project.title} ${project.summary} ${project.tags.join(' ')}`,
      Icon: ArrowUpRight,
      run: () => {
        close();
        // The rail moves itself to the card; the page only has to bring the
        // rail into view. Scrolling to the card directly would be wrong twice
        // over - it is inside a horizontal scroller, and `scrollIntoView` on
        // it would fight Embla for the same axis.
        openProject(project.id);
        goTo('work');
      },
    }));

    const elsewhere: Item[] = [
      {
        id: 'link:email',
        group: 'Elsewhere',
        label: 'Email Deepanshu',
        meta: profile.email,
        keywords: `email mail contact ${profile.email}`,
        Icon: Mail,
        run: () => {
          close();
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: 'link:github',
        group: 'Elsewhere',
        label: 'GitHub',
        meta: profile.githubHandle,
        keywords: 'github code repos source',
        Icon: Github,
        run: () => {
          close();
          openExternal(profile.github);
        },
      },
      {
        id: 'link:linkedin',
        group: 'Elsewhere',
        label: 'LinkedIn',
        meta: profile.linkedinHandle,
        keywords: 'linkedin profile hire',
        Icon: Linkedin,
        run: () => {
          close();
          openExternal(profile.linkedin);
        },
      },
      {
        id: 'link:resume',
        group: 'Elsewhere',
        label: 'Download résumé',
        meta: 'PDF',
        keywords: 'resume cv pdf download',
        Icon: FileDown,
        run: () => {
          close();
          window.location.href = profile.resume;
        },
      },
    ];

    return [...sections, ...work, ...elsewhere];
  }, [close]);
}

/**
 * Command palette, on ⌘K / Ctrl+K.
 *
 * Built as a combobox rather than as a dialog full of tab stops: the input
 * keeps focus for the whole interaction, the results are `role="option"` in a
 * `role="listbox"`, and the active one is named by `aria-activedescendant`.
 * That is the pattern screen readers already know, and it means there is no
 * focus trap to get wrong - there is only ever one focusable element inside.
 *
 * Nothing here is on the critical path. The component renders `null` until it
 * is opened, the key listener is eleven lines, and anime.js is only reached
 * for once a palette has actually been opened.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);
  const items = useItems(close);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    // Substring over label + keywords, ranked so a hit in the name beats a hit
    // in a description. Deliberately not fuzzy: on a list this small, fuzzy
    // matching mostly produces confident wrong answers.
    return items
      .map((item) => {
        const label = item.label.toLowerCase();
        if (label.startsWith(needle)) return { item, rank: 0 };
        if (label.includes(needle)) return { item, rank: 1 };
        if (item.keywords.toLowerCase().includes(needle)) return { item, rank: 2 };
        return null;
      })
      .filter((hit): hit is { item: Item; rank: number } => hit !== null)
      .sort((a, b) => a.rank - b.rank)
      .map((hit) => hit.item);
  }, [items, query]);

  /* Global hotkey. Registered once and never torn down while the app is
     mounted, because the palette not existing yet is the normal state. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Open: remember where focus came from, take it, and stop the page behind
     from scrolling. Close: give focus back to whatever had it. */
  useEffect(() => {
    if (!open) {
      setQuery('');
      setActive(0);
      restoreTo.current?.focus();
      restoreTo.current = null;
      return;
    }

    restoreTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    inputRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  /* Entrance. Fast on purpose: a palette that takes longer than a keystroke to
     arrive is a palette people stop using. */
  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel || prefersReducedMotion()) return;

    let cancelled = false;
    void loadMotionEngine().then((engine) => {
      if (cancelled || !panelRef.current) return;
      engine.animate(panel, {
        opacity: [0, 1],
        translateY: [-8, 0],
        scale: [0.985, 1],
        duration: 180,
        ease: engine.cubicBezier(0.16, 1, 0.3, 1),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // A filtered list can be shorter than the cursor that was sitting in it.
  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active, results.length]);

  if (!open) return <PaletteHint onOpen={() => setOpen(true)} />;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      results[active]?.run();
    } else if (event.key === 'Tab') {
      // One focusable element inside, so there is nowhere legitimate to tab to.
      event.preventDefault();
    }
  };

  let lastGroup = '';

  return (
    <>
      <PaletteHint onOpen={() => setOpen(true)} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
        onKeyDown={onKeyDown}
      >
        <button
          type="button"
          aria-label="Close command palette"
          onClick={close}
          className="absolute inset-0 cursor-default bg-ink-0/75 backdrop-blur-sm"
        />

        <div
          ref={panelRef}
          className="relative flex w-full max-w-[38rem] flex-col overflow-hidden border border-rule-strong bg-ink-2 shadow-none"
        >
          <div className="flex items-center gap-3 border-b border-rule px-4">
            <Search aria-hidden="true" className="size-4 shrink-0 text-text-4" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              aria-activedescendant={results.length ? `palette-option-${active}` : undefined}
              aria-label="Search sections, projects and links"
              autoComplete="off"
              spellCheck={false}
              placeholder="Jump to a section, a project, or a link"
              className="type-mono-m w-full bg-transparent py-4 text-text-1 outline-none placeholder:text-text-4"
            />
          </div>

          <ul
            ref={listRef}
            id="palette-list"
            role="listbox"
            aria-label="Results"
            className="max-h-[46vh] overflow-y-auto py-2"
          >
            {results.map((item, i) => {
              const header = item.group !== lastGroup ? item.group : null;
              lastGroup = item.group;
              const selected = i === active;

              return (
                <li key={item.id}>
                  {header && (
                    <p className="type-overline px-4 pt-4 pb-2 first:pt-2">{header}</p>
                  )}
                  <div
                    id={`palette-option-${i}`}
                    role="option"
                    aria-selected={selected}
                    data-index={i}
                    onPointerMove={() => setActive(i)}
                    onClick={item.run}
                    className={`flex cursor-pointer items-center gap-3 border-l-2 px-4 py-2.5 transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] ${
                      selected
                        ? 'border-signal-2 bg-signal-feint text-text-1'
                        : 'border-transparent text-text-2'
                    }`}
                  >
                    <item.Icon
                      aria-hidden="true"
                      className={`size-3.5 shrink-0 ${selected ? 'text-signal-2' : 'text-text-4'}`}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm">{item.label}</span>
                    <span className="type-mono-s shrink-0 text-text-4">{item.meta}</span>
                  </div>
                </li>
              );
            })}

            {!results.length && (
              <p className="type-mono-m px-4 py-8 text-center text-text-3">
                Nothing matches &ldquo;{query}&rdquo;.
              </p>
            )}
          </ul>

          <div className="type-mono-s flex items-center gap-5 border-t border-rule px-4 py-3 text-text-4">
            <span className="flex items-center gap-1.5">
              <Key>↑</Key>
              <Key>↓</Key>
              navigate
            </span>
            <span className="flex items-center gap-1.5">
              <Key>
                <CornerDownLeft aria-hidden="true" className="size-3" />
              </Key>
              open
            </span>
            <span className="flex items-center gap-1.5">
              <Key>esc</Key>
              close
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center border border-rule px-1 font-mono text-[0.6875rem] leading-none text-text-3">
      {children}
    </kbd>
  );
}

/**
 * The affordance. A palette nobody can discover is a palette nobody uses, so
 * the shortcut is stated in the interface rather than left for people to guess,
 * and the hint is itself the button for anyone who would rather click.
 */
function PaletteHint({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-keyshortcuts="Meta+K Control+K"
      className="type-mono-s fixed bottom-5 right-5 z-[70] hidden items-center gap-2 border border-rule bg-ink-glass px-3 py-2 uppercase text-text-3 backdrop-blur-md transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:border-signal-2 hover:text-text-1 md:inline-flex"
    >
      <Search aria-hidden="true" className="size-3.5" />
      Search
      <kbd className="ml-1 border border-rule px-1.5 py-0.5 font-mono text-[0.625rem] leading-none text-text-4">
        ⌘K
      </kbd>
    </button>
  );
}
