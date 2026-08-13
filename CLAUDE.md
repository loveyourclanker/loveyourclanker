# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Content repo, not a codebase. No build, no tests, no dependencies. Writing and research for a planned website, **LoveYourClanker.org** — "Patterns of Agent Interaction", describing and comparing patterns of interaction between software engineers and AI agents.

Git repo, but with no commits yet — everything except `assets/shit.md` is staged on `main`.

## Layout

- `README.md` — site name and one-line pitch.
- `patterns/` — one markdown file per pattern. These are the live drafts and the source of truth for site content. They replaced the old single `inception.md`.
- `research/` — one markdown file per research question, backing specific claims in the patterns.
- `assets/shit.md` — scratch pad. Format experiments and discarded drafts, deliberately messy. **Not content.** Never cite it as current state or "fix" it.
- `assets/palette.txt` — teal/copper/patina palette (crocodile scales, oxidised metal), matching the crocodile branding. Use for any site or artifact work.
- `assets/clanker_reference.png`, `clanker_idle_animation.mp4` — mascot reference.
- `design_handoff/` — gitignored design export (HTML + JS + uploads). Not content; leave alone unless asked.

### Dropped in the split

The old `inception.md` had trailing `## References` (footnote definitions, `[^1]`), `## Words` (definition-list glossary), and a `----shit` scratch list. None of these survive in `patterns/`. Don't reintroduce them into pattern files without asking; if footnotes come back they need a home.

## Pattern rubric

Five patterns, in increasing order of handoff:

| Order | File | Title |
| ----: | ---- | ----- |
| 1 | `patterns/tab_completion.md` | Tab Completion |
| 2 | `patterns/full_vibe_agent.md` | Full Vibing with Agent |
| 3 | `patterns/full_vibe_walled_garden.md` | Full Vibing in a Walled Garden |
| 4 | `patterns/plan_execute_check.md` | Plan, Execute, Check |
| 5 | `patterns/icode_ucheck.md` | I Code, You Check |

Each file is `# <Pattern Title>`, a one-paragraph intro, then a fixed rubric at `##` — keep it identical across patterns so they stay comparable in a table:

`## Flow` · `## Tools` · `## Speed` · `## Control` · `## Quality` · `## Safety` · `## Brainrot` · `## Token Use` · `## Best For`

Ratings are qualitative (Low / Medium / High / Highest / Fastest) plus a sentence of reasoning. "Brainrot" is the current name for the cognitive-cost axis — it was "Developer Brain Drain" earlier; don't revert it.

`## Flow` is currently numbered prose ending "The interaction ends." A two-column **Software Engineer | Agent** actor table (optionally with a leading step number) is being trialled in `assets/shit.md` as a replacement. Not adopted in `patterns/` yet — ask before converting.

## Voice

Drafts have typos (`untill`, `eqivalent`, `Implementatino`) and deliberately informal asides (the PUBG Mobile line). Don't mass-fix silently — ask, since the informality is the voice.

## Research convention

Established for `research/walled-garden-quality-and-safety.md`; follow it for new research files:

- Open by quoting the exact claim from the pattern file being investigated (name the file).
- Date the research and note that platform facts are a snapshot.
- Distinguish vendor-published architecture claims from independent/measured evidence, and say when a proxy metric is industry-wide rather than specific to the subject.
- End with a **Suggested edits** section (naming the target pattern file) and a **Sources** list of markdown links.

### Findings already banked (don't re-research)

`research/walled-garden-quality-and-safety.md` covers Lovable / Replit / Base44 quality and safety. Load-bearing conclusions:

- Multi-agent cross-checking is real and published (Replit Agent 3's isolated testing subagent, Playwright-in-REPL); it is asymmetric across vendors and, at Lovable, gated behind paid Agent Mode.
- DRY is the weakest link and the one more agents won't fix — verification proves the app *works*, nothing checks the logic isn't written six times.
- Standard auth libraries were mostly used (Replit is an OIDC provider; Lovable rides Supabase Auth; Base44 rolled its own). The failures were in platform-layer authorization and in generated-code defaults, not in crypto.
- Walled gardens invert the "small blast radius" argument: risk is systemic and inherited from the vendor, and the user has no lever on it.
- Recurring motif worth reusing across the site: **a guardrail stated in the prompt is not a guardrail** — only what's enforced in the execution path counts (Replit's ignored code freeze).

An open proposal from that research: add **"Blast Radius"** as its own rubric row. It does real analytic work across all five patterns and is currently smuggled into Safety prose.
