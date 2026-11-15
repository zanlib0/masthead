# Masthead

A small, opinionated **letterpress** design system — cool rag paper, blue-black
ink, twelve gemstone accents, hairline rules. CSS only, one file, one link. It
sets both apps (compact chrome at one UI size) and articles (a reading register,
`.prose`).

See: https://zanlib0.github.io/masthead.

## Install

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/zanlib0/masthead@<commit>/dist/masthead.min.css">
```

Pin the link to a commit (or a tag, once there are tags). Without `@…` the link
follows `master`, and every change ships to your pages the moment it lands.

Link `dist/masthead.min.css` — never the source `masthead.css` (that's the
authoring entrypoint and pulls the rest via `@import`).

Upgrading from v0.1? See [MIGRATION.md](MIGRATION.md).

## Hello, world

```html
<!doctype html>
<html lang="en" data-theme="light" data-accent="lapis">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/zanlib0/masthead@<commit>/dist/masthead.min.css">
  </head>
  <body>
    <article class="paper-card">
      <h2 class="title">Tuesday's Press</h2>
      <div class="body">Set in EB Garamond at one UI size.</div>
      <div class="form-field">
        <label class="label" for="email">Email</label>
        <input class="input" id="email" type="email">
      </div>
      <button class="press-button -accent">Subscribe</button>
    </article>

    <article class="prose" style="max-width: 64ch">
      <h1>On stacked paper</h1>
      <p>Long-form text goes in <code>.prose</code>: a 24px reading size,
        old-style figures and its own vertical rhythm.</p>
    </article>
  </body>
</html>
```

All spacing between components (the margins, the grid, the measure) is yours;
Masthead's components carry none.

## Browser support

Requires **Chrome/Edge 127+, Safari 17.4+, Firefox 128+** (Baseline 2024+).
Masthead uses `oklch()`, `color-mix()`, native nesting, relative-color syntax,
`font-size-adjust`, `:user-invalid`, `:has()` and alt text on generated content,
with no `@supports` guards and no transpile. `text-box` trimming is progressive:
browsers without it fall back to untrimmed lines. Older browsers degrade per
feature.

## Development

```sh
npm run lint    # stylelint
npm run build   # bundle into dist/
npm run shots   # screenshot index.html, light + dark at 1280 and 390, into shots/
```

`npm run shots` uses Playwright; run `npx playwright install chromium` once first.

## The contract

The design system's rules — what each token means, how components compose,
what the system refuses to do — live in [DESIGN.md](DESIGN.md).

## License

Masthead is MIT (see [LICENSE](LICENSE)). Bundled webfonts are SIL OFL 1.1:

- **EB Garamond** — Octavio Pardo, [octaviopardo/EBGaramond12](https://github.com/octaviopardo/EBGaramond12)
- **IBM Plex Mono** — IBM, [IBM/plex](https://github.com/IBM/plex)

Each font's OFL is in its `fonts/<family>/` directory.

## Stability

`v0.x` — no API guarantees, no warranty, use at your own risk. If it's useful,
great; if a token name changes between minor versions, that's the deal at this
stage. The DESIGN.md contract is the closest thing to a stability promise.
