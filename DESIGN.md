# Deepanshu Sagore — Portfolio Design System

> **Sections 0–10 document the dark warm-charcoal build, which no longer ships.**
> They are kept because the reasoning still holds and several constraints
> survived the redirect intact. **[§11](#11-revision-4--three-directions)
> supersedes every colour, typeface and radius below.**

## 0. Research Log

- **Embedded refs:** shortlisted `linear.app` / `vercel` / `voltagent` as Layer B candidates → picked **`gpt-tasteskill.md` (Layer A)** + **`linear.app.md` (Layer B)**, both read in full. Layer A because the brief is explicitly "award winning" and motion-forward (expressive lane, not operational); Layer B because Linear is the reference set's nearest high-craft exemplar for *luminance-stacked dark surfaces* and *aggressive negative display tracking* — the two mechanics this design leans on hardest. `interaction-skill.md` stacked for motion mechanics.
- **Runtime extraction (user-named references):** drove real Chromium against `animejs.com` and `motion.dev` and read `getComputedStyle` + authored CSS custom properties. This lane produced the palette spine and the motion curve, and is the reason this system is **warm** rather than the default cool-gray dark theme:
  - anime.js ships an 8-stop **warm** gray ramp (`#f6f4f2 → #cccac9 → #85837e → #706e69 → #5b5855 → #4a4745 → #3b3937 → #2c2a28`) on a `#171616` body over a `#252423` root, with a single hot accent `#ff4b4b` and a lime string token `#a2db3c`. Display H2 runs 64px/55.36px — **line-height 0.865**, well under 1.
  - motion.dev runs `0px` border-radius CTAs, 11px **Geist Mono uppercase** labels at `.1em`/`.18em` kicker tracking, and one transition curve everywhere: `cubic-bezier(0.16, 1, 0.3, 1)` at `0.14s`. Max content width `980px`. Color authored in OKLCH.
  - React Bits loads **Bricolage Grotesque** (variable, `opsz 12..96`, `wght 200..800`) as its display face.
- **Lazyweb:** 3 queries (`AI agent LLM developer product dark landing`, `personal portfolio engineer projects showcase minimal`, `animation motion library documentation dark accent`), 15 screens downloaded, viewed in detail: the anime.js documentation shell and the "Minimal Gallery" portfolio. **Layout grammar harvested:** (a) anime.js pairs a dense left index rail with a content column, uppercase mono micro-labels (`SINCE 1.0.0`) set right-aligned against the heading, and an "in this section" list of rows with right-aligned `→` affordances; (b) the Minimal Gallery portfolio abandons the card grid entirely and renders Experience / Projects / Connect as **three columns of label-left / meta-right rows with `↗` arrows** — restrained micro-type, no card chrome. This row-register grammar is the single most important anti-slop finding and becomes this system's core primitive.
- **Skipped lanes:** *Imagen concept drafts* — no image-generation tool is available in this harness. Mitigated by the runtime-extraction lane above, which supplied a concrete token contract (real measured values from two of the user's named references) in place of a generated draft.

### Direction commit

**A warm darkroom for an engineering logbook.** The canvas is warm near-black — charcoal that has been *sat in*, never the cool blue-black of default dark mode. Content is ruled into a register by hairlines, like a ledger or a spec sheet, and a single hot vermilion signal appears **only** where something is interactive or being measured. The one moment a visitor remembers: on load, the name resolves character-by-character out of a scramble while the hairline grid behind it draws itself into existence — the page assembling itself from raw material.

Rejected alternatives (recorded so this is a chosen direction, not an averaged one): a Linear-clone cool indigo system (accurate but indistinguishable from every dev portfolio), and a brutalist all-mono terminal (fits the bio, but flattens the project work into undifferentiated text).

---

## 1. Atmosphere & Identity

Warm charcoal darkness with the texture of exposed film. Information sits in a ruled register — hairline separators, mono metadata flush right, display type flush left — so the page reads as an instrument panel rather than a marketing site. Depth comes from *warm luminance stepping*, never from drop shadows: each surface layer is a slightly lighter warm gray, and the only borders are whisper-thin warm-white rules.

**The signature is the hot signal on a ruled warm register**: vermilion is chromatically the only color in the interface chrome, it never decorates, and its arrival on a row is the entire hover language.

---

## 2. Color

Authored in OKLCH for a real perceptual ramp; hex fallbacks are the measured anime.js values.

### Palette

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Canvas deepest | `--ink-0` | `#100F0F` | Body backdrop behind everything |
| Canvas page | `--ink-1` | `#171616` | Page surface (measured: anime.js body) |
| Surface raised | `--ink-2` | `#1E1D1C` | Section bands, alternating register |
| Surface panel | `--ink-3` | `#252423` | Panels, code surfaces (measured: anime.js root) |
| Surface elevated | `--ink-4` | `#2C2A28` | Hover fills, active rows |
| Surface highest | `--ink-5` | `#3B3937` | Pressed states, selected chips |
| Text primary | `--text-1` | `#F6F4F2` | Display headings, key values |
| Text secondary | `--text-2` | `#CCCAC9` | Body copy, row labels |
| Text tertiary | `--text-3` | `#918F89` | Mono metadata, captions, row indices — **the floor for any real text** |
| Text quaternary | `--text-4` | `#85837E` | Decorative `aria-hidden` icons and disabled controls ONLY |
| Text faint | `--text-5` | `#706E69` | Reserved; carries no text in the shipped UI |
| Signal bright | `--signal-1` | `oklch(0.76 0.19 27)` | Hover/active accent, focus ring |
| Signal | `--signal-2` | `oklch(0.665 0.221 26.5)` ≈ `#FF4B4B` | Primary accent, CTA fill |
| Signal deep | `--signal-3` | `oklch(0.54 0.18 26)` | Pressed CTA, accent underlines |
| Signal wash | `--signal-wash` | `color-mix(in oklch, var(--signal-2) 14%, transparent)` | Accent-tinted fills |
| Signal feint | `--signal-feint` | `color-mix(in oklch, var(--signal-2) 6%, transparent)` | Ambient glow, row hover tint |
| Live status | `--live` | `oklch(0.82 0.19 128)` ≈ `#A2DB3C` | **Status only** — deployed/live badges |
| Rule default | `--rule` | `rgba(246,244,242,0.10)` | Register hairlines, card borders |
| Rule subtle | `--rule-subtle` | `rgba(246,244,242,0.06)` | Softest separation |
| Rule strong | `--rule-strong` | `rgba(246,244,242,0.18)` | Focused/hovered row rules |

### Rules

- **Vermilion is the only chromatic color in interface chrome.** It marks interactive state and measured values. Never decorative, never a background wash on a whole section.
- `--live` is reserved for deployment status badges. It never appears on a button, link, or heading.
- Depth is warm luminance stepping (`--ink-1 → --ink-5`), never `box-shadow`. See Section 7.
- Primary text is `#F6F4F2`, never `#FFFFFF` — pure white is harsh on warm charcoal.
- No raw hex in components. Every color resolves through a token above.

---

## 3. Typography

### Font Stack

- **Display:** `Bricolage Grotesque Variable` — variable `opsz 12..96`, `wght 200..800`. Optical sizing is set explicitly at each display step so the face tightens as it scales. Traced to React Bits.
- **Body / UI:** `Geist Variable`.
- **Mono:** `Geist Mono Variable` — the register layer: overlines, row metadata, indices, code, badges. Traced to motion.dev.

**Three families, justified:** Bricolage carries brand personality at display scale (its optical axis is the reason it does not read as generic grotesk); Geist carries reading text; Geist Mono carries the metadata register, which in this layout grammar is roughly a third of all rendered text and must be tabular. Geist and Geist Mono are one superfamily shipped as two files. All three are self-hosted via `@fontsource-variable` (no third-party DNS in the critical path); only the display face is preloaded.

### Scale

| Level | Size | Family | Weight | Line Height | Tracking | Usage |
|-------|------|--------|--------|-------------|----------|-------|
| Display XL | `clamp(3.5rem, 11vw, 9rem)` | Bricolage | 700 | **0.86** | `-0.045em` | Hero name |
| Display L | `clamp(2.5rem, 6vw, 4.5rem)` | Bricolage | 600 | 0.92 | `-0.035em` | Section headings |
| Display M | `clamp(1.75rem, 3.4vw, 2.75rem)` | Bricolage | 600 | 1.0 | `-0.025em` | Sub-section, big stats |
| H3 | `1.25rem` | Bricolage | 600 | 1.25 | `-0.015em` | Row titles, card headers |
| Body L | `1.125rem` | Geist | 400 | 1.62 | `-0.005em` | Lead paragraphs |
| Body | `1rem` | Geist | 400 | 1.6 | normal | Default reading text |
| Body S | `0.875rem` | Geist | 400 | 1.55 | normal | Secondary copy |
| Mono M | `0.8125rem` | Geist Mono | 400 | 1.5 | `0.01em` | Row metadata, code |
| Mono S | `0.75rem` | Geist Mono | 500 | 1.4 | `0.04em` | Badges, indices |
| Overline | `0.6875rem` | Geist Mono | 500 | 1.3 | **`0.18em`** | Section kickers, UPPERCASE |

### Rules

- Display leading runs **under 1.0** — the measured anime.js signature (64px/55.36px). Sub-1.0 leading is what makes the hero read as engineered rather than typed.
- Tracking tightens as size grows (`-0.045em` at hero, `normal` at body). Never positive on display type.
- Overline tracking is `0.18em` (motion.dev `--kicker-tracking-loose`), always uppercase, always mono, always `--text-3`.
- Hero H1 is capped at **2 lines**; the container is `max-w-[15ch]` at display scale so the name breaks by intent, not by accident.
- Body text never below `0.75rem`.

---

## 4. Spacing & Layout

Base unit **4px**.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon-to-label |
| `--space-2` | 8px | Inline groups, badge padding |
| `--space-3` | 12px | Control padding |
| `--space-4` | 16px | Standard gap |
| `--space-5` | 20px | Row vertical padding (compact) |
| `--space-6` | 24px | Row vertical padding (default) |
| `--space-8` | 32px | Between row groups |
| `--space-10` | 40px | Sub-section spacing |
| `--space-12` | 48px | Major internal break |
| `--space-16` | 64px | Section inner padding (mobile) |
| `--space-24` | 96px | Section rhythm (tablet) |
| `--space-32` | 128px | Section rhythm (desktop) |
| `--space-40` | 160px | Hero / chapter separation |

### Grid

- Max content width **1240px**; reading columns cap at **68ch**.
- Gutter: `clamp(1.25rem, 5vw, 4rem)` (mechanics, intentionally not tokenized).
- Section rhythm: `--space-24` mobile → `--space-32` desktop → `--space-40` between chapters.
- Breakpoints: `sm 640` / `md 768` / `lg 1024` / `xl 1280`.
- Register rows are **full-bleed to the content width** with hairline rules spanning the entire row — the ruled-ledger read depends on the rule reaching both edges.

### Radius

Near-zero by commitment. This is the deliberate counter to rounded-everything AI slop, and it is measured from both named motion references (`0px` on motion.dev CTAs, `0px` on anime.js nav).

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-0` | 0px | Buttons, tags, rows, inputs — the default |
| `--radius-1` | 2px | Badges, micro-chips |
| `--radius-2` | 4px | Panels, code surfaces, images |

---

## 5. Components

### Button
- **Structure:** `<button>` / `<a>` with optional leading or trailing Lucide icon at 16px.
- **Variants:** `signal` (filled vermilion), `outline` (hairline rule), `ghost` (no chrome).
- **Spacing:** `--space-3` × `--space-5`; mono `Mono S`, uppercase, `0.04em`.
- **States:**
  - *default* — `signal`: `--signal-2` fill, `--ink-0` text (contrast 7.4:1). `outline`: transparent, `--rule` border, `--text-2`.
  - *hover* — `signal`: fill → `--signal-1`, `translateY(-1px)`. `outline`: border → `--signal-2`, text → `--text-1`.
  - *active* — `signal`: `--signal-3`, `translateY(0)`.
  - *focus-visible* — 2px `--signal-1` outline at 2px offset. Never removed.
  - *disabled* — `--ink-4` fill, `--text-4` text, `cursor: not-allowed`, no transform.
- **Accessibility:** real `<button>`/`<a href>`; icons `aria-hidden`; focus ring never suppressed.
- **Motion:** `transform`/`background-color` on `--ease-signal` at `--dur-micro`.
- **Layout:** cluster.

### RegisterRow — the core primitive
The harvested Minimal-Gallery / anime.js grammar. Every list on this site is a register, not a card grid.
- **Structure:** `<a>` or `<div>` grid — `[index (mono)] [label (Bricolage H3) + optional description] [meta (mono, right)] [arrow]`, hairline `border-top`.
- **Variants:** `link` (navigable, shows `↗`/`→`), `static` (data only, no arrow), `stat` (large value flush right).
- **Spacing:** `--space-6` block padding; `--space-4` column gap.
- **States:**
  - *default* — transparent, `--rule` top border, label `--text-1`, meta `--text-3`.
  - *hover* (link only) — `--signal-feint` fill, top rule → `--signal-2`, index → `--signal-2`, arrow `translateX(4px)`, label `translateX(6px)`.
  - *focus-visible* — same as hover plus 2px `--signal-1` outline inset.
  - *active* — fill `--ink-4`.
  - *empty* — single centered `--text-4` row reading the empty reason.
- **Accessibility:** whole row is one link (single tab stop); arrow `aria-hidden`; meta text has real contrast (`--text-3` on `--ink-1` = 4.6:1).
- **Motion:** transform + background only, `--dur-standard` / `--ease-signal`. Scroll-reveal staggered by `--stagger-row`.
- **Layout:** stack of grid rows; owns no scroll.

### Tag
- **Structure:** `<span>`/`<li>`, mono `Mono S`, uppercase, `--radius-1`, hairline rule.
- **Variants:** `default` (`--text-3` on transparent), `signal` (`--signal-wash` fill, `--signal-1` text), `live` (`--live` text + 6px pulsing dot).
- **States:** *default*; *hover* (only in filterable contexts) rule → `--rule-strong`.
- **Accessibility:** `live` variant pairs the dot with a text label — never color alone.

### SectionHeader
- **Structure:** a hollow **chapter numeral** hanging in the left margin, beside a stack of mono overline (uppercase, `0.18em`) + Display L heading + optional `lede` + optional right-flush mono counter.
- **Why the numeral:** five chapters opening with an identical overline/heading pair made every section arrive at the same pitch, which is the single loudest "generated" tell a long page can have. The numeral gives each chapter its own anchor and a running sense of position, and the `lede` lets a heading be a short phrase rather than a full declarative sentence carrying all the meaning.
- **Spec:** `.chapter-numeral`, Bricolage 700 at `clamp(2.75rem, 7vw, 5.5rem)`, `opsz 72`, filled `transparent` with a `1px --rule-strong` `-webkit-text-stroke`. `@supports`-guarded; the fallback is a solid `--ink-4` figure.
- **Accessibility:** the numeral is `aria-hidden` - it is a position marker, and "zero two" announced before every heading is noise, not orientation.
- **Motion:** heading reveals per-line on scroll; overline fades with a 60ms lead.
- **Layout:** two-column grid (`auto` numeral / `minmax(0,1fr)` content) over stack.

---

## 6. Motion & Interaction

The motion engine is **anime.js v4.5.0** (`animate`, `createScope`, `stagger`, `splitText`, `svg.createDrawable`, `onScroll`, `utils`). It is **loaded lazily** via `loadMotionEngine()` — a dynamic `import('animejs')` — so its ~43KB gzipped never sits on the critical path, and under `prefers-reduced-motion: reduce` it is **never fetched at all** (verified: 1 JS chunk loads instead of 2). Every mechanism below traces to a beui.dev catalog pattern or is recorded as novel.

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | `--dur-micro` 140ms | `--ease-signal` | Hover, press, arrow shift |
| Standard | `--dur-standard` 240ms | `--ease-signal` | Row reveal, tag swap |
| Emphasis | `--dur-emphasis` 620ms | `--ease-signal` | Section entry, hero character reveal |
| Draw | 900ms | `--ease-signal` | Hero hairline grid, staggered 40ms per line |

`--ease-signal` = `cubic-bezier(0.16, 1, 0.3, 1)` — measured verbatim from motion.dev.

### Stagger

| Token | Value | Usage |
|-------|-------|-------|
| `--stagger-char` | 14ms | Hero name resolve |
| `--stagger-row` | 28ms | Register row reveal |
| `--stagger-block` | 60ms | Section child blocks |

### Interaction mechanisms (beui.dev traced)

| Interaction | beui.dev pattern | Mechanism |
|---|---|---|
| Row hover reveal | `shared-layout-bg` | Accent rule + fill glide on the hovered row; transform-only label/arrow shift |
| Hero name resolve | `text-animation` (letter-cascade / scramble) | `splitText` → per-char opacity + `translateY` + scramble, `stagger(14ms)` |
| Section reveal | `scroll-animation` | `onScroll` + `stagger(28ms)`, play once, `repeat: false` |
| Copy-email affordance | `action-swap` | Label swaps to a check on success, reverts after 1.6s; `aria-live="polite"` announces it |
| Stat counters | `number` | Count-up on first intersection |
| Hero registration frame | *novel* | `svg.createDrawable` → `draw: '0 1'` on the three frame paths, staggered 110ms; the SVG box IS the crop-mark box, so the `+` glyphs land on its corners |
| Card spotlight | Magic UI `magic-card` | Delegated `pointermove` writes `--spot-x/--spot-y`; `.spot::before` paints a `--signal-feint` radial at `z-index:-1`. No motion library, no gradient palette |
| Index band | Magic UI `marquee` | N repeated copies translated `-100% - gap` by CSS keyframe; paused on hover/focus-within, `animation: none` under reduced motion |
| Scroll progress | Magic UI `scroll-progress` | One `scaleX` written straight to the header's bottom hairline. No state, no re-render, no gradient |
| Nav position | *novel* | A reading line at 32% viewport height; the active section is the last one whose top is above it |

### Rules

- Only `transform`, `opacity`, `filter`, and color properties animate. Never layout properties.
- All anime.js work is created inside `createScope({ root })` and torn down with `scope.revert()` on unmount — React 19 StrictMode double-mounts, and this is the only safe cleanup path.
- Scroll triggers use anime.js `onScroll` (which wraps IntersectionObserver semantics), never raw scroll listeners.
- **Reduced motion is part of every component, and it is the *absence* of code rather than a parallel path.** Every animated element is authored visible in markup and CSS; a reveal hides its targets in JS only in the instant before animating them back. So under `prefers-reduced-motion: reduce` the motion layer simply never runs: the name renders whole with no split or scramble, the grid renders fully drawn, every row and heading is already at full opacity, counters show their final values, and hover keeps its colour change. The same is true if JS fails or the engine 404s — **content can never be gated behind motion.**
- Every interactive element has hover **and** active **and** focus-visible. Motion that does not signal state is not added.

---

## 7. Depth & Surface

**Strategy: tonal-shift + hairline.** Committed — there are zero `box-shadow` declarations for elevation in this project.

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 | `--ink-0`, no rule | Page backdrop |
| 1 | `--ink-1` | Default page surface |
| 2 | `--ink-2` + `--rule-subtle` top rule | Alternating section bands |
| 3 | `--ink-3` + `1px --rule` | Panels, code blocks |
| 4 | `--ink-4` + `1px --rule-strong` | Hover/active surfaces |
| 5 | `--ink-5` | Pressed, selected |
| Ambient | Radial `--signal-feint` at 40% viewport-width, `filter: blur(80px)` | Hero atmosphere only — one instance per page |

Elevation reads through warm luminance steps and hairline rules. The single ambient vermilion glow behind the hero is the only "light source" and gives the canvas dimension without a flat fill.

---

## 8. Accessibility Constraints & Accepted Debt

### Constraints
- **WCAG 2.2 AA, verified by axe via Lighthouse: accessibility 100 on mobile and desktop.**
- A text token must clear 4.5:1 against the **lightest** surface it can land on, which is `--ink-3` (`#252423`) — not merely against the page background. `--text-3` was originally `#85837E`, which passed on `--ink-1` (4.6:1) but measured **4.44:1 on `--ink-2`** and failed the audit wherever a section band sat behind it. It is now `#918F89`: 5.58:1 on `--ink-1`, 5.20:1 on `--ink-2`, 4.79:1 on `--ink-3`.
- `--text-4` is below the text floor and is therefore restricted to **decorative `aria-hidden` icons** (which need only 3:1 as non-text UI, and measure 4.77:1) and **disabled controls** (exempt under WCAG 1.4.3). `--text-5` carries no text at all. Row index numerals, footer lines and de-emphasised captions all use `--text-3`.
- Other verified pairs: `--text-1` on `--ink-1` = 15.8:1; `--text-2` on `--ink-1` = 10.9:1; `--ink-0` on `--signal-2` = 7.4:1; `--live` on `--ink-1` = 11.2:1.
- Visible `:focus-visible` on every interactive element; focus ring is never removed, including on the filled CTA.
- Full keyboard reachability; each register row is a single tab stop.
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`; one `<h1>`; unique page `<title>`; `lang="en"`.
- `prefers-reduced-motion: reduce` fully honored per Section 6 — content is never motion-gated.
- Status is never conveyed by color alone (the `live` tag pairs its dot with a text label).

### Accepted Debt
| Item | Location | Why accepted | Owner / Exit |
|------|----------|--------------|--------------|
| Imagen concept-draft lane skipped | Research Log | No image-generation tool in this harness; substituted real runtime token extraction from two user-named references | Revisit if a bitmap hero focal object is wanted later |
| Project rows carry no imagery | Work section | No product screenshots supplied. The register grammar is deliberately typographic, so rows read as a ledger rather than a card grid; adding art would fight that | Add screenshots only if the row layout is redesigned around them |
| **Lighthouse mobile performance is 98, not 100** | Whole page | Desktop is 100/100/100/100 over 5 runs; mobile is 98/100/100/100 (one run hit 100). The gap is FCP/LCP/SI/TTI ≈2.0s under Lighthouse's simulated Fast-3G + 4× CPU throttle, and the sole remaining lever is the 72KB-gzipped React runtime — every other cause was fixed at the architecture (prerender, lazy motion engine, CSS strategy, font subsetting). Closing it means replacing React with `preact/compat`, which was judged not worth the runtime risk to a portfolio the owner will maintain as a React project | Revisit if the owner wants the Preact alias; the swap is `resolve.alias` plus `preact-render-to-string` in the prerender step |
| `--dur-micro` / `--dur-standard` are declared in CSS but read by Tailwind arbitrary values, not by the motion layer | `tokens.css` | Hover/press timing lives in CSS transitions while scroll/entry timing lives in JS; both read the same numbers but through different mechanisms | Unify only if a hover ever needs spring physics |

---

## 9. Revision 2 — anti-slop pass

The first build was internally consistent and shipped a real system, and it
still read as generated. Consistency was most of the reason: one row grammar,
one header shape and one section rhythm applied five times running produced a
page with no chapters, only repetitions. This pass keeps the palette, the type
scale, the radius commitment and the motion contract untouched, and changes
what the page does with them.

### What was wrong, and what replaced it

| Symptom | Diagnosis | Change |
|---|---|---|
| Five identical section openings | No chapter structure. Every heading arrived at the same pitch | Hollow **chapter numerals** `01`–`05` hanging in the left margin, plus an optional `lede` so headings can be short phrases (Section 5) |
| Headings read as LLM voice | Full first-person declarative sentences with trailing periods: *"Things I built and shipped."*, *"What I reach for."*, *"Where I have worked."* | Noun phrases carrying the claim, with the substance moved into the lede: *Ten products, end to end* / *The working set* / *Two years, two disciplines* / *The long version*. Contact's heading is now the **address itself**, set large — the one real, useful, actionable string on the page |
| Empty right half of the fold | The instrument readout was a four-across strip pinned to the bottom of the hero, leaving the fold's right side blank | The readout is a **bordered panel beside the intro**. The two halves brace each other, which is what a spec sheet actually looks like |
| The hero's hairline grid was invisible | `--rule` at `0.1` alpha on a `0.1`-width stroke is not a visible line | Two layers: a masked **plot field** (Magic UI `grid-pattern` mechanism) with a handful of lit cells, and a **registration frame** whose three rules bound exactly the box the four crop marks sit on. The frame still arrives by being drawn |
| 39 identically bordered chips in Stack | At that density a chip is not a chip. Nothing is emphasised and the block reads as a word cloud | Chrome removed; each group is one **slash-separated run** of terms, the way a spec sheet lists a set |
| Experience reused the Work rail | A pinned rail buys horizontal travel with vertical scroll, and two cards have none to buy — it did not move on a desktop viewport. It also meant two consecutive sections opened with the identical gesture | A **sticky index**: the role holds itself at the top of the viewport while its own responsibilities scroll past |
| `RegisterRow` — "the core primitive" — was used by nothing | Specified in Section 5, shipped in `Showcase` only | It is now the Contact channel list |
| Nav was five inert words | No position feedback anywhere on a single-page site | `aria-current` **scrollspy**, marked by colour *and* a rule, and the header's bottom hairline doubles as document **scroll progress** |
| Nothing between the Work rail and Stack | The rail shows three of ten cards at a time, so its register is never visible whole | A full-bleed **index band** naming all ten, which also gives the section a close |

### Ported components

Three mechanisms were taken from public registries rather than invented. In
every case the *mechanism* was kept and the *styling* was discarded — none of
them ship their source's colour, radius, easing or dependencies, and each
carries its provenance in a comment at the top of its own file.

| Source | Kept | Dropped |
|---|---|---|
| [Magic UI `marquee`](https://magicui.design/r/marquee.json) | Repeat-N-copies, translate one copy width. Seamless without measuring | `cn`/clsx, `[--duration:40s]` arbitrary values, the padding. Copies past the first are `aria-hidden` |
| [Magic UI `grid-pattern`](https://magicui.design/r/grid-pattern.json) | SVG `<pattern>` of corner strokes, plus the `squares` prop that lights named cells — the reason it beats a CSS background grid | Hard-coded `fill-gray-400/30`, `cn`. Colour is inherited so a token class sets it |
| [Magic UI `magic-card`](https://magicui.design/r/magic-card.json) | A radial wash that follows the pointer inside a card | `motion/react` motion values, `next-themes`, the violet/pink gradient. Position arrives as two custom properties from one delegated, rAF-coalesced listener; the wash is `--signal-feint` |
| [Magic UI `scroll-progress`](https://magicui.design/r/scroll-progress.json) | Scroll fraction as `scaleX` on a fixed hairline | `motion/react` `useScroll`, the three-stop gradient. One transform written straight to the node |

### Constraints this pass did not relax

- No new colour. Vermilion is still the only chromatic value in interface
  chrome; `--live` still appears only on deployment status, and it now actually
  does — the `live` Tag variant Section 5 specifies was previously unused and
  is the **Live** badge on deployed project cards.
- No new dependency. Everything above is CSS plus one pointer listener; the
  bundle graph is unchanged.
- Text tokens still clear the floor. Real text sits at `--text-3` or above
  (group counts, bullet indices and the colophon were all corrected during this
  pass); `--text-4` carries only `aria-hidden` decoration; `--text-5` still
  carries no text.
- Reduced motion is still the *absence* of code. The band stops
  (`animation: none`, and it becomes a plain scroller), the spotlight listener
  is never attached, the frame renders drawn, and nothing is gated.

---

## 10. Revision 3 — the register, and the numbers behind it

### The rail stayed horizontal. The pin did not.

The work section was a pinned, scroll-scrubbed horizontal rail. It read well
and it was the wrong trade, for a reason no amount of craft fixes: **the only
way out of a pin is to spend its entire scroll range.** A visitor who wanted to
know how many projects there were and then move on had to scrub through every
one of them to reach the next section.

The first attempt at a fix replaced it with a vertical disclosure register.
That solved the hijack and introduced a worse problem in its place: fifteen
projects as stacked rows ran past 2,000px, which is a long way to scroll past
work someone has already decided not to read. Trading a hostage scroll for a
long one is not a fix.

So the rail is horizontal again, and the pin is what is actually gone.
Vertical scroll belongs to the page; horizontal travel belongs to the rail;
the two never argue. The section is one card tall whether you engage with it
or not.

| | Pinned scrub | Vertical register | Free rail |
|---|---|---|---|
| Cost of skipping | Its full scroll range | ~2,000px of rows | One flick |
| Section height | Grows with project count | Grows with project count | Fixed, ~700px |
| Projects visible | 3 of 15 | 15 of 15 | 3 of 15, all reachable |
| Who owns vertical scroll | The section | The reader | The reader |

### Embla, and why a dependency was worth it

`embla-carousel-react` drives it: 36M weekly downloads, zero runtime
dependencies, and what shadcn/ui ships underneath its own Carousel. This is the
first runtime dependency added to the project since the motion engine, and it
earns its place on one capability native scrolling does not have — **momentum
drag with a mouse**. A trackpad and a touchscreen can already flick a native
scroller sideways; a mouse cannot, and a rail a mouse user can only reach with
two buttons is a rail most desktop visitors will not use.

It is an **enhancement, and the fallback is real**. The markup and CSS are a
plain native scroll-snap scroller: `overflow-x: auto`, `scroll-snap-type: x
mandatory`, a leading inset as track padding and a trailing inset as a real
flex item. That works with no JavaScript at all — it scrolls, it snaps, it
keyboard-scrolls, and it reaches every card. Embla is initialised in an effect
and writes `data-embla="on"` onto the viewport, which is the only thing that
flips it to `overflow: hidden` and hands scrolling over to Embla's transform.
Same pattern the pinned rail used, applied to a mechanism that is worth
keeping. The prev/next buttons only render once Embla is live, because without
it they would be two controls that cannot do anything.

Measured: track `scrollWidth` 6,928px = 15 cards × 440 + both insets, so the
trailing flex item is being counted. Chrome leaves inline-end padding on a flex
row out of scrollable overflow, and a margin on the last card too; either one
strands the final card flush against the viewport edge with its gutter
unreachable.

The position readout is a **scrollbar thumb, not a progress fill**. A bar that
fills from empty says "you have consumed 0% of this", which at rest reads as
broken. A thumb sized to the share of the rail currently on screen says "you
are here, and there is this much of it", which is the thing a reader wants to
know. It is written straight to the DOM on Embla's `scroll` event — this fires
every frame of a drag, and a re-render per frame would cost more than the rail.

### The numbers are measured, not claimed

`scripts/github.mjs` reads the GitHub REST API and writes
`src/data/github.ts`, which is committed. Three options were considered and two
were rejected:

- **Runtime fetch** — puts a third-party request on the critical path of a page
  whose entire performance argument is that it has none, and blanks the panel
  the moment an anonymous client hits GitHub's 60-per-hour limit.
- **Build-time fetch** — makes every deploy depend on `api.github.com` being
  up, and silently ships different numbers on every rebuild.
- **Committed artefact, with the date it was measured printed beside it** —
  chosen. The page never claims to be live, and it says so in the panel.

The counts distinguish things GitHub conflates: 23 public repos, 21 authored
(forks removed), 17 with code in them (reserved empty names removed), 12
carrying a deployment. The footnote states the difference rather than picking
the flattering number silently. `stats` in `content.ts` now reads from this
artefact and from `projects.length`, which is how "10 shipped projects" was
able to survive to a point where there were fifteen.

The language bar is a **measured value**, which is the one thing Section 2
licenses the signal for: the dominant language carries vermilion and the rest
step down the warm ramp, so the bar ranks correctly even in greyscale and
introduces no colour the page did not already have. Segments are sized by
`flex-grow` and animated with `scaleX` — the track is laid out once and only
the fill moves, so Section 6's no-layout-animation rule holds.

### Command palette

`⌘K` / `Ctrl+K`. Sections, all fifteen projects, and the outbound links, with a
substring match ranked name-before-description. Deliberately not fuzzy: on a
list this small, fuzzy matching mostly produces confident wrong answers.

Built as a **combobox, not a dialog full of tab stops**. The input holds focus
for the whole interaction, results are `role="option"` inside a
`role="listbox"`, and the active one is named by `aria-activedescendant`. That
is the pattern assistive technology already knows, and it means there is no
focus trap to get wrong — there is only ever one focusable element inside. Open
records the previously focused element and restores it on close; `Tab` is
swallowed because there is nowhere legitimate to go.

Selecting a project scrolls the rail to that card. The two components are
connected by a ten-line module-level subscription (`lib/register.ts`) rather
than a context: the only thing they need to agree on is a string, and nothing
between them should re-render because the rail moved.

Discoverability is part of the feature — a shortcut nobody can find is a
shortcut nobody uses — so the hint in the corner states the binding and is
itself the button.

### Two more mechanisms

| Interaction | Mechanism |
|---|---|
| Card title scramble on hover | One pass of the hero's glyph churn, resolving left to right. Pure rAF over `textContent` — it deliberately does **not** load anime.js, because fetching a 22KB engine because a cursor crossed a card would be absurd. Skipped on coarse pointers and under reduced motion; leaving mid-scramble restores the string |
| Deployment strip | The `Marquee` band above the rail runs live **hostnames**, not project names. Those are already in the list below; a row of addresses is different information, and the shortest possible proof that "shipped" is meant literally |

---

## 11. Revision 4 — three directions

The brief changed: one portfolio, three genuinely different art directions,
switchable at runtime. The dark system above became one candidate rather than
the answer, and was dropped — none of the three is a darkroom.

### What replaced the palette

`src/styles/tokens.css` holds **no literal values**. Every Tailwind entry
forwards to a `--t-*` variable, and each direction declares that set:

| | Sketchbook | Editorial | Brutalist |
|---|---|---|---|
| Canvas | `#fbfaf6` warm paper | `#ffffff` | `#f0eee4` bone |
| Backdrop | `#86847e` desk + grid | none | `#0e0e0e` |
| Display | Archivo, 800, `wdth 84` | Instrument Serif, 400 | Archivo, 900, `wdth 125`, upper |
| Hand | Shantell Sans | *(body face)* | *(mono)* |
| Accents | 5 chromatic | stone scale + one red | 4 electric |
| Measure | 1100px | 1280px | 1360px |
| Radius / border | 3px / 1px | 0 / 1px | 0 / 2px |
| Shadow | soft lift | none | `6px 6px 0` hard |

Each accent carries its own ink token (`--t-a1-ink`…) because the pairing is a
contrast decision, not a preference. Every pair clears 4.5:1.

### Rules that survived the redirect

- No raw hex in components. Still true, and now enforced harder — a component
  cannot name a colour that means three things.
- Depth is luminance stepping, not shadow. Still true in two of three;
  brutalist uses a hard offset shadow *as* the direction.
- Tracking tightens as size grows; display leading stays under 1.0.
- `border-[var(--x)]` remains type-ambiguous in Tailwind v4. Rules and washes
  are real `--color-*` theme entries.

### Three traps this revision added

- **Duplicate `@theme` keys do not warn.** Text tokens and the legacy surface
  bridge both claimed `ink-2`/`ink-3`; the later declaration won and shipped
  white type on a bone canvas. Text owns `ink-soft`/`ink-faint` now.
- **The contract must be declared on `html`.** A custom property whose value is
  `var(--x)` resolves against the element it is *declared* on, and `@theme`
  emits into `:root`. On `<body>` every token resolves to nothing.
- **`font-stretch` must cover every `wdth` any direction asks for**, or the
  axis clamps silently and `font-variation-settings` does nothing.

### The material layer

Tape, polaroids, hand-cut labels, marker strokes and folder tabs, all CSS and
inline SVG masks — no bitmap textures, no image assets. Decoration degrades
through the token contract rather than through conditionals: rotation reads
`--t-tilt` (0deg outside sketchbook) and tape paints in `--t-tape`
(transparent there), so one markup tree yields three materials.

The marker stroke is a mask, not a coloured SVG, because a data URI cannot take
a CSS variable. It blends with `multiply` rather than sitting at `z-index: -1`:
an inline span creates no stacking context, so a negative index sends the
stroke behind the *sheet* and it disappears.

### Accepted debt

- Sections 0–10 are not rewritten. The measured research in §0 and the
  accessibility constraints in §8 still apply; the colour and type tables do
  not.
- Motion timings in §6 are per-direction now (`--t-dur` 120–320ms) rather than
  the single 140/240/620 ladder documented there.
