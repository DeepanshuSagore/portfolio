import { SectionHeader } from '../components/SectionHeader';
import { achievements, certificates, education, interests, profile, stats } from '../data/content';
import { countUp, useAnimeScope, useReveal } from '../lib/motion';

function Stats() {
  const root = useAnimeScope<HTMLDListElement>((self, engine) => {
    const nodes = (self.root as HTMLElement).querySelectorAll<HTMLElement>('[data-count]');
    nodes.forEach((node) => countUp(engine, node, Number(node.dataset.count)));
  });

  return (
    <dl ref={root} className="grid grid-cols-2 gap-px md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="border-t border-rule px-2 py-6">
          <dd className="type-display-m text-text-1">
            <span data-count={stat.value}>{stat.value}</span>
            {stat.suffix}
          </dd>
          <dt className="type-overline mt-2">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}

function List({
  overline,
  items,
}: {
  overline: string;
  items: readonly { left: string; right?: string; sub?: string }[];
}) {
  return (
    <div data-reveal>
      <p className="type-overline border-t border-rule pt-5">{overline}</p>
      <ul className="mt-4">
        {items.map((item) => (
          <li
            key={item.left + (item.right ?? '')}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule-subtle py-3 last:border-b-0"
          >
            <span className="text-sm text-text-2">
              {item.left}
              {item.sub && <span className="mt-0.5 block text-xs text-text-3">{item.sub}</span>}
            </span>
            {item.right && <span className="type-mono-s shrink-0 text-text-3">{item.right}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function About() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="about" ref={root} className="defer-paint bg-ink-2 py-24 md:py-32">
      <div className="shell scroll-mt-24">
        <SectionHeader overline="About" title="A short account of the work." />

        <div className="grid gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-16">
          <div data-reveal>
            <p className="type-body-l max-w-[56ch] text-text-2">
              I am a final-year engineering student in Indore who spends most of his time on the
              boundary between language models and the products around them. At Ethara.ai I worked
              as an LLM post-trainer — reviewing, correcting and grading model output, annotating
              datasets, and writing prompts designed to catch reasoning failures rather than
              flatter them.
            </p>
            <p className="mt-5 max-w-[56ch] text-text-3">
              That work shapes how I build. NeuroNest refuses to answer outside its retrieved
              context. Aligna scores candidates on a weighted model you can inspect. I care about
              systems that are honest about the limits of what they know, and interfaces that make
              those limits legible to the person reading them.
            </p>
            <p className="mt-5 max-w-[56ch] text-text-3">
              Before engineering took over, I ran social media and design for a manufacturing brand
              and wrote for other creators — which is where the interest in how people actually
              read an interface started. I still lead the debate club at our Entrepreneurship
              Development Cell.
            </p>

            <blockquote className="mt-8 border-l-2 border-signal-2 pl-5">
              <p className="type-mono-m text-text-3">{profile.tagline}</p>
              <footer className="type-overline mt-2">GitHub bio</footer>
            </blockquote>
          </div>

          <div className="space-y-10">
            <List
              overline="Education"
              items={education.map((e) => ({ left: e.title, sub: e.org, right: `${e.period}  ·  ${e.meta}` }))}
            />
            <List overline="Certificates" items={certificates.map((c) => ({ left: c.title, right: c.org }))} />
            <List overline="Achievements" items={achievements.map((a) => ({ left: a }))} />
            <List overline="Interests" items={interests.map((i) => ({ left: i }))} />
          </div>
        </div>

        <div className="mt-16">
          <Stats />
        </div>
      </div>
    </section>
  );
}
