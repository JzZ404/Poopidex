import Anthropic from "@anthropic-ai/sdk";
import type { UserHints } from "./speciesAttributes";
import { SIZE_LABELS, CONTENT_LABELS, HABITAT_LABELS } from "./speciesAttributes";
import { SPECIES_LIST } from "./types";

/* Claude Vision-based scat identification.
   Used as a fallback when CLIP confidence is low or when user hints exclude
   every CLIP candidate.

   Claude is restricted to the 20 species in the Poopidex — same list as CLIP.
   This guarantees Claude never returns something the app doesn't have a card,
   art file, or rarity for (e.g. previously could return Brown Rat / Domestic
   Cat / Eastern Cottontail). If a photo is genuinely an out-of-set species,
   Claude picks the closest of our 20 — which is what a Poopidex should do. */

export const POOPIDEX_SPECIES: string[] = SPECIES_LIST.map((s) => s.species);

/* System prompt — Claude's "memory" of the 20 species and how to discriminate
   between them. Constraining to 20 candidates with explicit confusion-group
   guidance is the highest-leverage prompt fix (per cross-LLM diagnosis: the
   model has the visual capability, it just needs the cheat sheet + process). */
const SYSTEM_PROMPT = `You are an experienced wildlife biologist identifying scat from photos. Your task is to identify the species from a fixed list of 20. You have a structured cheat sheet and a strict process.

## The 20 Candidate Species (with key visual signatures)

LEGENDARY:
- Brown Bear — large blob/tubular (6"+), varied contents (berries, salmon scales, plant matter, fur), forest/mountains
- Gray Wolf — large rope-like (6"+) with TWISTED TAPERED ENDS, densely packed with fur, no plant matter, forest/mountains
- Mountain Lion — medium-large segmented tubular, fur + bone fragments, often partially buried/scratched, forest/desert/mountains
- Moose — small oval/acorn pellets (1–1.5"), woody/fibrous, in piles, forest/mountains
- American Bison — large grass clumps (6"+), pure plant fiber, open plains

RARE:
- Bobcat — medium (3–5") segmented tubular, fur + bone, often covered with debris, forest/desert
- Fisher — small/medium (2–4"), fur + bone, FOREST ONLY (not desert)
- Pronghorn — tiny–small oval pellets, dropped in piles, pure plant, DESERT/open country
- North American River Otter — small/medium (2–4"), fish scales + bones, NEAR WATER
- Ringtail — small (1–2"), INSECT PARTS + fruit/seeds, no fur/bone, desert/forest

UNCOMMON:
- North American Porcupine — tiny–small (0.5–1.5") oval pellets, often CURVED/banana-shaped, pure plant, forest/mountains
- American Beaver — small/medium (1–2.5"), WOOD CHIPS visible (sawdust-like), near water
- Big-Eared Woodrat — tiny pellets near nest middens, plant + seeds, desert/forest
- Wild Boar — medium/large amorphous piles (3"+), varied content (omnivore), forest/urban
- Black-Tailed Jackrabbit — tiny (~0.5") PERFECTLY ROUND/SPHERICAL pellets, pure plant, desert

COMMON:
- Coyote — small/medium tubular (3–4"), fur + bone, often with berries/seeds mixed in, forest/desert/urban
- Red Fox — small tubular (1–2.5") — clearly SMALLER than Coyote, fur + bone, forest/urban
- Common Raccoon — small/medium tubular (2–3"), BERRY SEEDS visible, often loose, urban/forest
- Striped Skunk — small (1–3"), INSECT PARTS visible (beetle wings, exoskeleton), urban/forest
- White-Tailed Deer — tiny (0.5–1") oval/acorn pellets, smooth surface, pure plant, forest/urban

## Color Cues (diagnostic — DO NOT IGNORE)

Color is a strong diagnostic signal. Always note the dominant color of the scat in your analysis:

- **REDDISH / ORANGE / RUSTY** → strongly suggests Red Fox (foxes eat rosehips, hawthorn, currants — their scat often has a reddish-orange tint, especially when berry-heavy). Also possible: Brown Bear after eating red berries.
- **PURPLE / BLUE-BLACK** → fruit-eater — usually Common Raccoon (mulberries, grapes), sometimes Brown Bear (huckleberries, blueberries).
- **VERY DARK BROWN / BLACK** → meat-heavy carnivore diet. Typical for Gray Wolf (almost always pitch black with fur), Coyote, Mountain Lion, Bobcat, Fisher. NOT a Bear signature (Bears have varied diet → varied colors).
- **TAN / LIGHT BROWN / GREY** → pure herbivore. Dried Jackrabbit pellets, Pronghorn pellets, sometimes Porcupine.
- **GREEN-BROWN / KHAKI** → fresh grass eater. Bison (fresh), Moose (fresh), Deer (fresh). Turns darker as it ages.
- **YELLOW-TAN with VISIBLE FIBERS / WOOD CHIPS** → Beaver (chewed wood chips visible in the scat itself).
- **SILVER / IRIDESCENT SCALES** → River Otter (fish scales reflecting light).
- **DARK BROWN with WHITE FLECKS (insect exoskeleton)** → Striped Skunk (or Ringtail).
- **DARK BROWN with VISIBLE BERRY SEEDS** → Common Raccoon (or Coyote/Fox eating fruit).

Red Fox specifically is notable because most other canid scat (Coyote, Wolf) is dark brown to black — a reddish/orange tint is a strong Fox signal even without a size reference.

## Confusion Groups (the disambiguation problems)

These groups share gross morphology. You MUST consciously work through them when applicable:

1. CANID SIZE LADDER → Wolf (6"+) > Coyote (3–4") > Fox (1–2.5"). All produce rope-like tubular scat with fur/bone. ONLY SIZE distinguishes them. Use any scale reference in the photo or the user's size hint. COLOR can also help — Red Fox often reddish/orange, Wolf almost always pitch black.

2. BEAR vs WOLF (both large) → Bear: blob-like or thick tubular, segmented, varied content (berries, plants, fur, salmon), COLOR VARIES (brown, purple, black, green depending on diet). Wolf: rope-like with TWISTED TAPERED ENDS, densely fur-packed, no plant matter, ALMOST ALWAYS PITCH BLACK. Bear is "messy/varied", Wolf is "clean black rope".

3. CAT-LIKE CARNIVORES → Mountain Lion (large, covered, often scratched), Bobcat (medium, covered), Fisher (small/medium, forest only, never covered). Cats often have BURIED/SCRATCHED appearance; Fisher does not. All typically dark brown to black.

4. SMALL PELLET HERBIVORES → Jackrabbit (PERFECTLY ROUND spheres, TAN when dried), Deer (oval/acorn, DARK BROWN), Pronghorn (oval, desert/plains, brown), Porcupine (oval but CURVED/banana, sometimes YELLOWISH), Woodrat (tiny near nest, dark brown). Shape AND color discriminate within this group.

5. MOOSE vs JACKRABBIT (both pellet piles) → Moose pellets are oval ~1" and DARK brown/black. Jackrabbit are round ~0.5" and lighter tan. Size + shape + color are the discriminators.

6. URBAN OMNIVORES → Raccoon (fruit SEEDS visible, often purple/blue-black), Skunk (INSECT PARTS visible, dark with white flecks). Color + content discriminate.

7. WATER SPECIALISTS → Otter (fish scales + bones, FISHY appearance, often with iridescent scales), Beaver (WOOD CHIPS, sawdust texture, tan-yellow fibers visible). Content + color discriminate.

## Process (Walk through this every single time)

1. DESCRIBE: What is the shape (round/oval/tubular/blob/rope)? Size relative to objects in frame? Surface texture? **DOMINANT COLOR** (and any unusual tints — red, orange, purple, green, yellow, etc.)? Visible contents (bone, fur, plant matter, seeds, insect parts, wood chips, fish scales)? Surroundings (forest floor, sand, gravel, snow, near water)?

2. SHORTLIST: From the 20, which 2–3 candidates are visually most plausible?

3. APPLY CONFUSION GROUPS: For each shortlist candidate, which confusion group does it sit in? Use the disambiguator for that group.

4. ELIMINATE: Write explicit "Why not X" sentences for each rejected candidate. Be specific about the visual feature that rules each one out.

5. COMMIT: Pick the species whose distinguishing features best match what you actually see. Do not default to the more "prototypical" or "common" species (e.g. do not default to Brown Bear on any large carnivore scat — check for Wolf-specific features first).

## Output

Use the identify_scat tool. The 'analysis' field MUST contain steps 1–4 explicitly (this is your reasoning scratchpad — be thorough). The 'reasoning' field must be ONE concise sentence for the user-facing card.`;

export interface ClaudePrediction {
  species: string | null;
  confidence: number;
  /* The long-form chain-of-thought analysis. Forces Claude to deliberate
     (compare candidates, justify eliminations) before committing. NOT shown
     to the user — kept server-side for logs/debug. */
  analysis: string;
  /* Short user-facing summary. ONE sentence. */
  reasoning: string;
  runnerUp: { species: string; confidence: number } | null;
}

/* Build a one-line description of the user's hints to inject into Claude's
   prompt. Helps Claude reconcile the photo with what the user actually
   observed in person — particularly useful when CLIP's hint-filtered ranking
   excluded every species (i.e. our re-ranker hit a contradiction). */
function formatHints(hints?: UserHints): string {
  if (!hints) return "";
  const parts: string[] = [];
  if (hints.size) parts.push(`size: ${SIZE_LABELS[hints.size]}`);
  if (hints.habitat) parts.push(`habitat: ${HABITAT_LABELS[hints.habitat]}`);
  if (hints.contents && hints.contents.length > 0) {
    const cs = hints.contents.map((c) => CONTENT_LABELS[c]).join(", ");
    parts.push(`visible contents: ${cs}`);
  }
  if (parts.length === 0) return "";
  return `\n\nThe user reported these observations from the actual scat on-site (trust these — they were there): ${parts.join(" · ")}.`;
}

/* Format the CLIP context — the specialist model's top probabilities — into
   text Claude can reason about. CLIP is just a low-weight advisor: only
   species CLIP was reliably trained on are shown, and each entry includes
   its training-sample count so Claude can judge reliability. */
function formatClipContext(
  clipContext?: Array<{ species: string; confidence: number; trainingSamples?: number }>
): string {
  if (!clipContext || clipContext.length === 0) return "";
  const lines = clipContext
    .map((c, i) => {
      const samples = c.trainingSamples ? ` · trained on ${c.trainingSamples} photos` : "";
      return `  ${i + 1}. ${c.species} — ${(c.confidence * 100).toFixed(1)}%${samples}`;
    })
    .join("\n");
  return (
    `\n\nADVISORY (low weight) — a small specialist vision model (CLIP fine-tuned on ~700 scat photos) ranked the candidates as:\n${lines}\n\n` +
    `This is just FYI from a model with significant limitations: severely imbalanced training data biases it toward common species (Raccoon/Bear/Moose), it can't perceive size or context outside the frame, and it has only ~63% top-1 accuracy. ` +
    `You are the decider. Trust the photo and the user's observations first; let the specialist's vote nudge you only if you're already on the fence.`
  );
}

export interface IdentifyClaudeOptions {
  /* If provided, restrict Claude's species pick to this subset (e.g. only
     species that survived the user's hint hard-filters). */
  allowedSpecies?: string[];
  /* CLIP's ranked predictions (filtered to allowed + reliable species).
     Each entry can include a trainingSamples count so Claude knows how
     reliable each prediction is. */
  clipContext?: Array<{ species: string; confidence: number; trainingSamples?: number }>;
}

export async function identifyWithClaude(
  imageBase64: string,
  mimeType: string,
  hints?: UserHints,
  options?: IdentifyClaudeOptions
): Promise<ClaudePrediction> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Restrict tool enum to allowed species when provided; else all 20.
  const speciesEnum =
    options?.allowedSpecies && options.allowedSpecies.length > 0
      ? options.allowedSpecies
      : POOPIDEX_SPECIES;

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    // Note: Anthropic disallows extended `thinking` when tool_choice forces
    // tool use (which we need — the schema is how we get structured output).
    // Instead we use a required `analysis` field as an in-schema chain-of-thought
    // scratchpad + the SYSTEM_PROMPT cheat sheet for cross-species comparison.
    tools: [
      {
        name: "identify_scat",
        description:
          "Identify the animal species that produced this scat. Choose only from the provided species list. If the image is not a clear photo of scat, set species to null.",
        input_schema: {
          type: "object" as const,
          properties: {
            analysis: {
              type: "string",
              description:
                "Internal deliberation scratchpad — REQUIRED to be filled before committing to a species. Walk through this explicitly:\n" +
                "  (1) Describe what you see in the photo: shape (round/oval/tubular/blob/rope), size relative to objects in frame, surface texture (segmented, fibrous, smooth, hairy), color, visible contents (bone/fur/plant matter/seeds/insect parts), and surroundings.\n" +
                "  (2) Identify the 2-3 species from the allowed list that are visually most plausible. For each, note what would CONFIRM it and what would RULE IT OUT.\n" +
                "  (3) Eliminate candidates one by one with 'Why not X: …' statements based on what you actually see in the photo.\n" +
                "  (4) Be specifically careful with similar-shape pairs: Bear ↔ Wolf (Bear is large blob/tubular with varied contents; Wolf is large rope-like with twisted tapered ends densely packed with fur), Moose ↔ Jackrabbit (Moose pellets ~1\" oval, Jackrabbit pellets ~0.5\" perfectly round), Coyote ↔ Fox (size — Coyote 3-4\", Fox 1-2.5\"), Raccoon ↔ Skunk (Skunk more insect content).\n" +
                "Do NOT default to the more 'common' species — be specific about what the photo actually shows.",
            },
            species: {
              type: ["string", "null"],
              enum: [...speciesEnum, null],
              description:
                "Final species pick. Must be consistent with your analysis above. null if the image is not a photo of scat.",
            },
            confidence: {
              type: "number",
              minimum: 0,
              maximum: 1,
              description: "Your confidence in the identification, from 0 to 1.",
            },
            reasoning: {
              type: "string",
              description:
                "Short USER-FACING summary — ONE concise sentence (this is what they'll read on the card). Don't restate your full analysis here; just the key cue that led to your pick. Example: 'Rope-like coil with dense fur and twisted tapered end — classic Gray Wolf signature.'",
            },
            runnerUp: {
              type: ["object", "null"],
              properties: {
                species: { type: "string", enum: speciesEnum },
                confidence: { type: "number", minimum: 0, maximum: 1 },
              },
              required: ["species", "confidence"],
            },
          },
          required: ["analysis", "species", "confidence", "reasoning", "runnerUp"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "identify_scat" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text:
              "Identify the species in this scat photo. Walk through your usual process (describe → shortlist → apply confusion groups → eliminate → commit) in the analysis field." +
              formatHints(hints) +
              formatClipContext(options?.clipContext),
          },
        ],
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use response");
  }
  return toolUse.input as ClaudePrediction;
}
