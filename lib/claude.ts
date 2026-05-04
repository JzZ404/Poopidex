import Anthropic from "@anthropic-ai/sdk";
import { CardData } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function identifyScat(imageBase64: string, mimeType: string): Promise<CardData> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [
      {
        name: "generate_poopidex_card",
        description: "Generate a Poopidex collector card from a scat image",
        input_schema: {
          type: "object" as const,
          properties: {
            species: { type: "string" },
            species_scientific: { type: "string" },
            rarity: { type: "string", enum: ["common", "uncommon", "rare", "legendary"] },
            freshness: { type: "string" },
            fun_fact: { type: "string" },
            illustration_variant: { type: "string" },
            conservation_flag: { type: "boolean" },
            conservation_note: { type: ["string", "null"] },
            stats: {
              type: "object",
              properties: {
                size: { type: "number", minimum: 1, maximum: 10 },
                smell: { type: "number", minimum: 1, maximum: 10 },
                danger: { type: "number", minimum: 1, maximum: 10 },
              },
              required: ["size", "smell", "danger"],
            },
          },
          required: ["species", "species_scientific", "rarity", "freshness", "fun_fact", "illustration_variant", "conservation_flag", "conservation_note", "stats"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "generate_poopidex_card" },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mimeType as "image/jpeg", data: imageBase64 } },
          { type: "text", text: "Identify this scat and generate a Poopidex collector card." },
        ],
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") throw new Error("No tool use in response");
  return toolUse.input as CardData;
}
