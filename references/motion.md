# Motion

Install commands and APIs below were verified 2026-08-26 against each library's own docs. If a build fails, re-verify with Context7 or the library's site. Do not fall back to memory - these three libraries all had breaking API or licensing changes recently, and a model's default recall of them is wrong.

## Picking the library

| Need | Library |
|---|---|
| UI state changes, enter/exit, layout, gestures, bento hover | **Motion** (`motion/react`) |
| Full-page scrolltelling: pinning, stacking, horizontal pan, scrub | **GSAP + ScrollTrigger** |
| Canvas / WebGL backgrounds, 3D scenes | **Three.js** |
| Standalone SVG/DOM sequences, draggable physics, no React | **anime.js** |
| A fade-up on scroll into view | **Nothing.** `IntersectionObserver`, or a CSS scroll-driven animation |

**Never mix GSAP or Three.js with Motion in the same component tree.** They compete for the same frames. Isolate each in its own client leaf.

## GSAP

**GSAP and every plugin are free for commercial use.** SplitText, MorphSVG, ScrollSmoother, DrawSVG, Inertia - all of it. There is no membership, license key, auth token, or private registry any more. Any instruction telling you to configure `npm.greensock.com` or a Club token is outdated; ignore it.

```bash
npm install gsap
npm install @gsap/react   # React only
```

Register plugins at module level, once:

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
```

### React

Use `useGSAP` from `@gsap/react`, never a raw `useEffect`. It returns a cleanup that kills tweens, removes ScrollTriggers, reverts DOM changes, and restores inline styles.

```jsx
'use client';
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PinnedSection() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.to(".panel", {
      xPercent: -100,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: () => "+=" + container.current.offsetWidth,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: container });

  return <div ref={container}>{/* .panel children */}</div>;
}
```

- `{ scope: container }` scopes selector strings to that subtree. Use it, or your selectors will match the whole document.
- Anything that creates GSAP objects in an event handler must be wrapped in `contextSafe()` from the hook's return value, or it escapes cleanup.
- `dependencies: [...]` for re-running; `revertOnUpdate: true` when the animation must be rebuilt rather than persisted.
- `pin: true` requires `start: "top top"` for a section that should stick at the viewport top.
- Use `scrub: 1` (a small number) rather than `scrub: true` for a smoothed, less twitchy tie to scroll position.

## Motion

```bash
npm install motion
```

Requires React ≥18.2.

```js
import { motion, useScroll, useTransform, useMotionValue } from "motion/react";
```

- The import path is `motion/react`. The `framer-motion` package still resolves as a legacy alias - do not use it in new code.
- Continuous values (scroll progress, pointer position, magnetic hover) go through `useMotionValue` / `useTransform` / `useScroll`. Putting them in `useState` re-renders on every frame.
- Every component importing from `motion/react` needs `'use client'`.
- **Motion+ is paid.** `motion-plus/react` (Typewriter, Cursor, Ticker, and other premium components) ships from a private registry at `api.motion.dev` behind an access token in `.npmrc`. Do not write an import from `motion-plus/react` unless the user has confirmed a Motion+ licence, and never commit the token.

## anime.js

v4 is ESM with named exports. The v3 default-export `anime({...})` form is gone.

```bash
npm install animejs
```

```js
import { animate, utils, createDraggable, spring } from 'animejs';

animate('.logo', {
  scale: [
    { to: 1.25, ease: 'inOut(3)', duration: 200 },
    { to: 1, ease: spring({ bounce: 0.7 }) },
  ],
  loop: true,
  loopDelay: 250,
});

createDraggable('.logo', { container: [0, 0, 0, 0], releaseEase: spring({ bounce: 0.7 }) });
```

`utils.$('.selector')` is the built-in element query. CommonJS works via `const { animate } = require('animejs')`.

## Rules that apply to all of them

- **Reduced motion is not optional.** Every animation above `MOTION_INTENSITY 3` needs a `@media (prefers-reduced-motion: reduce)` path - typically a crossfade or an instant state change.
- **Ease out, exponentially.** ease-out-quart / quint / expo, or a custom curve like `cubic-bezier(0.32, 0.72, 0, 1)`. No bounce, no elastic, never `linear` or `ease-in-out` as the default.
- **Animate `transform` and `opacity`.** Blur, `backdrop-filter`, `clip-path`, `mask`, and shadow are legitimate materials when they materially improve the effect and stay smooth - but never `width`, `height`, `top`, `left`.
- **`backdrop-filter` only on fixed or sticky elements.** On a scrolling container it repaints every frame and destroys mobile framerate.
- **Noise and grain overlays** go on a `position: fixed; inset: 0; pointer-events: none` layer. Never attached to scrolling content.
- **Never `window.addEventListener('scroll')`.**
- **Content is visible by default.** A reveal enhances an already-rendered element. If visibility depends on a class that a transition applies, the section ships blank in a headless render or a background tab.
- **Staggering a list is fine. One identical entrance on every section is the tell.** Each reveal should suit what it reveals. This is not a licence to ship a static page.
- `will-change: transform` only on elements currently animating, then remove it.
