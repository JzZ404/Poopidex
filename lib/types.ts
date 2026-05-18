export type Rarity = "Common" | "Uncommon" | "Rare" | "Legendary";

export interface ScatCard {
  species: string;
  speciesScientific: string;
  rarity: Rarity;
  freshness: string;
  funFact: string;
  illustrationVariant: string;
  conservationFlag: boolean;
  conservationNote?: string;
  stats: { size: number; smell: number; danger: number };
  identifiedAt: string;
  location: string;
  coords: string;
  serial: string;
  imageUrl?: string;
  artUrl?: string;
}

export interface CollectionEntry {
  id: string;
  card: ScatCard;
  collectedAt: string;
}

/* Locked species list — drives Claude prompt + Collection grid + illustration mapping.
   Edit this list to add/remove species; art file must exist at /art/<artFile>. */
export interface SpeciesSpec {
  species: string;
  speciesScientific: string;
  rarity: Rarity;
  artFile: string;
  conservationFlag: boolean;
  conservationNote?: string;
  defaultFunFact: string;
  defaultStats: { size: number; smell: number; danger: number };
}

export const SPECIES_LIST: SpeciesSpec[] = [
  {
    species: "Brown Bear",
    speciesScientific: "Ursus arctos",
    rarity: "Legendary",
    artFile: "brown_bear.png",
    conservationFlag: true,
    conservationNote: "Threatened in lower-48 states. Sightings valuable to USFWS.",
    defaultFunFact: "Brown bears can identify over 80 different berry species by smell alone.",
    defaultStats: { size: 9, smell: 8, danger: 9 },
  },
  {
    species: "Coyote",
    speciesScientific: "Canis latrans",
    rarity: "Rare",
    artFile: "coyote.png",
    conservationFlag: false,
    defaultFunFact: "Coyote scat often contains fur and bone fragments — visible signs of a mesopredator diet.",
    defaultStats: { size: 5, smell: 7, danger: 4 },
  },
  {
    species: "Red Fox",
    speciesScientific: "Vulpes vulpes",
    rarity: "Uncommon",
    artFile: "red_fox.png",
    conservationFlag: false,
    defaultFunFact: "Foxes use scent posts to mark territory edges, often on raised objects.",
    defaultStats: { size: 4, smell: 6, danger: 2 },
  },
  {
    species: "Raccoon",
    speciesScientific: "Procyon lotor",
    rarity: "Uncommon",
    artFile: "raccoon.png",
    conservationFlag: false,
    defaultFunFact: "Raccoons designate communal latrines — multiple raccoons use one spot over months.",
    defaultStats: { size: 4, smell: 7, danger: 3 },
  },
  {
    species: "Striped Skunk",
    speciesScientific: "Mephitis mephitis",
    rarity: "Common",
    artFile: "skunk.png",
    conservationFlag: false,
    defaultFunFact: "Skunk scat is often loaded with insect exoskeletons — they're voracious bug hunters.",
    defaultStats: { size: 3, smell: 10, danger: 5 },
  },
];

/* Map: species common name → art file path (relative to /public).
   Species not in this map render with the placeholder graphic in ScatCard. */
export const ART_BY_SPECIES: Record<string, string> = Object.fromEntries(
  SPECIES_LIST.map((s) => [s.species, `/art/${s.artFile}`])
);

/* Pick a sensible default rarity for species we haven't explicitly classified.
   Charismatic megafauna are Legendary; common backyard animals are Common.
   Tweak as needed when you add more illustrations. */
const LEGENDARY_FALLBACK = new Set([
  "Gray Wolf", "Eastern Wolf", "Mountain Lion", "American Black Bear",
  "Moose", "Wapiti", "African Leopard", "Indian Elephant", "Savanna Elephant",
  "Common Hippopotamus", "Caracal",
]);
const RARE_FALLBACK = new Set([
  "Bobcat", "Fisher", "American Beaver", "North American River Otter",
  "Wolverine", "Pronghorn", "Caribou", "Ringtail", "Plains Zebra",
  "Cape Eland", "Blue Wildebeest", "Bighorn Sheep",
]);
const UNCOMMON_FALLBACK = new Set([
  "Gray Fox", "Kit Fox", "Island Fox", "North American Porcupine",
  "Mule Deer", "Common Hedgehog", "European Badger", "American Mink",
  "Marsh Mongoose", "Greater Roadrunner",
]);

export function inferRarity(species: string): Rarity {
  if (LEGENDARY_FALLBACK.has(species)) return "Legendary";
  if (RARE_FALLBACK.has(species)) return "Rare";
  if (UNCOMMON_FALLBACK.has(species)) return "Uncommon";
  return "Common";
}

export function findSpec(species: string): SpeciesSpec | undefined {
  return SPECIES_LIST.find((s) => s.species === species);
}

