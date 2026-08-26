# The wow

The gate in the main skill stops the page being bad. This file is how it becomes breathtaking. Both halves are required: an ambitious page that fails the gate is slop with effects on it, and a page that passes the gate with nothing memorable in it is competent wallpaper.

Package versions and APIs verified 2026-08-26.

## The rule of one

**One signature moment, executed to an absurd standard.** Not five effects at 70%.

Every site people remember has exactly one thing they describe when they tell someone else about it. Decide what that sentence is before you write code: *"the one where the type breaks apart as you scroll"*, *"the one with the liquid distortion on hover"*, *"the one where the product rotates while the spec list writes itself"*.

Then everything else on the page gets quieter to make room for it. Chanel's rule: before leaving the house, remove one accessory. A page with three signature moments has none.

## Choosing the moment

Pick from the subject's own world, not from a list of effects. The moment should only make sense for *this* subject - that is what makes it non-generic. A typography studio earns kinetic type. A hardware company earns a scrubbed product render. A data company earns a live visualisation. Reaching for a shader because shaders are impressive is how you get an expensive-looking page that says nothing.

### Moments that reliably land

| Moment | What it needs | Earned by |
|---|---|---|
| **Pinned scroll narrative** - section sticks, content advances through states | GSAP ScrollTrigger `pin: true` | A story with real steps: a process, a transformation, a before/after |
| **Horizontal pan** - vertical scroll drives sideways travel | ScrollTrigger + `xPercent` | A sequence, a timeline, a gallery with an order |
| **Scrubbed image sequence** - product rotates or assembles under scroll | Canvas + preloaded frames, ScrollTrigger scrub | A physical object worth rotating |
| **Kinetic type** - words split, stagger, mask, or distort | GSAP SplitText (free now), CSS masks | Type-forward brands, editorial, agencies |
| **Text scrub reveal** - words go from 0.15 to full opacity in sequence as you read | ScrollTrigger scrub over split words | A manifesto or thesis paragraph that deserves to be read slowly |
| **Card stack** - cards overlap and stack from the bottom under scroll | ScrollTrigger, sticky positioning | 3-5 items with genuine hierarchy |
| **Magnetic / physics hover** - elements pull toward the cursor with real easing | Motion `useMotionValue` + `useTransform`, spring easing | Interactive-feeling brands. One element, not everything |
| **Custom cursor** - context-aware, morphs over targets | Motion values, never `useState` | Only when it tells you something. A decorative blob is noise |
| **WebGL / shader hero** - distortion, particles, fluid, displacement on hover | Three.js + R3F, isolated leaf, WebGL fallback required | Genuinely ambitious brands with the load budget for it |
| **Load sequence** - the page assembles itself once, deliberately | Timeline, 800-1500ms total ceiling | A brand where the first second is part of the pitch |
| **Page transitions** - routes morph instead of cutting | View Transition API | Multi-page sites where continuity is the point |

## The ambition toolkit

### Smooth scroll

```bash
npm install lenis          # 1.3.26, MIT
```

Lenis is the default for scroll-heavy sites. Alternative: GSAP's ScrollSmoother, which is now free like every other GSAP plugin (`import { ScrollSmoother } from "gsap/ScrollSmoother"`). Do not run both.

Smooth scroll is a commitment, not a decoration: it changes how every scroll-linked animation feels, so add it early or not at all. It must respect `prefers-reduced-motion` by not initialising at all.

### CSS scroll-driven animations

For simple scroll reveals, native CSS beats a library and costs zero JS:

```css
.reveal {
  animation: rise linear;
  animation-timeline: view();   /* declare AFTER the animation shorthand */
}
@keyframes rise {
  from { opacity: 0; transform: translateY(2rem); }
  to   { opacity: 1; transform: translateY(0); }
}
```

`animation-timeline: scroll()` ties to a scroll container (`scroll(y root)`, `scroll(block nearest)`); `view()` ties to the element's own visibility (`view(block 20% 80%)` to inset the range).

**Not Baseline.** MDN states it does not work in some of the most widely used browsers. So: progressive enhancement only. Content must be fully visible without it, and gate it behind `@supports (animation-timeline: view())` when the animation does anything structural.

### View Transitions

Same-document:

```js
document.startViewTransition(() => { /* mutate the DOM */ });
```

Cross-document - opt in from **both** documents:

```css
@view-transition { navigation: auto; }
```

Name the elements that should morph rather than crossfade:

```css
.hero-image { view-transition-name: hero; }
```

`view-transition-class` styles a group of named elements; `view-transition-scope` limits element discovery to a subtree. The `pageswap` and `pagereveal` events expose the `ViewTransition` object for cross-document work. Support is uneven - a browser without it simply navigates normally, which is a fine fallback, so this is safe to add.

### 3D and WebGL

```bash
npm install three @react-three/fiber @react-three/drei
```

Verified current: `three` 0.185.1, `@react-three/fiber` 9.7.0, `@react-three/drei` 10.7.8.

Non-negotiables:

- Isolated `'use client'` leaf. Never in the same tree as Motion - they fight for frames.
- Lazy-load it. A WebGL hero that blocks LCP has cost you more than it bought.
- A real fallback for no-WebGL, reduced-motion, and mobile-under-budget: a static image or video that carries the same idea.
- Cap the pixel ratio (`min(devicePixelRatio, 2)`), pause the loop when the canvas is off-screen, dispose geometries and materials on unmount.

## Craft details that separate expensive from competent

These are cheap and they are what people actually feel:

- **Ease with intent.** `cubic-bezier(0.32, 0.72, 0, 1)` and its family. Heavy out-easing reads as mass. Linear reads as a computer.
- **Vary the timing.** Everything at 300ms is a template. Small feedback 120-200ms, entrances 600-900ms, page-scale moves 1000ms+.
- **Stagger with a real rhythm.** 40-80ms between siblings. Uniform 100ms on everything is the tell.
- **Hover is a state, not a color change.** Something moves, scales, reveals, or shifts weight. Give it a `duration-700 ease-out` inside an `overflow-hidden` parent and let the image grow past its frame.
- **Press feedback.** `active:scale-[0.98]`. It is one class and it makes the whole page feel physical.
- **Nested containers.** An outer shell with a hairline border and small padding, holding an inner surface with its own background and an inset highlight. Compute the inner radius as `calc(outer - padding)` so the curves are concentric. This is what makes a card look machined rather than drawn.
- **Type detail.** `text-wrap: balance` on h1-h3, `text-wrap: pretty` on prose, optical sizing on variable fonts, tabular figures for numbers that change.
- **Vary section spacing.** `py-32` on one section and `py-48` on the next creates rhythm. Identical padding everywhere is what a template does.
- **Real depth over drop shadows.** Layered surfaces, an inset highlight on the top edge, a diffuse ambient shadow well below the element. Not `shadow-md`.
- **Treat every image.** A blend mode, a duotone, a grain layer, a contrast push, a mask. Untreated stock photography is the fastest way to look cheap.
- **Grain, correctly.** A `position: fixed; inset: 0; pointer-events: none` layer at ~3% opacity. Never on scrolling content.

## Ambition has a floor it cannot break

Breathtaking does not license breaking these. A stunning page that fails here is a broken page:

- LCP under 2.5s, INP under 200ms, CLS under 0.1. Measure, do not hope.
- Content visible without JS and without the reveal firing.
- `prefers-reduced-motion` honoured by every single effect - which means designing the reduced version, not deleting the animation and shipping a blank section.
- Keyboard reachable, focus visible, contrast passing.
- Works at 390px wide. Most award-site clones are desktop-only, and that is a failure, not a trade-off.
- Effects degrade rather than break: no WebGL, no `backdrop-filter`, no scroll-driven timelines - the page still reads.

## Self-critique loop

Do not ship the first version. After building:

1. Screenshot it. Look at it as an image, not as code. A picture is worth a thousand tokens.
2. Ask: what is the one thing someone would describe to a friend? If you cannot answer in one sentence, there is no signature yet - go build one.
3. Ask: what would a designer cut? Cut it.
4. Then run the main skill's Step 4 gate. Every box.
