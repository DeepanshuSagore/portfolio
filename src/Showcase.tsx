import { ArrowUpRight } from 'lucide-react';
import { Button, ButtonLink } from './components/Button';
import { EmptyRow, RegisterRow, StaticRow } from './components/RegisterRow';
import { SectionHeader } from './components/SectionHeader';
import { Tag } from './components/Tag';

function Bay({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule py-10">
      <p className="type-overline mb-6">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  );
}

export function Showcase() {
  return (
    <div className="grain min-h-[100dvh] py-20">
      <div className="shell">
        <SectionHeader
          chapter="00"
          overline="Design QA"
          title="Primitive showcase."
          counter="4 primitives"
          id="showcase-heading"
        />

        <Bay label="Button / signal - default, disabled">
          <ButtonLink href="#" variant="signal" icon={<ArrowUpRight aria-hidden="true" className="size-4" />}>
            View work
          </ButtonLink>
          <Button variant="signal" disabled>
            Disabled
          </Button>
        </Bay>

        <Bay label="Button / outline - default, disabled">
          <ButtonLink href="#" variant="outline">
            Résumé
          </ButtonLink>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </Bay>

        <Bay label="Button / ghost - default, disabled">
          <ButtonLink href="#" variant="ghost">
            Ghost action
          </ButtonLink>
          <Button variant="ghost" disabled>
            Disabled
          </Button>
        </Bay>

        <Bay label="Tag - default, signal, live">
          <Tag>LangChain</Tag>
          <Tag variant="signal">Featured</Tag>
          <Tag variant="live">Live</Tag>
        </Bay>

        <section className="border-t border-rule py-10">
          <p className="type-overline mb-6">RegisterRow - link, static, empty</p>
          <div className="border-b border-rule">
            <RegisterRow
              href="#"
              index="01"
              label="Link row"
              description="Hover or focus this row: the rule takes the signal, the index warms, the label and arrow shift."
              meta="2026"
            >
              <div className="flex gap-1.5">
                <Tag>React</Tag>
                <Tag>TypeScript</Tag>
              </div>
            </RegisterRow>
            <StaticRow index="02" label="Static row" description="Data only. No arrow, no hover." meta="2025" />
            <EmptyRow>No entries yet.</EmptyRow>
          </div>
        </section>

        <Bay label="Type scale">
          <div className="w-full space-y-6">
            <p className="type-display-xl">Display XL</p>
            <p className="type-display-l">Display L</p>
            <p className="type-display-m">Display M</p>
            <p className="type-h3">Heading 3</p>
            <p className="type-body-l text-text-2">Body large - the quick brown fox jumps over the lazy dog.</p>
            <p className="text-text-3">Body - the quick brown fox jumps over the lazy dog.</p>
            <p className="type-mono-m text-text-3">Mono M - 0123456789</p>
            <p className="type-mono-s text-text-3">MONO S - 0123456789</p>
            <p className="type-overline">Overline</p>
          </div>
        </Bay>

        <Bay label="Surface ladder - ink-0 through ink-5">
          {(['bg-ink-0', 'bg-ink-1', 'bg-ink-2', 'bg-ink-3', 'bg-ink-4', 'bg-ink-5'] as const).map((bg) => (
            <div
              key={bg}
              className={`${bg} type-mono-s flex size-24 items-end border border-rule p-2 text-text-3`}
            >
              {bg.replace('bg-', '')}
            </div>
          ))}
        </Bay>

        <Bay label="Signal ramp">
          {(['bg-signal-1', 'bg-signal-2', 'bg-signal-3'] as const).map((bg) => (
            <div key={bg} className={`${bg} type-mono-s flex size-24 items-end p-2 text-ink-0`}>
              {bg.replace('bg-', '')}
            </div>
          ))}
          <div className="type-mono-s flex size-24 items-end border border-rule bg-signal-wash p-2 text-text-2">
            wash
          </div>
          <div className="type-mono-s flex size-24 items-end border border-rule bg-signal-feint p-2 text-text-2">
            feint
          </div>
        </Bay>
      </div>
    </div>
  );
}
