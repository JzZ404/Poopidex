import { NextRequest, NextResponse } from "next/server";
import { ScatCard, findSpec, inferRarity } from "@/lib/types";
import { identifyWithClaude, ClaudePrediction } from "@/lib/claude";
import {
  UserHints,
  scoreSpecies,
  SizeBucket,
  ContentTag,
  HabitatTag,
  SPECIES_ATTRIBUTES,
} from "@/lib/speciesAttributes";

type ModelSource = "claude";

const YOLO_URL = process.env.YOLO_API_URL || "http://127.0.0.1:8001/predict";

type ModelPrediction = {
  ok: boolean;
  top?: { species: string; speciesRaw: string; confidence: number };
  runnerUp?: { species: string; speciesRaw: string; confidence: number } | null;
  all?: { species: string; confidence: number }[];
};

/* Per-species training-data reliability (validation counts as proxy).
   We trust CLIP's advisory vote ONLY for species above MIN_RELIABLE_SAMPLES.
   Below the threshold, CLIP's prediction on that species is noise. */
const CLIP_TRAIN_SAMPLES: Record<string, number> = {
  "Common Raccoon": 158,
  "Brown Bear": 57,
  "Fisher": 56,
  "Ringtail": 51,
  "Wild Boar": 42,
  "Moose": 41,
  "North American Porcupine": 30,
  "Striped Skunk": 26,
  "Bobcat": 23,
  "Mountain Lion": 19,
  "White-Tailed Deer": 12,
  "Pronghorn": 10,
  "Big-Eared Woodrat": 9,
  "Gray Wolf": 9,
  "North American River Otter": 5,
  "Red Fox": 4,
  "Coyote": 4,
  "American Beaver": 4,
  "American Bison": 3,
  "Black-Tailed Jackrabbit": 2,
};

const MIN_RELIABLE_SAMPLES = 20;

async function callYolo(file: File): Promise<ModelPrediction | null> {
  try {
    const upstream = new FormData();
    upstream.append("file", file, file.name || "upload.jpg");
    const res = await fetch(YOLO_URL, { method: "POST", body: upstream });
    if (!res.ok) return null;
    return (await res.json()) as ModelPrediction;
  } catch {
    return null;
  }
}

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

async function callClaude(
  file: File,
  hints?: UserHints,
  options?: {
    allowedSpecies?: string[];
    clipContext?: Array<{
      species: string;
      confidence: number;
      trainingSamples?: number;
    }>;
  }
): Promise<ClaudePrediction | null> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    return await identifyWithClaude(base64, mimeType, hints, options);
  } catch (err) {
    console.error("Claude call failed:", err);
    return null;
  }
}

function parseHints(form: FormData): UserHints {
  const size = (form.get("size") as string) || undefined;
  const habitat = (form.get("habitat") as string) || undefined;
  const contentsRaw = form.get("contents") as string | null;

  let contents: ContentTag[] | undefined;
  if (contentsRaw) {
    try {
      contents = JSON.parse(contentsRaw) as ContentTag[];
      if (!Array.isArray(contents) || contents.length === 0) contents = undefined;
    } catch {
      contents = undefined;
    }
  }

  return {
    size: size as SizeBucket | undefined,
    habitat: habitat as HabitatTag | undefined,
    contents,
  };
}

/* Step identifiers emitted by the streaming /api/identify response.
   Frontend (lib/identify.ts) listens for these and updates the progress UI
   in real time. ORDER MATTERS — these correspond to the StatusList steps. */
export type IdentifyStep =
  | "photo_received"
  | "hints_filtered"
  | "clip_done"
  | "claude_done"
  | "result";

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch (err) {
    return NextResponse.json(
      { error: "bad_form_data", detail: err instanceof Error ? err.message : String(err) },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const hints = parseHints(form);
  const hasHints = Boolean(
    hints.size ||
      hints.habitat ||
      (hints.contents && hints.contents.length > 0)
  );

  // ── Stream pipeline progress as NDJSON ──
  // Each event is one JSON line. Frontend reads the stream line-by-line and
  // updates the StatusList in lockstep with real backend progress.
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: { type: string; [k: string]: unknown }) => {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };

      try {
        // STEP 1 — request entered the server
        send({ type: "step", step: "photo_received" });

        // STEP 2 — compute hint-allowed species
        let allowedSpecies: string[] | undefined;
        if (hasHints) {
          const surviving = SPECIES_ATTRIBUTES
            .filter((a) => scoreSpecies(a.species, hints) > 0)
            .map((a) => a.species);
          if (surviving.length > 0) allowedSpecies = surviving;
        }
        send({ type: "step", step: "hints_filtered" });

        // STEP 3 — CLIP advisory vote
        let clipContext:
          | Array<{ species: string; confidence: number; trainingSamples: number }>
          | undefined;
        let yoloPick: { species: string; confidence: number } | null = null;
        const yolo = await callYolo(file);
        if (yolo?.ok && yolo.top && yolo.all) {
          yoloPick = { species: yolo.top.species, confidence: yolo.top.confidence };
          const filtered = yolo.all
            .filter((p) => (CLIP_TRAIN_SAMPLES[p.species] ?? 0) >= MIN_RELIABLE_SAMPLES)
            .filter((p) => !allowedSpecies || allowedSpecies.includes(p.species))
            .slice(0, 5)
            .map((p) => ({
              species: p.species,
              confidence: p.confidence,
              trainingSamples: CLIP_TRAIN_SAMPLES[p.species] ?? 0,
            }));
          if (filtered.length > 0) clipContext = filtered;
        }
        send({ type: "step", step: "clip_done" });

        // STEP 4 — Claude (the long one — typically 3-5s)
        const claude = await callClaude(file, hasHints ? hints : undefined, {
          allowedSpecies,
          clipContext,
        });

        let species: string | null = null;
        let confidence = 0;
        let runnerUp: { species: string; confidence: number } | null = null;
        let reasoning: string | undefined;
        const hintChangedTop = false;

        if (claude?.species) {
          species = claude.species;
          confidence = claude.confidence;
          reasoning = claude.reasoning;
          runnerUp = claude.runnerUp
            ? { species: claude.runnerUp.species, confidence: claude.runnerUp.confidence }
            : null;

          if (claude.analysis) {
            console.log(
              "\n────── Claude analysis ──────\n" +
                `species: ${species} (conf ${confidence})\n` +
                `runnerUp: ${runnerUp?.species ?? "—"}\n\n` +
                claude.analysis +
                "\n────────────────────────────\n"
            );
          }
        }
        send({ type: "step", step: "claude_done" });

        // STEP 5 — finalize
        if (!species) {
          send({
            type: "error",
            error: "no_match",
            reason: "Could not identify a species in this photo.",
            yoloPick,
          });
          controller.close();
          return;
        }

        const card = buildCard(species);
        send({
          type: "result",
          step: "result",
          payload: {
            card,
            confidence,
            runnerUp,
            source: "claude" as ModelSource,
            reasoning,
            yoloPick,
            hintChangedTop,
            hintsUsed: hasHints ? hints : null,
          },
        });
        controller.close();
      } catch (err) {
        send({
          type: "error",
          error: "internal_error",
          detail: err instanceof Error ? err.message : String(err),
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no", // disable proxy buffering so events arrive live
    },
  });
}

