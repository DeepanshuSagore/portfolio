import { useEffect, useMemo, useState } from 'react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { navLinks, profile } from '../data/content';
import { useActiveSection, useScrollProgress } from '../lib/motion';

/**
 * Fixed register bar. The hairline and surface only materialise once the page
 * has moved - at rest the nav sits directly on the hero with no chrome.
 *
 * No hamburger: on mobile the links become a horizontally scrollable mono
 * strip, so navigation is always visible rather than hidden behind a toggle.
 *
 * Two things were added on top of that. The active section is now tracked and
 * marked with `aria-current`, so the strip reports where you are instead of
 * being a list of five equally inert words. And the header's own bottom
 * hairline doubles as the document scroll progress - the mechanism is the
 * Magic UI `scroll-progress` component's, minus its gradient and its
 * dependency on a motion library, since a single `scaleX` written straight to
 * the node is the whole feature.
 */
export function Nav() {
  const [lifted, setLifted] = useState(false);
  const bar = useScrollProgress<HTMLSpanElement>();

  const ids = useMemo(() => navLinks.map((link) => link.href.slice(1)), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed left-[var(--t-frame)] right-[var(--t-frame)] top-[var(--t-frame)] z-50 transition-[background-color,border-color,backdrop-filter] duration-[var(--dur-standard)] ease-[var(--ease-signal)] ${
        lifted
          ? 'border-b border-rule bg-ink-glass backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="shell flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          className="type-mono-s group inline-flex shrink-0 items-center gap-2.5 uppercase text-text-1"
        >
          <span
            aria-hidden="true"
            className="block size-1.5 bg-signal-2 transition-transform duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:rotate-45"
          />
          {profile.name}
        </a>

        <ul className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navLinks.map((link) => {
            const current = active === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={current ? 'true' : undefined}
                  className={`type-mono-s relative block shrink-0 px-3 py-2 uppercase transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:text-text-1 ${
                    current ? 'text-text-1' : 'text-text-3'
                  }`}
                >
                  {link.label}
                  {/* Position is marked twice - by colour and by a rule - so it
                      never depends on colour alone. */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 bottom-1 block h-px origin-left bg-signal-2 transition-transform duration-[var(--dur-standard)] ease-[var(--ease-signal)] ${
                      current ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-3">
          <ThemeSwitcher />

          <a
            href={profile.resume}
            download
            className="type-mono-s hidden shrink-0 border border-rule px-4 py-2 uppercase text-text-2 transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:border-signal-2 hover:text-text-1 md:block"
          >
            Résumé
          </a>
        </div>
      </nav>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 block h-px overflow-hidden"
      >
        <span
          ref={bar}
          style={{ transform: 'scaleX(0)' }}
          className="block h-full w-full origin-left bg-signal-2"
        />
      </span>
    </header>
  );
}
