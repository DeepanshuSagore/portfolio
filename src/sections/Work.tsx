import { ArrowUpRight, Github } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { Tag } from '../components/Tag';
import { projects, type Project } from '../data/content';
import { useReveal } from '../lib/motion';

/**
 * The work register.
 *
 * Each row uses the stretched-link pattern: the title anchor spans the row via
 * `::after`, so the whole row is one click target and one tab stop, while the
 * secondary source link is raised above it. This keeps the markup valid — no
 * anchor is ever nested inside another.
 */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const primary = project.live ?? project.repo;
  const hasPrimary = Boolean(primary);

  return (
    <li
      data-reveal
      className="group relative grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-3 border-t border-rule px-2 py-7 transition-[background-color,border-color] duration-[var(--dur-standard)] ease-[var(--ease-signal)] hover:border-signal-2 hover:bg-signal-feint has-[a:focus-visible]:border-signal-2 has-[a:focus-visible]:bg-signal-feint md:grid-cols-[3rem_minmax(0,1fr)_auto]"
    >
      <span className="type-mono-s self-start pt-1.5 text-text-3 transition-colors duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:text-signal-2">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="min-w-0 transition-transform duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:translate-x-1.5">
        <h3 className="type-h3 flex items-center gap-2 text-text-1">
          {hasPrimary ? (
            <a
              href={primary as string}
              target="_blank"
              rel="noreferrer noopener"
              className="after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
          {hasPrimary && (
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 shrink-0 text-text-4 transition-[translate,color] duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal-2"
            />
          )}
        </h3>

        <p className="mt-2 max-w-[62ch] text-sm text-text-2">{project.summary}</p>
        <p className="mt-2 max-w-[68ch] text-sm text-text-3">{project.detail}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:col-start-3 md:flex-col md:items-end">
        <span className="type-mono-m text-text-3">{project.year}</span>

        {project.live && <Tag variant="live">Live</Tag>}
        {project.note && <span className="type-mono-s text-text-3">{project.note}</span>}

        {/* Raised above the stretched link so it stays independently clickable. */}
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="type-mono-s relative z-10 inline-flex items-center gap-1.5 text-text-3 transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:text-signal-2"
          >
            <Github aria-hidden="true" className="size-3.5" />
            Source
          </a>
        )}
      </div>
    </li>
  );
}

export function Work() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="work" ref={root} className="defer-paint shell scroll-mt-24 py-24 md:py-32">
      <SectionHeader
        overline="Selected work"
        title="Things I built and shipped."
        counter={`${String(projects.length).padStart(2, '0')} projects`}
      />

      <ul className="border-b border-rule">
        {projects.map((project, i) => (
          <ProjectRow key={project.id} project={project} index={i} />
        ))}
      </ul>
    </section>
  );
}
