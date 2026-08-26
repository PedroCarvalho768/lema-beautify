# Component sources

Verified 2026-08-26. All commands below came from each project's own docs.

Reach for a registry when the interaction already exists and is fiddly (3D card tilt, marquee, dynamic island, image reveal, animated number, chart). Hand-roll when the component *is* the signature element - the thing the page is remembered by should not be something a thousand other sites installed.

**Before any of these:** the project needs shadcn/ui initialised (`npx shadcn@latest init`) and `components.json` present. These are registries, not npm packages - the CLI copies source into your repo and you own it from then on.

## The registries

| Source | Add a component | What it is | Cost |
|---|---|---|---|
| **Kokonut UI** | `npx shadcn@latest add @kokonutui/<name>` | 100+ interactive components, 7+ templates. React + Tailwind + Motion. Publishes a machine-readable registry aimed at agents. | Free tier is the full open-source set. Kokonut UI Pro is paid. |
| **Skiper UI** | `npx shadcn add @skiper-ui/<name>` | 106+ uncommon components - dynamic island, image reveal, hover members. Motion.dev. Claims no extra dependencies. Components are numbered (`skiper40`). | Some free. Premium $129 one-time, Exclusive $549 with Figma + templates. |
| **Aceternity UI** | `npx shadcn@latest add @aceternity/<name>` | 200+ components and shadcn-compatible blocks (hero, features, pricing, testimonials, navbars) plus full templates. React + Tailwind + Framer Motion. | 200+ free. All-Access Pass is paid, lifetime. |
| **Unlumen UI** | shadcn registry `@unlumen-ui`, raw JSON at `https://ui.unlumen.com/r/{name}.json` | React components on the shadcn install flow. | Free components install unauthenticated. **Pro needs a Polar licence key** in `.env.local` and a registry auth entry in `components.json` (bearer header or query param). Do not attempt a Pro component without the user's key. |
| **Bklit UI** | `pnpm dlx shadcn@latest add @bklit/<name>` | **Data visualisation only** - area/bar/line/pie charts, gauges, heatmaps, plus axes, legends, tooltips, and a Studio chart builder. Registry at `https://ui.bklit.com/r/{name}.json`. | Open source, in the Vercel OSS program. Licence not stated in the docs - check the repo before shipping commercially. |
| **OriginKit** | Has its own CLI: `originkit` on npm (v0.2.23, MIT), described as "like shadcn, backed by the Originkit registry". Its site references `registryDependencies`, so it is shadcn-registry shaped. | Free animated component library for modern websites. | Free. |

**OriginKit caveat:** originkit.dev returns 403 to non-browser clients, so the exact subcommand could not be verified. Run `npx originkit@latest --help` and read the real usage before writing an install line. Do not guess it.

## When `@namespace/name` will not resolve

Namespaced shorthand depends on the registry being known to your shadcn CLI version. If `add @foo/bar` fails:

1. Add the registry to the `registries` field in `components.json`, or
2. Use the full JSON URL directly: `npx shadcn@latest add https://ui.unlumen.com/r/<name>.json`

Both are supported. The URL form always works and is the reliable fallback.

## After installing anything

- **Read the file.** It landed in your repo; it is your code now. Retheme it to your tokens - a registry component shipped at its default colors and radius is a visible tell.
- **Check what came with it.** Some registries pull dependencies you did not ask for (Bklit's chart components install `@bklit/shimmering-text`). Check the diff and `package.json`.
- **Do not mix motion libraries.** Aceternity uses Framer Motion, Kokonut and Skiper use Motion. Both resolve to the same engine family, but a tree that also runs GSAP will fight for frames. Pick one motion library per component tree.
- **One icon family.** If a component arrives with Lucide and the project is on Phosphor, swap it.
- **Do not install three registries for four components.** Every extra registry is another set of conventions in the codebase.

## Charts

Bklit for a designed chart in a marketing context. Chart.js in the single-file HTML lane. Anything data-dense and interactive belongs in a product UI, which is out of this skill's scope.
