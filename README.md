# lema-beautify

An agent for building websites that do not look AI-generated. Landing pages, marketing sites,
portfolios, agency sites. Greenfield, redesign, or modelled on a specific reference.

Four parts, all required: a sourcing step that browses the real galleries in your Chrome and
shops nine component and motion libraries instead of reinventing them, an ambition playbook
(one signature moment, executed absurdly well), a hard pre-flight gate (~35 mechanical checks
that catch the tells), and a browser verify loop - measure, screenshot three viewports, score,
fix, repeat until it passes.

## Install

Three paths. All three were tested end to end on 2026-08-26, not assumed.

### 1. Copy (simplest)

```bash
cp -r lema-beautify ~/.claude/skills/lema-beautify     # per-user
cp -r lema-beautify .claude/skills/lema-beautify       # per-project
```

Because this directory carries `.claude-plugin/plugin.json`, dropping it under
`~/.claude/skills/` also makes Claude Code load it as a plugin named `lema-beautify@skills-dir`
on the next session - the skill and the `lema-beautify` subagent both register, no install step.

### 2. Plugin, via marketplace

Two repo shapes are supported, and both were installed end to end before this was written.

**From GitHub** - what anyone else runs, verified against the live repo:

```bash
claude plugin marketplace add PedroCarvalho768/lema-beautify
claude plugin install lema-beautify@lema-beautify -y
claude plugin details lema-beautify@lema-beautify
```

**From a local checkout** - same manifest, added by path instead:

```bash
claude plugin marketplace add ./lema-beautify     # `.` alone is rejected; needs ./path
claude plugin install lema-beautify@lema-beautify -y
```

**Inside the `lema-skills` monorepo** - using the parent's
`.claude-plugin/marketplace.json`, which lists `./lema-beautify`:

```bash
claude plugin marketplace add ./lema-skills        # or PedroCarvalho768/lema-skills once pushed
claude plugin install lema-beautify@pedro-skills -y
claude plugin details lema-beautify@pedro-skills
```

Both print the same inventory: `Skills (1) lema-beautify`, `Agents (1) lema-beautify`, ~293
always-on tokens, ~6.7k when the skill fires.

The relative `"source"` in each manifest resolves against whatever directory the marketplace
was added from, so **the same files work for a local path and for a pushed GitHub repo**. No
`github` source block is needed.

**Caveat for authors:** the installer copies into a version-pinned cache directory
(`~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`). Your local edits do **not**
propagate to an installed copy. While iterating, use path 1 - a symlink or junction reads the
directory in place.

### 3. `npx skills add`

```bash
npx skills add PedroCarvalho768/lema-beautify -g --all
```

Verified: the CLI clones the repo and reports `Found 1 skill - lema-beautify`. Add `--list` to
see what it found without installing, or `--full-depth` for a multi-skill repo.

### Then

```bash
node scripts/setup.mjs            # report which companion skills are missing
node scripts/setup.mjs --install  # install them
```

Then `/lema-beautify <brief>`, or just describe the site - the description triggers it.

## Updating

**Installed as a plugin** - one command, then restart Claude Code:

```bash
claude plugin update lema-beautify
```

It reports the version it moved to, or tells you it is already current
(`lema-beautify is already at the latest version (X.Y.Z).`). Add `-y` in a non-interactive
shell. A restart is required before the new version loads.

If it does not see a new release, the marketplace clone is stale - refresh it first:

```bash
claude plugin marketplace update lema-beautify
claude plugin update lema-beautify
```

**Installed via `npx skills add`:**

```bash
npx skills update lema-beautify
```

**Installed by copy** - re-copy, or switch to a symlink/junction so it never goes stale:

```bash
# Windows, no admin needed
New-Item -ItemType Junction -Path "$HOME/.claude/skills/lema-beautify" -Target "<path to repo>"
# macOS / Linux
ln -s <path to repo> ~/.claude/skills/lema-beautify
```

**Symlink or junction installs need no update step** - they read the repo in place, so
`git pull` is the whole update. Changes apply on the next session.

## Publishing checklist

```bash
claude plugin validate . --strict                  # marketplace manifest
claude plugin validate .claude-plugin/plugin.json --strict
node --check scripts/setup.mjs && node --check scripts/contrast.mjs
node scripts/contrast.mjs "#767676" "#fff"         # expect PASS 4.54:1
git status --porcelain                             # must be clean of scratch files
claude plugin tag --dry-run                        # checks the versions agree
```

`claude plugin tag` creates an `lema-beautify--v<version>` git tag and **refuses unless
plugin.json and the enclosing marketplace entry agree**, which is the version-mismatch trap
below caught mechanically. `--push` sends it to origin; `--dry-run` just checks.

Before pushing:

1. Bump `version` in **both** `.claude-plugin/plugin.json` and the SKILL.md frontmatter, and update the manifest `description` if the feature set changed - that string is what the marketplace shows. `claude plugin tag --dry-run` catches a version mismatch; nothing catches a stale description.
2. If the repo moves, update `homepage` and `repository` in `.claude-plugin/plugin.json`. Nothing validates them, so a stale URL just 404s silently.
3. Update the `verified` date in the SKILL.md frontmatter if you re-checked the font or library catalogs.
4. Check `git status`, do not trust `.gitignore`. An 831 KB font-API dump got packaged into a build once because a verification run wrote it next to the skill.

Only `lema-beautify/` needs to ship. The parent `.claude-plugin/marketplace.json` in `lema-skills/` is only used
if you publish the monorepo.

## Layout

```
SKILL.md                        setup -> mode -> read -> brains -> build -> gate -> browser loop
references/sourcing.md          galleries via Chrome, registry catalogs, shadcn MCP, effect->source
references/verify-loop.md       the Chrome loop: measure, screenshot, score, fix, repeat
references/wow.md               signature moments, ambition toolkit, expensive-feeling craft
references/type-and-color.md    verified font lists and pairings, color strategy, OKLCH ramps
references/stack.md             stack detection, defaults, layout mechanics
references/motion.md            GSAP / Motion / anime.js - verified installs and current APIs
references/components.md        shadcn registries: commands, licensing, gotchas
references/refs.md              working from reference sites and screenshots
references/redesign-audit.md    redesign protocol: audit, preservation, levers
scripts/setup.mjs               detect + install the companion skills
scripts/contrast.mjs            WCAG 2.2 contrast checker
agents/lema-beautify.md         thin subagent wrapper
```

## Companions

Works standalone - `references/` carries a distillation of all four. When they are present it
defers to the real thing instead. `setup.mjs` handles them:

| Skill | Installed as |
|---|---|
| taste | `npx skills add Leonxlnx/taste-skill` -> `design-taste-frontend` |
| impeccable | `npx skills add pbakaus/impeccable` |
| frontend-design | `claude plugin install frontend-design@claude-plugins-official` |
| web interface guidelines | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` (optional - the skill just fetches `raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`, and lema-beautify fetches it directly as a fallback) |

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
