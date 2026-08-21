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
| Type | Bricolage Grotesque (display, self-subset), Geist + Geist Mono |

## Commands

```bash
npm install
npm run dev          # dev server, with react-scan + react-grab attached
npm run build        # typecheck, client build, SSR pass, prerender into dist/
npm run preview      # serve dist/ on :4173
npm run typecheck
npm run doctor       # react-doctor static scan
npm run fonts:build  # regenerate the subset display font (needs uv)
```

`npm run build` runs four steps: `tsc -b`, the client build, an SSR build of `src/entry-server.tsx`, then `scripts/prerender.mjs`, which renders the app to HTML, injects it into `dist/index.html`, and deletes the SSR output. The result is a fully static `dist/` — deployable to Vercel, Netlify or any static host with no server.

## Before deploying — set the site URL

**`.env` holds one value that must be correct: `VITE_SITE_URL`.** It is currently `https://deepanshusagore.com`, which is a placeholder and does not resolve yet. Set it to wherever the site actually lives (`https://your-project.vercel.app` is fine) and rebuild.

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
  components/        Button, Tag, RegisterRow, SectionHeader
  sections/          Nav, Hero, Work, Stack, Experience, About, Contact
  styles/tokens.css  the DESIGN.md tokens, as CSS + Tailwind @theme
```

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
