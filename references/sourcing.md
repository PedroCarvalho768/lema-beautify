# Sourcing: shop before you build

Endpoints verified 2026-08-26.

The failure this file exists to prevent: hand-rolling a mediocre version of an effect that a
registry already ships polished, or inventing a design direction from nothing when galleries
of real work are one Chrome tab away. **Reinventing a spotlight card is not craft, it is
waste.** Build the signature moment yourself. Shop everything around it.

This step is not optional and it happens **before** you write components.

## 1. Look at real work first

The galleries block plain fetches (403 from Cloudflare), but they do not block a browser. The
skill already drives the user's Chrome for the verify loop - use the same tooling here, in the
user's own logged-in session.

```
tabs_context_mcp { createIfEmpty: true }
tabs_create_mcp
navigate { url: "https://saaspo.com", tabId }
computer { action: "screenshot", tabId }
```

Ask the user before browsing - it uses their account and their subscriptions.

| Source | What it is | Reachable |
|---|---|---|
| `mobbin.com` | Real app and web UI flows, screenshotted | Chrome only, subscription |
| `saaspo.com` | SaaS website gallery | Chrome only |
| `recent.design` | Curated recent web design | Chrome only |
| `motionsites.ai` | Motion-heavy site gallery; prompts behind signup | Gallery browses fine |
| `getlayers.ai` | Prompt and template library, freemium | Partly |

Pull **three** references, not one. One reference produces a clone; three produce a synthesis.
For each, extract the six things in `refs.md` - type, palette, spatial rhythm, materiality,
motion vocabulary, signature - then build something none of them is.

Never claim to have looked at a gallery you could not load.

## 2. Read the machine-readable catalogs

Several of these libraries publish catalogs written for agents. Read them instead of guessing
component names - a guessed name is an install that fails.

| Endpoint | What you get |
|---|---|
| `https://ui.aceternity.com/registry.json` | **278 components enumerated** as `items[].name` + `type`. The best discovery surface of the lot. |
| `https://ui.aceternity.com/llms.txt` | ~74 KB agent-oriented catalog |
| `https://kokonutui.com/llms.txt` | ~11 KB index linking each component to a `.md` page that carries **the install command and the full source** |
| `https://ui.unlumen.com/llms.txt` | Short pointer to docs and gallery |
| `https://motion.dev/llms.txt` | ~47 KB of current Motion docs |
| `https://gsap.com/llms.txt` | ~25 KB of current GSAP docs |

No `llms.txt`: Skiper UI, Bklit, OriginKit. Browse those in Chrome or read their docs pages.

Grepping Aceternity's registry for the effect you need beats scrolling a website:

```bash
curl -s https://ui.aceternity.com/registry.json | node -e "
  let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
    const q=process.argv[1].toLowerCase();
    JSON.parse(s).items.filter(i=>i.name.toLowerCase().includes(q))
      .forEach(i=>console.log(i.name, '|', i.type));
  })" scroll
```

## 3. Wire the shadcn MCP server, once per project

This is the difference between "the libraries are documented" and "the agent uses the
libraries". With it configured you can list, read, and install registry components by name
instead of copy-pasting CLI incantations.

```bash
npx shadcn@latest mcp init --client claude
```

Registries are discovered through `components.json`. Add the namespaces you intend to use:

```json
{
  "registries": {
    "@kokonutui": "https://kokonutui.com/r/{name}.json",
    "@unlumen-ui": "https://ui.unlumen.com/r/{name}.json",
    "@bklit": "https://ui.bklit.com/r/{name}.json"
  }
}
```

`{name}` is a literal template token, not a placeholder for you to fill. After this,
`npx shadcn@latest add @kokonutui/particle-button` resolves, and so does the MCP equivalent.

If a namespaced add fails, fall back to the full JSON URL - it always works:

```bash
npx shadcn@latest add https://ui.unlumen.com/r/<name>.json
```

## 4. Effect to source

Look here before writing an effect from scratch.

| You need | Go to | Notes |
|---|---|---|
| 3D card tilt, spotlight, sparkles, glowing stars, text-reveal card, moving line, grid and beam backgrounds | **Aceternity** | 278 items; `npx shadcn@latest add @aceternity/<name>` |
| Dynamic island, image reveal, hover members, uncommon interactions | **Skiper UI** | Numbered names (`skiper40`); `npx shadcn add @skiper-ui/<name>` |
| Animated backgrounds, particle button, card flip, polished small components | **Kokonut UI** | `npx shadcn@latest add @kokonutui/<name>`; per-component `.md` carries full source |
| Free animated components | **OriginKit** | Own CLI - run `npx originkit@latest --help` first, do not guess the subcommand |
| Additional animated React primitives | **Unlumen UI** | Pro components need a Polar licence key; do not attempt without the user's key |
| Charts, gauges, heatmaps in a marketing context | **Bklit** | Data-viz only, not a general UI kit |
| Scroll narrative: pin, scrub, horizontal pan, card stack, split text | **GSAP + ScrollTrigger** | Build it. No registry ships your page's story. All plugins free. |
| UI state, enter/exit, layout, gestures, magnetic hover | **Motion** | `motion/react` |
| Standalone SVG/DOM sequences, draggable physics | **anime.js v4** | Named exports |
| Smooth scroll | **Lenis** | Or GSAP ScrollSmoother. Never both. |

## 5. Rules that keep this from becoming a mess

- **The signature moment is hand-built.** If the thing your page is remembered by came from a registry, a thousand other sites have it and it is not a signature. Shop the supporting cast, build the lead.
- **Retheme everything you install.** A registry component shipped at its default colours, radius, and easing is a visible tell. Pass it through your tokens before you look at it twice.
- **One motion library per component tree.** Aceternity uses Framer Motion, Kokonut and Skiper use Motion. Adding GSAP to that tree makes them fight for frames.
- **Two registries, maximum, per project.** Each one is another set of conventions in the codebase. Four registries for five components is how a codebase becomes unmaintainable.
- **Check what came with it.** These installs pull transitive dependencies. Read the diff and `package.json` after every add.
- **Pro tiers are real.** Skiper ($129 / $549), Aceternity All-Access, Kokonut Pro, Unlumen Pro (Polar key). Do not write an import for a component behind a paywall the user has not bought.

## 6. Say what you shopped

In your handoff, list what came from where:

```
Sourced:
  hero background   @kokonutui/beams-background   (rethemed to --accent ramp)
  pricing tilt      @aceternity/3d-card           (radius 12px, easing swapped)
  scroll narrative  hand-built, GSAP ScrollTrigger pin + scrub  <- the signature
Rejected:
  @aceternity/spotlight - reads as generic SaaS, cut
```

If that list is empty on a motion-heavy build, you almost certainly rebuilt something that
already existed. Go back to step 2.
