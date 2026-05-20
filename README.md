# Masthead

A small, opinionated **letterpress** design system — cool rag paper, blue-black
ink, twelve gemstone accents, hairline rules. CSS only, one file, one link.

## Install

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/zanlib/masthead@v0.1.0/dist/masthead.min.css">
```

Link `dist/masthead.min.css` — never the source `masthead.css` (that's the
authoring entrypoint and pulls 11 files via `@import`).

## Hello, world

```html
<!doctype html>
<html data-theme="light" data-accent="ruby">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/zanlib/masthead@v0.1.0/dist/masthead.min.css">
  </head>
  <body>
    <article class="paper-card">
      <h2>Tuesday's Press</h2>
      <p>Set in EB Garamond. The card is paper; the button below is a stamp.</p>
      <button class="stamp-button -accent">Order one</button>
    </article>
  </body>
</html>
```

## Browser support

Requires **Chrome/Edge 117+, Safari 16.4+, Firefox 128+** (Baseline 2024+).
Masthead uses `oklch()`, `color-mix()`, native nesting, and relative-color
syntax with no `@supports` guards and no transpile. Older browsers degrade
per feature.

## See it live

[zanlib.github.io/masthead](https://zanlib.github.io/masthead/) — every
component, both themes, all twelve accents.

## The contract

The design system's rules — what each token means, how components compose,
what the system refuses to do — live in [DESIGN.md](DESIGN.md).

## License

Masthead is MIT (see [LICENSE](LICENSE)). Bundled webfonts are SIL OFL 1.1:

- **EB Garamond** — Octavio Pardo, [octaviopardo/EBGaramond12](https://github.com/octaviopardo/EBGaramond12)
- **League Spartan** — The League of Movable Type, [theleagueof/league-spartan](https://github.com/theleagueof/league-spartan)
- **IBM Plex Mono** — IBM, [IBM/plex](https://github.com/IBM/plex)

Each font's OFL is in its `fonts/<family>/` directory.

## Stability

`v0.x` — no API guarantees, no warranty, use at your own risk. If it's useful,
great; if a token name changes between minor versions, that's the deal at this
stage. The DESIGN.md contract is the closest thing to a stability promise.
