import { layout } from './layout.mjs';
import { esc, iconChip, tag, radar, swimlane, toolsBlock } from '../components.mjs';
import { icon } from '../icons.mjs';

export function patternPage({ home, pattern: p, prev, next }) {
  const main =
    `<header class="pattern-head">` +
    iconChip(p.icon, 32, 'chip-lg') +
    `<h1>${esc(p.title)}</h1>` +
    `<div class="lede">${p.introHtml}</div>` +
    `</header>` +

    `<section class="section flow-layout">` +
    `<div class="flow-main"><h2>The flow</h2>${swimlane(p.flow)}</div>` +
    `<aside class="panel radar-panel">` +
    `<h3>Radar Chart</h3>` +
    radar(p.ratings) +
    `<p class="fine">Further out is better. The last two axes are the friendly side of ` +
    `brainrot and token use, so a full score there means the pattern costs you little.</p>` +
    `</aside>` +
    `</section>` +

    `<section class="section">` +
    `<h2>How it Stacks Up</h2>` +
    `<div class="card-grid rubric-grid">` +
    p.ratings
      .map(
        (r) =>
          `<div class="card rubric-card">` +
          `<div class="rubric-head"><h3>${esc(r.label)}</h3>${tag(r)}</div>` +
          (r.prose ? `<div class="prose">${r.prose}</div>` : '') +
          `</div>`
      )
      .join('') +
    `</div></section>` +

    `<section class="section two-up">` +
    `<div><h2>Best for</h2><div class="prose">${p.bestForHtml}</div></div>` +
    `<div><h2>Tools</h2>${toolsBlock(p.tools)}</div>` +
    `</section>` +

    `<aside class="attribution"><h2>Contributed by</h2>${p.contributedByHtml}</aside>` +

    `<nav class="pattern-nav">` +
    `<a class="btn btn-secondary" href="/#patterns">${icon('arrow-left', 16)} All patterns</a>` +
    (prev ? `<a class="btn btn-secondary" href="/patterns/${prev.slug}/">${icon('arrow-left', 16)} ${esc(prev.title)}</a>` : '') +
    (next ? `<a class="btn btn-secondary" href="/patterns/${next.slug}/">${esc(next.title)} ${icon('arrow-right', 16)}</a>` : '') +
    `</nav>`;

  return layout({
    home,
    title: p.title,
    description: p.blurb.replace(/[*_`]/g, '').slice(0, 200),
    bodyClass: 'page-pattern',
    main,
  });
}
