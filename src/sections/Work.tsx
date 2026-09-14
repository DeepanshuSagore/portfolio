import { ArrowUpRight, Github } from 'lucide-react';
import { useEffect } from 'react';
import { Annotation, CutLabel, Tape, vars, type Accent } from '../components/Material';
import { projects, sections, type Project } from '../data/content';
import { useReveal } from '../lib/motion';
import { onOpenProject } from '../lib/register';

const pad2 = (n: number) => String(n).padStart(2, '0');

const featured = projects.filter((p) => p.featured);
const rest = projects.filter((p) => !p.featured);

function Links({ project, muted }: { project: Project; muted: string }) {
  if (!project.live && !project.repo) {
    return <p className={`type-mono-s uppercase ${muted}`}>{project.note ?? 'Not public'}</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer noopener"
          className="type-mono-s group/link inline-flex items-center gap-1.5 uppercase underline-offset-4 hover:underline"
        >
          View project
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-[var(--dur-micro)] group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
          />
        </a>
      )}
      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer noopener"
          className={`type-mono-s inline-flex items-center gap-1.5 uppercase underline-offset-4 hover:underline ${muted}`}
        >
          <Github aria-hidden="true" className="size-3.5" />
          Source
        </a>
      )}
    </div>
  );
}

/**
 * A filed project panel.
 *
 * The references alternate a black sheet and a yellow one, each behind its own
 * angled tab, with the screenshot taped down so it runs off the panel's right
 * edge rather than sitting inside a frame. The bleed is the point: an image
 * that stops at the border reads as a card, and one that runs past it reads as
 * something laid on top.
 */
function FeaturedPanel({ project, index }: { project: Project; index: number }) {
  const dark = index % 2 === 0;
  const surface = dark ? 'bg-panel-ink text-panel-ink-text' : 'bg-a1 text-a1-ink';
  const muted = dark ? 'text-panel-ink-text/65' : 'text-a1-ink/70';

  return (
    <article id={`work-${project.id}`} data-reveal className="scroll-mt-32">
      <span className={`tab-cut type-mono-s inline-block py-2 uppercase ${surface}`}>
        ✦ Project {pad2(index + 1)}
      </span>

      <div className={`relative overflow-hidden ${surface}`}>
        <div className="grid items-center gap-8 p-7 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:p-10">
          <div>
            <p className={`type-mono-s flex items-center gap-2 uppercase ${muted}`}>
              <span aria-hidden="true" className="block size-1.5 rounded-full bg-current" />
              {project.year} · {project.kind}
            </p>

            <h3 className="type-display-l mt-4 max-w-[12ch] text-current">{project.title}</h3>

            <p className={`mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed ${muted}`}>
              {project.summary}
            </p>

            <dl className={`type-mono-s mt-6 flex flex-wrap gap-x-6 gap-y-1 uppercase ${muted}`}>
              <div className="flex gap-2">
                <dt>Role</dt>
                <dd className="text-current">{project.role}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Stack</dt>
                <dd className="text-current">{project.tags.slice(0, 3).join(', ')}</dd>
              </div>
            </dl>

            <div className="mt-7">
              <Links project={project} muted={muted} />
            </div>
          </div>

          {project.shot ? (
            <div className="relative md:-mr-20 md:translate-x-4">
              <span className="relative block">
                <Tape corner="tl" />
                <Tape corner="tr" />
                <img
                  src={project.shot}
                  alt={`${project.title} in the browser.`}
                  loading="lazy"
                  decoding="async"
                  className="w-full shadow-[var(--t-shadow-lift)]"
                />
              </span>
            </div>
          ) : (
            <p className={`type-hand text-[1.05rem] ${muted}`}>{project.detail}</p>
          )}
        </div>
      </div>
    </article>
  );
}

/** Everything behind the two the résumé documents. */
function GridCard({ project }: { project: Project }) {
  return (
    <article
      id={`work-${project.id}`}
      data-reveal
      className="tilt group flex scroll-mt-32 flex-col border border-line bg-panel shadow-[var(--t-shadow)]"
      style={vars({ '--tilt': 0 })}
    >
      {project.shot && (
        <span className="relative block overflow-hidden border-b border-line">
          <img
            src={project.shot}
            alt={`${project.title} in the browser.`}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover object-top transition-transform duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:scale-[1.03]"
          />
        </span>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="type-h3 text-ink">{project.title}</h3>
          <span className="type-mono-s shrink-0 text-ink-faint">{project.year}</span>
        </div>

        <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed text-ink-soft">{project.summary}</p>

        <div className="mt-4">
          <CutLabel accent={project.accent as Accent} tilt={0}>
            {project.kind}
          </CutLabel>
        </div>

        <div className="mt-5 border-t border-line pt-4 text-ink-soft">
          <Links project={project} muted="text-ink-faint" />
        </div>
      </div>
    </article>
  );
}

export function Work() {
  const root = useReveal<HTMLElement>();

  /* The command palette can open any project. With the rail gone there is no
     carousel to scrub - the card is just an element, so scroll to it. */
  useEffect(() => {
    return onOpenProject((id) => {
      document.getElementById(`work-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, []);

  return (
    <section id="work" ref={root} className="defer-paint scroll-mt-28 py-20 md:py-24">
      <div className="shell">
        <Annotation className="text-base" tilt={-1}>
          the work
        </Annotation>

        <h2 className="type-display-l mt-4 uppercase">Featured works</h2>

        <p className="type-hand mt-4 max-w-[48ch] text-[1.05rem] text-ink-soft">
          {sections.work.lede}
        </p>

        <div className="mt-12 space-y-14">
          {featured.map((project, i) => (
            <FeaturedPanel key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className="mt-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-6">
            <h3 className="type-display-m">Everything else</h3>
            <p className="type-mono-s text-ink-faint">{pad2(rest.length)} projects</p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project) => (
              <GridCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
