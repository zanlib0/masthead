# Migrating from v0.1 to the app register

This release makes Masthead work for applications as well as articles: a 16px
root, one UI size, a typeset button, app‑ready tables and forms. Almost every
change is visible, and several are breaking. This page lists every old‑to‑new
mapping, with examples from real apps.

## Before you upgrade: pin your link

The CDN link in the README (`https://cdn.jsdelivr.net/gh/zanlib0/masthead/dist/masthead.min.css`)
has no version, so it follows `master`. When this lands, every page on that link
changes at once. Pin to the last v0.1 commit first, then upgrade deliberately:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/zanlib0/masthead@<v0.1 commit>/dist/masthead.min.css">
```

## 1. The root is 16px: multiply your rem values by 1.5

`html { font-size: 150% }` is now `100%`. One rem was 24px; it is now 16px
(at default browser settings). Masthead's own tokens are re‑valued for this.
**Your** caller CSS is not: every rem value you wrote now renders at two thirds
of its old size.

To keep a caller layout value the same size, multiply it by 1.5:

| You wrote | Renders as | To keep the old size |
|---|---|---|
| `max-width: 48rem` | 768px (was 1152px) | `72rem` |
| `minmax(20rem, 1fr)` | 320px (was 480px) | `30rem` |
| `height: 12rem` (a chart) | 192px (was 288px) | `18rem` |

Often the smaller value is what you want in the app register — check each one
rather than converting blindly.

**Spacing tokens** are now 4px steps (were 6px). `--space-N` is `N × 4px`. To
keep the old pixel size of `--space-N`, use `--space-(1.5 × N)` where it exists
(`--space-4` 24px → `--space-6`; `--space-8` 48px → `--space-12`;
`--space-2` 12px → `--space-3`). The ruler is now contiguous from `--space-1` to
`--space-12` (plus 16, 20, 24), so `--space-7` — undefined before and silently
ignored — now exists (28px).

Remove any root override such as `@media (max-width: 30rem) { html { font-size: 100% } }`:
the root is the same on every viewport now.

## 2. Type tokens

| Old | New |
|---|---|
| `--text-2xs`, `--text-xs`, `--text-sm`, `--text-ms` | **`--text-ui`** (removed; one chrome size, 16px) |
| `--text-base` | **`--text-body`** (removed) |
| `--text-subhead`, `--text-h4`, `--text-lede`, `--text-h3`, `--text-h2`, `--text-display` | same names, **re‑valued**: compact app sizes at the root, the old book sizes inside `.prose` |
| `--display-3` (`… + var(--text-sm)`) | now `… + var(--text-ui)` |
| `--track-subhead` | `--track-caps` (0.06em, for small caps) |
| `--track-eyebrow`, `--track-button` | removed |
| `--font-display` (League Spartan) | removed — the font is gone |

**Body text is 16px at the root.** For an article, wrap it in `.prose` — it
remaps the scale to the reading sizes (24px body, the old heading ladder),
restores old‑style figures and supplies the vertical rhythm. Remove your own
`> * + *` spacing; keep only your `max-width`.

```html
<article class="prose" style="max-width: 64ch">…</article>
```

**Row text.** `.t-body` or `font-size: var(--text-base)` used as table or list
row text (Feiten's table cells, Pearview's rows) was 24px book text. Drop the
class: chrome already sets `--text-ui`. If you need the token, use `--text-ui`.

**Lining figures are the default in chrome.** Remove any caller rule that
overwrites `font-feature-settings` to force lining figures (Feiten does this) —
it drops kerning and ligatures, and it is no longer needed. Inputs inherit
lining figures too. For aligned columns use `.t-tabular` or the table's
`.-numeric` cells.

**Mono matches the serif.** `body` sets `font-size-adjust: 0.4`, so Plex Mono is
scaled to Garamond's x‑height. Remove caller shrinks such as
`font-size: 0.8em` on code.

## 3. Removed and renamed classes

| Old | New |
|---|---|
| `.stamp-button` | **`.press-button`** (no alias) — see §4 |
| `.t-eyebrow` | removed, no alias. Use `.t-meta` for a caption, `h6` for a small heading, `.t-subhead` for a small‑caps subtitle — or drop the label |
| `h6` (League Spartan eyebrow) | now a quiet roman heading at `--text-ui`, medium, in `--ink-2` |
| `.t-subhead` (lowercase + small‑caps hack) | real `all-small-caps` at `--text-subhead`; your text's case is kept |
| `<table class="data-table">` | **`<div class="data-table"><table>…</table></div>`** — see §5 |
| `.data-table.-numeric` (whole table) | `.-numeric` on each number **cell** (`th`/`td`) |

Labels (form labels, table heads, card feet, running heads, toc meta, cite, the
seal) are now real small caps with **no `text-transform`**. Write the text in
the case you want; don't pre‑uppercase it. `.press-masthead` no longer
lower‑cases its title or links: write `NASA Ops` and it shows `NASA Ops`.

## 4. `.stamp-button` → `.press-button`

The leaning rubber stamp is now a typeset button: a small‑caps label in a
hairline frame, `--control-h` tall, hover is a wash, press is a deboss. Rename
the class; most markup carries over.

| Old | New |
|---|---|
| `.stamp-button` | `.press-button` |
| `.stamp-button.-accent` (gem‑ink outline) | `.press-button.-accent` — now a **filled** primary |
| `.stamp-button.-ghost` | `.press-button.-ghost` |
| `.-small` / `.-large` | unchanged names; they set the height (24px / 40px), not the type size |
| destructive via `data-accent="ruby"` (Pearview) | **`.-danger`** (`--err` frame, `--err-ink` label); `.-ghost.-danger` for a quiet row action (Feiten) |
| hand‑built icon‑only button (Pearview) | **`.-icon`** with an `aria-label` and an `<svg class="icon">` |
| `--strike-bloom-none`, `--strike-bloom`, `--strike-bloom-press`, `--strike-ink` | removed; the press is `--deboss` |

**Toggle groups.** Pearview's store tabs are `-small -accent` buttons with
`aria-pressed`. Since `-accent` is now a filled primary, every tab would be
filled. Drop `-accent`: `<button class="press-button -small" aria-pressed="true">`
shows the pressed tab debossed on the `--selected` ground.

**Disabled.** Native `disabled` (Feiten's submit) still works and is still
styled. For actions in apps prefer `aria-disabled="true"`: the button stays
focusable and hoverable, so a tooltip can explain why — but your script must
then ignore the click itself.

## 5. `.data-table`

Wrap the table. The wrapper scrolls a wide table sideways; the table fills the
wrapper.

```html
<!-- before -->
<table class="data-table sensors">…</table>
.sensors { width: 100% }

<!-- after -->
<div class="data-table"><table>…</table></div>
```

Remove caller `width: 100%` on the table (Feiten's `.sensors`) — it fills its
wrapper on its own now. New, all optional: a sticky head (set `max-height` on
the wrapper), `aria-selected="true"` rows, `aria-sort` on heads, a `tfoot`
totals row, `.-numeric` number cells, and `.tick-box:indeterminate` for a
select‑all head.

## 6. `.form-field`

- **Use the child classes.** `> .label` and `> .input` are required. Feiten's
  field with a bare `<span>` and `<input>` gets no field styling — add
  `class="label"` and `class="input"`.
- **`<select class="input">`** (both apps) is now styled, with its own chevron,
  at `--control-h`. **`<textarea class="input">`** and radios (a
  `<fieldset class="form-field">` with a `<legend class="label">`) are styled
  too.
- **Errors.** Add `<span class="error" id="…">` and set
  `aria-invalid="true"` plus `aria-describedby` on the input (Pearview removed
  its error display waiting for this). `:user-invalid` also turns the field red.
- **Hints.** `<span class="hint">` for help text.
- **Settings rows.** `.form-field.-inline` puts the label left, the control right.
- Labels are small caps, not italic; the focused line is a 2px underline.

## 7. Colour

- **Status text.** The status 500s fail AA as text in dark mode (and emerald on
  light paper). Use the new text tokens for words:

  | Old (as text) | New |
  |---|---|
  | `color: var(--err)` (Feiten) | `var(--err-ink)` |
  | `color: var(--warn)` on 14px italic (Pearview) | `var(--warn-ink)` at `--text-ui` |
  | `--ok`, `--info` | `--ok-ink`, `--info-ink` |

  Keep the 500s for glyphs, rules and fills.
- **Ink spread.** `--ink-2` and `--ink-3` are lighter (about 10:1 and 5:1, were
  15:1 and 10:1). Anything you set in `--ink-3` is fainter than before, though
  still AA.
- **New tokens** for caller‑built pieces: `--surface-raised`, `--scrim`,
  `--overlay-lift`, `--hover`, `--selected`, `--focus-ring-*`, `--duration-2`,
  `--ease-out` / `--ease-in`, `--layer-*`, `--icon-ui`, `--icon-stroke`,
  `--control-h`, `--leading-ui`. Feiten's hand‑built Recharts tooltip, for
  example, becomes a loose sheet:

  ```css
  .chart-tooltip {
    background: var(--surface-raised);
    border: var(--rule-1) solid var(--rule);
    box-shadow: var(--overlay-lift);
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-ui);
    line-height: var(--leading-ui);
  }
  ```
- Both apps force `data-theme="light"`. The new tokens all remap in dark mode;
  it is worth trying `data-theme="dark"` once.

## 8. Smaller changes

- **Links.** Bare `<a>` in chrome (table cells, lists, nav) is no longer
  underlined until hover; links inside `p` and `.prose` still are. Use
  `.text-link` where a link must always look like one.
- **`.press-masthead`.** The title is a roman accent wordmark at `--text-h4`
  (~19px, was 39px); nav links are `--text-ui`. Feiten's inline
  `padding: var(--space-6)` around it now means 24px, not 36px.
- **`.paper-card`** stacks are box‑shadows now: they show inside panels with a
  background, and `-framed` combines with `-stack-1` / `-stack-2`.
- **`.toggle-switch`.** The "off / on" words no longer enter the accessible name.
  Name the setting with `aria-labelledby` on the input.
- **`.cancel-stamp`** lettering is Garamond small caps at `--text-ui`.
- **`.tick-box`** used display‑only with `tabindex="-1"` (Pearview) is unchanged.
- **League Spartan** is gone from `fonts/` and `dist/fonts/`. If you referenced
  `--font-display` or the font files directly, switch to `--font-serif`.
