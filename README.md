# Deepanshu Sagore — Portfolio

Personal site for a GenAI and full-stack engineer. Prerendered React, motion by anime.js, styled against a design system checked into [`DESIGN.md`](./DESIGN.md).

## Stack

| Piece | Choice |
|---|---|
| Build | Vite 6 + TypeScript (strict) |
| UI | React 19, prerendered to static HTML at build time and hydrated |
| Styling | Tailwind CSS v4, tokens declared in `src/styles/tokens.css` |
| Motion | anime.js 4.5 — lazily imported, never on the critical path |
| Icons | lucide-react |
| Type | Archivo, Shantell Sans, Instrument Serif (all self-subset), Geist + Geist Mono |

## Commands

```bash
npm install
npm run dev          # dev server, with react-scan + react-grab attached
npm run build        # typecheck, client build, SSR pass, prerender into dist/
npm run preview      # serve dist/ on :4173
npm run typecheck
npm run doctor       # react-doctor static scan
npm run fonts:build  # regenerate the subset display font (needs uv)
npm run data:github  # regenerate the committed GitHub artefact
npm run data:shots   # re-photograph the live deployments (needs cwebp)
```

`npm run build` runs four steps: `tsc -b`, the client build, an SSR build of `src/entry-server.tsx`, then `scripts/prerender.mjs`, which renders the app to HTML, injects it into `dist/index.html`, and deletes the SSR output. The result is a fully static `dist/` — deployable to Vercel, Netlify or any static host with no server.

## Before deploying — set the site URL

**`.env` holds one value that must be correct: `VITE_SITE_URL`.** It is `https://deepanshuprtfl.vercel.app`. The previous value pointed at an origin that had started answering 404 `DEPLOYMENT_NOT_FOUND`, which silently aimed the canonical link, `og:url`, JSON-LD, `robots.txt` and `sitemap.xml` at a deployment that no longer existed — worth re-checking with `curl` whenever the Vercel project is renamed.

That single value feeds the canonical link, `og:url`, the JSON-LD `url`, `robots.txt` and `sitemap.xml` — the last two are generated into `dist/` at build time rather than kept in `public/`, so they can never drift from the canonical. The build throws if the value is empty rather than shipping a canonical pointing at a domain that isn't yours.

## Layout

```
src/
  App.tsx            page composition
  main.tsx           hydrates the prerendered markup (or mounts fresh)
  entry-server.tsx   render entry for the prerender step
  Showcase.tsx       primitive + state harness, at /?showcase
  data/content.ts    every fact on the site, in one file
  lib/motion.ts      anime.js wrapper: lazy engine, scoped cleanup, reduced motion
  lib/theme.ts       the three-direction store, read off the document attribute
  components/        Button, Tag, RegisterRow, SectionHeader, ThemeSwitcher
  sections/          Nav, Hero, Work, Stack, Experience, About, Contact
  styles/tokens.css  the token contract, as CSS + Tailwind @theme
public/shots/        captured screenshots of the live deployments
```

### Three visual directions

The site ships one application and three art directions — **Sketchbook**, **Editorial** and **Brutalist** — switchable from the nav and persisted in `localStorage`. They are not one design recoloured: colour, measure, display weight, width, tracking, leading, case, border width, shadow, radius and motion timing are all per-direction.

Two things make it work:

- **`tokens.css` holds no literal values.** Every Tailwind entry forwards to a `--t-*` variable, and each direction declares that set. The contract is declared on `html`, not `body`, and that is load-bearing: a custom property whose value is `var(--x)` resolves against the element it is *declared* on, and `@theme` emits into `:root`. Move the attribute down one element and every token resolves to nothing.
- **An inline script in `index.html` sets the attribute before first paint**, so a stored choice is never flashed over by the default. It is parser-blocking on purpose. Because the attribute is already correct when React boots, `lib/theme.ts` reads the DOM rather than re-deriving from storage, and its `useSyncExternalStore` server snapshot keeps hydration exact instead of suppressing a mismatch.

### Project imagery

`npm run data:shots` drives Chromium over every project with a live deployment and writes a WebP into `public/shots/`. Like the GitHub artefact, the output is committed — a deploy that depended on twelve third-party sites being reachable would fail for reasons unrelated to this repository.

Captures are read back before they are kept. A screenshot of a splash screen or a stack trace is exactly the right size and shape to pass unnoticed, and the first run produced both: one site photographed mid-preloader, two returned errors. Loading and blank states are waited out and retried once; errors are reported and the project keeps `shot: null`.

### Content

Everything rendered comes from `src/data/content.ts` — projects, roles, education, links. Editing that file is the whole content workflow; no component holds a hard-coded fact. Projects without a public repository render without a link rather than a dead one.

### Design system

`DESIGN.md` is the contract, not documentation written after the fact. Colours, type steps, spacing, radii, motion timings and accessibility constraints are named there before any component uses them, and `src/styles/tokens.css` is the single place they become CSS. A component should never introduce a raw hex, an arbitrary px value, or an undeclared duration.

Two traps are recorded in the code where they bite, because both fail silently:

- `border-[var(--x)]` is type-ambiguous in Tailwind v4 — it cannot tell a width from a colour, emits nothing, and the border falls back to `currentColor`. Rules and washes are therefore declared as real `--color-*` theme entries.
- Tailwind v4 emits the standalone `translate` property, so a hand-written `transition-[transform,color]` will not animate a `translate-x-*` utility. Name `translate`.

### Motion

`src/lib/motion.ts` owns every animation. Three rules hold throughout:

1. The engine loads lazily, and under `prefers-reduced-motion: reduce` it is never fetched at all.
2. Content is authored visible; a reveal hides its targets only in the instant before animating them in. If JS fails, the engine 404s, or motion is reduced, the page is simply there.
3. Everything is created inside `createScope({ root })` and reverted on unmount, which is what makes React StrictMode's double-mount safe.

## Measured results

Lighthouse via real Chrome over CDP, against the production build, median of 5 runs per form factor:

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | **100** | **100** | **100** | **100** |
| Mobile | **98** | **100** | **100** | **100** |

The mobile gap is FCP/LCP ≈2.0s under simulated Fast 3G with a 4× CPU throttle; the remaining lever is the React runtime itself. Reasoning and the exit path are recorded in `DESIGN.md` §8.

## QA

`/?showcase` renders every primitive against every state — the harness used for breakpoint and state review at 375 / 768 / 1280px. It is a dynamic import, so it costs visitors nothing.
