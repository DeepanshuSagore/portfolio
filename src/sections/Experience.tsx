import { SectionHeader } from '../components/SectionHeader';
import { experience, sections } from '../data/content';
import { useReveal } from '../lib/motion';

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Experience.
 *
 * This section previously reused the Work rail. That was the wrong instrument
 * twice over: a pinned, scroll-scrubbed track exists to buy horizontal travel
 * with vertical scroll, and two cards have almost none to buy - on a desktop
 * viewport they sat side by side and the rail never moved. Reusing it also
 * meant two consecutive sections opened with the identical gesture, which is
 * how a page starts feeling like a template.
 *
 * The grammar here is its own: the role holds itself at the top of the
 * viewport while its responsibilities scroll past it. Nothing about that is
 * decorative - it keeps the "who and when" on screen for the whole time the
 * "what" is being read, which is exactly the pairing a reader needs.
 */
export function Experience() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="experience" ref={root} className="defer-paint scroll-mt-24 py-24 md:py-32">
      <div className="shell">
        <SectionHeader
          chapter={sections.experience.chapter}
          overline={sections.experience.overline}
          title={sections.experience.title}
          lede={sections.experience.lede}
          counter={`${pad2(experience.length)} roles`}
        />

        <ol className="border-b border-rule">
          {experience.map((role, i) => (
            <li
              key={role.company}
              data-reveal
              className="grid gap-x-12 gap-y-8 border-t border-rule py-10 md:grid-cols-[minmax(0,0.44fr)_minmax(0,1fr)] md:py-14"
            >
              <div className="self-start md:sticky md:top-[6.5rem]">
                <div className="flex items-baseline justify-between gap-4 md:justify-start md:gap-5">
                  <span className="type-mono-s text-signal-2">{pad2(i + 1)}</span>
                  <span className="type-mono-s text-text-3">{role.period}</span>
                </div>

                <h3 className="type-display-m mt-6 max-w-[14ch] text-text-1">{role.role}</h3>
                <p className="type-mono-m mt-3 text-text-2">{role.company}</p>
              </div>

              <ul className="md:pt-1">
                {role.points.map((point, j) => (
                  <li
                    key={point}
                    className="group grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-3 border-t border-rule-subtle py-4 transition-colors duration-[var(--dur-standard)] ease-[var(--ease-signal)] first:border-t-0 hover:bg-signal-feint"
                  >
                    <span className="type-mono-s text-text-3 transition-colors duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:text-signal-2">
                      {pad2(j + 1)}
                    </span>
                    <span className="max-w-[58ch] text-sm text-text-2">{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
