import { THEMES, THEME_META, setTheme, useTheme, type Theme } from '../lib/theme';

/* Written out rather than interpolated: Tailwind scans source text statically,
   so `bg-swatch-${theme}` would compile to nothing at all. */
const SWATCH: Record<Theme, string> = {
  sketchbook: 'bg-swatch-sketchbook',
  editorial: 'bg-swatch-editorial',
  brutalist: 'bg-swatch-brutalist',
};

export function ThemeSwitcher() {
  const active = useTheme();

  return (
    <div
      role="group"
      aria-label="Visual direction"
      className="flex shrink-0 items-center gap-px border border-line bg-line p-px"
    >
      {THEMES.map((theme) => {
        const current = theme === active;
        return (
          <button
            key={theme}
            type="button"
            aria-pressed={current}
            title={THEME_META[theme].note}
            onClick={() => setTheme(theme)}
            className={`type-mono-s flex items-center gap-1.5 px-2 py-1.5 uppercase transition-colors duration-[var(--dur-micro)] ease-[var(--ease-signal)] sm:px-2.5 ${
              current
                ? 'bg-panel-ink text-panel-ink-text'
                : 'bg-canvas text-ink-faint hover:text-ink'
            }`}
          >
            {/* The swatch names the direction; the fill behind it reports the
                selection. Two independent channels, so the control still reads
                correctly with colour discarded entirely. */}
            <span aria-hidden="true" className={`block size-2 ${SWATCH[theme]}`} />
            {/* Below xl the three full labels cost ~290px of bar and push the
                contact button off the end, so only the live one keeps its
                label. The others stay named for assistive tech and on hover. */}
            <span className={current ? '' : 'sr-only 2xl:not-sr-only'}>
              {THEME_META[theme].label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
