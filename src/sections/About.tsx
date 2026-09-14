import { Annotation, Boxed, CutLabel, Polaroid, vars, type Accent } from '../components/Material';
import { Readout } from '../components/Readout';
import {
  aboutIntro,
  aboutNarrative,
  achievements,
  certificates,
  education,
  interests,
  profile,
  sections,
  stats,
} from '../data/content';
import { useReveal } from '../lib/motion';

/** Pinned scraps. Each list is a card on the page rather than a column of a
    grid, which is what the references do with this kind of loose detail. */
function Card({
  label,
  accent,
  tilt,
  children,
}: {
  label: string;
  accent: Accent;
  tilt: number;
  children: React.ReactNode;
}) {
  return (
    <div className="tilt border border-line bg-panel p-5 shadow-[var(--t-shadow)]" style={vars({ '--tilt': tilt })}>
      <div className="mb-4">
        <CutLabel accent={accent} tilt={0}>
          {label}
        </CutLabel>
      </div>
      {children}
    </div>
  );
}

function Rows({ items }: { items: readonly { left: string; right?: string }[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.left} className="flex items-baseline justify-between gap-4 border-b border-line pb-2.5 last:border-b-0 last:pb-0">
          <span className="text-sm text-ink-soft">{item.left}</span>
          {item.right && <span className="type-mono-s shrink-0 text-ink-faint">{item.right}</span>}
        </li>
      ))}
    </ul>
  );
}

export function About() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="about" ref={root} className="defer-paint scroll-mt-28 py-20 md:py-24">
      <div className="shell">
        <Annotation className="text-base" tilt={-1}>
          about me!
        </Annotation>

        <div className="mt-10 flex flex-col items-center">
          <span data-reveal>
            <Boxed className="text-[0.8rem]">What&rsquo;s up</Boxed>
          </span>

          {/* The prints sit either side of the handwriting and at different
              heights, which is what stops three items in a row from reading as
              a three-column grid. */}
          <div
            data-reveal
            className="mt-10 grid w-full items-start justify-items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8"
          >
            <Polaroid
              src="/me/portrait.webp"
              alt="Deepanshu Sagore."
              caption="off the clock"
              tilt={-1}
              corners={['tl', 'tr']}
              className="w-40 lg:mt-8"
            />

            <p className="type-hand max-w-[42ch] text-center text-[1.15rem] leading-[1.85] text-ink">
              {aboutIntro}
            </p>

            <Polaroid
              src="/me/workspace.webp"
              alt="A language model fine-tune reporting evaluation loss beside a notebook building a retrieval pipeline."
              caption="my workstation"
              tilt={1}
              corners={['tl', 'tr']}
              className="w-52 lg:-mt-2"
            />
          </div>
        </div>

        {/* The long version. Handwriting carries forty words; this carries the
            argument, so it goes back into ordinary type. */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.75fr)] lg:gap-16">
          <div data-reveal>
            <h2 className="type-display-l max-w-[18ch]">{sections.about.title}</h2>

            {aboutNarrative.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'type-body-l mt-7 max-w-[58ch] text-ink-soft'
                    : 'mt-5 max-w-[58ch] text-ink-soft'
                }
              >
                {paragraph}
              </p>
            ))}

            <blockquote className="mt-9 border-l-[3px] border-a5 pl-5">
              <p className="type-hand text-[1.05rem] text-ink">{profile.tagline}</p>
              <footer className="type-overline mt-2">{profile.taglineSource}</footer>
            </blockquote>
          </div>

          <div data-reveal className="space-y-8">
            <Readout tilt={1} />

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
              {stats.map((stat) => (
                <div key={stat.label} className="border-t border-line pt-3">
                  <dt className="type-overline">{stat.label}</dt>
                  <dd className="type-display-m mt-1 text-ink">
                    {stat.value}
                    {stat.suffix}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div data-reveal>
            <Card label="Education" accent={2} tilt={-1}>
              <Rows items={education.map((e) => ({ left: `${e.title}, ${e.org}`, right: e.period }))} />
            </Card>
          </div>
          <div data-reveal>
            <Card label="Certificates" accent={4} tilt={1}>
              <Rows items={certificates.map((c) => ({ left: c.title, right: c.org }))} />
            </Card>
          </div>
          <div data-reveal>
            <Card label="Achievements" accent={1} tilt={-1}>
              <Rows items={achievements.map((a) => ({ left: a }))} />
            </Card>
          </div>
          <div data-reveal>
            <Card label="Interests" accent={3} tilt={1}>
              <Rows items={interests.map((i) => ({ left: i }))} />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
