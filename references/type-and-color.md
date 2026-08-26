# Type and color

The two decisions that carry most of a page's feel. Everything here was checked against the
source on 2026-08-26: Google families against `fonts.google.com/metadata/fonts` (1946
families), Fontshare against `api.fontshare.com/v2/fonts`. Every family named below is
confirmed available. Do not substitute a font from memory - a family that turns out not to
exist silently falls back to the system stack and the whole design collapses.

## Typography

### Rules

- **Never Inter, Roboto, Arial, Open Sans, or Helvetica as the display face.** They are the default, and default is the failure mode.
- **At most 3 families**: display + body + optional mono. More reads as indecision. One well-tuned family across several weights usually beats three competing ones.
- **Pair on a contrast axis** - serif against sans, geometric against humanist, condensed against wide. Two near-identical grotesques look like a mistake, not a system.
- **Step ratio ≥1.25** between type scale levels. A flat scale has no hierarchy.
- **Hero `clamp()` max ≤6rem (~96px).** Above that the page is shouting.
- **Display letter-spacing ≥ -0.04em.** That is the floor, not the target; -0.02 to -0.03em is plenty for a tight grotesque. Tighter and the letters touch.
- **Body line length 65-75ch.** `text-wrap: balance` on h1-h3, `text-wrap: pretty` on prose.
- No all-caps body copy. Uppercase is for labels of four words or fewer.

### Google Fonts, by role

All verified present. Load with `next/font/google` - never a `<link>` in production.

**Display sans** - Bricolage Grotesque (width + optical size axes), Archivo, Anton, Bebas Neue, Space Grotesk, Familjen Grotesk, Funnel Display, Host Grotesk, Instrument Sans, Syne, Unbounded, Wix Madefor Display, Radio Canada Big

**Display serif** - Bodoni Moda, Young Serif, Gloock, Libre Caslon Display, DM Serif Display, Newsreader, Petrona, Vollkorn

**Body sans** - Geist, Public Sans, Hanken Grotesk, Schibsted Grotesk, Onest, Figtree, Manrope, Work Sans, Chivo, Sora, Plus Jakarta Sans, Funnel Sans

**Body serif / long-form** - Literata, Spectral, Crimson Pro, Lora, Newsreader

**Mono** - Geist Mono, JetBrains Mono, IBM Plex Mono, Martian Mono, Fragment Mono, Sometype Mono, DM Mono, Space Mono

**Variable-width note:** "Archivo Expanded" is not a separate Google family. Archivo is variable with a width axis - reach it through `font-variation-settings: 'wdth' 125` or `font-stretch`, not a second import.

**Flagged as saturated:** Fraunces, Instrument Serif, and Playfair Display are all available and all are the current AI-default serif picks. Using one needs a brand reason you can state, and not on two consecutive projects.

### Fontshare

Higher-character faces than most of the Google catalogue. All verified present: Satoshi,
Clash Display, Clash Grotesk, General Sans, Switzer, Cabinet Grotesk, Supreme, Author,
Bespoke Serif, Sentient, Gambetta, Boska, Zodiak, Erode, Melodrama, Panchang, Tanker.

Loading, in the single-file HTML lane:

```html
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=clash-display@600&display=swap" rel="stylesheet">
```

The API returns real `@font-face` rules against `cdn.fontshare.com` and it works. But in a
production build the same rule from `stack.md` applies: no render-blocking third-party font
link. Download the woff2 files and use `next/font/local`.

Fontshare distributes these free. Check the licence on the family's own Fontshare page before
shipping commercially - do not assume it from another family.

### Pairings that work

Starting points, not a menu to pick blindly from. Each is a contrast axis, not two similar faces.

| Direction | Display | Body | Utility |
|---|---|---|---|
| Editorial authority | Bodoni Moda | Public Sans | - |
| Technical product | Geist (600-700) | Geist (400) | Geist Mono |
| Agency, loud | Anton or Bebas Neue | Hanken Grotesk | - |
| Warm editorial, no cream | Young Serif | Schibsted Grotesk | - |
| Swiss precision | Archivo (wdth axis) | Archivo | Fragment Mono |
| Expressive, characterful | Bricolage Grotesque | Figtree | - |
| Fashion / luxury | Gloock or Boska | Switzer | - |
| Premium consumer | Clash Display | General Sans | - |
| Long-form reading | Literata | Instrument Sans | - |
| Brutalist / terminal | Martian Mono | Chivo | Martian Mono |

## Color

### Strategy before colors

Pick a position on the commitment axis first. Skipping this is how pages end up with a
neutral background and one arbitrary accent by default.

| Strategy | Shape | Fits |
|---|---|---|
| **Restrained** | Tinted neutrals + one accent at ≤10% of surface | Product-adjacent, brand minimalism |
| **Committed** | One saturated color on 30-60% of the surface | Identity-driven marketing pages |
| **Full palette** | 3-4 named roles, each used deliberately | Campaigns, editorial, data-rich |
| **Drenched** | The surface *is* the color | Heroes, campaign pages, single-idea sites |

Light versus dark is never a default. Write one sentence of physical scene first: who is
looking at this, where, in what ambient light, in what mood. If the sentence does not force
the answer, add detail until it does.

### Building the ramp

Author in OKLCH. Its lightness is perceptually even, so a fixed-step ramp actually looks even.

1. **Anchor the hue in the subject**, not in the category. If the hue is guessable from the industry, it is the reflex.
2. **Fix the lightness steps** and hold them across every hue: e.g. L 0.98 / 0.94 / 0.86 / 0.72 / 0.58 / 0.44 / 0.30 / 0.18.
3. **Name roles, not shades**: `--bg`, `--surface`, `--ink`, `--muted`, `--accent`, `--accent-ink`. Roles survive a rebrand; `--gray-400` does not.
4. **Tint the neutrals toward the brand hue** by 0.005-0.015 chroma. Do not default-tint warm; that is the cross-project monoculture move.
5. **Verify every text pairing with the script.** Not by eye.

### The banned band

The warm-neutral body background - OKLCH L 0.84-0.97, C < 0.06, hue 40-100 - is the
saturated AI default. It reads as cream, sand, paper, or parchment no matter what you call it,
and these token names give it away on sight: `--paper`, `--cream`, `--sand`, `--bone`,
`--linen`, `--parchment`, `--flour`, `--wheat`, `--ivory`, `--biscuit`.

A brief asking for "warm", "editorial restraint", or "magazine warmth" is *not* asking for
this. Carry the warmth in the accent, the type, and the imagery. For the body, pick one of:

- a saturated brand color (terracotta, oxblood, deep ochre, near-black),
- a true off-white at chroma 0, or tinted toward the brand's own hue rather than toward warmth by reflex,
- a darker mid-tone tinted neutral that is clearly this brand's.

### Contrast, measured

Light-gray body text on a tinted near-white is the single most common failure in AI design
work, and it is the one gate item people wave through. Run it:

```bash
node scripts/contrast.mjs "#6b7280" "#f9fafb"          # one pair
node scripts/contrast.mjs "#a3a3a3" "#111" --large     # >=24px, or bold >=18.66px
node scripts/contrast.mjs --pairs pairs.txt            # "fg bg label" per line
```

Thresholds: body text ≥4.5:1, large text ≥3:1. **Placeholder text and CTA labels count as
body text** - that is where this usually breaks. The script takes hex and `rgb()`; resolve
OKLCH tokens to hex first (devtools computed value) rather than converting by hand.

Write your real token pairs into a `pairs.txt` and run it once per project. It takes ten
seconds and it removes the most-argued item on the gate from the realm of opinion.

### Two more

- Gray text on a colored background looks washed out. Use a darker shade of the background's own hue, or a transparency of the text color.
- One accent, used identically everywhere. A second accent that appears in one section is a bug, not a flourish.
