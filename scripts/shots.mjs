// Screenshot the catalogue (index.html): the full page and every plate,
// light and dark, at 1280 and 390 wide. Output goes to shots/ (gitignored).
//
//   npm run shots            # -> shots/
//   npm run shots -- <dir>   # -> <dir>
//
// First run needs a browser: npx playwright install chromium
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const out = resolve(process.argv[2] ?? join(root, 'shots'));
const types = { '.html': 'text/html', '.css': 'text/css', '.woff2': 'font/woff2' };

// A tiny static server, so the @imported CSS and the fonts load as they would
// from a host (file:// blocks the font requests).
const server = createServer(async (req, res) => {
  try {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (path.endsWith('/')) path += 'index.html';
    const body = await readFile(join(root, path));
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
}).listen(0);
const url = `http://localhost:${server.address().port}/`;

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [1280, 390]) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await page.evaluate(() => document.fonts.ready);
      const tag = `${width}-${theme}`;
      await page.screenshot({ path: join(out, `page-${tag}.png`), fullPage: true });

      // Name every plate: the element after each h4.cl-h4, each use-case, the
      // dark panel, plus anything marked data-shot in the page.
      await page.evaluate(() => {
        for (const h of document.querySelectorAll('h4.cl-h4')) h.nextElementSibling?.setAttribute('data-shot', h.textContent);
        for (const u of document.querySelectorAll('.cl-uc')) u.setAttribute('data-shot', 'case ' + u.querySelector('.cl-uc-tag span').textContent);
        for (const d of document.querySelectorAll('.cl-dark')) d.setAttribute('data-shot', 'dark panel');
      });
      for (const el of await page.$$('[data-shot]')) {
        await el.screenshot({ path: join(out, `${slug(await el.getAttribute('data-shot'))}-${tag}.png`) });
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`shots written to ${out}`);
