# SPEC.md — Poopidex: AI-Powered Scat Identification & Collector Game

## Project Overview

Poopidex is a dual-mode mobile-friendly web app. In **Explorer Mode** (kids & casual users), it's a Pokémon-style collectible game, snap a photo of any dropping (any animal, including human), get a AI-generated Poopidex card for that species, and build your collection. Cards have stats, rarity tiers, and can be traded or used in head-to-head battles with friends. In **Pro Mode** (hunters, researchers, pet owners, vets), it's a serious field tool. You can look at species ID, freshness estimate, health assessment, conservation flagging, and a GPS-mapped scat log. Same app, two lenses.

All species are in scope: wild animals, domesticated animals, birds, reptiles, invertebrates, and humans.

---

## Developer & Fee

| Field | Value |
|---|---|
| **Developer** | Joyce Zhou |
| **Development Fee** | 40 GIX Bucks |

---

## User Stories

### Explorer Mode (Kids & Casual)

1. **As a kid on a nature walk**, I want to photograph poop, get a funny Poopidex card with a cool name and stats, so I can feel the thrill of discovering a new species like catching a Pokémon.

2. **As a competitive kid**, I want to challenge my friend to a poop battle where our cards' stats decide the winner, so finding rare animal scat actually matters.

3. **As a collector**, I want to see which species are still missing from my Poopidex and get hints about where to find them, so I always have a reason to keep exploring.

4. **As any user**, I want to trade Poopidex cards with friends so that poop found in different ecosystems can be shared without being there in person.

### Pro Mode (Serious Users)

5. **As a hunter**, I want to photograph scat on the trail and know the species and how recently it passed through, so I can make smarter tracking decisions.

6. **As a pet owner**, I want to photograph my dog's stool and get a Bristol Stool Scale assessment, so I know whether to call the vet.

7. **As a conservation researcher**, I want rare or watch-listed species sightings to be automatically flagged, so crowdsourced data can surface meaningful ecological signals.

8. **As a Pro Mode user**, I want a GPS-mapped log of all my submissions with species, freshness, and AI notes, so I can track wildlife patterns over time.

---

## Desired Specifications

### Must-Have Features

- **Photo capture / upload** — Camera on mobile, file upload fallback. Works for any species including human.
- **AI species identification** — Claude Vision identifies the species from the photo, assigns a rarity tier (Common / Uncommon / Rare / Legendary), and writes a fun Poopidex flavor text AND a plain scientific note (used by Pro Mode).
- **Poopidex card generation** — Each new species ID generates a collectible card with: species name, fun nickname, rarity badge, stat block (Size, Smell, Danger, Freshness), and flavor text. Cards live in the user's Poopidex.
- **Poopidex collection view** — Full Pokédex-style grid. Discovered species are full color; undiscovered are silhouetted with a "???" label. Shows completion percentage.
- **Card battles** — Two users each pick a card and choose a stat to compete on; higher stat wins. Simple async challenge system (send a battle invite link).
- **Card trading** — Users can offer a card from their collection to another user in exchange for one of theirs.
- **Pro Mode toggle** — Switch in settings to enable Pro Mode, which surfaces freshness estimate, Bristol Stool Scale score, health notes, and GPS log instead of (or alongside) the game UI.
- **Personal scat log (Pro)** — Submissions saved with GPS, timestamp, and AI notes. Viewable as list or map.

### Nice-to-Have Features

- **Conservation alert** — Rare or watch-listed species trigger a badge and optional report link (Pro Mode).
- **Collection stats & streaks** — Unique species count, day streak, "rarest find" highlight.
- **Habitat hints** — Unlock short clues about where to find undiscovered species once 50% of a habitat group is collected.
- **Leaderboard** — Most species collected globally / by region.

### Out of Scope

- Offline mode
- Augmented reality overlay
- Real money / real trading value

---

## Poopidex Card Stat System

Each card has four stats (1–10 scale, assigned by AI based on species biology):

| Stat | Description |
|---|---|
| **Size** | How big the dropping typically is |
| **Smell** | Potency (1 = barely there, 10 = legendary stench) |
| **Danger** | Pathogen / disease risk of the source animal |
| **Freshness** | How recently this specific sample was deposited (dynamic per find) |

Rarity tiers based on how commonly the species appears in submissions:

| Tier | Examples |
|---|---|
| Common | Dog, Pigeon, Rabbit, Human |
| Uncommon | Deer, Raccoon, Fox |
| Rare | Black Bear, Mountain Lion, Otter |
| Legendary | Wolverine, Wolf, Grizzly Bear |

---

## Data Model

**Table: `scat_entries`**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to auth |
| `image_url` | text | Stored photo |
| `species` | text | AI result (any animal or human) |
| `species_nickname` | text | Fun Poopidex name |
| `rarity` | text | common / uncommon / rare / legendary |
| `stats` | jsonb | `{size, smell, danger, freshness}` |
| `flavor_text` | text | Fun card description |
| `sci_note` | text | Plain scientific note (Pro) |
| `freshness` | text | e.g., "< 1 hour" |
| `health_note` | text | Bristol/vet note |
| `conservation_flag` | boolean | Rare species? |
| `lat` | float | GPS latitude |
| `lng` | float | GPS longitude |
| `created_at` | timestamptz | Submission time |

**Table: `user_collection`**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to auth |
| `entry_id` | uuid | FK to scat_entries |
| `in_trade` | boolean | Currently listed for trade? |

**Table: `battles`**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `challenger_id` | uuid | Initiating user |
| `opponent_id` | uuid | Receiving user |
| `challenger_card` | uuid | FK to scat_entries |
| `opponent_card` | uuid | FK to scat_entries |
| `chosen_stat` | text | Which stat is being contested |
| `winner_id` | uuid | Resolved after both pick |
| `created_at` | timestamptz | |

**Table: `users`** — handled by Supabase Auth.

---

## GitHub Issues (Project Decomposition)

1. **[Setup] Project scaffolding & tech stack** — Initialize repo, configure Next.js + Supabase, environment variables, deploy skeleton to Vercel.

2. **[UI] Photo capture & upload interface** — Camera trigger on mobile, file upload fallback, image preview. Works for any species.

3. **[AI] Species ID & Poopidex card generation** — Claude Vision prompt returns: species name, fun nickname, rarity tier, stat block (Size/Smell/Danger/Freshness), flavor text, and scientific note. Store result and render as a card.

4. **[Feature] Poopidex collection view** — Pokédex-style grid of all possible species. Discovered = full card; undiscovered = silhouette + "???". Show completion %.

5. **[Feature] Card battles** — Pick a card, choose a stat, send a battle link. Opponent picks their card. Higher stat wins. Show result screen.

6. **[Feature] Card trading** — List a card for trade, browse trade offers, accept/reject. Both users' collections update atomically.

7. **[Feature] Pro Mode** — Settings toggle. Enables freshness estimate, Bristol Stool Scale health note, conservation flag, and GPS-mapped scat log view.

8. **[Auth] User authentication** — Supabase Auth (email/magic link). Gate collection, battles, and trades behind login. Allow anonymous one-shot ID without account.

---

## Acceptance Criteria

- A kid can photograph poop and receive a Poopidex scard with a name, rarity, and stats within 10 seconds.
- A user's Poopidex grid shows all species with correct discovered/undiscovered state.
- Two users can complete a card battle from invite to result.
- Two users can complete a card trade.
- Pro Mode surfaces freshness, health note, and a GPS map log.
- App is deployed to a public URL and accessible without local setup.
