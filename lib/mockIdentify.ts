import { ScatCard, SPECIES_LIST } from "./types";

/* Mock species identifier. Picks a random species from SPECIES_LIST and
   builds a card. Replace with real Claude call once model is finalized. */
export async function mockIdentify(imageDataUrl: string): Promise<ScatCard> {
  await new Promise((r) => setTimeout(r, 2400));

  const spec = SPECIES_LIST[Math.floor(Math.random() * SPECIES_LIST.length)];
  const freshnessOpts = ["< 1 hour", "2–4 hours", "1+ day"];
  const freshness = freshnessOpts[Math.floor(Math.random() * freshnessOpts.length)];
  const variants = ["A — Standard", "B — Foraging", "C — Resting"];
  const variant = variants[Math.floor(Math.random() * variants.length)];

  const now = new Date();
  const identifiedAt = now.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(",", " ·");

  const serial = String(Math.floor(Math.random() * 200) + 1).padStart(3, "0");

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
    imageUrl: imageDataUrl,
  };
}
