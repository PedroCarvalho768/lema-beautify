# Redesign

Misclassifying a redesign as a greenfield build is the single biggest source of bad redesign output. Read this before touching code.

## Pick the sub-mode

- **Preserve** - modernise without breaking the brand. Audit, extract the existing tokens, evolve.
- **Overhaul** - new visual language over existing content. Treat visuals as greenfield; content and IA are still preserved.
- **Rebrand** - the brand itself is changing. Now it is genuinely greenfield.

If it is ambiguous, ask once: *"Preserve the existing brand, or start visually from scratch?"*

## Audit before proposing anything

Write this down. It is short, and skipping it is how you delete something that was working.

| Axis | Capture |
|---|---|
| Brand tokens | Primary and accent colors, type stack, logo treatment, radii, shadow language |
| Information architecture | Page tree, primary nav labels, conversion paths |
| Content blocks | What exists, what is doing work, what is filler |
| Keep | Signature interactions, recognisable hero, copy voice, accessibility wins already there |
| Retire | Slop tells, broken layouts, dead links, generic stock imagery, performance traps |
| Current dials | Infer the existing `DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`. **That is your starting point, not the baseline.** |
| SEO baseline | Ranking pages, meta titles, structured data, OG cards, canonical URLs |

**SEO migration is the number one redesign risk.** A prettier site that lost its rankings is a failed project.

## Never change silently

Requires explicit approval, every time:

- URL structure and route slugs
- Anchor IDs (they are in other people's links)
- Primary nav labels
- Form field names and order - breaks analytics and browser autofill
- Logo and wordmark
- Legal, consent, and cookie copy
- Section IDs, button labels, and event names that analytics depends on

Also: do not rewrite the copy voice unless a rewrite was asked for. Visual modernisation is not a content rewrite.

## Modernisation levers, in priority order

Apply in order. **Stop when the brief is satisfied** - going further is unrequested risk.

1. **Typography.** Biggest visual lift per unit of risk. Almost always start here.
2. **Spacing and rhythm.** Increase section padding, fix the vertical rhythm, vary it deliberately.
3. **Color recalibration.** Unify the neutrals, desaturate what is shouting, keep the brand accent. A brand that is already purple stays purple.
4. **Motion layer.** Add dial-appropriate micro-interactions to components that already exist.
5. **Hero and key-section recomposition.** Restructure top-of-funnel.
6. **Full block replacement.** Only when a block is genuinely unsalvageable.

## Evolution or full redesign

- IA, content, and SEO are sound → **targeted evolution**, levers 1-4. Roughly 70% of the value at 40% of the risk. This is the right answer more often than it feels like it is.
- Visual debt is structural - broken IA, no design system, broken mobile → **full redesign** with strict content preservation.
- The brand itself is changing → **greenfield**. Go back to the main skill's Step 1.

## Before you hand it back

Everything in the main skill's Step 4 gate, plus:

- [ ] Every URL that existed still resolves, or 301s somewhere sensible
- [ ] Meta titles, descriptions, OG cards, and structured data carried over or deliberately improved
- [ ] No accessibility regression - focus states, alt text, keyboard nav, contrast all at least as good as before
- [ ] Analytics still fires: event names, form field names, section IDs intact
- [ ] A side-by-side of before and after, so the user can see what changed and say no to any of it
