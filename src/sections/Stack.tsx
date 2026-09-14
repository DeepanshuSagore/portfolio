import { Annotation, Boxed, CutLabel, type Accent } from '../components/Material';
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
    <section id="stack" ref={root} className="defer-paint scroll-mt-28 py-20 md:py-24">
      <div className="shell">
        <Annotation className="text-base" tilt={1}>
          the toolbox
        </Annotation>

        <div className="mt-8 flex flex-col items-center">
          <span data-reveal>
            <Boxed className="text-[0.8rem]">{sections.stack.title}</Boxed>
          </span>

          <p data-reveal className="type-hand mt-6 max-w-[46ch] text-center text-[1.05rem] text-ink-soft">
            {sections.stack.lede}
          </p>
        </div>

        <dl className="mt-12 space-y-7">
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
