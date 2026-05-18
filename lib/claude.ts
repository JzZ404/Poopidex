import Anthropic from "@anthropic-ai/sdk";

/* Claude Vision-based scat identification.
   Used as a fallback when YOLO confidence is low (general-purpose vision
   often beats a small specialized model on out-of-distribution photos).

   Constrains Claude to the 101 species the AnimalClue model knows, so the
   two systems are directly comparable. */

export const ANIMALCLUE_SPECIES = [
  "African Civet", "African Clawless Otter", "African Leopard",
  "American Alligator", "American Beaver", "American Bison",
  "American Black Bear", "American Mink", "American Pika",
  "American Robin", "Bare-nosed Wombat", "Barn Owl",
  "Big-eared Woodrat", "Bighorn Sheep", "Black Grouse",
  "Black Phoebe", "Black-tailed Jackrabbit", "Blue Wildebeest",
  "Bobcat", "Brown Bear", "Brown Hare", "Brown Hyaena",
  "Brown Rat", "Burrowing Owl", "Bush Duiker", "Bushpig",
  "California Ground Squirrel", "California Quail", "Canada Goose",
  "Cape Buffalo", "Cape Clawless Otter", "Cape Duiker", "Cape Eland",
  "Cape Grey Mongoose", "Cape Porcupine", "Caracal", "Caribou",
  "Chacma Baboon", "Common Brushtail Possum", "Common Eland",
  "Common Hedgehog", "Common Hippopotamus", "Common Ostrich",
  "Common Raccoon", "Common Raven", "Common Slender Mongoose",
  "Coyote", "Desert Iguana", "Domestic Cat", "Domestic Cattle",
  "Domestic Dog", "Domestic Goat", "Domestic Horse", "Donkey",
  "Eastern Cottontail", "Eastern Wolf", "European Badger",
  "European Bison", "European Rabbit", "Feral Pigeon", "Fisher",
  "Gray Fox", "Gray Wolf", "Greater Cane Rat", "Greater Roadrunner",
  "Greater Sage-Grouse", "Hazel Grouse", "Impala", "Indian Elephant",
  "Island Fox", "Kit Fox", "Klipspringer", "Leopard Tortoise",
  "Marsh Mongoose", "Mojave Desert Tortoise", "Moose", "Mountain Lion",
  "Mourning Dove", "Mule Deer", "Muskrat", "North American Porcupine",
  "North American River Otter", "Northern Flicker", "Plains Zebra",
  "Pronghorn", "Red Fox", "Ringtail", "Ruffed Grouse",
  "Savanna Elephant", "Scrub Hare", "Striped Skunk", "Wapiti",
  "Western Fence Lizard", "Western Gray Squirrel", "Western Toad",
  "White-tailed Deer", "Wild Boar", "Wild Turkey", "Yellow-bellied Marmot",
];

export interface ClaudePrediction {
  species: string | null;
  confidence: number;
  reasoning: string;
  runnerUp: { species: string; confidence: number } | null;
}

export async function identifyWithClaude(
  imageBase64: string,
  mimeType: string
): Promise<ClaudePrediction> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const speciesList = ANIMALCLUE_SPECIES.map((s) => `- ${s}`).join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [
      {
        name: "identify_scat",
        description:
          "Identify the animal species that produced this scat. Choose only from the provided species list. If the image is not a clear photo of scat, set species to null.",
        input_schema: {
          type: "object" as const,
          properties: {
            species: {
              type: ["string", "null"],
              enum: [...ANIMALCLUE_SPECIES, null],
              description:
                "Most likely species. null if the image is not a photo of scat or you cannot identify it.",
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
                "One short sentence explaining what visual cues led to the identification (shape, size, contents, location, etc.).",
            },
            runnerUp: {
              type: ["object", "null"],
              properties: {
                species: { type: "string", enum: ANIMALCLUE_SPECIES },
                confidence: { type: "number", minimum: 0, maximum: 1 },
              },
              required: ["species", "confidence"],
            },
          },
          required: ["species", "confidence", "reasoning", "runnerUp"],
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
              "Identify the animal species that produced this scat. Use shape, size, contents, color, and any other visual cues. Return the most likely species from the list, your confidence, brief reasoning, and a runner-up if there's a close second.",
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
