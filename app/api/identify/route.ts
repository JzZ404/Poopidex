import { NextRequest, NextResponse } from "next/server";
import { ScatCard, findSpec, inferRarity } from "@/lib/types";
import { identifyWithClaude, ClaudePrediction } from "@/lib/claude";

const YOLO_URL = process.env.YOLO_API_URL || "http://127.0.0.1:8001/predict";

/* Trust threshold: if YOLO confidence is below this, fall back to Claude.
   The pre-trained AnimalClue model is noisy — most correct calls land in the
   30%+ range. Below 25% we should ask a stronger model. */
const YOLO_TRUST_THRESHOLD = 0.25;

type YoloPrediction = {
  ok: boolean;
  reason?: string;
  top?: { species: string; speciesRaw: string; confidence: number };
  runnerUp?: { species: string; speciesRaw: string; confidence: number } | null;
  all?: { species: string; confidence: number }[];
};

type ModelSource = "yolo" | "claude" | "claude_fallback";

function buildCard(species: string): ScatCard {
  const spec = findSpec(species);

  const freshnessOpts = ["< 1 hour", "2–4 hours", "1+ day"];
  const freshness = freshnessOpts[Math.floor(Math.random() * freshnessOpts.length)];
  const variants = ["A — Standard", "B — Foraging", "C — Resting"];
  const variant = variants[Math.floor(Math.random() * variants.length)];

  const now = new Date();
  const identifiedAt = now
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " ·");

  const serial = String(Math.floor(Math.random() * 200) + 1).padStart(3, "0");

  if (spec) {
    return {
      species: spec.species,
      speciesScientific: spec.speciesScientific,
      rarity: spec.rarity,
      freshness,
      funFact: spec.defaultFunFact,
      illustrationVariant: variant,
      conservationFlag: spec.conservationFlag,
      conservationNote: spec.conservationNote,
      stats: spec.defaultStats,
      identifiedAt,
      location: "Mt. Tam, CA",
      coords: "37.9235° N, 122.5965° W",
      serial: `${serial} / 200`,
    };
  }

  return {
    species,
    speciesScientific: "—",
    rarity: inferRarity(species),
    freshness,
    funFact: `A wild ${species.toLowerCase()} passed through here. Illustration coming soon.`,
    illustrationVariant: variant,
    conservationFlag: false,
    stats: { size: 5, smell: 5, danger: 5 },
    identifiedAt,
    location: "Mt. Tam, CA",
    coords: "37.9235° N, 122.5965° W",
    serial: `${serial} / 200`,
  };
}

async function callYolo(file: File): Promise<YoloPrediction | null> {
  try {
    const upstream = new FormData();
    upstream.append("file", file, file.name || "upload.jpg");
    const res = await fetch(YOLO_URL, { method: "POST", body: upstream });
    if (!res.ok) return null;
    return (await res.json()) as YoloPrediction;
  } catch {
    return null;
  }
}

async function callClaude(file: File): Promise<ClaudePrediction | null> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    return await identifyWithClaude(base64, mimeType);
  } catch (err) {
    console.error("Claude call failed:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // 1) Try YOLO first (fast + free)
    const yolo = await callYolo(file);

    let source: ModelSource = "yolo";
    let species: string | null = null;
    let confidence = 0;
    let runnerUp: { species: string; confidence: number } | null = null;
    let reasoning: string | undefined;
    let yoloPick: { species: string; confidence: number } | null = null;

    if (yolo?.ok && yolo.top) {
      yoloPick = { species: yolo.top.species, confidence: yolo.top.confidence };

      if (yolo.top.confidence >= YOLO_TRUST_THRESHOLD) {
        // High confidence — trust YOLO
        species = yolo.top.species;
        confidence = yolo.top.confidence;
        runnerUp = yolo.runnerUp
          ? { species: yolo.runnerUp.species, confidence: yolo.runnerUp.confidence }
          : null;
      }
    }

    // 2) YOLO failed OR was unsure → call Claude
    if (!species) {
      const claude = await callClaude(file);
      if (claude?.species) {
        source = yolo?.ok ? "claude_fallback" : "claude";
        species = claude.species;
        confidence = claude.confidence;
        reasoning = claude.reasoning;
        runnerUp = claude.runnerUp
          ? { species: claude.runnerUp.species, confidence: claude.runnerUp.confidence }
          : null;
      }
    }

    if (!species) {
      return NextResponse.json(
        {
          error: "no_match",
          reason: "Neither model could identify a species in this photo.",
          yoloPick,
        },
        { status: 422 }
      );
    }

    const card = buildCard(species);
    return NextResponse.json({
      card,
      confidence,
      runnerUp,
      source,
      reasoning,
      yoloPick,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "internal_error", detail: message }, { status: 500 });
  }
}
