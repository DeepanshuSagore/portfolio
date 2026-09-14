import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { GithubPanel } from '../components/GithubPanel';
import { Marquee } from '../components/Marquee';
import { SectionHeader } from '../components/SectionHeader';
import { Tag } from '../components/Tag';
import { projects, sections, type Project } from '../data/content';
import { useHoverScramble, useReveal, useSpotlight } from '../lib/motion';
import { onOpenProject } from '../lib/register';

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * One cell of the rail.
 *
 * Every card ships at full detail, in document order, in the prerendered
 * HTML. The rail is a way of reading the register, never a way of deferring
 * it: nothing here is virtualised, lazy, or mounted late.
 */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const title = useHoverScramble<HTMLHeadingElement>();

  return (
    <li
      data-rail-card
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${projects.length}: ${project.title}`}
      className="rail-card spot group px-7 py-8 md:px-8 md:py-9"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="type-mono-s text-text-2 transition-colors duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:text-signal-2">
          {pad2(index + 1)}
        </span>
        <span className="type-mono-s text-text-4">{project.year}</span>
      </div>

      {/* Deployment state, stated rather than implied by a link's presence.
          This is the one place `--live` is allowed to appear (DESIGN.md 2). */}
      <div className="mt-7 flex h-6 items-center">
        {project.live ? (
          <Tag variant="live">Live</Tag>
        ) : (
          <span className="type-mono-s text-text-4">{project.repo ? 'Source only' : 'Private'}</span>
        )}
      </div>

      <h3 ref={title.ref} onPointerEnter={title.onEnter} className="type-h3 mt-4 text-text-1">
        {project.title}
      </h3>
      <p className="mt-2.5 text-sm text-text-2">{project.summary}</p>

      <p className="mt-6 border-t border-rule pt-6 text-sm text-text-3">{project.detail}</p>

      <ul className="mt-6 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li key={tag}>
            <Tag>{tag}</Tag>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-8">
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer noopener"
            className="type-mono-s link-wipe inline-flex items-center gap-1.5 text-text-2 transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:text-signal-1"
          >
            <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
            Live
          </a>
        )}

        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="type-mono-s link-wipe inline-flex items-center gap-1.5 text-text-3 transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:text-signal-1"
          >
            <Github aria-hidden="true" className="size-3.5 shrink-0" />
            Source
          </a>
        )}

        {project.note && <span className="type-mono-s text-text-4">{project.note}</span>}
      </div>
    </li>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center border border-rule text-text-2 transition-[color,border-color,background-color] duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:border-signal-2 hover:text-text-1 disabled:cursor-not-allowed disabled:border-rule-subtle disabled:text-text-4 disabled:hover:border-rule-subtle"
    >
      {children}
    </button>
  );
}

/**
 * The work register, read sideways.
 *
 * Fifteen projects at full detail run past 2,000px as a vertical list, which
 * is a long way to scroll past work you have decided not to read. The rail
 * spends horizontal travel instead: the section is one card tall, and the page
 * scrolls past it in a single flick.
 *
 * It does NOT pin. The previous build scrubbed a pinned track with the page's
 * own scroll, which meant the only way out of the section was to spend its
 * entire scroll range - skipping cost the reader every project in it. Here
 * vertical scroll belongs to the page and horizontal travel belongs to the
 * rail, and the two never argue.
 *
 * Embla drives it (embla-carousel-react, 36M weekly downloads, zero runtime
 * dependencies, and what shadcn/ui ships underneath its own Carousel). It was
 * chosen over hand-rolling for one capability native scrolling does not have:
 * momentum drag with a mouse. But it is an ENHANCEMENT - the markup and CSS
 * are a native scroll-snap scroller, and Embla only takes over once it is
 * live. With no JavaScript the rail still scrolls, still snaps, and still
 * reaches every card.
 */
export function Work() {
  const root = useReveal<HTMLElement>();
  const spotlight = useSpotlight<HTMLDivElement>();

  const [emblaRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    // Snap to one card at a time. `dragFree` would feel loose against a
    // register whose whole point is that it is ruled into cells.
    slidesToScroll: 1,
    duration: 22,
    // Tabbing into a card off-screen must bring it into view. Embla does this
    // itself; the native fallback gets it from the browser.
    watchFocus: true,
  });

  const [enhanced, setEnhanced] = useState(false);
  const [selected, setSelected] = useState(0);
  const [bounds, setBounds] = useState({ prev: false, next: true });

  const barRef = useRef<HTMLSpanElement>(null);
  const thumb = useRef(0.2);

  /* A scrollbar thumb, not a fill.
     A bar that fills from empty says "you have consumed 0% of this", which at
     rest reads as broken; a thumb sized to the share of the rail currently on
     screen says "you are here, and there is this much of it", which is the
     thing a reader actually wants to know. Width is the visible fraction and
     the travel is the remainder, expressed in the thumb's own width because
     a percentage translate resolves against the element, not the track.

     Written straight to the DOM rather than through state: this fires on every
     frame of a drag, and a re-render per frame would cost more than the rail. */
  const paint = useCallback((progress: number) => {
    const bar = barRef.current;
    if (!bar) return;
    const width = thumb.current;
    bar.style.width = `${width * 100}%`;
    bar.style.transform = `translateX(${(progress * (1 - width) * 100) / width}%)`;
  }, []);

  useEffect(() => {
    if (!embla) return;
    setEnhanced(true);

    const measure = () => {
      // Never a full-width thumb on a rail that can still move, and never a
      // sliver on one that has fifteen cards but shows five.
      const inView = embla.slidesInView().length || 1;
      thumb.current = Math.min(Math.max(inView / projects.length, 0.08), 0.92);
    };

    const onSelect = () => {
      setSelected(embla.selectedScrollSnap());
      setBounds({ prev: embla.canScrollPrev(), next: embla.canScrollNext() });
    };
    const onScroll = () => paint(Math.min(Math.max(embla.scrollProgress(), 0), 1));
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    onSelect();
    onScroll();
    embla
      .on('select', onSelect)
      .on('reInit', onResize)
      .on('resize', onResize)
      .on('slidesInView', onResize)
      .on('scroll', onScroll);

    return () => {
      embla
        .off('select', onSelect)
        .off('reInit', onResize)
        .off('resize', onResize)
        .off('slidesInView', onResize)
        .off('scroll', onScroll);
    };
  }, [embla, paint]);

  /* The command palette can ask for a specific project. It is the only thing
     that moves the rail from outside. */
  useEffect(
    () =>
      onOpenProject((id) => {
        const index = projects.findIndex((project) => project.id === id);
        if (index >= 0) embla?.scrollTo(index);
      }),
    [embla],
  );

  /* Left and right move the rail when it, or anything in it, has focus. The
     native fallback gets this from the browser for free; once Embla owns the
     box it has to be re-supplied. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!enhanced) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      embla?.scrollPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      embla?.scrollNext();
    }
  };

  const deployed = projects.filter((project) => project.live);

  return (
    <section id="work" ref={root} className="scroll-mt-24 pt-24 md:pt-32">
      <div data-reveal className="shell">
        <SectionHeader
          chapter={sections.work.chapter}
          overline={sections.work.overline}
          title={sections.work.title}
          lede={sections.work.lede}
          counter={`${pad2(projects.length)} projects`}
        />
      </div>

      {/* Deployment strip. Not a restatement of the cards below - those are
          names, these are addresses, and a row of live hostnames is the
          shortest possible proof that "shipped" is meant literally.
          Mechanism ported from Magic UI `marquee`; see components/Marquee.tsx. */}
      <div aria-hidden="true" className="mt-4 border-t border-rule py-3.5">
        <Marquee durationSeconds={72}>
          {deployed.map((project) => (
            <span key={project.id} className="type-mono-s flex items-center whitespace-nowrap text-text-4">
              {project.live?.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              <span className="px-6 text-signal-3">&#8599;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div
        ref={spotlight}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected work"
        onKeyDown={onKeyDown}
      >
        <div ref={emblaRef} className="rail-viewport" data-embla={enhanced ? 'on' : undefined}>
          <ul className="rail-track">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </ul>
        </div>

        <div className="shell mt-6 flex items-center gap-5 md:gap-7">
          {/* A position readout, not content: the indices it mirrors are on the
              cards themselves, and a live region ticking on every frame of a
              drag would be unusable. */}
          <p aria-hidden="true" className="type-mono-s shrink-0 text-text-4">
            <span className="text-text-1">{pad2(selected + 1)}</span>
            <span className="px-1.5">/</span>
            {pad2(projects.length)}
          </p>

          <span aria-hidden="true" className="relative block h-px flex-1 bg-rule">
            <span
              ref={barRef}
              style={{ width: '20%' }}
              className="absolute inset-y-0 left-0 block bg-signal-2"
            />
          </span>

          {/* Only rendered once Embla is live. Without it these would be two
              buttons that cannot do anything, and the native scroller they sit
              under already works. */}
          {enhanced && (
            <div className="flex shrink-0 gap-2">
              <RailButton
                label="Previous project"
                disabled={!bounds.prev}
                onClick={() => embla?.scrollPrev()}
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
              </RailButton>
              <RailButton
                label="Next project"
                disabled={!bounds.next}
                onClick={() => embla?.scrollNext()}
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </RailButton>
            </div>
          )}
        </div>
      </div>

      <div className="shell">
        <GithubPanel />
      </div>
    </section>
  );
}
