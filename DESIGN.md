# Masthead

> A small, opinionated, letterpress design system. Cool rag paper, blue‑black ink,
> twelve gemstone accents, hairline rules. The page is flat; only buttons lift off it;
> only the cancellation stamp is allowed to be crooked.

Masthead is built from two earlier sketches (`tianlou/`, `old/`) plus two method
references — [RSCSS](https://ricostacruz.com/rscss/) and Julia Evans'
[*Moving away from Tailwind*](https://jvns.ca/blog/2026/05/15/moving-away-from-tailwind--and-learning-to-structure-my-css-/).
This document is the contract. The CSS implements it; the showcase proves it.

---

## 1. The one rule

**A component is a sealed box. It owns how it looks and how its own parts are
arranged inside it. It never owns where it sits.**

| The system owns (intrinsic) | The caller owns (extrinsic) |
| --- | --- |
| `padding`, `border`, `border-radius` | `margin` |
| `height` / `min-height`, intrinsic `min-width` | `width` / `max-width` as a layout constraint |
| `color`, `background`, `box-shadow` | `position`, `top/left/right/bottom` |
| `font`, `letter-spacing`, `line-height` | `flex` / `grid` placement *of the component itself* |
| `display`/`gap`/`align` to arrange the component's **own** named sub‑elements | `gap` between sibling components |
| `:hover` / `:active` / `:focus-visible` / `:disabled` state | responsive breakpoints, page rhythm |
| `transition`, `transform` that is part of the component's identity | the decision of *which* tilt a stamp gets in a cluster |

A `.press-masthead` may set its own three‑region internal grid — that grid *is* the
masthead. It may **not** set its own `margin`, become `position: sticky`, or cap its
own width. Those are the page's decisions, not the component's.

**Why this exists.** The most expensive failure mode of a design system is a
component that looks right in the kit and wrong in the product because it carried
its demo's margins with it. By refusing layout entirely, every component is
trustworthy in every context, and the same boundary tells you exactly which file a
change belongs in. Spacing bugs are never component bugs.

Long‑form vertical rhythm (a blog post) is therefore **not** the system's job. It is
the caller's, until a dedicated, opt‑in `.prose` scope is built (see §9).

---

## 2. Methodology — RSCSS

We follow [RSCSS](https://ricostacruz.com/rscss/) without compromise.

- **Components** are named with **two words**, dash‑separated: `.stamp-button`,
  `.paper-card`, `.press-masthead`, `.cancel-stamp`, `.text-link`, `.form-field`,
  `.data-table`. Two words guarantee no collision with generic/utility names.
- **Elements** are single‑word child classes selected with the **child combinator**:
  `.paper-card > .title`. Avoid bare tag selectors inside components.
- **Variants** are **dash‑prefixed** and nested under the component:
  `.stamp-button.-accent`, `.-ghost`, `.-small`. A variant only ever changes the
  component's own appearance.
- **Helpers** are **underscore‑prefixed** (`._tilt-2`, `._sr-only`), live in one
  file, and may use `!important` — that is their entire reason to exist.
- **One component per file.** Selector depth stays shallow
  (`.component > .element`, occasionally one more). One selector per line.
  `!important` appears *only* in `helpers.css`.

Per Evans: minimal reset, bottom‑up base styles, design values centralised as
custom properties, native `@import` + nesting, no utility soup. Components never
override other components.

---

## 3. Token architecture

Two layers. Components only ever read layer 2.

1. **Primitives — immutable.** Raw scales. Never themed, never overridden by a
   component. The gem ramps, the paper ramp, the ink ramp, spacing, type, radii.
2. **Semantic aliases — remapped.** `--paper`, `--ink`, `--rule`, `--accent`,
   `--accent-deep`, … Their *values* change with `data-theme` and `data-accent`;
   their *names* never change. Components read these and nothing else.

```html
<html data-theme="light" data-accent="lapis">
```

`data-theme` ∈ `light | dark`. `data-accent` ∈ the twelve gem names. Either can be
re‑declared on any subtree to retint a region.

Token names are **explicit**, not terse: `--space-4`, `--text-18`, `--radius-1`,
`--leading-prose`, `--track-eyebrow`, `--gem-ruby-500`, `--paper-50`, `--ink-900`.

### 3.1 Colour — OKLCH, computed

Everything is OKLCH and purely formula‑driven. Hand‑nudging individual channels is
*allowed later* but nothing is hand‑nudged in v1.

**Twelve gems**, each a full **50–900 tonal ramp** (ten steps). The hues are
deliberately spread around the wheel so no two read as the same colour:

> ruby 25° · carnelian 47° · amber 70° · citrine 95° · peridot 128° ·
> emerald 158° · malachite 185° · turquoise 213° · sapphire 250° ·
> lapis 280° · amethyst 310° · tourmaline 350°

The ramp is one shared shape applied to every gem:

- A shared **lightness scale** `--ramp-l-50 … --ramp-l-900` (≈ 0.972 → 0.246).
- A shared **chroma multiplier** `--ramp-c-50 … --ramp-c-900`, peaking at 500 and
  tapering at both ends (tints and shadows can't hold chroma).
- Per gem: one **hue** and one **peak chroma**. The ramp is
  `oklch(L  calc(mult × peakC)  hue)`.

So `--gem-ruby-500` is the gem; `--gem-ruby-100` ≈ a paper wash of it;
`--gem-ruby-800` ≈ it dragged toward ink. `tint`, `base`, `deep` are just readable
aliases onto 100 / 500 / 800. Adding or retuning a gem is **two numbers**.

**Neutrals are two separate ramps**, same 50–900 shape:

- `--paper-50 … --paper-900` — a cool blue‑white family (chroma ≈ 0, faint 250° cast). *Never cream.*
- `--ink-50 … --ink-900` — a blue‑black family (250–255° cast). *Never pure black, never OLED.*

### 3.2 Semantic colour mapping

| Alias | Light | Dark |
| --- | --- | --- |
| `--paper` | `paper-50` | `ink-900` |
| `--paper-sunk` | `paper-100` | `ink-800` |
| `--paper-edge` | `paper-200` | `ink-700` |
| `--ink` | `ink-900` | `paper-100` |
| `--ink-2` | `ink-700` | `paper-300` |
| `--ink-3` | `ink-500` | `paper-500` |
| `--rule` | `paper-300` | `ink-600` |
| `--rule-soft` | `paper-200` | `ink-700` |
| `--rule-strong` | `ink-2` | `paper-400` *(the firmest stroke — never pure ink)* |
| `--accent` (text / marks / edges) | `accent-500` | `accent-500` |
| `--accent-solid` (filled controls) | `accent-700` | `accent-400` |
| `--accent-soft` | `accent-200` | `accent-600` |
| `--accent-tint` | `accent-100` | `accent-800` |
| `--accent-deep` | `accent-800` | `accent-300` |
| `--accent-on` (text on `--accent-solid`) | `paper-50` | `ink-900` |
| `--accent-chroma` (ramp chroma ×) | `1` | `0.78` *(muted — candlelit, not glaring)* |

`data-accent="<gem>"` points the `--accent-*` ramp at that gem's hue/chroma; the
theme then chooses which steps the aliases resolve to.

**`--accent` vs `--accent-solid`.** A single mid gem can't be both a legible mark
*and* a filled background under text. So `--accent` is the colour for text, marks
and edges on paper; `--accent-solid` is the one for filled controls (the accent
button). Because the ramp's **lightness is hue‑uniform** (every gem shares
`--ramp-l-*`), a fixed step is guaranteed to clear WCAG AA against `--accent-on`
for *all twelve* gems at once: light uses `accent-700` + white text (~5.9:1); dark
uses `accent-400` + ink text (~5:1). One rule, no per‑gem tuning.

**Dark muting.** Rather than a brighter step, dark mode keeps a mid step and lowers
`--accent-chroma` to `0.78`, scaling chroma across the whole accent ramp at the
formula level. The gem reads *lit by a candle*, never *lit by a screen* — and
nothing else in the architecture has to change.

Semantic status, when ever needed, borrows gems with intent (success = emerald,
warning = amber, danger = ruby, info = sapphire). There are **no generic
blue/red/green** and **no status‑badge component** (see §6).

### 3.3 Type

- **Serif — EB Garamond.** Body, prose, headings. Old‑style figures by default
  (`onum`), real italics, small caps.
- **Display — League Spartan.** Eyebrows, labels, chrome, masthead nav.
  Geometric; takes uppercase + tracking without shouting.
- **Mono — IBM Plex Mono.** Code, tabular data, serials.
- Loaded from the Google Fonts CDN via `@import` (chosen for zero font management;
  the trade‑off is the showcase needs the network).

The scale is **fixed rem steps** the components reference directly
(`--text-12 … --text-84`). Responsiveness is the caller's job (§1), so fluid type is
**opt‑in**: a tiny set of `--display-1/2/3` `clamp()` tokens the caller may reach for
on hero/masthead moments — exactly the same shape as the deferred `.prose` decision.
A foundry sells 12pt and 36pt, not "clamp"; the system ships the specimen, the caller
decides the room.

**Base size & rhythm.** The root is left at the reader's default
(`html { font-size: 100% }` ≈ 16px) and the rem scale is authored against that, so
`--text-18` resolves to a true **18px** body — the best‑practice long‑form reading
size — without hard‑pinning the root or inflating every other token. Line‑height
follows length: prose `--leading-prose` 1.55, headings `--leading-snug` 1.18,
display `--leading-tight` 1.05 (the longer the line, the looser the leading).
Headings get `text-wrap: balance`, body gets `text-wrap: pretty`.

**Contrast.** Body ink on paper is ~16:1; the faintest text token (`--ink-3`) still
clears AA on paper, and dark‑mode text is deliberately paper‑100 (not pure white) to
hold AA while avoiding halation. Filled accent controls clear AA via `--accent-solid`
(above). Contrast is a system guarantee, not a per‑screen afterthought.

### 3.4 Space, radii, rules

- Spacing: a 4px ruler, `--space-1: 4px … --space-24: 96px`. Used **only** for
  intrinsic padding and a component's own internal `gap`. Never emitted as `margin`.
- Radii: almost none. `--radius-0: 0`, `--radius-1: 1px`, `--radius-2: 2px` (max),
  `--radius-pill` exists for the postmark only. *Print has no radii.*
- Rule weights: `--rule-1: 1px` (hairline — does most structural work),
  `--rule-2: 2px`, `--rule-3: 3px`. The firmest a stroke ever gets in *colour*
  is `--rule-strong` (≈`ink-2`), **never pure ink** — jet‑black 2–3px strokes
  read as harsh, so table heads, framed plates and heavy rules use the softened
  value at 1px.

---

## 4. Elevation — the page is flat

The defining decision. Most of the system has **no shadow at all**. Three exceptions,
each physically motivated.

### 4.1 Surfaces — stacked paper, no blur

A `.paper-card` is flat by default. When lifted (`.-stack-1`, `.-stack-2`), elevation
is **literal duplicate sheets of paper** offset behind it: a hairline `--rule`
border, translated down‑and‑right, **no blur, no rotation**. Each deeper sheet sits
further into shadow — `--sheet-1` darker than the page, `--sheet-2` darker still
(in dark mode they are rim‑lit a touch *lighter*, since you can't go darker than a
near‑black page). The look is carried over from `old/`.

**When to use which** — elevation encodes *how much is behind the surface*, never
interactivity (pressing is the button's job, never a card's):

- **flat** (default) — the resting state of almost everything: list rows, form
  panels, peers in a grid. If unsure, flat.
- **`-stack-1`** (one sheet) — "there is more behind this one": a card standing
  for a set (a thread, an album, a folder), or a single item promoted above its
  peers (featured / pinned).
- **`-stack-2`** (two sheets) — the heavy pile: a deep archive, a draft stack, one
  hero object, or a lifted dialog. Sparingly; never a whole grid of them.

### 4.2 Buttons — the only thing on top of the paper

A button is a **matte solid object** on the paper — *not* a glossy web button.
Loud gradient + bright bevel + border is the dated Aqua/Bootstrap‑2 tell; we avoid
it deliberately. The form is read from the **cast shadow**, not from shine:

1. **A face modelled by one light.** `--btn-face` is two radial layers, not a
   linear fill: a key‑light pool at the **upper‑left** (where the light lands) and
   the surface curving into its own **shade at the lower‑right**. That diagonal
   value range is what stops it reading as a flat UI fill and makes it look like a
   solid catching light from one side. A minimal `--btn-bevel` only crisps the
   edge. The accent button has **no border** at all.
2. **A real cast shadow** — two ink‑tinted layers under that same upper‑left
   light, thrown down‑and‑right onto the paper (`--cast-rest`). The face‑shade and
   the cast share one light direction, so the object reads as genuinely lit, and
   sits clearly off the page.
3. **State is light, not motion.** Hover *brightens the source* — `brightness`↑
   and a stronger key pool (`--btn-face-hover`) — the object does **not** jump.
   Press lets it *settle*: ~1px of travel, the cast collapsing (`--cast-press`),
   and the *same* face with a touch less light reaching it (`--btn-face-press` +
   a gentle `--btn-bevel-press`). **No brightness filter, no colour shift** — the
   position drop and the shadow collapse carry the press entirely. The accent
   button fills with `--accent-solid` and that colour does not change on press.
4. **An engraved label** — `--btn-engrave` sets a 1px lit lip under the glyphs so
   the type reads as cut into the face (a dark‑walled variant on accent fills).

All moulding alphas are pure black/white over the colour, so any gem works and
both themes stay coherent. `.-ghost` is the deliberate exception: a flat token,
no moulding, sitting almost flush.

### 4.3 Links — flat

Links cast nothing. They are marginalia, not objects. Affordance is carried by a
visible ink underline, an accent shift on hover, and a real `:focus-visible` ring —
accessibility is non‑negotiable even though the link is flat.

### 4.4 The cancellation stamp — pressed in, not raised

See §6. It has no elevation; it is ink driven *into* the page by a librarian.

---

## 5. Motion

Restrained, mechanical, honest. Default transition ≈ 120ms; the button press is
~70ms ease‑out. No bounce, no spring, no scale‑up‑on‑hover, no parallax.
`@media (prefers-reduced-motion: reduce)` collapses all of it globally.
Focus ring: `2px solid var(--accent)` at `2px` offset, everywhere, always.

---

## 6. The cancellation stamp

There are **no status badges** in Masthead. The only badge‑like component is the
**cancellation stamp** — a rubber/postal impression a librarian thumped onto the
page for *Cancelled · Void · Expired · Archived · Paid · Draft*.

`.cancel-stamp`

- Rectangular. Uppercase, heavily tracked display type.
- A **double‑rule inkpad outline**: a `2px` border plus a `box-shadow` ring just
  outside it — the doubled edge real stamps leave.
- **Ink‑bled** via reduced `opacity` (≈ .82) — uneven coverage, not crisp print.
- A small **intrinsic tilt** (it is part of the stamp's identity that it is never
  perfectly square to the page).
- **No strikethrough.** The v4 diagonal slash is removed.
- Colour follows **`--accent`** by default; explicit gem variants override
  (`.-ruby`, `.-tourmaline`, `.-emerald`, `.-amber`, `.-sapphire`). The variant
  just re‑points the accent hue/chroma, so it stays theme‑correct.

`.cancel-stamp.-postmark` — the one variant: a circular, two‑line postmark with a
concentric ring. It **scales to its own text** (`aspect-ratio:1` + a `min-width`
floor) so it stays a true circle and can never overflow. Use once, deliberately
(a single PAID/VOID seal), never in clusters.

**Tilt variety** for clusters (a tag cloud of stamps) is *not* the component's job —
which stamp leans which way is a caller/arrangement concern. It is delivered as
generic helpers `._tilt-1 … ._tilt-6` (symmetric, both directions, `!important`).
The caller applies them; the component keeps only its single default tilt.

---

## 7. Inventory

### Core (built in v1)

| Component | Variants / elements |
| --- | --- |
| `.stamp-button` | `.-accent` `.-ghost` `.-small` `.-large`, `:disabled`, `> .icon` |
| `.form-field` | `> .label` `> .input`; `.-boxed` (mail‑order box) vs default underline |
| `.paper-card` | `.-stack-1` `.-stack-2` `.-framed`; `> .title` `> .body` `> .foot` |
| `.data-table` | `> thead/tbody` styling; `.toc-row` (`> .leader` `> .meta`) |
| `.press-masthead` | `> .title` (lowercase italic) `> .nav` (`a[aria-current]` gets the accent dot) |
| `.cancel-stamp` | `.-postmark`, gem overrides `.-ruby` `.-tourmaline` `.-emerald` `.-amber` `.-sapphire` |
| `.text-link` | `.-reference` (↗) `.-runninghead` (small‑caps nav) |

**Primitives:** type roles (`.t-display`, `.t-heading`, `.t-body`, `.t-lede`,
`.t-eyebrow`, `.t-label`, `.t-mono`, `.t-meta`, `.t-tabular`), hairline rule
(`.rule`, `.rule-thick`, `.rule-double`), `.fleuron-divider`, `.ornament`.

`.text-link.-runninghead` is for printed‑page‑style navigation cues: a section
pager (`◂ Prologue · Chapter II · Chapter III ▸`), an article footer "next" link,
in‑page section jumps, or a quiet running header — anywhere a small‑caps tracked
cross‑reference reads better than a button.

**Helpers:** `._tilt-1…6`, `._sr-only`. (`._prose` — see §9.)

### Deferred — documented, not built in v1

Treated exactly like `.prose`: named, scoped, *not* implemented until a real
use‑case needs it.

- Components: instrument gauge, tabs, switch, kbd, `.text-link.-folio` (leader
  dots), `.text-link.-manicule` (☞).
- **Drop cap** — intentionally not a primitive. A drop cap is a forward,
  per‑article editorial decision (which letter, how many lines, hung or sunk),
  not a system default. Build it at the caller/`.prose` layer if a publication
  wants one.
- **Press Ornaments tier** (own file when built, "use rarely, deliberately"):
  cartouche frame, ticket / perforation, vertical‑type, serial number, microtype.
- `._prose` scope (§9).

The showcase renders deferred items as documented stubs, not working code.

---

## 8. Files

Authoring is split (RSCSS one‑component‑per‑file + Evans' per‑component structure).
`masthead.css` is the only thing a consumer links; it `@import`s the rest in
cascade order.

```
masthead.css                 entrypoint — @import in order:
  tokens/colours.css           gem ramps, paper/ink ramps, semantic aliases, theming
  tokens/type.css              families, fixed scale, opt-in --display-*, leading, tracking
  tokens/space.css             spacing, radii, rule weights
  tokens/shadows.css           --lift-*, --cast-* (paper stack, button cast)
  base.css                     thin reset + bare-tag APPEARANCE ONLY (zero spacing)
  components/stamp-button.css
  components/form-field.css
  components/paper-card.css
  components/data-table.css
  components/press-masthead.css
  components/cancel-stamp.css
  components/text-link.css
  helpers.css                  ._tilt-*, ._sr-only  (the only !important)
DESIGN.md
showcase.html                  single file, HTML+CSS only, <link> masthead.css
old/  tianlou/                 source sketches (reference only)
```

---

## 9. `.prose` (deferred)

**Job:** wrap long‑form content and supply *only* the vertical rhythm and reading
measure the system deliberately refuses to put on bare tags — the Evans
`._prose > * + *` lobotomised‑owl pattern, plus an optional `max-width` measure.

**Status:** documented, **not in core**. Until it ships, long‑form rhythm is the
caller's responsibility. The showcase's devblog use‑case demonstrates this honestly:
its prose rhythm lives in **showcase‑only (caller) CSS**, explicitly labelled "this
spacing belongs to the caller, not Masthead."

---

## 10. Showcase

One HTML file, HTML + CSS only, no JavaScript, linking `masthead.css`. Any layout in
it lives in a clearly separated `caller-layer` `<style>` block — the showcase is a
consumer and proves the boundary by obeying it.

1. **Isolation gallery** — every token (gem ramps, paper/ink, spacing, type
   specimen, radii, shadows), every primitive, every core component with all
   variants and states (`:hover`/`:active`/`:focus`/`:disabled` shown statically),
   helpers, light **and** dark, a couple of `data-accent` retints. Deferred items
   appear as labelled stubs.
2. **Three use‑cases** (core‑only), each a different accent to prove single‑accent
   retinting:
   - **Devblog article** — `data-accent="lapis"`: press‑masthead, display type, an
     auto‑style "Contents" (`.toc-row` with reading‑time meta) at the top, fleuron
     dividers, a `DRAFT` cancel‑stamp, reference links, and `.prose` rhythm
     supplied at the caller layer.
   - **Catalogue / index** — `data-accent="emerald"`: press‑masthead, paper‑card
     "plates", running‑head links, a section pager.
   - **Subscription panel** — `data-accent="amber"`: form‑field, every button
     state, paper‑card elevation, a `PAID` cancel‑stamp.

---

## 11. Voice (inherited, unchanged)

Restrained, typographically literate, professional. Title Case headings; UPPERCASE
tracked (0.18em) eyebrows/labels; sentence case body. Em dashes, curly quotes,
Oxford comma, old‑style figures in prose / lining figures in tables. **No emoji** in
chrome — Unicode ornaments (`❦ ❧ ✦ § ¶ №`) instead. Every flourish earns its place;
no Victorian cosplay.
