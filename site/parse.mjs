// Turns patterns/*.md into plain data objects, and refuses to guess.
//
// The markdown in patterns/ is the source of truth for every word on the site.
// That only works if drift is loud, so everything here throws on surprise
// rather than rendering an empty section: a renamed heading, a rating word that
// isn't in the scale, a duplicate slug. If `npm run build` is green, the pages
// match the markdown.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

// html: true is required — Flow table cells contain <br> and <kbd>Tab</kbd>.
// typographer stays off: the drafts use straight quotes and "etc....." on
// purpose, and we are not in the business of tidying the author's voice.
export const md = new MarkdownIt({ html: true, linkify: true, typographer: false });

const inline = (s) => md.renderInline(String(s ?? '').trim());
const block = (s) => md.render(String(s ?? '').trim());

class ContentError extends Error {
  constructor(file, msg) {
    super(`${file}: ${msg}`);
    this.name = 'ContentError';
  }
}

/** Split a markdown body into { title, intro, sections: Map<heading, body> }. */
function splitSections(file, body) {
  const lines = body.split('\n');

  const h1 = lines.findIndex((l) => /^# .+/.test(l));
  if (h1 === -1) throw new ContentError(file, 'no `# Title` heading found');
  const title = lines[h1].replace(/^#\s+/, '').trim();

  const sections = new Map();
  const order = [];
  let current = null;
  const intro = [];

  for (const line of lines.slice(h1 + 1)) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      current = m[1];
      if (sections.has(current)) throw new ContentError(file, `duplicate heading "## ${current}"`);
      sections.set(current, []);
      order.push(current);
      continue;
    }
    (current ? sections.get(current) : intro).push(line);
  }

  return {
    title,
    intro: intro.join('\n').trim(),
    order,
    sections: new Map([...sections].map(([k, v]) => [k, v.join('\n').trim()])),
  };
}

/**
 * Pull the rating word off the front of a rubric section.
 *
 * Shape in the drafts is `<Rating>. <reasoning>` — but "Highest." appears with
 * no reasoning at all, and the rewritten walled-garden Safety runs the rating
 * into the sentence with a comma. Match longest-first so "Low to Medium" wins
 * over "Low", and only strip the rating when a full stop separates it; after a
 * comma it is part of the sentence and stays.
 */
function readRating(file, heading, body, scale) {
  const words = Object.keys(scale).sort((a, b) => b.length - a.length);
  for (const word of words) {
    const m = new RegExp(`^${word}(?=[.,]|\\s*$)`, 'i').exec(body);
    if (!m) continue;
    const rest = body.slice(word.length);
    const prose = rest.startsWith('.') ? rest.slice(1).trim() : body;
    return { word, score: scale[word], prose };
  }
  throw new ContentError(
    file,
    `"## ${heading}" starts with an unknown rating. Expected one of: ${words.sort().join(', ')}.\n` +
      `  Got: ${JSON.stringify(body.slice(0, 60))}`
  );
}

/**
 * Flow is a GFM actor table followed by loose markdown (a numbered tail in every
 * file, plus a stray paragraph in one and a `_notes_` bullet block in another).
 * Parse the table into swimlane rows; treat everything after it as opaque
 * markdown and just render it. Do not try to structure the tail.
 */
function readFlow(file, body) {
  const lines = body.split('\n');
  const start = lines.findIndex((l) => l.trimStart().startsWith('|'));
  if (start === -1) throw new ContentError(file, '"## Flow" has no actor table');

  let end = start;
  while (end < lines.length && lines[end].trimStart().startsWith('|')) end++;

  const cells = (line) =>
    line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

  const header = cells(lines[start]);
  if (header.length !== 3) {
    throw new ContentError(file, `"## Flow" table needs 3 columns, found ${header.length}: ${header.join(' | ')}`);
  }

  const rows = [];
  for (const line of lines.slice(start + 2, end)) {
    const [step, engineer, agent] = cells(line);
    if (!engineer && !agent) continue;
    // A plain integer gets zero-padded to match the design ("01"); "5a." and
    // "9.1" are left exactly as the author wrote them.
    const label = /^\d+$/.test(step) ? String(step).padStart(2, '0') : step;
    rows.push({
      label,
      engineer: engineer ? inline(engineer) : '',
      agent: agent ? inline(agent) : '',
      both: Boolean(engineer && agent),
    });
  }
  if (!rows.length) throw new ContentError(file, '"## Flow" table has no steps');

  return {
    lanes: header.slice(1),
    rows,
    notes: block(lines.slice(end).join('\n')),
  };
}

/**
 * Tools is free prose, but the design shows pills. Split on sentence
 * boundaries and use pills only when every fragment is short enough to read as
 * a product name ("Lovable. Replit. Base44." / "Microsoft Copilot"). Anything
 * longer is a sentence, not a list, and renders as prose.
 */
const TOOL_PILL_MAX = 40;
function readTools(body) {
  const parts = body
    .split(/\.\s+|\.$/)
    .map((s) => s.trim())
    .filter(Boolean);
  const pills = parts.length > 0 && parts.every((p) => p.length <= TOOL_PILL_MAX);
  return pills ? { pills: parts.map(inline) } : { prose: block(body) };
}

export function loadAxes(file = 'content/axes.yml') {
  // gray-matter's YAML engine, reused so the build has one YAML parser.
  const raw = fs.readFileSync(file, 'utf8');
  const cfg = matter(`---\n${raw}\n---\n`).data;
  for (const key of ['scale', 'sections', 'axes']) {
    if (!cfg[key]) throw new ContentError(file, `missing top-level "${key}"`);
  }
  cfg.sections.leading ??= [];
  cfg.sections.trailing ??= [];
  return cfg;
}

export function loadPattern(file, axesCfg) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));

  for (const key of ['order', 'slug', 'icon']) {
    if (data[key] === undefined) throw new ContentError(file, `frontmatter is missing "${key}"`);
  }
  if (!/^[a-z0-9-]+$/.test(data.slug)) {
    throw new ContentError(file, `slug "${data.slug}" must be lowercase letters, digits and hyphens`);
  }

  const { title, intro, order, sections } = splitSections(file, content);

  // The rubric is a contract. Same headings, same order, in every file — that
  // is what makes the comparison table honest.
  const expected = [
    ...axesCfg.sections.leading,
    ...axesCfg.axes.map((a) => a.heading),
    ...axesCfg.sections.trailing,
  ];
  if (order.length !== expected.length || order.some((h, i) => h !== expected[i])) {
    throw new ContentError(
      file,
      `rubric headings do not match content/axes.yml.\n` +
        `  expected: ${expected.join(' | ')}\n` +
        `  found:    ${order.join(' | ')}`
    );
  }

  const ratings = axesCfg.axes.map((axis) => {
    const { word, score, prose } = readRating(file, axis.heading, sections.get(axis.heading), axesCfg.scale);
    // invert: low is the good news, so the dots and radar show the flipped
    // score. The word on the tag is always what the markdown actually says.
    const display = axis.invert ? 6 - score : score;
    return { ...axis, word, score, display, prose: prose ? block(prose) : '' };
  });

  return {
    file,
    order: data.order,
    slug: data.slug,
    icon: data.icon,
    title,
    introHtml: block(intro),
    blurb: intro,
    blurbHtml: inline(intro.replace(/\s+/g, ' ')),
    flow: readFlow(file, sections.get('Flow')),
    tools: readTools(sections.get('Tools')),
    bestForHtml: block(sections.get('Best For')),
    ratings,
  };
}

export function loadAllPatterns(dir = 'patterns', axesCfg) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(dir, f));
  if (!files.length) throw new Error(`no markdown files in ${dir}/`);

  const patterns = files.map((f) => loadPattern(f, axesCfg)).sort((a, b) => a.order - b.order);

  for (const key of ['order', 'slug']) {
    const seen = new Map();
    for (const p of patterns) {
      if (seen.has(p[key])) throw new ContentError(p.file, `duplicate ${key} "${p[key]}" (also in ${seen.get(p[key])})`);
      seen.set(p[key], p.file);
    }
  }
  return patterns;
}

export function loadHome(file = 'content/home.md') {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  return { ...data, ledeHtml: block(content) };
}
