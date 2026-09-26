import { CutLabel, SectionHead, type Accent } from '../components/Material';
import { sections, stack } from '../data/content';
import { useReveal } from '../lib/motion';

/**
 * The toolbox.
 *
 * This section once rendered thirty-nine identically bordered mono chips in
 * six rows. At that density a chip stops being a chip: the borders collide,
 * nothing is emphasised, and the block reads as a word cloud - the clearest
 * single "generated" tell the page had.
 *
 * The references label skills with torn colour tickets, and it is tempting to
 * reach for them here. They carry FOUR. Putting a ticket on all thirty-nine
 * terms would rebuild the word cloud in brighter paint, so the ticket goes on
 * the GROUP - six of them, the references' own density - and the terms stay a
 * slash-separated run, which is how a spec sheet lists a set.
 */
export function Stack() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="stack" ref={root} className="section defer-paint scroll-mt-28">
      <div className="shell">
        <SectionHead
          note="the toolbox"
          title={sections.stack.title}
          lede={sections.stack.lede}
          tilt={1}
        />

        <dl className="mt-12 space-y-6">
          {stack.map((group) => (
            <div
              key={group.label}
              data-reveal
              className="grid grid-cols-1 items-baseline gap-x-8 gap-y-3 border-t border-line pt-6 md:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <dt>
                <CutLabel accent={group.accent as Accent} tilt={group.accent % 2 ? 1 : -1}>
                  {group.label}
                </CutLabel>
              </dt>

              <dd className="type-mono-m flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5 md:text-[0.9375rem]">
                {group.items.map((item, i) => (
                  <span key={item} className="inline-flex items-baseline gap-2.5">
                    <span className="text-ink-soft transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:text-ink">
                      {item}
                    </span>
                    {i < group.items.length - 1 && (
                      <span aria-hidden="true" className="text-ink-faint">
                        /
                      </span>
                    )}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
