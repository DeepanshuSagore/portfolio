import {
  Annotation,
  Arrow,
  Boxed,
  Bubble,
  CutLabel,
  Pill,
  vars,
  type Accent,
} from '../components/Material';
import {
  achievements,
  certificates,
  education,
  experience,
  interests,
  sections,
} from '../data/content';
import { useReveal } from '../lib/motion';

const pad2 = (n: number) => String(n).padStart(2, '0');

/* One accent per role, oldest last, so the colour tracks the timeline rather
   than being handed out arbitrarily. */
const ROLE_ACCENT: readonly Accent[] = [5, 2, 3];

function Card({
  label,
  accent,
  tilt,
  items,
}: {
  label: string;
  accent: Accent;
  tilt: number;
  items: readonly { left: string; right?: string }[];
}) {
  return (
    <div
      className="tilt border border-line bg-panel p-5 shadow-[var(--t-shadow)]"
      style={vars({ '--tilt': tilt })}
    >
      <div className="mb-4">
        <CutLabel accent={accent} tilt={0}>
          {label}
        </CutLabel>
      </div>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item.left}
            className="flex items-baseline justify-between gap-4 border-b border-line pb-2.5 last:border-b-0 last:pb-0"
          >
            <span className="text-sm text-ink-soft">{item.left}</span>
            {item.right && <span className="type-mono-s shrink-0 text-ink-faint">{item.right}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The timeline.
 *
 * Each role carries two different kinds of fact and they are deliberately
 * given two different shapes: what was DONE is a numbered list, and what was
 * PICKED UP is a speech bubble pinned beside it. Reading only the bubbles
 * gives you the technical arc; reading only the lists gives you the work.
 * A drawn arrow runs between roles so the sequence is stated rather than
 * implied by vertical order alone.
 */
export function Experience() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="experience" ref={root} className="defer-paint scroll-mt-28 py-20 md:py-24">
      <div className="shell">
        <Annotation className="text-base" tilt={1}>
          the road so far
        </Annotation>

        <div className="mt-8 flex flex-col items-center">
          <span data-reveal>
            <Boxed className="text-[0.8rem]">{sections.experience.title}</Boxed>
          </span>
          <p data-reveal className="type-hand mt-6 max-w-[46ch] text-center text-[1.05rem] text-ink-soft">
            {sections.experience.lede}
          </p>
        </div>

        <ol className="mt-14">
          {experience.map((role, i) => (
            <li key={role.company}>
              <article
                data-reveal
                className="grid gap-x-10 gap-y-7 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]"
              >
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="type-mono-s text-a5">{pad2(i + 1)}</span>
                    <span className="type-mono-s text-ink-faint">{role.period}</span>
                  </div>

                  <h3 className="type-display-m mt-4 max-w-[14ch] text-ink">{role.role}</h3>

                  <div className="mt-3">
                    <Pill accent={ROLE_ACCENT[i]} tilt={i % 2 ? 1 : -1}>
                      {role.company}
                    </Pill>
                  </div>

                  <Annotation className="mt-5 max-w-[30ch] text-[1.02rem]" tilt={i % 2 ? 1 : -1}>
                    {role.note}
                  </Annotation>

                  {/* What was picked up, not what was done - so it gets a
                      different shape from the list opposite. */}
                  <Bubble tilt={i % 2 ? -1 : 1} className="mt-9 max-w-[24rem]">
                    <p className="type-overline mb-2.5">Picked up</p>
                    <ul className="flex flex-wrap gap-2">
                      {role.tags.map((tag) => (
                        <li key={tag}>
                          <CutLabel accent={ROLE_ACCENT[i]} tilt={0}>
                            {tag}
                          </CutLabel>
                        </li>
                      ))}
                    </ul>
                  </Bubble>
                </div>

                <ol className="md:pt-14">
                  {role.points.map((point, p) => (
                    <li
                      key={point}
                      className="flex gap-4 border-t border-line py-4 first:border-t-0 first:pt-0"
                    >
                      <span className="type-mono-s shrink-0 pt-1 text-ink-faint">{pad2(p + 1)}</span>
                      <span className="text-[0.95rem] leading-relaxed text-ink-soft">{point}</span>
                    </li>
                  ))}
                </ol>
              </article>

              {i < experience.length - 1 && (
                <div aria-hidden="true" className="flex justify-center py-10 md:py-12">
                  <Arrow className="h-12 w-14 rotate-[118deg] text-line-strong" />
                </div>
              )}
            </li>
          ))}
        </ol>

        {/* Education and certificates moved here from About: a timeline is
            already the right place for them, and About is about who he is. */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div data-reveal>
            <Card
              label="Education"
              accent={2}
              tilt={-1}
              items={education.map((e) => ({ left: `${e.title}, ${e.org}`, right: e.period }))}
            />
          </div>
          <div data-reveal>
            <Card
              label="Certificates"
              accent={4}
              tilt={1}
              items={certificates.map((c) => ({ left: c.title, right: c.org }))}
            />
          </div>
          <div data-reveal>
            <Card label="Achievements" accent={1} tilt={-1} items={achievements.map((a) => ({ left: a }))} />
          </div>
          <div data-reveal>
            <Card label="Interests" accent={3} tilt={1} items={interests.map((i) => ({ left: i }))} />
          </div>
        </div>
      </div>
    </section>
  );
}
