# The verify loop

You do not ship what you have not looked at. Reading your own code and declaring it good is
the single biggest reason AI-built sites fail: the code is plausible and the render is broken.

This loop is mandatory and it runs in the user's own Chrome, through the
`mcp__claude-in-chrome__*` tools. It ends when the page passes, not when you get bored.

## Prerequisites

- Chrome with the Claude extension connected, and site permission granted for `localhost`. If a tool returns a permission error, tell the user which host needs granting and stop - do not retry blindly.
- A dev server running, or a single `index.html` on disk (`file:///...` works).
- If the browser tools are not available at all, say so plainly and fall back to the static gate in SKILL.md. Never claim you verified visually when you did not.

**CRITICAL: call `tabs_context_mcp` with `createIfEmpty: true` once before any other browser
tool.** Nothing else works reliably until you have real tab ids. Create your own tab with
`tabs_create_mcp`; do not reuse a tab the user is working in. Close every tab you opened with
`tabs_close_mcp` when the loop ends.

**Never trigger `alert`, `confirm`, or `prompt`.** A modal dialog freezes the extension and
the loop dies. If you need a value out of the page, use `javascript_tool` and read the
returned expression.

## Setup

```
1. tabs_context_mcp { createIfEmpty: true }        -> tab ids
2. tabs_create_mcp                                 -> your own tab
3. navigate { url: "http://localhost:3000", tabId } -> the page
```

Start the dev server in the background first and wait for it to actually answer. If `navigate`
lands on an error page, read the server output before touching the browser - a blank
screenshot is usually a build error, not a design problem.

## The loop

Run at most **5 passes**. Each pass: measure, look, score, fix. Never fix something you have
not first observed.

Keep a defect ledger as you go - a scratch file or a running list in your head, but written
down either way, because pass 4 must not reintroduce what pass 2 fixed:

```
PASS 2
  P0  hero h1 wraps to 5 lines at 390px          -> reduced clamp max to 4.5rem
  P1  muted body text 3.9:1 on tinted surface    -> ink ramp bumped two steps
  P2  all six sections use identical py-32       -> varied to 32/40/28/48
```

Severity decides whether you keep looping:

- **P0** - broken. Console error, overflow, unreadable text, invisible CTA, a section that renders blank, the signature moment not firing. **Any P0 means another pass. No exceptions.**
- **P1** - fails the gate in SKILL.md. Contrast under 4.5, hero over 3 lines, eyebrow count over budget, an em-dash. Another pass.
- **P2** - craft. Uniform spacing, timing that feels wrong, a weak hover. Fix if a pass remains.

Exit when a pass finds **zero P0 and zero P1**, and the rubric below clears its thresholds.
If you burn all 5 passes and P0s remain, stop and report exactly what is still broken and
what you tried. A surfaced failure beats a hidden one.

### Pass step 1 - measure, do not squint

One `javascript_tool` call returns most of the gate as numbers. `action` must be
`"javascript_exec"`; the tool has REPL semantics so the final expression is the result.

```js
(() => {
  const out = {}, vw = innerWidth, de = document.documentElement;
  out.viewport = [vw, innerHeight];

  // Fonts: catches a family that does not exist and silently fell back to the system stack.
  const fam = el => getComputedStyle(el).fontFamily;
  const h1el = document.querySelector('h1');
  out.fonts = {
    body: fam(document.body),
    h1: h1el ? fam(h1el) : null,
    unresolved: [...document.fonts].filter(f => f.status !== 'loaded').map(f => f.family),
  };

  // Horizontal overflow, with the elements responsible.
  out.overflowX = de.scrollWidth - de.clientWidth;
  out.overflowCulprits = [...document.querySelectorAll('*')]
    .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1); })
    .slice(0, 10)
    .map(el => `${el.tagName.toLowerCase()}.${String(el.className || '').split(/\s+/)[0]} right=${Math.round(el.getBoundingClientRect().right)}`);

  // Hero line count, the most-violated rule.
  if (h1el) {
    const cs = getComputedStyle(h1el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
    out.h1 = { lines: Math.round(h1el.getBoundingClientRect().height / lh), size: cs.fontSize, tracking: cs.letterSpacing };
  }

  out.emDashes = (document.body.innerText.match(/—/g) || []).length;

  // Eyebrow budget: uppercase + tracked micro-labels.
  out.eyebrows = [...document.querySelectorAll('*')].filter(el => {
    const cs = getComputedStyle(el), t = el.innerText;
    return !el.children.length && cs.textTransform === 'uppercase'
      && parseFloat(cs.letterSpacing) > 0.5 && t && t.trim().length > 0 && t.trim().length < 40;
  }).length;
  out.sections = document.querySelectorAll('section').length;

  // Contrast over everything actually visible.
  const f = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  const rgb = s => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  const alpha = s => { const p = s.match(/[\d.]+/g) || []; return p.length > 3 ? +p[3] : 1; };
  const bgOf = el => { let n = el; while (n) { const b = getComputedStyle(n).backgroundColor; if (b && alpha(b) > 0.5) return rgb(b); n = n.parentElement; } return [255, 255, 255]; };
  const fails = [];
  for (const el of document.querySelectorAll('p,span,a,li,h1,h2,h3,h4,h5,h6,button,label,small,td,th')) {
    if (el.children.length) continue;
    const t = el.innerText && el.innerText.trim(); if (!t) continue;
    const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || +cs.opacity < 0.5) continue;
    const fg = rgb(cs.color); if (fg.length < 3) continue;
    const L1 = lum(fg), L2 = lum(bgOf(el));
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
    const need = (px >= 24 || (bold && px >= 18.66)) ? 3 : 4.5;
    if (ratio < need) fails.push(`${ratio.toFixed(2)} < ${need} | ${px}px | "${t.slice(0, 40)}"`);
  }
  out.contrastFailCount = fails.length;
  out.contrastFails = fails.slice(0, 15);

  // Reduced motion actually implemented, not just claimed.
  let rm = 0, blocked = 0;
  for (const s of document.styleSheets) {
    try { for (const r of s.cssRules) if (r.conditionText?.includes('prefers-reduced-motion')) rm++; }
    catch { blocked++; }
  }
  out.reducedMotionBlocks = rm;
  out.crossOriginSheets = blocked;
  out.activeAnimations = document.getAnimations().length;

  const lcp = performance.getEntriesByType('largest-contentful-paint').pop();
  out.lcpMs = lcp ? Math.round(lcp.startTime) : null;
  out.cls = +performance.getEntriesByType('layout-shift')
    .filter(e => !e.hadRecentInput).reduce((a, e) => a + e.value, 0).toFixed(4);
  return out;
})()
```

Reading the result:

- `fonts.body` or `fonts.h1` showing a system stack instead of your chosen family means **the font never loaded**. This is a P0 and it is invisible in a screenshot if you do not know the intended face. `unresolved` non-empty is the same problem.
- `overflowX > 0` is a P0. `overflowCulprits` names the elements, so fix those rather than reaching for `overflow-x: hidden`.
- `h1.lines > 3` is a P1.
- `emDashes > 0`, `eyebrows > Math.ceil(sections / 3)`, `contrastFailCount > 0` are all P1.
- `reducedMotionBlocks === 0` while `activeAnimations > 0` is a P1. If `crossOriginSheets > 0` the count is a floor, not a total.
- `lcpMs === null` and `cls === 0` together usually mean the entries were not buffered, not that the page is perfect. Reload and measure again before trusting them.

Console errors are separate. The tool requires a `pattern`:

```
read_console_messages { tabId, pattern: "error|Error|failed|Failed|warn|Uncaught", onlyErrors: true, clear: true }
```

Any uncaught error is a P0. `clear: true` so the next pass does not re-read the same ones.

### Pass step 2 - look at it

Three viewports, every pass. `resize_window` then `computer { action: "screenshot" }`.

| Width | Height | Looking for |
|---|---|---|
| 390 | 844 | The one everybody skips. Overflow, stacked layout, tap targets, hero fitting |
| 768 | 1024 | The awkward middle where grids break and headings overflow |
| 1440 | 900 | The composition you actually designed |

Then scroll the full page at 1440 and screenshot each viewport-height step
(`computer { action: "scroll", coordinate: [720, 450], scroll_direction: "down", scroll_amount: 10 }`).
A page is a sequence, not a hero. Judge the rhythm between sections, not each section alone.

Use `computer { action: "zoom", region: [x0, y0, x1, y1] }` on anything small: button labels,
form placeholders, icon alignment, the inner radius of a nested card.

Use `computer { action: "hover", coordinate: [x, y] }` on every interactive element and
screenshot the result. A hover state you never triggered is a hover state you never built.

**What to actually look at.** A screenshot is useless without a list:

- Does one thing hold the eye, or does everything shout equally?
- Is the hero readable in one glance, or is it a wall of text?
- Do the section rhythms vary, or is every gap identical?
- Are optical alignments right - text baselines, icon centres, concentric radii?
- Do images look treated and intentional, or dropped in from a stock library?
- Is there dead space that reads as a mistake rather than as breathing room?
- Would you screenshot this and send it to a friend? If not, name what is missing.

### Pass step 3 - score the wow

Static correctness is not the goal, it is the floor. Score each dimension 0-5 and write the
number down. This is where "until it is WOW" becomes a condition instead of a feeling.

| Dimension | 0 | 5 | Exit needs |
|---|---|---|---|
| **Signature** | nothing memorable | one moment you would describe to someone | **4** |
| **Typography** | default faces, flat scale | the type carries the personality | **4** |
| **Composition** | uniform stack of cards | deliberate rhythm, real hierarchy | **4** |
| **Motion** | static, or effects everywhere | motion serves the content, timing feels physical | **3** |
| **Colour & material** | grey on grey, flat | committed strategy, real depth | **4** |
| **Craft detail** | rounded rectangles | hovers, easing, optical alignment | **4** |
| **Not-slop** | you could guess it was AI | nobody would ask | **5** |

**Not-slop must be a 5.** Everything else is negotiable across passes; that one is not.

Score honestly. A pass that scores everything 4 on the first try is a pass that did not look
properly - go back to step 2 and name three specific things you would change.

### Pass step 4 - fix, then re-measure

Fix P0s first, then P1s, then P2s if a pass remains. One coherent edit per defect. Then start
the next pass from step 1. **Never mark a defect fixed without re-measuring it** - the fix
that breaks the fix is how a loop turns into thrashing.

## Degradation checks - once, before the final pass

These catch the failures that only appear in conditions you are not currently in.

- **No JS.** Would the page render? Check that content is in the DOM and visible by default rather than gated behind a reveal class. `javascript_tool`: count elements with `opacity: 0` or `visibility: hidden` that hold real text. Anything above zero needs justifying.
- **Reduced motion.** The extension cannot emulate the media query, so verify structurally: the `reducedMotionBlocks` count above, plus read the animation code. Say in your report that this was verified by inspection, not by emulation. Do not claim more than you did.
- **No WebGL.** If there is a canvas, confirm a fallback path exists in the code.
- **Slow load.** `lcpMs` over 2500 is a P1 no matter how good it looks.

## Finishing

1. Save the final screenshots to share: `computer { action: "screenshot", save_to_disk: true }` at each of the three widths.
2. For a motion-heavy page, record the scroll: `gif_creator { action: "start_recording", tabId }`, screenshot, scroll through, screenshot, `stop_recording`, then `export` with `download: true`. Motion does not survive a still image, and this is how the user sees whether the signature moment actually lands.
3. Close every tab you opened with `tabs_close_mcp`.
4. Report: passes used, the defect ledger with what was fixed, the final rubric scores, the signature moment named in one sentence, and anything still outstanding.

Never report a score you did not measure, or a viewport you did not open.
