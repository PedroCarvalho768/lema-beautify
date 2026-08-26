# Working from references

## The access reality

Checked 2026-08-26. Most inspiration galleries block non-browser clients or sit behind a login. Plan around it instead of failing at it.

| Source | Reachable by a plain fetch? | What it actually is |
|---|---|---|
| **mobbin.com** | No - 403 | Screenshot library of real app and web UI flows. Subscription. |
| **saaspo.com** | No - 403 | SaaS website design gallery. |
| **recent.design** | No - 403 | Curated recent web design. |
| **getlayers.ai** | Partly | A library of **prompts and templates**, not a gallery. Freemium; full prompts and source behind sign-in. |
| **motionsites.ai** | Yes, gallery only | Gallery of motion-heavy site examples with **prompts** behind signup. Does not document which animation libraries any example uses - the tags are categories, not tech. |

So:

- **Do not claim to have looked at a reference you could not load.** Say the fetch failed and ask for what you need.
- **The user's own browser can reach all of them.** When the user wants a specific reference mined, drive Chrome (the `claude-in-chrome` tools) in their logged-in session: navigate, screenshot, `read_page`. Ask before doing it - it uses their account.
- **Screenshots are the highest-bandwidth input.** One screenshot beats three paragraphs of description. Ask for them.
- **getlayers and motionsites sell prompts.** If the user has a prompt from one, treat it as the brief - then still run this skill's Step 1 and Step 4 over the result. A purchased prompt is not a substitute for the gate.

## Extracting a system from a reference

The goal is never to copy a page. It is to extract the *system* and re-apply it to this subject. Work in this order:

1. **Type.** Identify the display and body faces (or the closest available substitutes). Measure the scale: h1 → body ratio, and the step ratio between levels. Note the display letter-spacing and weight. This is the single biggest carrier of the reference's feel.
2. **Palette.** Pull actual values, then name the roles: background, surface, ink, muted, accent. Note which one dominates by surface area - that is the reference's colour strategy, and it matters more than the hues.
3. **Spatial rhythm.** Section padding, container max-width, grid gutters, and how much the spacing *varies* between sections. Uniform spacing reads cheap; the good references vary it deliberately.
4. **Materiality.** Radii, border treatment, shadow language, whether surfaces are flat, layered, or nested.
5. **Motion vocabulary.** Name the moves: pinned section, horizontal pan, scrub-reveal, card stack, magnetic hover, page transition. Then note the *timing feel* - fast and snappy, or slow and heavy.
6. **The signature.** The one thing that page will be remembered by. Identify it, then build a *different* one for this subject. Copying the signature is how you make an obvious clone.

Write those six down before coding. If you cannot state them, you have not looked closely enough.

## `modelled-on` mode

When the ask is "build something like <site>":

- Extract the system as above, then apply it to **this** subject's content, vocabulary, and imagery. The reference supplies the grammar; the subject supplies everything that is said.
- The category-reflex test still applies. Cloning a reference is not a design decision, it is a copy of someone else's.
- **Do not reproduce another site's logo, wordmark, photography, illustrations, or copy.** Substitute generated or licensed assets. Say so once, then move on.

## Placeholder assets

- Images: generate them if a tool is available. Otherwise `https://picsum.photos/seed/<keyword>/1920/1080` with a seed keyword matching the subject, then treat it - `grayscale`, `contrast-125`, a blend mode, a wash - so it does not read as stock.
- Logos for a "used by" wall: real SVG marks from Simple Icons or devicon, or generated marks. Never plain text wordmarks.
- Never a div-based fake screenshot. Never a hand-drawn SVG scene. If you cannot produce a real asset, leave an explicit, labelled placeholder slot instead.
