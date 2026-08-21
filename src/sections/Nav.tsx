import { useEffect, useState } from 'react';
import { navLinks, profile } from '../data/content';

/**
 * Fixed register bar. The hairline and surface only materialise once the page
 * has moved — at rest the nav sits directly on the hero with no chrome.
 *
 * No hamburger: on mobile the links become a horizontally scrollable mono
 * strip, so navigation is always visible rather than hidden behind a toggle.
 */
export function Nav() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[var(--dur-standard)] ease-[var(--ease-signal)] ${
        lifted
          ? 'border-b border-rule bg-ink-glass backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="shell flex h-16 items-center justify-between gap-4">
        <a href="#top" className="type-mono-s shrink-0 uppercase text-text-1 hover:text-signal-2">
          {profile.name}
        </a>

        <ul className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="type-mono-s block shrink-0 px-3 py-2 uppercase text-text-3 transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:text-text-1"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={profile.resume}
          download
          className="type-mono-s hidden shrink-0 border border-rule px-4 py-2 uppercase text-text-2 transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:border-signal-2 hover:text-text-1 sm:block"
        >
          Résumé
        </a>
      </nav>
    </header>
  );
}
