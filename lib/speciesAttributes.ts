/* Species attributes for filter-based disambiguation.
   When the user provides hints (size, contents, habitat),
   re-rank the model's predictions to prefer species that match.

   Covers the 19 species the CLIP model knows about (no Ruffed Grouse yet). */

export type SizeBucket = "tiny" | "small" | "medium" | "large";
//                         <1"     1–3"      3–6"      6"+

export type ContentTag =
  | "berries_seeds"
  | "fur_hair"
  | "bone"
  | "insects"
  | "grass_plant"
  | "smooth_digested";

export type HabitatTag =
  | "forest"
  | "desert"
  | "urban"
  | "mountains";

export interface SpeciesAttributes {
  species: string;            // matches CLIP class name (with spaces)
  sizes: SizeBucket[];
  contents: ContentTag[];                      // typical contents — soft match bonus
  habitats: HabitatTag[];
  /* Hard-exclude rules — contents this species biologically CANNOT produce.
     Pure herbivores can't have bone/fur. Strict aquatic herbivores can't have
     insects. Used by scoreSpecies() to zero out the species when matched. */
  forbiddenContents?: ContentTag[];
}

/* Data for the 20 species the model identifies. */
export const SPECIES_ATTRIBUTES: SpeciesAttributes[] = [
  // ───── Megafauna / carnivores (10) ─────
  {
    species: "Brown Bear",
    sizes: ["large"],                              // 7–15"
    contents: ["berries_seeds", "grass_plant", "fur_hair", "bone"],
    habitats: ["forest", "mountains"],
  },
  {
    species: "Mountain Lion",
    sizes: ["medium", "large"],                    // 4–6"
    contents: ["fur_hair", "bone"],
    habitats: ["forest", "desert", "mountains"],
    forbiddenContents: ["berries_seeds", "grass_plant", "smooth_digested", "insects"],
  },
  {
    species: "Bobcat",
    sizes: ["medium"],                             // 3–5"
    contents: ["fur_hair", "bone"],
    habitats: ["forest", "desert"],
    forbiddenContents: ["berries_seeds", "grass_plant", "smooth_digested", "insects"],
  },
  {
    species: "Gray Wolf",
    sizes: ["large"],                              // 6"+
    contents: ["fur_hair", "bone"],
    habitats: ["forest", "mountains"],
    forbiddenContents: ["berries_seeds", "grass_plant", "smooth_digested", "insects"],
  },
  {
    species: "Coyote",
    sizes: ["small", "medium"],                    // 2–4"
    contents: ["fur_hair", "bone", "berries_seeds"],
    habitats: ["forest", "desert", "urban"],
  },
  {
    species: "Red Fox",
    sizes: ["small", "medium"],                    // 2–3"
    contents: ["fur_hair", "bone", "berries_seeds"],
    habitats: ["forest", "urban"],
  },
  {
    species: "Fisher",
    sizes: ["small", "medium"],                    // 2–4"
    contents: ["fur_hair", "bone"],
    habitats: ["forest"],
    forbiddenContents: ["berries_seeds", "grass_plant", "smooth_digested"],
    // insects OK — small prey may include insect-eaters
  },
  {
    species: "Common Raccoon",
    sizes: ["small", "medium"],                    // 2–3"
    contents: ["berries_seeds", "insects"],
    habitats: ["forest", "urban"],
  },
  {
    species: "Striped Skunk",
    sizes: ["small", "medium"],                    // 1–3"
    contents: ["insects", "grass_plant"],
    habitats: ["forest", "urban"],
  },
  {
    species: "Ringtail",
    sizes: ["small"],                              // 1–2"
    contents: ["insects", "berries_seeds"],
    habitats: ["desert", "forest"],
    forbiddenContents: ["fur_hair", "bone", "grass_plant"],
    // Primarily insect/fruit eater — vertebrate prey extremely rare; never grazes
  },

  // ───── Ungulates / herbivores (5) ─────
  {
    species: "Moose",
    sizes: ["small"],                              // 1–1.5" pellets (small bucket = 1–3")
    contents: ["grass_plant", "smooth_digested"],
    habitats: ["forest", "mountains"],
    forbiddenContents: ["bone", "fur_hair", "insects"],
  },
  {
    species: "White-Tailed Deer",
    sizes: ["tiny"],                               // 0.5–1" pellets
    contents: ["grass_plant", "smooth_digested"],
    habitats: ["forest"],
    forbiddenContents: ["bone", "fur_hair", "insects"],
  },
  {
    species: "Pronghorn",
    sizes: ["tiny", "small"],                      // small pellets in piles
    contents: ["grass_plant", "smooth_digested"],
    habitats: ["desert"],                          // open plains/sage — not forest
    forbiddenContents: ["bone", "fur_hair", "insects"],
  },
  {
    species: "American Bison",
    sizes: ["large"],                              // huge grass clumps
    contents: ["grass_plant"],
    habitats: ["forest"],                          // no `plains` tag exists — gap
    forbiddenContents: ["bone", "fur_hair", "insects"],
  },
  {
    species: "Wild Boar",
    sizes: ["medium", "large"],                    // tubular piles
    contents: ["berries_seeds", "grass_plant"],
    habitats: ["forest", "urban"],
    // Wild boars are omnivorous (eat small animals, insects, carrion) — no forbidden contents
  },

  // ───── Specialists (4) ─────
  {
    species: "North American River Otter",
    sizes: ["small", "medium"],                    // 2–4"
    contents: ["fur_hair", "bone"],                // fish scales / bones — chunky, not smooth
    habitats: ["forest"],                          // ~ near water
    forbiddenContents: ["berries_seeds", "grass_plant", "smooth_digested"],
    // Strictly piscivorous/carnivorous — no plant matter; insects OK (aquatic invertebrates)
  },
  {
    species: "American Beaver",
    sizes: ["small", "medium"],                    // 1–2.5"
    contents: ["grass_plant", "smooth_digested"],  // wood-chip filled
    habitats: ["forest"],                          // ~ near water
    forbiddenContents: ["bone", "fur_hair", "insects"],
  },
  {
    species: "North American Porcupine",
    sizes: ["tiny", "small"],                      // 0.5–1.5" pellets
    contents: ["grass_plant"],
    habitats: ["forest", "mountains"],
    forbiddenContents: ["bone", "fur_hair", "insects"],
  },
  {
    species: "Black-Tailed Jackrabbit",
    sizes: ["tiny"],                               // ~0.5" round pellets
    contents: ["grass_plant"],
    habitats: ["desert", "forest"],
    forbiddenContents: ["bone", "fur_hair", "insects"],
  },
  {
    species: "Big-Eared Woodrat",
    sizes: ["tiny"],                               // small pellets near nest
    contents: ["berries_seeds", "grass_plant"],
    habitats: ["forest", "desert"],
    forbiddenContents: ["bone", "fur_hair"],
  },
];

/* Human labels for the UI form — short, emoji-led, ordered for 2×2 layout */
export const SIZE_LABELS: Record<SizeBucket, string> = {
  tiny:   "🪙 Tiny · < 1\"",
  small:  "🥚 Small · 1–3\"",
  medium: "🥊 Medium · 3–6\"",
  large:  "🐻 Big · 6\"+",
};

export const CONTENT_LABELS: Record<ContentTag, string> = {
  berries_seeds:   "🍇 Berries / seeds",
  fur_hair:        "🐭 Fur / hair",
  bone:            "🦴 Bone fragments",
  insects:         "🦗 Insect parts",
  grass_plant:     "🌿 Grass / plants",
  smooth_digested: "✨ Smooth / digested",
};

export const HABITAT_LABELS: Record<HabitatTag, string> = {
  forest:    "🌲 Forest",
  desert:    "🏜️ Desert",
  urban:     "🏘️ Urban",
  mountains: "🏔️ Mountains",
};

/* User hints from the form. All optional. */
export interface UserHints {
  size?: SizeBucket;
  contents?: ContentTag[];
  habitat?: HabitatTag;
}

export function getSpeciesAttributes(species: string): SpeciesAttributes | undefined {
  return SPECIES_ATTRIBUTES.find((s) => s.species === species);
}

/* Score how well a species matches the user's hints.
   Returns a multiplier applied to the model's confidence.

   - Size mismatch → 0 (hard-exclude). Size is the most reliable hint a user
     can give — they can literally measure it.
   - Habitat mismatch → 0 (hard-exclude). A desert specialist can't show up
     in a forest photo and vice versa.
   - forbiddenContents match → 0 (hard-exclude). A pure herbivore biologically
     cannot produce bone/fur scat. If user spots bone, no herbivore can win.
   - Other contents match → soft bonus (× 1.3); mismatch → soft penalty (× 0.85).
   - All missing hints → 1.0 (no change).
*/
export function scoreSpecies(species: string, hints: UserHints): number {
  const attrs = getSpeciesAttributes(species);
  if (!attrs) return 1.0;

  // ── Hard filters ──
  if (hints.size && !attrs.sizes.includes(hints.size)) return 0;
  if (hints.habitat && !attrs.habitats.includes(hints.habitat)) return 0;

  // Biologically impossible contents — pure herbivore can't have fur/bone, etc.
  if (hints.contents && attrs.forbiddenContents) {
    for (const c of hints.contents) {
      if (attrs.forbiddenContents.includes(c)) return 0;
    }
  }

  // ── Soft scoring ──
  let mult = 1.0;

  if (hints.size) mult *= 1.5;
  if (hints.habitat) mult *= 1.3;

  if (hints.contents && hints.contents.length > 0) {
    for (const c of hints.contents) {
      mult *= attrs.contents.includes(c) ? 1.3 : 0.85;
    }
  }

  return mult;
}
