import { SectionHeader } from '../components/SectionHeader';
import { stack } from '../data/content';
import { useReveal } from '../lib/motion';

/**
 * Capabilities.
 *
 * This section used to render thirty-nine identically bordered mono chips in
 * six rows. At that density a chip stops being a chip: the borders collide,
 * nothing is emphasised, and the whole block reads as a word cloud - the
 * clearest single "generated" tell on the page.
 *
 * The chrome is gone and the type does the work instead. Each group is one
 * run of slash-separated terms, which is how a spec sheet lists a set, and
 * hovering a term lifts it to primary so the list still answers to a pointer.
 */
export function Stack() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="stack" ref={root} className="defer-paint bg-ink-2 py-24 md:py-32">
      <div className="shell scroll-mt-24">
        <SectionHeader
          chapter="02"
          overline="Capabilities"
          title="The working set"
          lede="What I have actually shipped with, rather than everything I have opened once. Ordered build track first, analyst track second."
          counter={`${stack.length} areas`}
        />

        <dl className="border-b border-rule">
          {stack.map((group) => (
            <div
              key={group.label}
              data-reveal
              className="group grid grid-cols-1 gap-x-8 gap-y-3 border-t border-rule px-2 py-7 transition-colors duration-[var(--dur-standard)] ease-[var(--ease-signal)] hover:bg-ink-3/40 md:grid-cols-[13rem_minmax(0,1fr)]"
            >
              <dt className="flex items-baseline justify-between gap-3 pt-1 md:pr-6">
                <span className="type-overline transition-colors duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:text-text-1">
                  {group.label}
                </span>
                <span className="type-mono-s text-text-3">{String(group.items.length).padStart(2, '0')}</span>
              </dt>

              <dd className="type-mono-m flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5 md:text-[0.9375rem]">
                {group.items.map((item, i) => (
                  <span key={item} className="inline-flex items-baseline gap-2.5">
                    <span className="text-text-2 transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:text-text-1">
                      {item}
                    </span>
                    {i < group.items.length - 1 && (
                      <span aria-hidden="true" className="text-text-4">
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
