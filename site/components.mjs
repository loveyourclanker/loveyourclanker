// Repeating pieces of the design, as functions returning HTML strings.
// Everything is styled by classes in static/site.css — the design handoff did
// it all with inline styles and a runtime-only style-hover attribute, neither
// of which survives into real HTML.

import { icon } from './icons.mjs';

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
export const numberWord = (n) => NUMBER_WORDS[n] ?? String(n);

/** Tag colour follows the displayed score, so an inverted axis reads correctly. */
export function tagClass(rating) {
  if (rating.display >= 4) return rating.invert ? 'tag tag-accent-2' : 'tag tag-accent';
  if (rating.display <= 2) return 'tag tag-outline';
  return 'tag tag-neutral';
}

export const tag = (rating) => `<span class="${tagClass(rating)}">${esc(rating.word)}</span>`;

export const iconChip = (name, size, cls = '') =>
  `<span class="chip ${cls}">${icon(name, size)}</span>`;

/** Five dots per axis. Filled dots are the displayed (inversion-aware) score. */
export function dotRow(rating) {
  const dots = Array.from({ length: 5 }, (_, i) => {
    const on = i < rating.display;
    const tone = rating.invert ? 'is-alt' : 'is-on';
    return `<i class="dot${on ? ` ${tone}` : ''}"></i>`;
  }).join('');
  return (
    `<div class="dots-row">` +
    `<span class="dots-label">${esc(rating.dotLabel)}</span>` +
    `<span class="dots" role="img" aria-label="${esc(rating.dotLabel)}: ${rating.display} out of 5">${dots}</span>` +
    `</div>`
  );
}

export function patternCard(p) {
  return (
    `<a class="card pattern-card" href="/patterns/${p.slug}/">` +
    iconChip(p.icon, 26) +
    `<h3 class="card-title">${esc(p.title)}</h3>` +
    `<p class="card-body">${p.blurbHtml}</p>` +
    `<div class="dots-grid">${p.ratings.map(dotRow).join('')}</div>` +
    `<span class="card-meta">Read the pattern ${icon('arrow-right', 18)}</span>` +
    `</a>`
  );
}

export const placeholderCard = (home) =>
  `<div class="card card-placeholder">` +
  `<h3 class="card-title">${esc(home.placeholderTitle)}</h3>` +
  `<p class="card-body">${esc(home.placeholderBody)}</p>` +
  `</div>`;

export function compareTable(patterns, axes) {
  const head = axes.map((a) => `<th scope="col">${esc(a.label)}</th>`).join('');
  const rows = patterns
    .map(
      (p) =>
        `<tr><th scope="row"><a href="/patterns/${p.slug}/">${esc(p.title)}</a></th>` +
        p.ratings.map((r) => `<td>${tag(r)}</td>`).join('') +
        `</tr>`
    )
    .join('');
  return (
    `<div class="table-scroll">` +
    `<table class="table compare"><thead><tr><th scope="col">Pattern</th>${head}</tr></thead>` +
    `<tbody>${rows}</tbody></table></div>`
  );
}

/**
 * N-axis radar. The handoff hardcoded a hexagon; this reproduces those exact
 * coordinates from the formula, and keeps working when an axis is added.
 */
export function radar(ratings) {
  const cx = 170, cy = 160, R = 120, n = ratings.length;
  const pt = (i, r) => {
    const a = (-90 + (360 / n) * i) * (Math.PI / 180);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const fmt = ([x, y]) => `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
  const ring = (r) => ratings.map((_, i) => fmt(pt(i, r))).join(' ');

  const rings = [R, (R * 2) / 3, R / 3]
    .map((r) => `<polygon class="radar-ring" points="${ring(r)}"/>`)
    .join('');
  const spokes = ratings
    .map((_, i) => {
      const [x, y] = pt(i, R);
      return `<line class="radar-spoke" x1="${cx}" y1="${cy}" x2="${fmt([x, y]).split(',')[0]}" y2="${fmt([x, y]).split(',')[1]}"/>`;
    })
    .join('');

  const verts = ratings.map((r, i) => pt(i, (R * r.display) / 5));
  const dots = verts
    .map((v, i) => (ratings[i].display < 5 ? `<circle class="radar-dot" cx="${fmt(v).split(',')[0]}" cy="${fmt(v).split(',')[1]}" r="5"/>` : ''))
    .join('');

  const labels = ratings
    .map((r, i) => {
      const [x, y] = pt(i, R + 34);
      const anchor = Math.abs(x - cx) < 6 ? 'middle' : x > cx ? 'start' : 'end';
      const dy = y < cy - 6 ? 0 : y > cy + 6 ? 10 : 5;
      return `<text class="radar-label" x="${Math.round(x)}" y="${Math.round(y) + dy}" text-anchor="${anchor}">${esc(r.dotLabel)}</text>`;
    })
    .join('');

  const summary = ratings.map((r) => `${r.dotLabel} ${r.display} of 5`).join(', ');
  return (
    `<svg class="radar" viewBox="-90 -20 520 380" role="img" aria-label="Ratings: ${esc(summary)}">` +
    rings + spokes +
    `<polygon class="radar-shape" points="${verts.map(fmt).join(' ')}"/>` +
    dots + labels +
    `</svg>`
  );
}

/**
 * Example prompts from the Flow table's "Prompt Examples" column.
 *
 * These render in two pieces that land in different places: a pill inside the
 * step card, and a `<dialog>` emitted straight after it. The first cut showed
 * the prompts inline under the step and it drowned the flow — step 1 of the
 * plan patterns carries five of them, and the bands ran taller than the steps
 * they belonged to. A modal keeps the swimlane readable and gives a long prompt
 * the full width instead of a ~300px lane.
 *
 * The text is escaped rather than rendered as markdown on purpose: what is on
 * screen is exactly what lands on the clipboard, straight quotes and typos
 * included. prompts.js reads it back out of `.prompt-text` with textContent, so
 * the two can never drift. Both the trigger and the copy buttons ship `hidden`
 * and are only revealed by that script — an affordance that cannot act is worse
 * than none. Without JS the dialog falls back to rendering inline (see the
 * `html:not(.js)` block in static/site.css), so the prompts are never lost.
 */
export const promptId = (label) => `prompts-${String(label).replace(/[^a-zA-Z0-9]+/g, '-').replace(/-$/, '')}`;

export function promptTrigger(id, prompts) {
  if (!prompts || !prompts.length) return '';
  const n = prompts.length;
  return (
    `<button class="step-prompt-trigger" type="button" data-prompt-dialog="${esc(id)}" hidden>` +
    icon('message-square-quote', 15) +
    `<span>${n} prompt example${n > 1 ? 's' : ''}</span>` +
    `</button>`
  );
}

export function promptDialog(id, label, prompts) {
  if (!prompts || !prompts.length) return '';
  const one = (text) =>
    `<div class="prompt">` +
    `<p class="prompt-text">${esc(text)}</p>` +
    `<button class="prompt-copy" type="button" aria-label="Copy this prompt" hidden>` +
    icon('copy', 15, 'icon-copy') +
    icon('check', 15, 'icon-done') +
    `<span class="prompt-copy-label" aria-live="polite">Copy</span>` +
    `</button></div>`;
  return (
    `<dialog class="prompt-dialog" id="${esc(id)}" aria-labelledby="${esc(id)}-title">` +
    `<div class="prompt-dialog-head">` +
    `<h3 id="${esc(id)}-title">` +
    `${prompts.length > 1 ? 'Prompts' : 'Prompt'} for step ${esc(label)}` +
    `</h3>` +
    `<button class="prompt-dialog-close" type="button" aria-label="Close">${icon('x', 18)}</button>` +
    `</div>` +
    `<div class="prompts">${prompts.map(one).join('')}</div>` +
    `</dialog>`
  );
}

/**
 * Two-lane swimlane from the Flow actor table. A row with both actors filled
 * becomes a full-width pair (the design's accept/reject outcome cards); every
 * other row is one card plus a spacer so the grid rows stay aligned. The
 * numbered tail continues the same series with no actor, so it spans both lanes.
 */
export function swimlane(flow) {
  const lanes =
    `<div class="lane-head lane-eng">${esc(flow.lanes[0])}</div>` +
    `<div class="lane-head lane-agt">${esc(flow.lanes[1])}</div>`;

  const step = (label, html, side, trigger) =>
    `<div class="step step-${side}">` +
    `<span class="step-n">${esc(label)}</span>` +
    `<div class="step-body">${html}</div>` +
    trigger +
    `</div>`;

  const rows = flow.rows
    .map((r) => {
      const id = promptId(r.label);
      const trigger = promptTrigger(id, r.prompts);
      const dialog = promptDialog(id, r.label, r.prompts);
      if (r.both) {
        return (
          `<div class="step-pair">` +
          `<div class="step step-outcome step-eng"><span class="step-n">${esc(r.label)}</span><div class="step-body">${r.engineer}</div>${trigger}</div>` +
          `<div class="step step-outcome step-agt"><span class="step-n">${esc(r.label)}</span><div class="step-body">${r.agent}</div></div>` +
          `</div>` +
          dialog
        );
      }
      return (
        (r.engineer
          ? step(r.label, r.engineer, 'eng', trigger) + `<div class="step-spacer"></div>`
          : `<div class="step-spacer"></div>` + step(r.label, r.agent, 'agt', trigger)) + dialog
      );
    })
    .join('');

  const tail = flow.tail
    .map(
      (t) =>
        `<div class="step step-full">` +
        `<span class="step-n">${esc(t.label)}</span>` +
        `<div class="step-body">${t.html}</div>` +
        `</div>`
    )
    .join('');

  return (
    `<div class="swimlane">${lanes}${rows}${tail}</div>` +
    (flow.notes ? `<div class="flow-notes">${flow.notes}</div>` : '')
  );
}

export function toolsBlock(tools) {
  if (tools.pills) return `<div class="pills">${tools.pills.map((t) => `<span class="tag tag-neutral">${t}</span>`).join('')}</div>`;
  return `<div class="prose">${tools.prose}</div>`;
}
