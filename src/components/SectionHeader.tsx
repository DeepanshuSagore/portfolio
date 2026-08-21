/** DESIGN.md Section 5 — SectionHeader: mono overline, display heading, right-flush counter. */
export function SectionHeader({
  overline,
  title,
  counter,
  id,
}: {
  overline: string;
  title: string;
  counter?: string;
  id?: string;
}) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-5">
        <p className="type-overline">{overline}</p>
        {counter && <p className="type-overline tabular-nums">{counter}</p>}
      </div>
      <h2 id={id} className="type-display-l mt-8 max-w-[18ch]">
        {title}
      </h2>
    </header>
  );
}
