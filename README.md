# Poopidex — AI-Powered Scat Identification & Collector Game

Snap a photo of wild animal scat, get a collectible field-guide card. Build your Poopidex, hunt rarities, contribute to wildlife conservation research.

> **Gotta log 'em all.**

🔗 **Live URL:** **https://poopidex.vercel.app** — open in any browser, no install needed.

🟢 **Service health:**
- Frontend (Vercel) — https://poopidex.vercel.app
- YOLO inference (Hugging Face Space) — https://huggingface.co/spaces/JZ0317/poopidex-yolo · [health check](https://jz0317-poopidex-yolo.hf.space/health)

---

## What it does

1. **Identify** — Drop a photo of scat. A hybrid YOLO + Claude Vision pipeline identifies the species.
2. **Collect** — Every find earns a collectible card with rarity tier, stats, fun fact, and a painted illustration of the animal.
3. **Conserve** — Flagged species (rare or threatened) trigger conservation alerts. Your finds plot on a map and contribute to the citizen-science Dex.

**20 species are fully cataloged** with painted illustrations, rarity tiers, element types (Forest · Mountain · Desert · Water · Plains · Urban · Shadow), and biological attribute rules:

| Tier | Species |
|---|---|
| 🟡 **Legendary** | Brown Bear · Gray Wolf · Mountain Lion · Moose · American Bison |
| 🔵 **Rare** | Bobcat · Fisher · Pronghorn · North American River Otter · Ringtail |
| 🟢 **Uncommon** | North American Porcupine · American Beaver · Big-Eared Woodrat · Wild Boar · Black-Tailed Jackrabbit |
| ⚪ **Common** | Coyote · Red Fox · Common Raccoon · Striped Skunk · White-Tailed Deer |

Rarity reflects how hard the species is to encounter in the wild (Common = backyard / Legendary = deep wilderness), not how easy it is to identify.

---

## Stack

| Layer | Tech |
|---|---|
| **Frontend** | Next.js 16 (App Router) + React 19 + Tailwind v4 |
| **Backend** | Next.js `/api/identify` route — streams pipeline events as NDJSON |
| **AI · Decider** | **Claude Opus 4.7** via Anthropic API. Sees image + user hints + CLIP's advisory vote. Returns structured tool output with a required `analysis` chain-of-thought field. |
| **AI · Specialist advisor** | **CLIP ViT-B/32** fine-tuned on [AnimalClue feces dataset](https://huggingface.co/datasets/risashinoda/feces_yolo) (ICCV 2025). Top-5 predictions are filtered (≥20 training samples per species) and passed to Claude as a low-weight signal. |
| **User hints (mandatory)** | Size + Habitat + Visible contents. Hard biological filters: e.g. `Tiny + Desert + Bone fragments` excludes every species that biologically can't satisfy all three. |
| **Persistence** | `localStorage` for the user's collection (anonymous, no signup) |
| **Hosting** | Vercel (frontend) · Hugging Face Spaces (CLIP server) |

### How the hybrid pipeline works

```
User uploads photo + mandatory hints (size · habitat · contents)
   ↓
Hint hard filter — compute "allowed species" (subset of 20)
   ↓
CLIP advisor — run image through fine-tuned ViT-B/32
   ↓
Filter CLIP's top-5 to species with ≥20 training samples (drops noisy tail)
   ↓
Claude Opus 4.7 (the decider) ← image + hints + CLIP top-5 + 20-species cheat sheet
   ↓
Claude writes `analysis` (chain-of-thought) → commits to species → 1-sentence `reasoning`
   ↓
Card built · streamed back to UI as the final NDJSON event
```

The whole pipeline streams progress in real time: the UI's analyzing screen advances step-by-step with the actual server work (no fake loaders).

---

## Run locally

### Prerequisites

- Node.js 20+
- Python 3.11+ (only needed for the YOLO inference server)
- An Anthropic API key (free signup at https://console.anthropic.com)

### 1. Clone + install Node deps

```bash
git clone https://github.com/GIX-Luyao/final-project-codebase-aarony630-1.git
cd final-project-codebase-aarony630-1
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and replace `sk-ant-your-key-here` with your real Anthropic key. `YOLO_API_URL` can stay at its default for local dev.

### 3. Set up the YOLO inference server (optional but recommended)

The Python server hosts the AnimalClue YOLO model. Without it, the app falls back to Claude-only.

```bash
cd scripts
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

You'll also need the model weights file at `scripts/models/feces_yolo.pt`. Download from the [Hugging Face model repo](https://huggingface.co/risashinoda/feces_yolo) (file: `last.pt`, rename to `feces_yolo.pt`).

### 4. Start the two servers

**Terminal 1 — YOLO inference server (port 8001):**
```bash
cd scripts
.venv/bin/python server.py
```

**Terminal 2 — Next.js dev server (port 3000):**
```bash
npm run dev
```

Open http://localhost:3000.

---

## Project structure

```
.
├── app/                       Next.js app router
│   ├── page.tsx               Home/landing (3-card hero stack + recent finds)
│   ├── identify/              Upload → Hints → Analyze → Reveal flow
│   ├── collection/            User's Dex grid (rarity + element filters, style preview)
│   ├── conservation/          Map + alerts + science partnership
│   └── api/identify/          Server route — streams NDJSON pipeline events
├── components/
│   ├── cards/ScatCard.tsx     The collectible card (element circle, rarity glow, stats)
│   ├── cards/HeroCardDeck.tsx Home-page interactive card stack
│   └── ui/                    Nav, Logo, Container
├── lib/
│   ├── types.ts               ScatCard schema + 20-species list + rarity inference
│   ├── speciesAttributes.ts   Size/habitat/contents per species + scoreSpecies() hard filters
│   ├── claude.ts              Claude Opus + system prompt with 20-species cheat sheet
│   ├── identify.ts            Frontend stream reader for /api/identify
│   ├── collection.ts          localStorage-backed user collection
│   └── mockIdentify.ts        Fallback when both AI paths fail
├── public/art/                20 species illustrations + 7 element icons (PNG)
├── scripts/
│   ├── _hf_space/             Deployable CLIP inference server (Docker SDK Space)
│   │   ├── server.py          FastAPI CLIP server with logit-adjustment for class imbalance
│   │   ├── poopidex_clip_v2.pt CLIP ViT-B/32 fine-tuned on 20 species
│   │   └── Dockerfile
│   └── models/                Training checkpoints (gitignored)
└── design_handoff_scat_dex/   Original design reference from Claude Design
```

---

## Deployment

### Frontend (Vercel)

1. Sign in at https://vercel.com with GitHub
2. Import this repo
3. Set environment variables:
   - `ANTHROPIC_API_KEY` — your Anthropic key
   - `YOLO_API_URL` — your deployed YOLO server URL (e.g. `https://yourname-poopidex-yolo.hf.space/predict`)
4. Deploy — Vercel auto-builds and auto-redeploys on every push to `main`.

### Backend (Hugging Face Spaces)

The YOLO inference server is deployed as a Docker-SDK Space on Hugging Face. The `scripts/` folder is self-contained — it can be pushed to a Space repo as-is with a `Dockerfile`.

*(Detailed deploy instructions added when the space is set up.)*

---

## Credits

- **Design** — generated with Claude Design, painted illustrations included
- **Specialist advisor model** — CLIP ViT-B/32 fine-tuned on the [AnimalClue dataset](https://huggingface.co/risashinoda/feces_yolo), ICCV 2025 (Shinoda et al.)
- **Decider model** — Claude Opus 4.7 (Anthropic), with structured tool-use + extended deliberation via required `analysis` field
- **Developer** — Joyce Zhou (TECHIN 510, GIX)
- **Proposer** — Aaron (aarony630)

---

## Project economics

40 GIX Bucks. TECHIN 510 marketplace economy.

---

## License & data note

The AnimalClue dataset and model are released for **research / non-commercial use only**. The model weights (`feces_yolo.pt`) and any dataset files are gitignored — do not commit them. See [`feces_yolo` on Hugging Face](https://huggingface.co/datasets/risashinoda/feces_yolo) for terms.

Application code in this repo is for the course project; ask before reuse.
