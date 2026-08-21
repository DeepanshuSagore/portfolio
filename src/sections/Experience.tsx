import { SectionHeader } from '../components/SectionHeader';
import { experience } from '../data/content';
import { useReveal } from '../lib/motion';

export function Experience() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="experience" ref={root} className="defer-paint shell scroll-mt-24 py-24 md:py-32">
      <SectionHeader overline="Experience" title="Where I have worked." />

      <ol className="border-b border-rule">
        {experience.map((role, i) => (
          <li
            key={role.company}
            data-reveal
            className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-4 border-t border-rule px-2 py-8 md:grid-cols-[3rem_minmax(0,1fr)_auto]"
          >
            <span className="type-mono-s self-start pt-1.5 text-text-3">
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="min-w-0">
              <h3 className="type-h3 text-text-1">{role.role}</h3>
              <p className="type-mono-m mt-1 text-signal-2">{role.company}</p>

              <ul className="mt-4 space-y-2.5">
                {role.points.map((point) => (
                  <li key={point} className="relative max-w-[68ch] pl-5 text-sm text-text-3">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[0.7em] h-px w-3 bg-rule-strong"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <p className="type-mono-m col-start-2 text-text-3 md:col-start-3 md:text-right">
              {role.period}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
