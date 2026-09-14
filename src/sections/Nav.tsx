import { Briefcase, Github, Layers, LayoutGrid, Linkedin, Mail, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { navLinks, profile } from '../data/content';
import { useActiveSection, useScrollProgress } from '../lib/motion';

/**
 * The document bar.
 *
 * The references frame the page as a physical document: a hairline strip along
 * the top carrying tabs with small marks, the open one filled in, and a
 * cluster of round destinations at the far end. That is what this is - tabs
 * rather than links, so the bar reports which part of the document you are
 * reading instead of listing five equally inert words.
 *
 * No hamburger, on purpose and unchanged from the previous build: hiding five
 * destinations behind a toggle costs a tap and a guess. Mobile gets its own
 * composition instead - the identity and controls hold the first row and the
 * tabs become a snapping strip on a second, with the open tab scrolled into
 * view so the strip always opens showing where you are.
 */

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  work: LayoutGrid,
  stack: Layers,
  experience: Briefcase,
  about: User,
  contact: Mail,
};

/* Contact is pulled out of the strip and rendered as the call to action at the
   far end, the way the references separate it from the tabs. */
const TAB_LINKS = navLinks.filter((link) => link.href !== '#contact');

const SOCIALS = [
  { key: 'github', href: profile.github, label: 'GitHub', Icon: Github, fill: 'bg-a4 text-a4-ink' },
  { key: 'linkedin', href: profile.linkedin, label: 'LinkedIn', Icon: Linkedin, fill: 'bg-a2 text-a2-ink' },
  { key: 'email', href: `mailto:${profile.email}`, label: 'Email', Icon: Mail, fill: 'bg-a3 text-a3-ink' },
] as const;

function Tab({
  href,
  label,
  current,
  className = '',
}: {
  href: string;
  label: string;
  current: boolean;
  className?: string;
}) {
  const id = href.slice(1);
  const Icon = ICONS[id];

  return (
    <a
      href={href}
      aria-current={current ? 'true' : undefined}
      data-tab={id}
      className={`tab-cut type-mono-s inline-flex shrink-0 items-center gap-1.5 py-2 uppercase transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] ${
        current ? 'bg-a1 text-a1-ink' : 'text-ink-faint hover:bg-canvas-2 hover:text-ink'
      } ${className}`}
    >
      {Icon && <Icon className="size-3.5" />}
      {label}
      {/* The open tab is marked by fill AND by this rule, so the bar still
          reports position with colour discarded. */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 block h-0.5 origin-left bg-ink transition-transform duration-[var(--dur-standard)] ease-[var(--ease-signal)] ${
          current ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </a>
  );
}

export function Nav() {
  const [lifted, setLifted] = useState(false);
  const bar = useScrollProgress<HTMLSpanElement>();
  const strip = useRef<HTMLDivElement>(null);

  const ids = useMemo(() => navLinks.map((link) => link.href.slice(1)), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* The mobile strip scrolls independently of the page, so the open tab can sit
     off-screen while you are reading its section. Nudging it back is what keeps
     the strip answering "where am I" rather than "where did I start". */
  useEffect(() => {
    const node = strip.current?.querySelector(`[data-tab="${active}"]`);
    node?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [active]);

  return (
    <header
      className={`fixed left-[var(--t-frame)] right-[var(--t-frame)] top-[var(--t-frame)] z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-[var(--dur-standard)] ease-[var(--ease-signal)] ${
        lifted ? 'border-line bg-ink-glass backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      {/* Not .shell. The bar is document chrome and spans the sheet, the way
          the references run it edge to edge - capping it at the 1100px content
          measure left the tabs and the contact button fighting for 972px. */}
      <nav
        aria-label="Primary"
        className="flex h-14 items-center justify-between gap-3 px-[var(--gutter)]"
      >
        <a href="#top" className="type-mono-s group inline-flex shrink-0 items-center gap-2 uppercase text-ink">
          <span
            aria-hidden="true"
            className="grid size-5 place-items-center border border-ink bg-a1 text-[0.6rem] font-bold text-a1-ink transition-transform duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:-rotate-6"
          >
            DS
          </span>
          {/* Below xl the tabs, switcher and contact already fill the bar, and
              the name is the widest thing that is not a destination. The mark
              carries identity on its own there. */}
          <span className="hidden xl:inline">{profile.name}</span>
        </a>

        <ul className="hidden items-end gap-1 lg:flex">
          {TAB_LINKS.map((link) => (
            <li key={link.href} className="relative">
              <Tab href={link.href} label={link.label} current={active === link.href.slice(1)} />
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <ul className="hidden items-center gap-1.5 xl:flex">
            {SOCIALS.map(({ key, href, label, Icon, fill }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className={`grid size-7 place-items-center rounded-full border border-ink transition-transform duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:-translate-y-0.5 ${fill}`}
                >
                  <Icon className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="type-mono-s hidden shrink-0 items-center gap-1.5 border border-ink bg-panel px-3 py-2 uppercase text-ink shadow-[var(--t-shadow)] transition-transform duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:-translate-y-0.5 sm:inline-flex"
          >
            <Mail className="size-3.5" />
            Contact
          </a>
        </div>
      </nav>

      <div
        ref={strip}
        className="flex items-end gap-1 overflow-x-auto border-t border-line px-[var(--gutter)] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {navLinks.map((link) => (
          <span key={link.href} className="relative">
            <Tab href={link.href} label={link.label} current={active === link.href.slice(1)} />
          </span>
        ))}
      </div>

      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 block h-px overflow-hidden">
        <span ref={bar} style={{ transform: 'scaleX(0)' }} className="block h-full w-full origin-left bg-a5" />
      </span>
    </header>
  );
}
