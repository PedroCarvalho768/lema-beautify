---
name: abunitador
description: Builds and rebuilds websites that do not look AI-generated. Use for landing pages, marketing sites, portfolios, agency sites, one-pagers - greenfield, redesign of an existing site, or a new site modelled on a specific reference. Handles design direction, stack choice, component-registry sourcing, scroll/motion engineering, and a hard pre-flight gate before shipping. Not for dashboards, admin UI, data tables, or backend work.
license: MIT
metadata:
  author: Pedro Carvalho
  version: "1.0.0"
  verified: "2026-08-26"
---

# abunitador

You build websites that stop people scrolling. The target is not "clean" or "professional" -
it is the site someone screenshots and sends to a friend. Aim for that every time.

Two halves, both required:

- **Ambition** - one signature moment executed to an absurd standard. `references/wow.md`.
- **Discipline** - the Step 4 gate, which is what separates ambitious from amateur.

Ambition without the gate is slop with effects on it. The gate without ambition is competent
wallpaper. Neither ships.

Four non-negotiables, before anything else:

1. **Never skip Step 4.** The gate is the skill. Everything before it is preparation.
2. **Never install a package without checking `package.json` first.** Print the install command, run it, then import.
3. **Never invent an API.** If you are unsure of a library's current API, read `references/motion.md`, or query Context7, or read the docs. Do not guess.
4. **Declare, do not ask.** One design read, stated in one line. Ask at most one clarifying question, and only when the read genuinely forks.

---

## Setup - install what is missing

Once per session, before the design work:

```bash
node scripts/setup.mjs
```

It reports which of the four companion skills are present and prints the exact command for
each missing one. If anything is missing, tell the user what and ask once, then:

```bash
node scripts/setup.mjs --install
```

Newly installed skills are picked up on the next session, so for *this* session use the
`references/` fallbacks either way and carry on. Never block the build on an install.

Deliberately **not** run by the installer: `npx impeccable install`. That installer chooses a
scope by itself and writes detector hooks into the current project's
`.claude/settings.local.json` without asking. `setup.mjs` uses `npx skills add pbakaus/impeccable`
instead. Point the user at the other one if they want the per-harness build and its hooks.

**Project dependencies are a separate thing, and you install them, you do not print them.**
Once the direction is set in Step 3, check `package.json`, then actually run the installs the
direction needs - `gsap` and `@gsap/react` for scroll work, `motion` for UI motion, `lenis`
for smooth scroll, `npx shadcn@latest init` before any registry component. Exact commands and
current APIs in `references/motion.md` and `references/components.md`. A build that imports
something absent is a broken build, not a suggestion.

---

## Step 0. Mode and stack

**Mode** (first action, always). Pick one and say which:

| Mode | Signal | What changes |
|---|---|---|
| `new` | No site exists. Blank repo or a brief. | Full freedom. Set dials from the brief. |
| `redesign` | An existing site/repo is the subject. | **Read `references/redesign-audit.md` before touching code.** Audit first. Content and IA are not yours to rewrite. |
| `modelled-on` | "Like <site>", "based on <site>", a URL or screenshots. | Extract the reference's *system* (type scale, palette, spacing, motion vocabulary). Rebuild it for this subject. See `references/refs.md`. |

If ambiguous between `redesign` and `modelled-on`, ask once: *"Preserve the existing brand, or start visually from scratch?"*

**Stack.** Detect, do not assume. Read `package.json`, `components.json`, `tailwind.config.*`, `app/`, `src/`, `next.config.*`. Match what is there. Only when nothing exists do you choose, and then follow `references/stack.md`.

For a pure visual exploration ("show me a direction", "mock this up"), a single self-contained `index.html` is the correct answer, not a framework. `references/stack.md` covers that lane.

---

## Step 1. Design read and dials

Output one line before any code:

> Reading this as: **\<page kind>** for **\<audience>**, with a **\<vibe>** language, leaning **\<aesthetic family / design system>**.

Then set three dials explicitly, with a reason. Do not silently accept the baseline.

* `DESIGN_VARIANCE` 1-10 - 1 = perfect symmetry, 10 = artsy chaos
* `MOTION_INTENSITY` 1-10 - 1 = static, 10 = cinematic
* `VISUAL_DENSITY` 1-10 - 1 = art gallery, 10 = cockpit

Baseline `8 / 6 / 4`. Overrides:

| Signal | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| minimalist / calm / editorial / Linear-style | 5-6 | 3-4 | 2-3 |
| premium consumer / luxury / Apple-y | 7-8 | 5-7 | 3-4 |
| agency / Awwwards / experimental | 9-10 | 8-10 | 3-4 |
| trust-first / public-sector / regulated | 3-4 | 2-3 | 4-5 |
| redesign - preserve | match existing | +1 | match existing |
| redesign - overhaul | +2 | +2 | match existing |

**The category-reflex test.** If someone could guess your palette and type from the *category alone*, it is the first reflex - rework it. If they could guess it from *category plus your obvious anti-reference* ("AI tool but not SaaS-purple, so editorial-serif"), that is the second reflex - also rework it. Both answers must be non-obvious.

---

## Step 2. Load the design brains

Hybrid by design: prefer the real skill, fall back to the bundled distillation. Try each, once.

| Brain | Try | If unavailable |
|---|---|---|
| **taste** - anti-slop rules, dials, redesign protocol, 60-item pre-flight | `Skill(design-taste-frontend)` | Step 4 gate below + `references/redesign-audit.md` |
| **impeccable** - craft, color strategy, typography ceilings, copy bans | `Skill(impeccable)` | Hard bans below + `references/stack.md` |
| **frontend-design** - aesthetic direction, signature element, copy | `Skill(frontend-design)` | Step 1 read + Step 3 signature rule |
| **web interface guidelines** - a11y / UX audit pass | `Skill(web-design-guidelines)` | `WebFetch https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` and apply it directly |

The last row is the cheap one: that skill is only a fetch wrapper, so the fetch alone is a complete substitute. Do it at Step 4 regardless.

Missing ones are handled by `scripts/setup.mjs` in Setup above. Do not stall waiting for an
install - the fallbacks are complete enough to ship, and a freshly installed skill only loads
next session anyway.

---

## Step 3. Build

Order matters. Do not start at the components.

1. **Tokens first.** Color (OKLCH), type scale, spacing scale, radii, one z-index ladder. Commit them before writing a section. **`references/type-and-color.md`** carries the strategy ladder, the ramp method, the banned warm-neutral band, and a contrast script - use it, do not improvise a palette.
2. **Type next.** Display + body, at most 3 families, paired on a contrast axis. Pick from the verified font lists in `references/type-and-color.md`; every family there is confirmed to exist. Never name a font from memory - one that turns out not to exist falls back to the system stack silently and takes the design with it.
3. **Name the signature moment.** Before any section markup, write the one sentence someone will use to describe this page to a friend. **Read `references/wow.md` and choose it deliberately** - it must come from this subject's own world, not from a list of impressive effects. Then keep everything around it quiet so it lands. A page with no signature is a template; a page with three has none.
4. **Sections.** Vary the layout family - across 8 sections use at least 4 different families. Never 3 consecutive image+text splits. Vary the section padding too; identical spacing everywhere is what a template does.
5. **Motion, and motivated.** Every animation justifiable in one sentence (hierarchy / feedback / storytelling / state). `references/motion.md` for library choice and correct APIs, `references/wow.md` for the craft details that read as expensive.
6. **Components:** reach for a registry before hand-rolling an interaction that already exists - except the signature, which you build yourself. `references/components.md`.
7. **Then critique your own work.** Screenshot it, look at it as an image, cut one thing. Only then run the gate.

---

## Step 4. The gate

Run this before you say you are done. Not a vibe check - count things. If a box fails, fix it, then re-run.

**Mechanical**

- [ ] Zero em-dashes (`—`) anywhere on the page. Headlines, body, alt text, captions, buttons. Zero. Also not `--`.
- [ ] Eyebrow count (`uppercase tracking` micro-labels above headings) ≤ `ceil(sections / 3)`. Hero counts as one.
- [ ] Zero numbered section markers (`01 / 02 / 03`, `001 · Capabilities`) unless the content genuinely is an ordered sequence.
- [ ] Hero H1 ≤ 3 lines at every breakpoint. Subtext ≤ 20 words. CTA visible without scrolling.
- [ ] Hero `clamp()` max ≤ 6rem. Display letter-spacing ≥ -0.04em (that is the floor, not the target).
- [ ] Body line length capped 65-75ch.
- [ ] No two CTAs with the same intent on one page. No CTA label wrapping to 2 lines at desktop.
- [ ] One theme for the whole page. No section flipping to inverted mode mid-page.
- [ ] One accent color, one radius system, used identically everywhere.
- [ ] Bento/grid: N items → N cells. Zero empty cells. `grid-auto-flow: dense` where cells vary.
- [ ] At most one horizontal marquee per page.
- [ ] Nav on one line at desktop, height ≤ 80px.
- [ ] No horizontal page scroll at any breakpoint.

**Craft**

- [ ] Contrast **measured, not eyeballed**: `node scripts/contrast.mjs "<fg>" "<bg>"`, or `--pairs pairs.txt` for the whole token set. Body ≥4.5:1, large ≥3:1, **placeholders and CTA labels count as body**. Light-gray body text on a tinted near-white is the single most common failure and the most waved-through box on this list.
- [ ] `prefers-reduced-motion: reduce` alternative for every animation above `MOTION_INTENSITY 3`.
- [ ] Animations use `transform` / `opacity` (blur, clip-path, mask allowed when they materially improve the effect). No animating `width` / `height` / `top` / `left`.
- [ ] No `window.addEventListener('scroll')`. Use `IntersectionObserver`, CSS scroll-driven animations, `useScroll`, or ScrollTrigger.
- [ ] Content is visible by default; reveals *enhance* it. Never gate visibility on a transition that a headless renderer or a hidden tab will never fire.
- [ ] `min-h-[100dvh]`, never `h-screen`.
- [ ] Every `useEffect` animation has a cleanup function.
- [ ] Real images (generated, or `https://picsum.photos/seed/<keyword>/1920/1080`), never div-based fake screenshots or hand-drawn SVG scenes.
- [ ] Keyboard focus visible. Mobile collapses to single column with real padding.
- [ ] Motion claimed = motion shown. If `MOTION_INTENSITY > 4`, the page actually animates.

**Ambition**

- [ ] The signature moment exists, is built, and works. Name it in one sentence in your handoff.
- [ ] Nothing else on the page competes with it.
- [ ] LCP < 2.5s, INP < 200ms, CLS < 0.1 - plausibly, and measured if you can.
- [ ] Every effect degrades rather than breaks: no WebGL, no `backdrop-filter`, no scroll-driven timeline, reduced motion on - the page still reads.
- [ ] It holds up at 390px wide. Desktop-only is a failure, not a trade-off.

**The two tests.** Could someone say "AI made that" without hesitating? Then it failed, whatever the boxes say. And: would someone screenshot this and send it to a friend? If not, you have passed the gate and still not done the job - go back to Step 3.3.

---

## Hard bans

Match and refuse. If you are about to write one of these, restructure the element instead.

- **Gradient text** (`background-clip: text` + gradient). Solid color; emphasis via weight or size.
- **The hero-metric template**: big number, small label, supporting stats, gradient accent.
- **Identical card grids**: three equal icon + heading + text cards. Nested cards are always wrong.
- **Glassmorphism as decoration.** Purposeful and rare, or nothing.
- **Side-stripe borders** (`border-left` >1px as a colored accent).
- **`border: 1px solid` + `box-shadow` with ≥16px blur on the same element.** Pick one.
- **`border-radius` ≥32px on cards.** Cards top out at 12-16px. Pills are fine for tags and buttons.
- **Cream / sand / beige body backgrounds** (OKLCH L .84-.97, C <.06, hue 40-100), and the token names that give it away: `--paper`, `--cream`, `--sand`, `--linen`, `--bone`, `--ivory`. "Warm" belongs in the accent, type, and imagery, not the body background.
- **Inter, Roboto, Arial, Open Sans** as the display face.
- **Hand-drawn / sketchy SVG illustrations**, `feTurbulence` paper grain, `repeating-linear-gradient` stripe backgrounds.
- **Scroll cues** (`↓ scroll`, "Scroll to explore"), version badges in the hero (`v0.6`, `BETA`), locale/weather strips, decorative dots, photo-credit captions as decoration.
- **Placeholder people and companies**: Jane Doe, Acme, "Trusted by" with plain text wordmarks instead of real SVG marks.
- **Marketing buzzwords**: streamline, empower, supercharge, leverage, unleash, seamless, world-class, enterprise-grade, next-generation, game-changer.
- **"X theater" / "not just X, it's Y" copy.** Pick a specific noun and a verb that says what the thing does.
- **Emoji** in code, markup, or visible text, unless the brief is explicitly playful.

---

## References

Load on demand, not upfront.

| File | When |
|---|---|
| `references/wow.md` | **Every build.** Signature moments, the ambition toolkit (Lenis, view transitions, scroll-driven CSS, WebGL), and the craft details that read as expensive |
| `references/type-and-color.md` | **Every build.** Verified font lists and pairings, color strategy, OKLCH ramp method, the banned palette band |
| `references/stack.md` | Choosing or matching a stack; single-file HTML lane; icons, fonts, breakpoints |
| `references/motion.md` | Any animation. Verified install commands and current APIs for GSAP, Motion, anime.js |
| `references/components.md` | Sourcing a component instead of hand-rolling. Registry commands, licensing, gotchas |
| `references/refs.md` | Working from a reference site, screenshots, or an inspiration gallery |
| `references/redesign-audit.md` | Mode is `redesign`. Read before touching code |

| Script | What |
|---|---|
| `scripts/setup.mjs` | Detect and install the four companion skills. `--install` to run them |
| `scripts/contrast.mjs` | WCAG 2.2 contrast ratio. Takes hex / `rgb()`, single pair or `--pairs file` |
