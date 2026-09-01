import { SectionHeader } from '../components/SectionHeader';
import { achievements, certificates, education, interests, profile, stats } from '../data/content';
import { countUp, useAnimeScope, useReveal } from '../lib/motion';

function Stats() {
  const root = useAnimeScope<HTMLDListElement>((self, engine) => {
    const nodes = (self.root as HTMLElement).querySelectorAll<HTMLElement>('[data-count]');
    nodes.forEach((node) => countUp(engine, node, Number(node.dataset.count)));
  });

  return (
    <dl ref={root} className="grid grid-cols-2 border-y border-rule md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="border-rule px-2 py-7 even:border-l even:pl-5 md:border-l md:pl-5 md:first:border-l-0 md:first:pl-2"
        >
          <dd className="type-display-m tabular-nums text-text-1">
            <span data-count={stat.value}>{stat.value}</span>
            {stat.suffix}
          </dd>
          <dt className="type-overline mt-3 max-w-[16ch]">{stat.label}</dt>
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
        <SectionHeader
          chapter="04"
          overline="About"
          title="The long version"
          lede="Two tracks that keep turning out to be the same job: work out what is actually breaking, then build the fix."
        />

        <div className="grid gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-16">
          <div data-reveal>
            <p className="type-body-l max-w-[56ch] text-text-2">
              I build software and I analyse process, in Indore, and I have never found a good
              reason to pick one. Fifteen shipped products on one side of that; two years of quality
              and demand-generation work on the other.
            </p>
            <p className="mt-5 max-w-[56ch] text-text-3">
              React and Next.js in front, Node, Express and MongoDB behind, LangChain when a problem
              genuinely needs retrieval. NeuroNest grounds every answer in retrieved passages rather
              than model memory. FinTrack scans receipts and emails the numbers out before anyone
              opens a dashboard. DriveFlow computes a dealership&rsquo;s pipeline from live data
              instead of a static export. The Google AI Hackathon win came out of the same habit:
              scope it, build it, pitch the working thing.
            </p>
            <p className="mt-5 max-w-[56ch] text-text-3">
              For the past year at Ethara.ai I have owned quality checks on a daily queue of written
              responses, judged against a rubric two reviewers have to agree on. Most of that job is
              not scoring. It is noticing which mistakes keep recurring and turning them into
              written guidance so the same fix is not made twice, and catching where the rubric
              reads two ways before a distributed reviewer pool quietly drifts apart. Sitting inside
              LLM post-training is also the fastest way I have found to learn what these models
              actually do.
            </p>
            <p className="mt-5 max-w-[56ch] text-text-3">
              Before that I ran demand generation end to end for a B2B building-materials business:
              calendar, creative and community, and the first point of contact for creators and
              prospective investors. Turning a technical specification into copy a buyer could act
              on is a skill I still use every time I write a README. I lead the debate club at our
              Entrepreneurship Development Cell.
            </p>

            <blockquote className="mt-8 border-l-2 border-signal-2 pl-5">
              <p className="type-mono-m text-text-3">{profile.tagline}</p>
              <footer className="type-overline mt-2">{profile.taglineSource}</footer>
            </blockquote>
          </div>

          <div className="space-y-10">
            <List
              overline="Education"
              items={education.map((e) => ({
                left: e.title,
                sub: e.org,
                right: [e.period, e.meta].filter(Boolean).join('  ·  '),
              }))}
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
