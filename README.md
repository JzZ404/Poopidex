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

Five species are supported out of the box with full illustrations:

| Species | Rarity |
|---|---|
| Brown Bear | Legendary |
| Coyote | Rare |
| Red Fox | Uncommon |
| Raccoon | Uncommon |
| Striped Skunk | Common |

The underlying model recognizes 101 species — any of them can be identified, but species without illustrations render with a placeholder graphic.

---

## Stack

| Layer | Tech |
|---|---|
| **Frontend** | Next.js 16 (App Router) + React 19 + Tailwind v4 |
| **Backend (Node API routes)** | Next.js `/api/identify` — orchestrates AI calls |
| **AI #1 — Specialized model** | YOLO11n trained on the [AnimalClue feces dataset](https://huggingface.co/datasets/risashinoda/feces_yolo) (ICCV 2025), served via FastAPI |
| **AI #2 — General fallback** | Claude Sonnet 4 via Anthropic API |
| **Persistence** | `localStorage` for the user's collection (anonymous, no signup) |
| **Hosting** | Vercel (frontend) · Hugging Face Spaces (YOLO server) |

### How the AI hybrid works

```
User uploads photo
   ↓
YOLO model runs (fast + free)
   ↓
   Confidence ≥ 25%?
       YES → return YOLO's species  (badge: "YOLO · AnimalClue")
       NO  → call Claude as backup  (badge: "Claude (YOLO was unsure)")
              Claude null?          → "no scat detected" message
```

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
├── app/                    Next.js app router
│   ├── page.tsx            Home/landing
│   ├── identify/           Upload → Analyze → Reveal flow
│   ├── collection/         User's Dex grid
│   ├── conservation/       Map + alerts + science partnership
│   └── api/identify/       Server route that orchestrates YOLO + Claude
├── components/
│   ├── cards/ScatCard.tsx  The collectible card component (the soul of the app)
│   └── ui/                 Nav, Logo, Container
├── lib/
│   ├── types.ts            ScatCard schema + species list + rarity inference
│   ├── claude.ts           Claude Vision identification
│   ├── identify.ts         Frontend client for /api/identify
│   ├── collection.ts       localStorage-backed user collection
│   └── mockIdentify.ts     Fallback when both AI paths fail
├── public/art/             Painted animal illustrations (PNG)
├── scripts/
│   ├── server.py           FastAPI inference server (YOLO)
│   ├── inspect_model.py    Debug tool: list model classes
│   └── models/             Place the .pt file here (gitignored)
└── design_handoff_scat_dex/  Original design reference from Claude Design
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
- **AI model** — [AnimalClue: Recognizing Animals by Their Traces](https://huggingface.co/risashinoda/feces_yolo), ICCV 2025 (Shinoda et al.)
- **Vision fallback** — Claude Sonnet 4 by Anthropic
- **Developer** — Joyce Zhou (TECHIN 510, GIX)
- **Proposer** — Aaron (aarony630)

---

## Project economics

40 GIX Bucks. TECHIN 510 marketplace economy.

---

## License & data note

The AnimalClue dataset and model are released for **research / non-commercial use only**. The model weights (`feces_yolo.pt`) and any dataset files are gitignored — do not commit them. See [`feces_yolo` on Hugging Face](https://huggingface.co/datasets/risashinoda/feces_yolo) for terms.

Application code in this repo is for the course project; ask before reuse.
