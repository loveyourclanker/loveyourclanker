# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this is

**LoveYourClanker.org** — "Patterns of Agent Interaction", describing and comparing patterns of
interaction between software engineers and AI agents. Content repo *and* the static site
generator that publishes it.

**Live in production at https://loveyourclanker.org** (Railway, container from `Dockerfile`).
Released 2026-08-14. This is a public site now — changes to `patterns/` ship to real readers on
the next deploy, so treat content edits as publishing, not drafting.

The point of the build: **every word on the site comes from the markdown in `patterns/`**, at
build time. Nothing is typed twice. If a rating on the comparison table disagrees with the
pattern file, that's a bug in the build, not a content edit to make.

## Git — read-only

**Never run a git command that changes anything.** No `add`, `commit`, `push`, `branch`,
`checkout`, `switch`, `merge`, `rebase`, `reset`, `restore`, `stash`, `tag`, `rm`, `mv`,
`cherry-pick`, `revert`, `clean`, `apply`, `config`, or `gh pr create`. The user does all of
that themselves.

Read-only inspection is fine and encouraged: `status`, `diff`, `log`, `show`, `blame`, `ls-files`.

If work is ready to commit, say so and stop. Offer a commit message if it helps — do not run it.

## Layout

### Content — the source of truth

- `patterns/` — one markdown file per pattern. Drives the whole site.
- `content/axes.yml` — the rubric contract: axis definitions, display labels, which axes are
  inverted, and the rating-word → 1–5 scale.
- `content/home.md` — front page copy (hero, intro, section headings, lede).
- `research/` — one file per research question, backing specific claims in the patterns.
  **Internal.** Not published to the site.
- `README.md` — site name and one-line pitch.
- `assets/` — mascot source art (`clanker_reference.png`, `clanker_idle_animation.mp4`).
  `static/*.png` are downscaled from `clanker_reference.png`.

### Build

- `build.mjs` — reads `content/` + `patterns/`, writes `dist/`. The whole build.
- `dev.mjs` — `npm run dev`, rebuild-on-change plus a static server on :4321. No deps.
- `site/parse.mjs` — markdown → data, and **all** validation.
- `site/components.mjs`, `site/icons.mjs`, `site/templates/` — HTML as template literals.
- `static/` — copied verbatim into `dist/`. `ds.css` (vendored design system), `site.css`
  (palette + components + responsive), `palette.js`, `prompts.js` (the example-prompt modal and
  its click-to-copy; deferred, and every button ships `hidden` so an affordance only appears
  when it works), images. `palette.js` also sets a `js` class on `<html>` before first paint —
  `site.css` uses it to decide whether the prompt dialogs are modals or render inline.
- `Dockerfile` / `Caddyfile` — multi-stage build → Caddy on `$PORT`. This is what runs in
  production on Railway.

Two dependencies: `markdown-it` and `gray-matter`. Keep it that way.

### Running and shipping

```
npm run dev      # rebuild-on-change + static server on :4321
npm run build    # one-shot -> dist/
npm run clean    # rm -rf dist
```

`npm run dev` watches `patterns/`, `content/`, `site/`, `static/`. No live-reload — refresh yourself.

Deploy is push-to-`main`; Railway builds the `Dockerfile` and restarts. `dist/` is generated and
gitignored, never committed.

Caddy binds `:{$PORT:8080}`. Railway does **not** set `PORT` here, so it takes the `8080`
fallback; the container exposes 8080 and the custom domain is pointed at that. Don't remove the
`{$PORT:...}` form — the fallback is what's actually load-bearing, and the env-var branch keeps
it working if the platform ever starts injecting one. Locally: `docker run -p 8080:8080 lyc`.

`dev.mjs` is a separate Node server on :4321 and never runs in the container, which is why the
two ports differ.

Verified live: all six routes, every asset, 404 on unknown paths, the `Cache-Control` and
`X-Content-Type-Options` headers from `Caddyfile`, and the 308 redirect that adds the trailing
slash to `/patterns/<slug>`.

**A broken build is a broken deploy.** The validators in `site/parse.mjs` fail the Docker build,
not just the local one — that is the intent. Run `npm run build` before pushing.

### The design record

The site's look came from a designer's export of page mockups plus a design system. **That
export no longer exists** — it was never committed and has been deleted. What survives of it:

- `static/ds.css` — the design system stylesheet, vendored verbatim. **This is the only copy.**
- `static/site.css` — the clanker palette override, and every component the mockups expressed
  as inline styles.
- `assets/clanker_reference.png` and `clanker_idle_animation.mp4` — the mascot art.
- The rules and decisions below.

The page mockups are gone, so **there is nothing left to check the build against**. Treat the
current site as the reference: change the look deliberately, never by "restoring" something.

#### Design system rules

- Take every colour, font, spacing, radius and shadow from the tokens in `ds.css`. **Never
  hard-code a hex, a font name, or a px value the tokens already carry.** A lint config used to
  enforce this; it's gone, so it's on you now.
- Lucide icons (https://lucide.dev) at **stroke-width 2.75**. See `site/icons.mjs`.
- Left-aligned, asymmetric layouts. Flush-left headings, content hugging the left edge with
  whitespace on the right.
- Lean round: over-rounded containers, pill controls (`border-radius: 999px`), soft circular
  accents.
- **Accent-on-ground is only ~3:1** — fine for icons, large text and interface chrome, *not* for
  body copy. Paragraph-size text in the accent must use `--color-accent-700` or deeper.
- Don'ts: no sharp corners, no greying-out the palette, no condensed or geometric display faces,
  don't crowd.

Note the design system ships a cream/terracotta "Organic" palette in `ds.css`. The site does
**not** use it — `static/site.css` overrides `:root` with the teal/amber clanker palette taken
off the mascot art. That override, plus the two palettes in `static/palette.js`, is the colour
source of truth.

#### Deliberate deviations from the original mockups

Recorded because the mockups no longer exist to explain them. These are choices, not bugs:

- **`High` scores 4 dots, not 5.** The mockup showed 5/5 on every axis but Speed for Tab
  Completion. Across five patterns `High` has to sit below `Highest`, or Tab Completion and
  I Code You Check render identically.
- **Swimlane cards are coloured by actor** (engineer = surface, agent = accent-200). The mockup
  instead highlighted one specific step. Actor-colouring scales across five patterns.
- **`## Tools` renders as pills only when every sentence is ≤40 chars**, prose otherwise.
- **Example prompts open in a modal**, from a pill inside the step tile. The mockups had no
  prompts at all. They were first rendered inline under the step and it buried the flow — a lane
  is ~300px wide and step 1 of the plan patterns carries five of them, so the bands ran taller
  than the steps they belonged to. Without JS the dialog falls back to exactly that inline band,
  which is the lesser evil against losing the content entirely.
- **There is a footer.** The mockups had none; both pages just ended on padding.
- **Media queries exist.** The mockups had none at all, at any width.
- **The palette switcher is two swatches in the bottom-right corner**, not the mockup's orange
  circular FAB with a popover.

## Pattern rubric

Five patterns, in increasing order of handoff. Order comes from frontmatter, not filename.

| Order | File | Slug | Title |
| ----: | ---- | ---- | ----- |
| 1 | `patterns/tab_completion.md` | `tab-completion` | Tab Completion |
| 2 | `patterns/full_vibe_agent.md` | `full-vibe-agent` | Full Vibing with Agent |
| 3 | `patterns/full_vibe_walled_garden.md` | `full-vibe-walled-garden` | Full Vibing in a Walled Garden |
| 4 | `patterns/plan_execute_check.md` | `plan-execute-check` | Plan, Execute, Check |
| 5 | `patterns/icode_ucheck.md` | `icode-ucheck` | I Code, You Check |

Each file is:

```
---
order: 1
slug: tab-completion
icon: arrow-right-to-line     # must exist in site/icons.mjs
---

# <Pattern Title>

<one-paragraph intro — also used as the card blurb on the front page>

## Flow · ## Tools · ## Speed · ## Control · ## Quality · ## Safety · ## Brainrot · ## Token Use · ## Best For · ## Contributed By
```

The ten `##` headings must be **identical and in this order in every file**. The build fails
loudly if they aren't — that's deliberate, it's what keeps the comparison table honest.

- `## Flow` is a **`| Step | Software Engineer | Agent |`** actor table, optionally with a
  fourth **`| Prompt |`** column, followed by loose markdown (a numbered tail in every file,
  plus a stray paragraph in one and a `_notes_` block in another). It renders as a two-lane
  swimlane. A row with *both* actor cells filled becomes a full-width outcome pair. The tail is
  rendered as opaque markdown — don't try to structure it further.
- The **`Prompt Examples` column** holds example prompts, each in `"double quotes"`, separated
  by a comma or full stop if a step has more than one. Quotes are the delimiter, so a cell may
  contain *nothing* but quoted runs and the punctuation between them — stray prose fails the
  build. The heading must be exactly `Prompt Examples`; it is a machine contract like the
  rating words, so the older `Prompt` now fails loudly rather than still working.
  `promptTrigger` and `promptDialog` in `site/components.mjs` render a pill inside the step
  card and a `<dialog>` after it, and the copied string is read straight back out of the
  rendered text, so what is on screen is what lands on the clipboard. Both actors' prompts
  belong here — the agent's example questions too, not just the engineer's. The column is
  optional — `tab_completion.md` has no prompts and stays at three columns.

- `## Tools` is free prose. It renders as pills when every sentence is ≤40 chars
  (`Lovable. Replit. Base44.`) and as prose otherwise. See `readTools` in `site/parse.mjs`.
- The six rating sections are `<Rating>. <reasoning>`. The rating word must be in the `scale`
  in `content/axes.yml`: **Lowest, Low, Low to Medium, Medium, Medium to High, High, Highest,
  Negative**. Nothing else parses. (`Moderate` and `Fastest` were used once each and were
  normalised away — don't reintroduce them.)
- `## Contributed By` is the attribution block: a markdown list of contributor links, one per
  line. Bare URLs are fine — `linkify` is on in `site/parse.mjs`, so they render as anchors.
  It is **not** a rubric section: it renders as a small credit line below the two-up, styled by
  `.attribution` in `static/site.css`, not as a third column.
- "Brainrot" is the name of the cognitive-cost axis. It was "Developer Brain Drain" earlier and
  the designer's mockup says "Brain drain" — **don't revert either way**. The inverted framing
  used on the dots and radar ("Skill retention") is set in `content/axes.yml`.

### Adding a pattern

Write `patterns/<name>.md` with the frontmatter and the ten headings. That is the whole job —
card, detail page, radar, comparison-table row and nav all appear. Add the Lucide icon to
`site/icons.mjs` if it's a new one.

`## Contributed By` is required like every other heading — a new pattern without it fails the
build.

### Adding an axis

Add an entry to `axes` in `content/axes.yml` **and** a matching `##` section to all five pattern
files. Nothing in the templates hardcodes six axes. There is an open proposal to add
**"Blast Radius"** — it does real analytic work across all five patterns and is currently
smuggled into Safety prose.

## Voice

Drafts have typos (`untill`, `eqivalent`, `succesfully`, `interraction`, `ommissions`) and
deliberately informal asides (the PUBG Mobile line, `#fun`, `#expensive`, `etc.....`).
**Don't mass-fix silently** — ask, the informality is the voice. Rating-word normalisation is the
exception: the vocabulary is a machine contract, so it stays a closed set.

## Research convention

Established for `research/walled-garden-quality-and-safety.md`; follow it for new research files:

- Open by quoting the exact claim from the pattern file being investigated (name the file).
- Date the research and note that platform facts are a snapshot.
- Distinguish vendor-published architecture claims from independent/measured evidence, and say
  when a proxy metric is industry-wide rather than specific to the subject.
- End with a **Suggested edits** section (naming the target pattern file) and a **Sources** list.

### Findings already banked (don't re-research)

`research/walled-garden-quality-and-safety.md` covers Lovable / Replit / Base44 quality and
safety. Load-bearing conclusions:

- Multi-agent cross-checking is real and published (Replit Agent 3's isolated testing subagent,
  Playwright-in-REPL); it is asymmetric across vendors and, at Lovable, gated behind paid Agent Mode.
- DRY is the weakest link and the one more agents won't fix — verification proves the app *works*,
  nothing checks the logic isn't written six times.
- Standard auth libraries were mostly used (Replit is an OIDC provider; Lovable rides Supabase
  Auth; Base44 rolled its own). The failures were in platform-layer authorization and in
  generated-code defaults, not in crypto.
- Walled gardens invert the "small blast radius" argument: risk is systemic and inherited from the
  vendor, and the user has no lever on it. **This landed** — the Safety section of
  `patterns/full_vibe_walled_garden.md` was rewritten from it on 2026-08-14.
- Recurring motif worth reusing across the site: **a guardrail stated in the prompt is not a
  guardrail** — only what's enforced in the execution path counts (Replit's ignored code freeze).
