# abunitador

An agent for building websites that do not look AI-generated. Landing pages, marketing sites,
portfolios, agency sites. Greenfield, redesign, or modelled on a specific reference.

Two halves: an ambition playbook (one signature moment, executed absurdly well) and a hard
pre-flight gate (~35 mechanical checks that catch the tells). Both required.

## Install

Three paths. All three were tested end to end on 2026-08-26, not assumed.

### 1. Copy (simplest)

```bash
cp -r abunitador ~/.claude/skills/abunitador     # per-user
cp -r abunitador .claude/skills/abunitador       # per-project
```

Because this directory carries `.claude-plugin/plugin.json`, dropping it under
`~/.claude/skills/` also makes Claude Code load it as a plugin named `abunitador@skills-dir`
on the next session - the skill and the `abunitador` subagent both register, no install step.

### 2. Plugin, via marketplace

Two repo shapes are supported, and both were installed end to end before this was written.

**From GitHub** - what anyone else runs, verified against the live repo:

```bash
claude plugin marketplace add PedroCarvalho768/abunitador
claude plugin install abunitador@abunitador -y
claude plugin details abunitador@abunitador
```

**From a local checkout** - same manifest, added by path instead:

```bash
claude plugin marketplace add ./abunitador     # `.` alone is rejected; needs ./path
claude plugin install abunitador@abunitador -y
```

**Inside the `my-skills` monorepo** - using the parent's
`.claude-plugin/marketplace.json`, which lists `./abunitador`:

```bash
claude plugin marketplace add ./my-skills        # or PedroCarvalho768/my-skills once pushed
claude plugin install abunitador@pedro-skills -y
claude plugin details abunitador@pedro-skills
```

Both print the same inventory: `Skills (1) abunitador`, `Agents (1) abunitador`, ~263
always-on tokens, ~5.4k when the skill fires.

The relative `"source"` in each manifest resolves against whatever directory the marketplace
was added from, so **the same files work for a local path and for a pushed GitHub repo**. No
`github` source block is needed.

**Caveat:** the installer copies into a version-pinned cache directory
(`~/.claude/plugins/cache/abunitador/abunitador/<version>/`). Edits to the source do **not**
propagate. When iterating, bump `version` in both `.claude-plugin/plugin.json` and the
SKILL.md frontmatter, then `claude plugin marketplace update abunitador` and reinstall - or
just use path 1, which reads the directory in place.

### 3. `npx skills add`

```bash
npx skills add PedroCarvalho768/abunitador -g --all
```

Verified: the CLI clones the repo and reports `Found 1 skill - abunitador`. Add `--list` to
see what it found without installing, or `--full-depth` for a multi-skill repo.

### Then

```bash
node scripts/setup.mjs            # report which companion skills are missing
node scripts/setup.mjs --install  # install them
```

Then `/abunitador <brief>`, or just describe the site - the description triggers it.

## Publishing checklist

```bash
claude plugin validate . --strict                  # marketplace manifest
claude plugin validate .claude-plugin/plugin.json --strict
node --check scripts/setup.mjs && node --check scripts/contrast.mjs
node scripts/contrast.mjs "#767676" "#fff"         # expect PASS 4.54:1
git status --porcelain                             # must be clean of scratch files
```

Before pushing:

1. Bump `version` in **both** `.claude-plugin/plugin.json` and the SKILL.md frontmatter. They are read separately and a mismatch is silent.
2. If the repo moves, update `homepage` and `repository` in `.claude-plugin/plugin.json`. Nothing validates them, so a stale URL just 404s silently.
3. Update the `verified` date in the SKILL.md frontmatter if you re-checked the font or library catalogs.
4. Check `git status`, do not trust `.gitignore`. An 831 KB font-API dump got packaged into a build once because a verification run wrote it next to the skill.

Only `abunitador/` needs to ship. The parent `.claude-plugin/marketplace.json` in `my-skills/` is only used
if you publish the monorepo.

## Layout

```
SKILL.md                        entry point: setup -> mode -> design read -> brains -> build -> gate
references/wow.md               signature moments, ambition toolkit, expensive-feeling craft
references/type-and-color.md    verified font lists and pairings, color strategy, OKLCH ramps
references/stack.md             stack detection, defaults, layout mechanics
references/motion.md            GSAP / Motion / anime.js - verified installs and current APIs
references/components.md        shadcn registries: commands, licensing, gotchas
references/refs.md              working from reference sites and screenshots
references/redesign-audit.md    redesign protocol: audit, preservation, levers
scripts/setup.mjs               detect + install the companion skills
scripts/contrast.mjs            WCAG 2.2 contrast checker
agents/abunitador.md            thin subagent wrapper
```

## Companions

Works standalone - `references/` carries a distillation of all four. When they are present it
defers to the real thing instead. `setup.mjs` handles them:

| Skill | Installed as |
|---|---|
| taste | `npx skills add Leonxlnx/taste-skill` -> `design-taste-frontend` |
| impeccable | `npx skills add pbakaus/impeccable` |
| frontend-design | `claude plugin install frontend-design@claude-plugins-official` |
| web interface guidelines | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` (optional - the skill just fetches `raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`, and abunitador fetches it directly as a fallback) |

`setup.mjs` deliberately avoids `npx impeccable install`. That installer picks a scope by
itself and writes detector hooks into the current project's `.claude/settings.local.json`
without prompting. Run it yourself if you want the per-harness build.

## Contrast checker

The most-waved-through gate item, made into a number:

```bash
node scripts/contrast.mjs "#767676" "#fff"        # PASS 4.54:1
node scripts/contrast.mjs "#777" "#fff"           # FAIL 4.48:1
node scripts/contrast.mjs --pairs pairs.txt       # "fg bg label" per line
```

WCAG 2.2 G18 formulas. Hex and `rgb()`; resolve OKLCH to hex first rather than converting by hand.

## Notes

Every install command, API, font name, and package version in `references/` was verified
against the source on 2026-08-26, not recalled. Fonts were checked against
`fonts.google.com/metadata/fonts` (1946 families) and `api.fontshare.com/v2/fonts`, so every
family named is confirmed to exist - a hallucinated font falls back to the system stack
silently and takes the design with it.

Three things worth knowing because model training data usually has them wrong:

- **GSAP and all its plugins are free** for commercial use, including SplitText, MorphSVG and
  ScrollSmoother. No token, no private registry.
- **Motion+ (`motion-plus/react`) is paid**, behind a private registry. Plain `motion` is free.
- **anime.js v4 has named exports** (`import { animate } from 'animejs'`). The v3 default-export
  `anime({...})` form is gone.

Not for: dashboards, admin UI, data tables, backend work.
