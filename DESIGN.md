# Deepanshu Sagore — Portfolio Design System

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
- **Structure:** mono overline (uppercase, `0.18em`) + Display L heading + optional right-flush mono counter.
- **Motion:** heading reveals per-line on scroll; overline fades with a 60ms lead.
- **Layout:** cluster over stack.

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
| Hero grid draw | *novel* | `svg.createDrawable` → `draw: '0 1'` on hairline paths, staggered by grid axis |

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
