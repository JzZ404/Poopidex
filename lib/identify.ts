import { ScatCard } from "./types";
import { mockIdentify } from "./mockIdentify";
import { UserHints } from "./speciesAttributes";

export type IdentifySource = "yolo" | "claude" | "claude_fallback" | "mock";

/* Pipeline-stage identifiers emitted by /api/identify. Matches the
   IdentifyStep type in app/api/identify/route.ts. */
export type IdentifyStep =
  | "photo_received"
  | "hints_filtered"
  | "clip_done"
  | "claude_done"
  | "result";

export interface IdentifyResult {
  card: ScatCard;
  confidence: number;
  runnerUp: { species: string; confidence: number } | null;
  source: IdentifySource;
  reasoning?: string;
  /* What CLIP/YOLO picked, surfaced even when Claude was the final decider */
  yoloPick?: { species: string; confidence: number } | null;
  /* True if the user's hints changed which species ranked highest */
  hintChangedTop?: boolean;
  hintsUsed?: UserHints | null;
  errorReason?: string;
}

/* Send photo + hints to /api/identify (streaming NDJSON).
   - `onStep(step)` fires each time the server completes a pipeline stage,
     so the UI can advance the progress indicator in real time.
   - Returns the final result once the "result" event arrives.
   - Falls back to mockIdentify on network errors or no-match. */
export async function identifyPhoto(
  file: File,
  imageDataUrl: string,
  hints: UserHints = {},
  onStep?: (step: IdentifyStep) => void
): Promise<IdentifyResult> {
  const form = new FormData();
  form.append("file", file);
  if (hints.size) form.append("size", hints.size);
  if (hints.habitat) form.append("habitat", hints.habitat);
  if (hints.contents && hints.contents.length > 0) {
    form.append("contents", JSON.stringify(hints.contents));
  }

  try {
    const res = await fetch("/api/identify", { method: "POST", body: form });

    // Non-OK status (4xx/5xx) — body is plain JSON, not a stream
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const fallback = await mockIdentify(imageDataUrl);
      return {
        card: fallback,
        confidence: 0,
        runnerUp: null,
        source: "mock",
        yoloPick: errBody.yoloPick ?? null,
        errorReason: errBody.error || `http_${res.status}`,
      };
    }

    // OK status — read NDJSON stream line-by-line
    if (!res.body) throw new Error("Response has no body to stream");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    let result: IdentifyResult | null = null;
    let errorEvent: { error: string; yoloPick?: { species: string; confidence: number } | null } | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete lines (NDJSON = one JSON object per line)
      let nl = buffer.indexOf("\n");
      while (nl >= 0) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        nl = buffer.indexOf("\n");
        if (!line) continue;

        try {
          const event = JSON.parse(line);
          if (event.type === "step" && event.step) {
            onStep?.(event.step as IdentifyStep);
          } else if (event.type === "result" && event.payload) {
            const data = event.payload;
            const card: ScatCard = { ...data.card, imageUrl: imageDataUrl };
            result = {
              card,
              confidence: data.confidence,
              runnerUp: data.runnerUp
                ? { species: data.runnerUp.species, confidence: data.runnerUp.confidence }
                : null,
              source: (data.source as IdentifySource) || "claude",
              reasoning: data.reasoning,
              yoloPick: data.yoloPick ?? null,
              hintChangedTop: data.hintChangedTop,
              hintsUsed: data.hintsUsed ?? null,
            };
            onStep?.("result");
          } else if (event.type === "error") {
            errorEvent = {
              error: event.error || "unknown",
              yoloPick: event.yoloPick ?? null,
            };
          }
        } catch {
          // Malformed line — ignore and keep reading.
        }
      }
    }

    if (result) return result;

    // No result emitted — fall back to mock + surface the error reason
    const fallback = await mockIdentify(imageDataUrl);
    return {
      card: fallback,
      confidence: 0,
      runnerUp: null,
      source: "mock",
      yoloPick: errorEvent?.yoloPick ?? null,
      errorReason: errorEvent?.error || "no_match",
    };
  } catch {
    const fallback = await mockIdentify(imageDataUrl);
    return {
      card: fallback,
      confidence: 0,
      runnerUp: null,
      source: "mock",
      errorReason: "network_error",
    };
  }
}
