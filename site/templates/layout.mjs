import { esc } from '../components.mjs';
import { icon } from '../icons.mjs';

/** Nav differs between the two page types: the index one reveals on scroll. */
function nav(home, { sticky }) {
  const links = sticky
    ? [['#patterns', 'Patterns'], ['#compare', 'Compare'], ['#axes', 'The axes']]
    : [['/#patterns', 'All patterns'], ['/#compare', 'Compare']];
  return (
    `<header class="nav${sticky ? ' nav-sticky' : ''}"${sticky ? ' id="site-nav"' : ''}>` +
    `<a class="nav-brand" href="/">` +
    `<img src="/clanker.png" width="208" height="208" alt="" class="nav-mark">` +
    `<span>${esc(home.siteName)}</span>` +
    (home.badge ? `<span class="stamp">${esc(home.badge)}</span>` : '') +
    `</a>` +
    `<nav class="nav-links">` +
    links.map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join('') +
    `<a class="nav-gh" href="${esc(home.repoUrl)}" aria-label="Source on GitHub" title="Source on GitHub">` +
    `${icon('github', 22)}</a>` +
    `</nav></header>`
  );
}

const footer = (home) =>
  `<footer class="site-footer">` +
  `<p class="footer-brand">${esc(home.siteName)}</p>` +
  `<p>Every word on this site is generated at build time from the markdown in ` +
  `<code>patterns/</code>. Nothing is typed twice.</p>` +
  `<p><a href="${esc(home.repoUrl)}">Read the source ${icon('arrow-right', 15)}</a></p>` +
  `</footer>`;

/** Palette switcher: two swatches, bottom-right. Filled in by /palette.js,
    and stays hidden entirely when JS is unavailable. */
const paletteBar = () =>
  `<div class="palette-bar" id="palette-ui" hidden>` +
  `<span class="sr-only" id="palette-label">Palette</span>` +
  `<div class="palette-options" id="palette-options" role="group" aria-labelledby="palette-label"></div>` +
  `</div>`;

export function layout({ home, title, description, bodyClass = '', sticky = false, hero = '', main }) {
  const pageTitle = title === home.title ? `${home.title} — ${home.siteName}` : `${esc(title)} — ${home.siteName}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(pageTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:image" content="/clanker.png">
<link rel="icon" href="/favicon.png" sizes="any">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caprasimo:wght@400&family=Figtree:wght@400;600;700&display=swap">
<link rel="stylesheet" href="/ds.css">
<link rel="stylesheet" href="/site.css">
<!-- Blocking on purpose: applies the saved palette before first paint so a
     dark-mode reload does not flash light. ~3KB, same origin. -->
<script src="/palette.js"></script>
<!-- Deferred: the prompt trigger and copy buttons ship hidden; this reveals
     them and drives the modal. -->
<script src="/prompts.js" defer></script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<a class="skip-link" href="#main">Skip to content</a>
${nav(home, { sticky })}
${hero}
<main id="main" class="wrap">
${main}
</main>
${footer(home)}
${paletteBar()}
</body>
</html>
`;
}
