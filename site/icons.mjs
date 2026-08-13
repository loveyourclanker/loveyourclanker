// Lucide icons (https://lucide.dev), inlined rather than fetched.
// The design system's readme is specific: stroke-width 2.75. Paths are copied
// verbatim from Lucide so they can be re-synced by name.

const PATHS = {
  'arrow-right-to-line': ['M17 12H3', 'm11 18 6-6-6-6', 'M21 5v14'],
  sparkles: [
    'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z',
    'M5 3v4', 'M19 17v4', 'M3 5h4', 'M17 19h4',
  ],
  box: [
    'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
    'm3.3 7 8.7 5 8.7-5', 'M12 22V12',
  ],
  'list-checks': ['m3 17 2 2 4-4', 'm3 7 2 2 4-4', 'M13 6h8', 'M13 12h8', 'M13 18h8'],
  'scan-search': [
    'M3 7V5a2 2 0 0 1 2-2h2', 'M17 3h2a2 2 0 0 1 2 2v2', 'M21 17v2a2 2 0 0 1-2 2h-2',
    'M7 21H5a2 2 0 0 1-2-2v-2', 'm16 16-1.9-1.9',
  ],
  github: [
    'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
    'M9 18c-4.51 2-5-2-7-2',
  ],
  'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
  'arrow-down': ['M12 5v14', 'm19 12-7 7-7-7'],
  'arrow-left': ['M19 12H5', 'm12 19-7-7 7-7'],
};

const CIRCLES = {
  'scan-search': [{ cx: 12, cy: 12, r: 3 }],
};

export function icon(name, size = 24, cls = '') {
  const paths = PATHS[name];
  if (!paths) throw new Error(`unknown icon "${name}" — add it to site/icons.mjs or fix the frontmatter`);
  const circles = (CIRCLES[name] ?? [])
    .map((c) => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}"${c.fill ? ` fill="${c.fill}"` : ''}/>`)
    .join('');
  return (
    `<svg${cls ? ` class="${cls}"` : ''} width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" ` +
    `stroke-linejoin="round" aria-hidden="true">` +
    paths.map((d) => `<path d="${d}"/>`).join('') +
    circles +
    `</svg>`
  );
}

export const hasIcon = (name) => Object.hasOwn(PATHS, name);
