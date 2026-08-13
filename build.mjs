// Reads content/ and patterns/, writes dist/. That's the whole build.
//
//   patterns/*.md  ──┐
//   content/axes.yml ├─► parse + validate ─► templates ─► dist/
//   content/home.md ─┘
//   static/*         ──────────── copied verbatim ────────► dist/

import fs from 'node:fs';
import path from 'node:path';
import { loadAxes, loadAllPatterns, loadHome } from './site/parse.mjs';
import { hasIcon } from './site/icons.mjs';
import { indexPage } from './site/templates/index.mjs';
import { patternPage } from './site/templates/pattern.mjs';

const OUT = 'dist';

function write(rel, html) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  return file;
}

export function build({ quiet = false } = {}) {
  const log = quiet ? () => {} : (...a) => console.log(...a);

  const axesCfg = loadAxes();
  const home = loadHome();
  const patterns = loadAllPatterns('patterns', axesCfg);

  for (const p of patterns) {
    if (!hasIcon(p.icon)) {
      throw new Error(`${p.file}: icon "${p.icon}" is not in site/icons.mjs`);
    }
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  fs.cpSync('static', OUT, { recursive: true });

  const pages = [];
  pages.push(write('index.html', indexPage({ home, patterns, axes: axesCfg.axes })));
  patterns.forEach((p, i) => {
    pages.push(
      write(
        `patterns/${p.slug}/index.html`,
        patternPage({ home, pattern: p, prev: patterns[i - 1], next: patterns[i + 1] })
      )
    );
  });

  log(`built ${pages.length} pages from ${patterns.length} pattern files`);
  for (const f of pages) log(`  ${f}  ${(fs.statSync(f).size / 1024).toFixed(1)} KB`);
  return { pages, patterns };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    build();
  } catch (err) {
    console.error(`\n  build failed\n  ${err.message}\n`);
    process.exit(1);
  }
}
