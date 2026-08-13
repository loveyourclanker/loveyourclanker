import { layout } from './layout.mjs';
import { esc, numberWord, patternCard, placeholderCard, compareTable } from '../components.mjs';
import { icon } from '../icons.mjs';
import { md } from '../parse.mjs';

export function indexPage({ home, patterns, axes }) {
  const hero =
    `<section class="hero">` +
    `<img class="hero-art" src="/clanker-hero.png" width="880" height="880" ` +
    `alt="Clanker, a teal robot dog with amber eyes" fetchpriority="high">` +
    `<h1 class="hero-title">${esc(home.heroHeadline)}</h1>` +
    `<a class="hero-cue" href="#patterns">${esc(home.heroCue)} ${icon('arrow-down', 18)}</a>` +
    `</section>`;

  const main =
    `<section class="intro">` +
    `<h2>${md.renderInline(home.introHeading)}</h2>` +
    `<div class="lede">${home.ledeHtml}</div>` +
    `</section>` +

    `<section id="patterns" class="section">` +
    `<h2>${esc(home.patternsHeading)}</h2>` +
    `<div class="card-grid">${patterns.map(patternCard).join('')}${placeholderCard(home)}</div>` +
    `</section>` +

    `<section id="compare" class="section panel">` +
    `<h2>${esc(home.compareHeading)}</h2>` +
    `<p class="lede">${esc(home.compareLede)}</p>` +
    compareTable(patterns, axes) +
    `</section>` +

    `<section id="axes" class="section">` +
    `<h2>The ${numberWord(axes.length)} axes</h2>` +
    `<p class="lede">${esc(home.axesLede)}</p>` +
    `<div class="axes-grid">` +
    axes.map((a) => `<div><h3>${esc(a.label)}</h3><p>${esc(a.definition)}</p></div>`).join('') +
    `</div></section>`;

  return layout({
    home,
    title: home.title,
    description: home.description,
    bodyClass: 'page-index',
    sticky: true,
    hero,
    main,
  });
}
