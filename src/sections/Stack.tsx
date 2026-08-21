import { SectionHeader } from '../components/SectionHeader';
import { Tag } from '../components/Tag';
import { stack } from '../data/content';
import { useReveal } from '../lib/motion';

export function Stack() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="stack" ref={root} className="defer-paint bg-ink-2 py-24 md:py-32">
      <div className="shell scroll-mt-24">
        <SectionHeader
          overline="Capabilities"
          title="What I reach for."
          counter={`${stack.reduce((n, g) => n + g.items.length, 0)} tools`}
        />

        <dl className="border-b border-rule">
          {stack.map((group) => (
            <div
              key={group.label}
              data-reveal
              className="grid grid-cols-1 gap-x-4 gap-y-3 border-t border-rule px-2 py-6 md:grid-cols-[12rem_minmax(0,1fr)]"
            >
              <dt className="type-overline pt-1">{group.label}</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
