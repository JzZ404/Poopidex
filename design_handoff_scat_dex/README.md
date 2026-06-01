# Handoff: Scat·Dex — Wildlife Scat Identification Web App

## Overview

Scat·Dex is a desktop-web app that lets users photograph wild animal scat on the
trail, runs an ML model to identify the species, and rewards them with a
collectible field-guide-style card. Users build a personal collection (a "Dex"),
hunt rarities, and flagged sightings auto-route to wildlife conservation partners.

Tagline: **"Gotta log 'em all."**

**Pages in this handoff**
1. Home / Landing
2. Identify — Upload state
3. Identify — Analyzing (loading) state
4. Identify — Card Reveal state
5. My Collection (grid + filters)
6. Conservation (alerts + map + science partnership)
7. Style Guide (design tokens + card anatomy)

## About the Design Files

The HTML/JSX files in this bundle are **design references**, not production code
to ship as-is. They were built as a Babel-transpiled React-in-the-browser
prototype on a Figma-style canvas wrapper purely so the screens could be
reviewed side-by-side. Your job is to **recreate these designs in the target
codebase's environment** (React + your component library, Vue, SwiftUI, etc.)
using its established conventions.

If there is no existing codebase yet, pick the framework that best fits the
team. The design is desktop-first; mobile breakpoints are not specified.

## Fidelity

**High-fidelity (hi-fi).** Final palette, typography, spacing, card anatomy,
and interaction states are all decided. Recreate pixel-faithfully.

## Visual Direction — "Illustrated Field Guide × Trading Card Game"

The aesthetic blends a sophisticated naturalist field-guide feel (warm cream
paper, literary serif headings, soft watercolor washes) with the structure of a
trading card game (rarity tiers, stat blocks, collectible serials, holographic
Legendary cards).

The painterly animal illustrations the user provided drive everything: the
card design is built to make the illustration the focal point, not to compete
with it.

## Screens / Views

---

### 1. Home (Landing) · `screen-home.jsx`

**Purpose**: Introduce the product, drive the user to upload their first photo,
showcase recent community finds.

**Layout** (desktop, 1280–1440 design target):
- Sticky top nav (full-width, 64px tall)
- **Hero section** — radial-gradient cream backdrop with subtle topo SVG
  overlay (10% opacity). Two-column at 1.1fr / 0.9fr inside a max-w 1200px
  container with 40px side padding. 80px top / 100px bottom padding.
  - Left: eyebrow ("◆ a field guide · v2.4 · 200 species cataloged"),
    96px serif H1 ("Gotta log / 'em all."), 18px body paragraph (max-w 470px),
    two CTAs (`Identify Your First Find →` primary, `Browse the Dex` ghost),
    mono caption row.
  - Right: 500px-tall area holding 3 ScatCards absolutely-positioned and
    rotated (-9°, +3°, +10°). The middle card sits forward (z-index 2).
- **Feature cards** — 3-up grid, 20px gap, on `var(--bone)` bg, 80px vertical
  padding. Each card: 28px padding, 18px radius, 1px bone-3 border, sh-1.
  Icon glyph in a 44×44 rounded square, display-h3 (26px), body, link.
- **Recent Finds** — section with darker `var(--bone-2)` bg + bone-3 dividers
  top/bottom. Eyebrow + 34px display H2 left, "View all →" link right. Below:
  horizontal-scroll row of 4 small ScatCards (200px wide each), 18px gap.
- **Stats strip** — 60px padding, 4-column grid. Each stat: 2px left border
  in `--forest`, large display number, mono caption.
- **Footer** — `var(--ink)` bg, light text. Logo + tagline + nav links.

**Hero card stack content**:
- Back-left, -9° rotation: Red Fox · Uncommon
- Front-center, +3° rotation, z-index 2: Brown Bear · Legendary (conservation flagged)
- Bottom-right, +10° rotation: Coyote · Rare

---

### 2. Identify — Upload · `screen-identify.jsx` → `IdentifyUploadScreen`

**Purpose**: Get the user to drop a photo.

**Layout**:
- Container with 48px top padding
- Header: eyebrow ("STEP 1 of 2 · UPLOAD"), 44px serif H1
  ("What did you find out there?"), 15px subhead
- Two-column grid 1.4fr / 1fr, 32px gap
  - **Left — DropZone**: 460px min-height, 2px dashed `--ink-4` border, 20px
    radius, cream `--paper` bg. Centered content: 88×88 rounded-square upload
    glyph (📷), 28px display title ("Drop a photo here"), subcopy, two
    buttons (`Choose File` primary, `📸 Use Camera` soft). Mono keyboard hint
    pinned to bottom.
  - **Right — Tips panel**: stacked cards
    1. "📖 FIELD TIPS" card with 4 numbered tips (01–04: Get close, Good
       lighting, Scale reference, Don't touch)
    2. "EXAMPLE SHOTS" — 3-up grid of placeholder squares (good · scale, good
       · close, bad · blurry — the bad one has a red ✕ chip top-right)
    3. "Why we ask" microcopy box — moss-tinted bg, 1px moss border, 🔬 icon

---

### 3. Identify — Analyzing · `IdentifyLoadingScreen`

**Purpose**: Show the model working. Suspense.

**Layout**: Same shell as upload. Two-column grid.
- **Left**: 460px min-height card replacing the drop zone. Shows uploaded
  photo (placeholder) with corner brackets in `--ok` green, an animated
  scan-line at ~40% height (green with glow). Bottom progress overlay
  (rgba(0,0,0,.55) + blur backdrop): mono "▸ EXTRACTING TEXTURE FEATURES"
  + 74% bar.
- **Right**: SkeletonCard (matches ScatCard layout with shimmering placeholder
  rows) + console-style status list. Status uses ✓ for done, ● for in-progress,
  ◌ for pending, all in mono. Copy is intentionally warm — "AI is sniffing
  around…", "matching against 200 species…".

---

### 4. Identify — Reveal · `IdentifyRevealScreen`

**Purpose**: The payoff moment — show the card.

**Layout**: 900px tall screen, radial honey-tinted spotlight bg.
- Top: eyebrow "✨ IDENTIFICATION COMPLETE", 56px serif H1
  ("You found a *Legendary*.") with the rarity word italicized + clay-colored,
  subhead with confidence %.
- 3-column grid (1fr / auto / 1fr, 32px gap):
  - **Left**: original photo thumbnail (240×240, 14px radius, placeholder),
    mono metadata block underneath (filename, date, GPS).
  - **Center**: the ScatCard at full size (320px wide). Behind it: a soft
    honey-amber glow (`radial-gradient` with `filter: blur(20px)`).
  - **Right**: Feedback widget — paper card, 14px radius. Title "DID WE GET
    IT RIGHT?", body, two equal-width buttons (`👍 Nailed it`, `👎 Off`).
    Divider below, then "NEXT BEST GUESS" row showing the runner-up species
    + confidence %.
- Bottom CTA row, centered: `＋ Add to Collection` primary, `Identify Another`
  ghost, `📍 Pin to Map` soft.

---

### 5. My Collection · `screen-collection.jsx`

**Purpose**: Browse, filter, complete the Dex.

**Layout**:
- Header: eyebrow "YOUR DEX", flex row with 46px display H1 on the left and
  large progress fraction "47 / 200" right-aligned. Full-width 8px-tall
  rounded progress bar below (fill: forest→moss linear gradient), with
  percentage / remaining caption row.
- **Filter row** — paper card, 14px radius. Left: rarity filter chips (`All`
  active = ink bg, others soft). Right: search input (placeholder text only —
  it's a static mock) + sort chip ("Sort: Rarity ↓").
- **Card grid** — 4 columns, 20px gap. Mix of real cards + 4 "Locked" slots
  (dashed border, diagonal stripe pattern, big "???" in display serif).
- **Bottom callout** — `--bone-2` panel, 14px radius, display title + body +
  primary CTA ("Show Rarity Map →").

---

### 6. Conservation · `screen-conservation.jsx`

**Purpose**: Frame the app as a contribution to research, not a toy.

**Layout**:
- Header: eyebrow + 46px display H1 ("Your trail walks **are research**." —
  "are research" in `--forest` color), 15px subhead.
- **Section 1 — Species Alerts**: emoji + display H3 + subtitle row. Below:
  horizontal-scroll row of AlertCards. Each AlertCard: 320px wide, 18px
  padding, 2px border (red `--danger` for Critical, amber `--warn` for Watch),
  paper bg. Severity badge → species name + italic Latin → threat note →
  divider → "via [partners]" + "Learn more →" link.
- **Section 2 — My Scat Log**: 1.4fr / 1fr grid, 20px gap.
  - **MapPanel** (left): stylized SVG of terrain (cream → blue gradient bg,
    contour lines, a blue water blob, two green forest patches, a road).
    Pins absolutely-positioned, rarity-colored (teardrop shape rotated -45°).
    Bottom-left legend (rarity dots), top-right session counter, top-left
    zoom/recenter controls. In production this should be replaced with
    Mapbox or MapLibre.
  - **LogList** (right): paper card with header bar ("LOG · 47 ENTRIES" /
    "SORT: NEWEST ↓") and a scrollable list of 8 entries. Each row is a
    3-column grid: rarity badge | species + location | date + freshness.
- **Section 3 — Science Banner**: full-width rounded gradient panel (warm
  umber → moss gradient), white text. Two-column 1.4fr / 1fr layout. Left:
  partnership eyebrow, 44px display H3, body, two CTAs. Right: 2×2 stat tile
  grid on translucent white tiles with blur backdrop.

---

### 7. Style Guide · `screen-styleguide.jsx`

Self-explanatory reference. Documents:
- 4 swatch rows (Surfaces / Ink / Brand & Semantic / Rarity) — each token
  shown as a colored panel with label, CSS var name, and full oklch() value.
- Type scale (D1/D2/D3 + T1/T2/T3 + M1/M2 mono).
- Type families (3-up: Display / UI / Mono).
- Spacing scale visualization (4 → 64 in steps) and radius examples (xs–xl).
- Buttons + chips.
- "Card anatomy" — a labeled list of every region of a ScatCard.
- All four rarity tiers shown small side by side.

---

## The Collectible Card — `card.jsx`

The single most important component. **It is the soul of the app.**

**Anatomy** (top to bottom):
1. **Top row**: RarityStamp pill on the left (rarity-colored solid bg, white
   text, glyph + label in 10px uppercase tracked .12em). Freshness indicator
   on the right (mono, with a colored dot: green = "< 1 hour", amber =
   "2–4 hours", grey = "1+ day").
2. **Illustration panel**: 1:0.78 aspect ratio. Cream paper bg with a soft
   radial watercolor wash tinted by rarity. A faint horizon line at ~22% from
   bottom anchors the animal to a ground plane (matches the painted ground-
   shadows in the source illustrations). The animal image is `object-fit:
   contain`, centered, with ~6–8% inset on the sides and ~12% inset on the
   bottom. Corner serial number (mono, № 1000–9999, hashed deterministically
   from species+rarity) top-right; small italic mono variant label
   ("A — Foraging" etc.) bottom-left.
3. **Name block**: serif (Newsreader) common name at 26px / weight 500 / line-
   height 1.0 / opsz 36; italic Latin name below at 13px / `--ink-3`.
4. **Stat block**: cream `--bone` panel with 1px bone-3 border, 10px radius.
   Three rows (Size / Smell / Danger). Each row: 38px mono label (uppercase,
   tracked) | 10 dot-pips (each filled = `--ink`, unfilled = `rgba(70,40,20,
   .10)`, 5px tall, rounded) | numeric value right-aligned.
5. **Field note**: dashed-looking left-rule (2px solid bone-3) with mono
   "Field note" mini-label, italic serif body in `--ink-2`.
6. **Conservation banner** (conditional): light-coral bg, red-orange 1px
   border, danger-red text, ⚠ glyph + note. Only shown when
   `conservationFlag` is true.
7. **Footer**: 1px bone-3 top divider; mono left column (date / location);
   mono right column (coords / serial).

**Wrapper styling**: 3–4px gradient frame border tinted by rarity using
`oklch(from <base> calc(l + 0.08) c h)` for the lighter stop. Outer radius
18px (large) / 14px (small). Inner content card sits on `--paper` with 15px /
12px radius.

**Legendary holo effect**: an additional absolutely-positioned overlay layered
above the inner card with:
```
background:
  linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(255,250,235,.55) 50%, rgba(255,255,255,0) 65%),
  linear-gradient(45deg, oklch(0.85 0.10 80), oklch(0.78 0.12 50), oklch(0.85 0.10 95));
background-size: 300% 300%, 200% 200%;
mix-blend-mode: soft-light;
opacity: 0.6;
animation: sd-holo 7s linear infinite;  // shifts background-position 0% → 200%
```

**Two sizes**: `lg` (320px wide, used in Reveal/Hero/details) and `sm` (200px
wide, used in Collection grid and Recent Finds shelf). Small variant drops
the fun-fact and conservation banner sections; everything else scales down.

**Locked variant**: `LockedCard` — same aspect ratio (0.66), diagonal-stripe
bg, dashed bone-3 border, big "???" in display serif, "Undiscovered" mono
caption. No data shown.

---

## Card Data Schema

```ts
type ScatCard = {
  species: string;              // common name, e.g. "Red Fox"
  speciesScientific: string;    // italic Latin, e.g. "Vulpes vulpes"
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  freshness: string;            // "< 1 hour" | "2–4 hours" | "1+ day"
  funFact: string;              // ~1 sentence, ≤ 120 chars
  illustrationVariant: string;  // drives which artwork to show; also rendered
                                // as a small museum-label below the art
  conservationFlag: boolean;
  conservationNote?: string;
  stats: { size: number; smell: number; danger: number };  // each 1–10
  identifiedAt: string;         // human-friendly: "Apr 18 · 6:32 AM"
  location: string;             // "Mt. Tam, CA"
  coords: string;               // "37.9235° N, 122.5965° W"
  serial: string;               // "047 / 200"  — index in user's Dex
  // Behind the scenes:
  imageUrl: string;             // the user's original photo
  artUrl: string;               // the illustration for this species+variant
};
```

---

## Interactions & Behavior

**Reveal animation**: when the model returns, the card should mount with a
flip-or-scale entry (suspense → payoff). Suggested: card scales from 0.6
opacity 0 with a subtle rotate-y from -25° to 0° over ~600ms, easing
`cubic-bezier(0.2, 0.8, 0.2, 1)`. The honey-amber glow behind it fades in
~200ms after.

**Drag-and-drop upload**: the drop zone should accept drag-over (highlight
border in `--forest`) and a dropped file. Also a hidden `<input type="file">`
behind the "Choose File" button.

**Keyboard shortcuts**:
- `U` — open file picker (Upload screen)
- `Esc` — cancel current modal / close detail view

**Collection card hover**: lift (translateY -4px), shadow strengthens to
`--sh-3`, and a small location/date overlay slides up from the bottom edge.

**Collection card click**: opens a detail modal/page with the full-size card,
the original photo, a small map pin, and "Edit / Delete / Re-identify" actions.

**Filter chips** (Collection): single-select. Active chip uses ink bg + bone
text. Clicking another chip animates the indicator (suggest a shared
`layoutId` if using Framer Motion).

**Map pins** (Conservation): hover → small popover with species + date. Click
→ zoom to pin and open the matching log entry.

**Conservation alert cards**: hover → border thickens, "Learn more →" arrow
animates 4px right.

**Loading state**: the analyzing screen should cycle through the status
checklist with realistic timing (~600ms between steps). Real call latency
will vary; keep at minimum 2s of "AI is sniffing around" theatre even if the
model returns faster.

**Empty states**:
- Collection: "Your collection is empty — go explore! 🌲" (warm, not corporate)
- Recent Finds: "No finds yet — go explore! 🌲"

**Tone**: copy should feel like a confident, slightly-nerdy park ranger.
Never corporate, never twee. Microcopy examples in the prototypes (loading,
empty states, button labels) are intentional — copy them.

---

## State Management

Suggested top-level state slices:

- **`auth`**: current user, profile, settings (anon allowed)
- **`collection`**: `Card[]` — the user's logged finds, plus
  `discoveredSpecies: Set<string>` for the progress fraction
- **`upload`**: current file, preview URL, EXIF (timestamp + GPS), upload
  progress, identification result, model confidence + next-best-guess
- **`map`**: pin filters, viewport, selected pin id
- **`conservation`**: alerts feed (fetched from research-partner API),
  pending reports queue
- **`tweaks`** (optional, dev-only): currently in the prototype, drop in prod.

Server-side: photo → S3 (or equivalent), call ML inference endpoint, return
card data, persist to user's Dex, optionally enqueue conservation report if
flagged species.

---

## Design Tokens

### Colors (all CSS vars in `tokens.css`)

**Surfaces (warm paper)**
| Token       | Value                        | Use                |
| ----------- | ---------------------------- | ------------------ |
| `--bone`    | `oklch(0.96 0.020 78)`       | Page background    |
| `--bone-2`  | `oklch(0.93 0.024 75)`       | Panel              |
| `--bone-3`  | `oklch(0.88 0.028 72)`       | Divider / border   |
| `--paper`   | `oklch(0.985 0.014 80)`      | Card / sheet       |
| `--paper-2` | `oklch(0.97 0.020 80)`       | Card secondary     |

**Ink (warm brown-black, not slate)**
| Token     | Value                    | Use                 |
| --------- | ------------------------ | ------------------- |
| `--ink`   | `oklch(0.22 0.030 50)`   | Primary text        |
| `--ink-2` | `oklch(0.36 0.028 55)`   | Body                |
| `--ink-3` | `oklch(0.54 0.024 60)`   | Muted / labels      |
| `--ink-4` | `oklch(0.72 0.020 65)`   | Placeholder         |

**Brand (earthy)**
| Token        | Value                     |
| ------------ | ------------------------- |
| `--forest`   | `oklch(0.38 0.055 135)`   |
| `--forest-2` | `oklch(0.50 0.070 135)`   |
| `--moss`     | `oklch(0.62 0.080 130)`   |
| `--umber`    | `oklch(0.42 0.075 55)`    |
| `--clay`     | `oklch(0.65 0.095 50)`    |
| `--honey`    | `oklch(0.78 0.110 75)`    |
| `--wash`     | `oklch(0.92 0.04 70)`     |

**Rarity**
| Token              | Value                     | Glyph |
| ------------------ | ------------------------- | ----- |
| `--r-common`       | `oklch(0.56 0.025 70)`    | ●     |
| `--r-common-bg`    | `oklch(0.95 0.022 75)`    |       |
| `--r-uncommon`     | `oklch(0.55 0.080 135)`   | ◆     |
| `--r-uncommon-bg`  | `oklch(0.94 0.040 130)`   |       |
| `--r-rare`         | `oklch(0.55 0.080 235)`   | ✦     |
| `--r-rare-bg`      | `oklch(0.93 0.035 230)`   |       |
| `--r-legendary`    | `oklch(0.70 0.130 70)`    | ✺     |
| `--r-legendary-bg` | `oklch(0.95 0.055 75)`    |       |

**Semantic**
| Token       | Value                  |
| ----------- | ---------------------- |
| `--danger`  | `oklch(0.55 0.180 30)` |
| `--warn`    | `oklch(0.72 0.140 70)` |
| `--info`    | `oklch(0.55 0.110 235)`|
| `--ok`      | `oklch(0.56 0.110 140)`|

### Typography

- **Display**: `Newsreader` (Google Fonts), weights 400/500/600/700.
  Optical-sizing enabled; use `font-variation-settings: 'opsz' <px>`
  matching the font size. Letter-spacing `-0.012em` (tighter for big
  display sizes, e.g. -0.025em at 88px).
- **UI**: `Plus Jakarta Sans`, weights 400/500/600/700.
- **Mono**: `JetBrains Mono`, weights 400/500/600. Used for coords,
  serials, eyebrows, log/console panels, timestamps.

**Scale**
| Token | Size | Weight | Use |
| ----- | ---- | ------ | --- |
| D1 · Hero      | 88–96px | 500 | Big hero H1 |
| D2 · Page      | 46px    | 500–600 | Page H1 |
| D3 · Section   | 26–28px | 500–600 | Section H2 |
| T1 · Body L    | 18px    | 400 | Hero subhead |
| T2 · Body      | 14px    | 400 | Default body |
| T3 · Caption   | 12px    | 500 | Captions |
| M1 · Mono      | 11px    | 500 | Coords, serials, footers |
| M2 · Eyebrow   | 11px    | 500 uppercase tracked .14–.16em | Section eyebrow |

### Spacing scale

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`. Container max-width 1200px with 40px
horizontal gutters.

### Radius

`xs 6 · sm 10 · md 14 · lg 20 · xl 28`. Buttons are pill-shaped (999px).
Cards use 14 / 18.

### Shadows

```css
--sh-1: 0 1px 2px rgba(70,40,20,.05), 0 1px 1px rgba(70,40,20,.04);
--sh-2: 0 6px 18px rgba(70,40,20,.08), 0 2px 4px rgba(70,40,20,.04);
--sh-3: 0 22px 48px rgba(70,40,20,.14), 0 8px 18px rgba(70,40,20,.07);
--sh-card: 0 36px 70px -22px rgba(70,40,20,.30), 0 14px 30px -18px rgba(70,40,20,.22);
```

Shadow tints are warm brown, not neutral grey — keep that.

### Paper texture

Page background uses an inline SVG turbulence noise overlay at 6% alpha,
warm-brown tinted. See `.sd-root` in `tokens.css`. Optional; falls back to
solid `--bone` cleanly.

---

## Assets

**Animal illustrations** — user-provided painterly / gouache style PNGs with
transparent backgrounds, each with a subtle painted ground-shadow:

| Species         | File                 | Style notes                    |
| --------------- | -------------------- | ------------------------------ |
| Brown Bear      | `art/brown_bear.png` | Used for Legendary tier        |
| Coyote          | `art/coyote.png`     |                                |
| Raccoon         | `art/raccoon.png`    |                                |
| Red Fox         | `art/red_fox.png`    |                                |
| Striped Skunk   | `art/skunk.png`      |                                |

**More illustrations needed** — to ship, commission painted variants for at
minimum: Mountain Lion, Gray Wolf, White-tailed Deer, River Otter, Black
Bear, Elk, Moose, Bobcat, Beaver, Porcupine, Pronghorn, Snow Leopard (the
"Legendary white whale" species). Match the existing painterly style: matte
gouache feel, warm earthy palette, transparent bg with painted ground-shadow.
Allow ~2–3 variants per species (e.g. "A — Standard", "B — Cub", "C — Hat")
to drive the replay loop where the same species can appear as different
collectible cards.

**Icons** — none custom; emoji used as placeholders (📷, 🔍, 🌲, 🚨, 📍,
🔬, ⚠). In production swap for a tidy icon set like Lucide / Phosphor (line
weight ~1.5–2px, rounded caps) tinted in `--ink-2`.

**Logo** — see `Logo` component in `shell.jsx`. SVG with a gradient circle
and a stylized pine-tree-meets-drop motif in cream. Keep simple; this is a
placeholder.

**Fonts** — loaded from Google Fonts. License is open.

---

## Files in this bundle

```
design_handoff_scat_dex/
├── README.md                    ← this file
├── art/                         ← painted animal illustrations (also duplicated inside prototype/ so the HTML runs standalone)
│   ├── brown_bear.png
│   ├── coyote.png
│   ├── raccoon.png
│   ├── red_fox.png
│   └── skunk.png
└── prototype/
    ├── Scat Dex.html            ← entry point; double-click to open
    ├── tokens.css               ← all CSS variables and base styles
    ├── shell.jsx                ← Screen, Nav, Container, Logo, RarityBadge
    ├── card.jsx                 ← ScatCard + LockedCard + RARITY + ART map
    ├── screen-home.jsx          ← Home / Landing
    ├── screen-identify.jsx      ← Upload + Loading + Reveal
    ├── screen-collection.jsx    ← My Collection grid
    ├── screen-conservation.jsx  ← Alerts + Map + Science banner
    ├── screen-styleguide.jsx    ← Design tokens reference
    ├── design-canvas.jsx        ← Figma-style canvas wrapper (review only — drop in prod)
    ├── tweaks-panel.jsx         ← Live-tweak panel (review only — drop in prod)
    ├── app.jsx                  ← Wires screens onto the canvas
    └── art/                     ← same illustrations, here for the HTML to resolve them
```

**Opening the prototype**: open `prototype/Scat Dex.html` in a browser. It
runs Babel-in-the-browser, no build step. The canvas lets you pan/zoom and
view each screen full-screen.

**What to discard in production**:
- `design-canvas.jsx` and `tweaks-panel.jsx` are review tooling. Don't ship.
- `app.jsx` is a canvas wrapper; replace with your app's router.
- The Babel-in-browser CDN script tags in `Scat Dex.html` — use a real build.

**What to keep**:
- `tokens.css` — the entire design-token layer is production-grade. Port the
  CSS vars (or convert to your design-token system: Tailwind theme, Style
  Dictionary, etc.).
- `card.jsx` — the ScatCard component logic, prop shape, and visual structure
  should port near-1:1 to a real React component.
- All screen markup, copy, and layout decisions in the `screen-*.jsx` files.

---

## Open questions for product

A few things the prototype doesn't answer and the team should decide:

1. **Auth model**: anonymous local-only collection, or accounts from day one?
2. **Map provider**: Mapbox, MapLibre, or Google Maps? Pricing/branding diffs.
3. **ML inference**: real-time API or queued? Affects loading-state design.
4. **Conservation partners**: confirm which orgs are actually plugged in
   (the prototype name-drops USFWS, WWF, USGS as placeholder text).
5. **Mobile**: this is desktop-first. Mobile breakpoints not designed. A
   mobile-app version is implied by "phone shot" copy but is out of scope.
6. **Privacy**: GPS handling, opt-out flow for science-data sharing, and
   blurring of precise locations for sensitive species (e.g. wolf, lion).
