# ARCHITECTURE.md — Poopidex

## Overview

Poopidex is a dual-mode web app: a Pokémon-style collectible card game built on top of a serious AI scat identification engine. The architecture is designed around a single AI call that produces all outputs at once — game card data and pro field data — so the same photo submission serves both modes without duplicate inference costs.

---

## Tech Stack

| Layer | Choice | Justification |
|---|---|---|
| Frontend | Next.js 14 (App Router) | File-based routing maps cleanly to the two modes; React Server Components keep the collection grid fast without client-side fetching boilerplate |
| Database & Auth | Supabase | Postgres gives relational integrity for the battle/trade flows; Row Level Security enforces collection ownership without custom auth middleware; built-in Storage handles photo uploads |
| AI | Claude claude-sonnet-4-20250514 via Anthropic API | Vision + text in one call; structured JSON output via tool use gives reliable stat blocks without post-processing regex |
| Deployment | Vercel | Zero-config Next.js deploy; edge functions for the AI route keep cold starts low on mobile |
| Maps (Pro Mode) | Mapbox GL JS | Lightweight, works well on mobile, free tier covers prototype volume |

---

## Data Model

Four tables. Auth is delegated to Supabase Auth (no custom `users` table needed beyond the built-in `auth.users`).

### `scat_entries`

Stores every AI identification result. One row per photo submission.

```sql
create table scat_entries (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users,
  image_url         text not null,
  species           text not null,
  species_nickname  text not null,
  rarity            text check (rarity in ('common','uncommon','rare','legendary')),
  stats             jsonb not null,        -- {size, smell, danger, freshness} each 1–10
  flavor_text       text not null,
  sci_note          text,
  freshness         text,                  -- e.g. "< 1 hour"
  health_note       text,                  -- Bristol Stool Scale (Pro)
  conservation_flag boolean default false,
  lat               float,
  lng               float,
  created_at        timestamptz default now()
);
```

### `user_collection`

Junction table linking a user to the entries they own. Separates ownership from the AI result so the same species entry can exist in multiple collections without duplication.

```sql
create table user_collection (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid references auth.users not null,
  entry_id  uuid references scat_entries not null,
  in_trade  boolean default false,
  unique (user_id, entry_id)
);
```

### `battles`

Async challenge system. Created when a challenger sends an invite link; resolved when opponent picks their card and the higher stat is computed server-side.

```sql
create table battles (
  id               uuid primary key default gen_random_uuid(),
  challenger_id    uuid references auth.users not null,
  opponent_id      uuid references auth.users,
  challenger_card  uuid references scat_entries not null,
  opponent_card    uuid references scat_entries,
  chosen_stat      text check (chosen_stat in ('size','smell','danger','freshness')),
  winner_id        uuid references auth.users,
  created_at       timestamptz default now()
);
```

### `trades`

Offer-based trading. Both sides list the card they are offering; acceptance triggers an atomic swap via a Postgres function to prevent partial updates.

```sql
create table trades (
  id               uuid primary key default gen_random_uuid(),
  offerer_id       uuid references auth.users not null,
  receiver_id      uuid references auth.users,
  offered_entry    uuid references scat_entries not null,
  requested_entry  uuid references scat_entries,
  status           text default 'pending' check (status in ('pending','accepted','rejected','cancelled')),
  created_at       timestamptz default now()
);
```

---

## Key Design Decisions

### Single AI call, dual output

The Claude Vision call returns one structured JSON object containing both the game fields (nickname, rarity, stats, flavor text) and the pro fields (sci_note, freshness, health_note, conservation_flag). This avoids two round-trips and keeps costs predictable. The frontend renders whichever fields are relevant to the active mode; the rest are stored and available on mode switch.

### Species deduplication

`scat_entries` stores every individual submission including duplicates of the same species. `user_collection` is the ownership layer. The collection grid is built by grouping `user_collection` by `species` field — a user who has photographed three dogs sees one dog card. Rarest or highest-stat submission wins as the display card. This keeps the data model simple while supporting the Pokédex UX.

### Atomic trade execution

Card trading uses a Postgres function (`execute_trade`) called via RPC to swap `user_id` values in `user_collection` in a single transaction. No application-layer race condition possible.

### Anonymous one-shot ID

Users can get a single AI identification without creating an account. The result is returned to the client but not persisted to `scat_entries`. A prompt to sign up is shown after the result to save the card.

---

## Application Structure

```
/
├── app/
│   ├── page.tsx                  # Landing / mode select
│   ├── identify/
│   │   └── page.tsx              # Photo upload + AI call
│   ├── poopidex/
│   │   └── page.tsx              # Collection grid
│   ├── battle/
│   │   ├── page.tsx              # Create challenge
│   │   └── [id]/page.tsx         # Battle resolution
│   ├── trade/
│   │   └── page.tsx              # Trade marketplace
│   ├── pro/
│   │   └── page.tsx              # GPS log + Pro Mode dashboard
│   └── api/
│       ├── identify/route.ts     # Claude Vision call → structured JSON
│       ├── battle/route.ts       # Stat comparison + winner resolution
│       └── trade/route.ts        # RPC → execute_trade
├── components/
│   ├── PoopidexCard.tsx          # Collectible card UI
│   ├── CollectionGrid.tsx        # Pokédex-style grid
│   ├── BattleScreen.tsx
│   └── ProMap.tsx                # Mapbox GPS log
├── lib/
│   ├── supabase.ts               # Client + server Supabase instances
│   ├── claude.ts                 # Anthropic SDK wrapper + prompt
│   └── species.ts                # Rarity lookup, conservation list
└── ARCHITECTURE.md
```

---

## Agentic Engineering Plan

The build is decomposed into eight GitHub issues from the spec. The order below reflects hard dependencies: infrastructure must exist before features, and the AI call must work before any feature that depends on card data.

### Phase 1 — Infrastructure (Issues 1, 8)

**Issue 1 — Scaffolding:** Initialize Next.js repo, configure Supabase project, run the four `CREATE TABLE` statements, set up Row Level Security policies, add environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`), deploy skeleton to Vercel.

**Issue 8 — Auth:** Implement Supabase Auth with magic link. Gate `/poopidex`, `/battle`, and `/trade` routes behind session check. Allow anonymous access to `/identify` with a post-result sign-up prompt.

### Phase 2 — Core AI Loop (Issues 2, 3)

**Issue 2 — Photo capture:** Build the upload interface. On mobile, `<input type="file" accept="image/*" capture="environment">` triggers the camera. Preview the image before submission. Send as base64 to the `/api/identify` route.

**Issue 3 — AI identification:** The `/api/identify` route sends the image to Claude with a structured prompt requesting JSON output: `species`, `species_nickname`, `rarity`, `stats` object, `flavor_text`, `sci_note`, `freshness`, `health_note`, `conservation_flag`. Validate the response shape, write to `scat_entries`, add to `user_collection`, return card data. Render `PoopidexCard` on the client.

The Claude prompt (simplified):

```
You are the Poopidex AI. Analyze the scat in this photo.
Return ONLY valid JSON matching this schema:
{
  "species": string,
  "species_nickname": string (fun, Pokémon-style),
  "rarity": "common" | "uncommon" | "rare" | "legendary",
  "stats": { "size": 1-10, "smell": 1-10, "danger": 1-10, "freshness": 1-10 },
  "flavor_text": string (fun, 1-2 sentences),
  "sci_note": string (plain scientific note),
  "freshness": string (e.g. "< 1 hour", "2–4 hours"),
  "health_note": string (Bristol Stool Scale if applicable),
  "conservation_flag": boolean
}
```

### Phase 3 — Game Features (Issues 4, 5, 6)

**Issue 4 — Collection grid:** Query `user_collection` joined to `scat_entries`, group by species, render discovered cards in full color and undiscovered species (from a static master species list) as silhouettes. Show completion percentage.

**Issue 5 — Card battles:** Challenger picks a card and a stat, `/api/battle` creates a `battles` row and returns a shareable invite URL. Opponent visits the URL, picks their card, and the server compares the chosen stat and writes `winner_id`. Both users see the result screen.

**Issue 6 — Card trading:** User marks a card `in_trade = true`, optionally specifying a `requested_entry`. Other users browse available trades and accept. Acceptance calls `/api/trade` which executes the atomic swap RPC.

### Phase 4 — Pro Mode (Issue 7)

**Issue 7 — Pro Mode:** Settings toggle stored in user profile metadata. When enabled, the identify result page surfaces `sci_note`, `freshness`, `health_note`, and `conservation_flag` instead of (or alongside) the game card. The `/pro` page renders `ProMap` — a Mapbox map pulling all `scat_entries` for the current user with `lat`/`lng` populated, clustered by species.

---

## Acceptance Criteria Mapping

| Acceptance criterion | Covered by |
|---|---|
| Photo → Poopidex card in < 10 seconds | Issue 2 + 3; Claude call target < 6s, upload + render < 4s |
| Collection grid shows correct discovered/undiscovered state | Issue 4 |
| Two users complete a card battle from invite to result | Issue 5 |
| Two users complete a card trade | Issue 6 |
| Pro Mode surfaces freshness, health note, GPS map | Issue 7 |
| App deployed to public URL, no local setup required | Issue 1 + Vercel |
