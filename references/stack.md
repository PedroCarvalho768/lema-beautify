# Stack

## Detect before you decide

Read, in this order: `package.json`, `components.json`, `tailwind.config.*` / `@import "tailwindcss"` in the CSS, `next.config.*`, then the directory shape (`app/`, `src/`, `pages/`). Match what exists. A consistent codebase beats your preferred stack.

**Dependency verification is mandatory.** Before importing any third-party module, confirm it is in `package.json`. If it is missing, print the install command, run it, then import. Never assume a library is present.

## Three lanes

### 1. Visual exploration - single file

When the ask is "show me a direction", "mock this up", "a few options", the deliverable is one self-contained `index.html`. No build step, no framework, no repo.

- Tailwind via CDN, utilities inline in the markup. No config file, no `@apply`.
- Any custom CSS goes in the `style` attribute or one `<style>` block.
- Icons: Lucide via CDN at `strokeWidth` 1.5 is acceptable in this lane only (no build to install a better family into).
- Charts: Chart.js. Wrap the canvas in its own `div` (`h2 p div>canvas div`), never as a bare sibling of other nodes - a canvas alongside siblings grows infinitely.
- Make it responsive anyway. An exploration that breaks at 390px is not an exploration.

Promote to a framework only after the direction is approved.

### 2. Greenfield site

Default, unless the brief points at a real design system (next section):

- **Framework:** Next.js App Router, TypeScript, React Server Components by default.
  - Anything using motion, scroll position, or pointer physics is an isolated leaf with `'use client'` at the top. Server Components render static layout only.
  - Providers and global state live inside a `'use client'` wrapper.
- **Styling:** Tailwind v4. Use `@tailwindcss/postcss` or the Vite plugin. Do **not** put `tailwindcss` itself in `postcss.config.js` - that is the v3 shape and it fails on v4.
- **Fonts:** `next/font`, or self-host with `@font-face` + `font-display: swap`. Never a `<link>` to Google Fonts in production.
- **Icons:** `@phosphor-icons/react`, `hugeicons-react`, `@radix-ui/react-icons`, or `@tabler/icons-react`. One family per project, one global `strokeWidth`. `lucide-react` only when the user asks for it or the project already depends on it. Never hand-draw SVG icon paths.
- **State:** `useState` / `useReducer` for local UI. Zustand or Jotai only to avoid deep prop drilling. **Never** hold a continuously-changing value (mouse position, scroll progress) in `useState` - it re-renders the tree every frame and dies on mobile. Use Motion's `useMotionValue` / `useTransform` / `useScroll`.
- **Baseline:** `robots.txt`, `sitemap`, OG image, `<title>`/meta per route, `lang` on `<html>`.

### 3. The brief names a real design system

Install the official package. Do not recreate its CSS by hand, and do not import its tokens and then override 90% of them.

| Brief reads as | Package |
|---|---|
| Microsoft / enterprise | `@fluentui/react-components` or `@fluentui/web-components` |
| Google / Material-flavored | `@material/web` + Material 3 tokens |
| IBM-style B2B analytics | `@carbon/react` + `@carbon/styles` |
| Shopify app surfaces | Polaris web components / Polaris React |
| Atlassian / Jira-style | `@atlaskit/*` + `@atlaskit/tokens` |
| GitHub devtool or marketing | `@primer/css` / `@primer/react-brand` |
| UK public sector | `govuk-frontend` |
| US public sector / trust-first | `uswds` |
| Own-the-code modern SaaS | shadcn/ui (`npx shadcn@latest init`) |
| Fast local-business MVP | Bootstrap 5.3 |

**One system per project.** Never Fluent next to Carbon, never shadcn components inside a Material 3 app.

Aesthetic trends are not systems. Glassmorphism, bento, brutalism, editorial, aurora gradients, kinetic type, "Apple Liquid Glass" - none has an official package. Build them with native CSS + Tailwind and say so honestly in a comment. There is no official `liquid-glass.css`; web versions are `backdrop-filter` approximations. Label them as such.

## Layout mechanics

- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. Do not invent new ones.
- Page container: `max-w-7xl mx-auto` or `max-w-[1400px] mx-auto`.
- **Never `h-screen`.** Always `min-h-[100dvh]` - iOS Safari's address bar makes `100vh` jump.
- Grid for 2D, flex for 1D. Never flexbox percentage math (`w-[calc(33%-1rem)]`); use `grid grid-cols-1 md:grid-cols-3 gap-6`.
- Responsive grid without breakpoints: `repeat(auto-fit, minmax(280px, 1fr))`.
- Z-index is a semantic ladder (dropdown → sticky → backdrop → modal → toast → tooltip). Never `z-[9999]`.
- Wrap the page in `overflow-x-hidden` only after fixing the actual overflow, not instead of fixing it.
- Dropdowns inside an `overflow: hidden` / `auto` ancestor get clipped. Use the native popover API, `position: fixed`, or a portal.
