import { ScatCard } from "./types";
import { mockIdentify } from "./mockIdentify";

export type IdentifySource = "yolo" | "claude" | "claude_fallback" | "mock";

export interface IdentifyResult {
  card: ScatCard;
  confidence: number;
  runnerUp: { species: string; confidence: number } | null;
  source: IdentifySource;
  reasoning?: string;
  /* What YOLO picked, surfaced even when Claude was the final decider */
  yoloPick?: { species: string; confidence: number } | null;
  errorReason?: string;
}

/* Send the photo to our /api/identify endpoint (which forwards to the YOLO server).
   Falls back to mockIdentify if the API is unreachable, so the UI keeps working
   even when the Python server is offline. */
export async function identifyPhoto(
  file: File,
  imageDataUrl: string
): Promise<IdentifyResult> {
  const form = new FormData();
  form.append("file", file);

  try {
    const res = await fetch("/api/identify", { method: "POST", body: form });

    if (res.ok) {
      const data = await res.json();
      const card: ScatCard = { ...data.card, imageUrl: imageDataUrl };
      return {
        card,
        confidence: data.confidence,
        runnerUp: data.runnerUp
          ? { species: data.runnerUp.species, confidence: data.runnerUp.confidence }
          : null,
        source: (data.source as IdentifySource) || "yolo",
        reasoning: data.reasoning,
        yoloPick: data.yoloPick ?? null,
      };
    }

    const errBody = await res.json().catch(() => ({}));

    // 422 = model returned nothing or nothing supported. Fall back to mock so
    // the UX flow still completes (better than dead-ending the user).
    if (res.status === 422) {
      const fallback = await mockIdentify(imageDataUrl);
      return {
        card: fallback,
        confidence: 0,
        runnerUp: null,
        source: "mock",
        yoloPick: errBody.yoloPick ?? null,
        errorReason: errBody.error || "no_match",
      };
    }

    // 502/500 — server down. Fall back to mock and tell the caller.
    const fallback = await mockIdentify(imageDataUrl);
    return {
      card: fallback,
      confidence: 0,
      runnerUp: null,
      source: "mock",
      errorReason: errBody.error || `http_${res.status}`,
    };
  } catch {
    // Network error — Python server probably not running.
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
