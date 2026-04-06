# ARCHITECTURE.md

# Poopidex — Initial Architecture

## Project Summary

Poopidex is a gamified web application that turns scat identification into a collectible card experience. Users upload a photo, receive an AI-generated Poopidex card, and build a collection over time. The app supports two modes:

- **Explorer Mode** for casual users, focused on collectible cards, rarity, stats, trading, and battles
- **Pro Mode** for serious users, focused on species identification, freshness estimate, health notes, scientific notes, conservation alerts, and GPS-based logging

This document outlines the initial system architecture, data model, technical decisions, and implementation plan for MVP delivery.

---

## 1. Architecture Overview

### High-Level Flow

1. User signs in
2. User uploads or captures a scat image
3. Image is stored
4. Backend sends image to AI vision pipeline
5. AI returns structured identification result
6. App transforms result into:
   - Poopidex collectible card
   - collection entry
   - optional Pro Mode log entry
7. User can view collection, battle cards, and trade cards

---

## 2. System Architecture

### Frontend
- **Next.js**
- React components for upload flow, card rendering, collection grid, battle UI, trading UI, and Pro Mode dashboard
- Client-side state for immediate interactions
- Server actions or API routes for secure backend operations

### Backend
- **Next.js server routes / server actions**
- Handles:
  - authenticated requests
  - image upload orchestration
  - AI API calls
  - structured response validation
  - database writes
  - battle/trade operations

### Database / Auth / Storage
- **Supabase**
- PostgreSQL for relational data
- Supabase Auth for user accounts
- Supabase Storage for uploaded scat images

### AI Layer
- **Claude Vision API**
- Accepts uploaded image and prompt
- Returns structured JSON-like identification result:
  - likely species
  - rarity tier
  - stats
  - flavor text
  - optional Pro Mode outputs

### Deployment
- **Vercel**
- Frontend and backend routes hosted together
- Environment variables for Supabase and Claude API access

---

## 3. Core Product Surfaces

### 3.1 Upload / Capture Flow
User uploads an image from camera or file picker.  
System sends image for analysis.  
User receives generated Poopidex card.

### 3.2 Poopidex Card View
Displays:
- species name
- fun nickname
- rarity tier
- stats
- flavor text
- image thumbnail
- timestamp / habitat if needed

### 3.3 Collection Grid
Displays discovered cards and silhouette placeholders for undiscovered entries.

### 3.4 Card Battle Flow
User selects one of their cards, chooses a stat, and compares against opponent card.

### 3.5 Trading Flow
Users can offer cards and accept trades.

### 3.6 Pro Mode
Displays:
- scientific identification note
- freshness estimate
- health assessment / stool note
- conservation alert
- GPS log entry and timestamp

---

## 4. Data Model

The project brief mentions a 4-table schema at architecture check-in.  
To keep the MVP realistic while supporting core features, the initial schema is:

---

### Table 1: `profiles`

Stores user-level information.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key, matches auth user id |
| username | text | Public display name |
| created_at | timestamp | Default now() |
| mode_preference | text | explorer or pro |

**Purpose**
- user identity
- display name
- preference storage

---

### Table 2: `submissions`

Stores uploaded scat analyses.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to profiles.id |
| image_url | text | Supabase Storage URL |
| species_name | text | AI-estimated species |
| fun_nickname | text | Generated card nickname |
| rarity_tier | text | Common / Rare / Epic / Legendary |
| stat_size | integer | Card stat |
| stat_smell | integer | Card stat |
| stat_danger | integer | Card stat |
| stat_freshness | integer | Card stat |
| flavor_text | text | Explorer Mode card text |
| scientific_note | text | Pro Mode note |
| freshness_note | text | Pro Mode estimate |
| health_note | text | Pro Mode health assessment |
| conservation_alert | text | Pro Mode alert if applicable |
| latitude | numeric | Optional GPS |
| longitude | numeric | Optional GPS |
| created_at | timestamp | Default now() |

**Purpose**
- stores the AI result for each upload
- acts as source record for collection and Pro Mode log

---

### Table 3: `collection_entries`

Stores collectible ownership state.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to profiles.id |
| submission_id | uuid | Foreign key to submissions.id |
| species_key | text | normalized species identifier |
| is_discovered | boolean | default true |
| acquired_at | timestamp | Default now() |

**Purpose**
- tracks user collection
- supports Poopidex grid
- allows duplicate ownership if desired
- supports discovered / undiscovered logic

---

### Table 4: `trades`

Stores trade proposals and results.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| from_user_id | uuid | Foreign key to profiles.id |
| to_user_id | uuid | Foreign key to profiles.id |
| offered_entry_id | uuid | Foreign key to collection_entries.id |
| requested_entry_id | uuid | Foreign key to collection_entries.id |
| status | text | pending / accepted / rejected / cancelled |
| created_at | timestamp | Default now() |

**Purpose**
- supports card trading
- records transaction state between users

---

## 5. Notes on Battle Data

For MVP, card battles do **not** need a dedicated table.

Reason:
- battle outcome can be computed on demand
- no persistent battle history is required in the current spec
- avoids unnecessary schema expansion during MVP

If time permits later, a `battles` table can be added for:
- match history
- wins/losses
- leaderboard

---

## 6. Data Relationships

- A **profile** has many **submissions**
- A **profile** has many **collection_entries**
- A **submission** may create one **collection_entry**
- A **trade** links two users and two collection entries

---

## 7. Tech Stack Justification

## Next.js
Chosen because:
- supports both frontend and backend in one framework
- easy routing for upload, collection, battles, trading, and Pro Mode
- works well with Vercel deployment
- supports server actions / route handlers for secure AI calls

## Supabase
Chosen because:
- built-in auth reduces implementation time
- Postgres schema is suitable for structured collection/trade data
- storage support is ideal for uploaded images
- easy integration with Next.js

## Claude Vision API
Chosen because:
- image understanding is central to the product
- supports multimodal prompting for both fun and structured outputs
- can generate both casual card text and Pro Mode notes from one inference pipeline

## Vercel
Chosen because:
- easiest deployment path for Next.js
- good developer workflow
- environment variable support
- fast preview deployments for milestone reviews

---

## 8. AI Output Contract

To keep the application stable, the AI response should be normalized into a structured shape before saving to the database.

### Expected AI Output Shape

```json
{
  "species_name": "Raccoon",
  "fun_nickname": "Midnight Mischief",
  "rarity_tier": "Rare",
  "stats": {
    "size": 6,
    "smell": 8,
    "danger": 4,
    "freshness": 7
  },
  "flavor_text": "A sneaky urban forager with a dramatic signature drop.",
  "pro_mode": {
    "scientific_note": "Likely Procyon lotor based on shape and context.",
    "freshness_note": "Appears less than 12 hours old.",
    "health_note": "No obvious stool abnormality from image alone.",
    "conservation_alert": "None"
  }
}
