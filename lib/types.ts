export type Rarity = "Common" | "Uncommon" | "Rare" | "Legendary";

/* Element type — where the animal primarily lives */
export type Element =
  | "Forest"
  | "Mountain"
  | "Desert"
  | "Water"
  | "Plains"
  | "Urban"
  | "Shadow";

/* Class type — what the animal does in the food web */
export type Class =
  | "Apex"        // top predator
  | "Hunter"      // mid-tier carnivore
  | "Grazer"      // herbivore
  | "Scavenger"   // omnivore
  | "Burrower"    // small / hiding
  | "Shadow";     // nocturnal specialist (rare)

/* Display labels with emojis — used as inline glyphs in chips and small badges,
   and as fallback for any Element without an art asset. */
export const ELEMENT_LABELS: Record<Element, string> = {
  Forest:   "🌲",
  Mountain: "🏔️",
  Desert:   "🏜️",
  Water:    "💧",
  Plains:   "🌾",
  Urban:    "🏘️",
  Shadow:   "🌙",
};

/* Element art (placed in /public/art). Falls back to ELEMENT_LABELS emoji
   when an entry is missing. File names have spaces, so they're URL-encoded. */
export const ELEMENT_ART: Partial<Record<Element, string>> = {
  Forest:   "/art/forest%20element.png",
  Mountain: "/art/mountain%20element.png",
  Desert:   "/art/desert%20element.png",
  Water:    "/art/water%20element.png",
  Plains:   "/art/plain%20element.png",
  Urban:    "/art/urban%20element.png",
  Shadow:   "/art/shadow%20element.png",
};

export const CLASS_LABELS: Record<Class, string> = {
  Apex:      "🦴",
  Hunter:    "🥩",
  Grazer:    "🌿",
  Scavenger: "🍯",
  Burrower:  "🪺",
  Shadow:    "🌙",
};

/* Background colors for each Element — used by the small badges on the card */
export const ELEMENT_COLORS: Record<Element, string> = {
  Forest:   "oklch(0.58 0.10 145)",
  Mountain: "oklch(0.55 0.05 240)",
  Desert:   "oklch(0.70 0.10 75)",
  Water:    "oklch(0.60 0.10 230)",
  Plains:   "oklch(0.70 0.10 100)",
  Urban:    "oklch(0.50 0.02 60)",
  Shadow:   "oklch(0.30 0.05 280)",
};

export const CLASS_COLORS: Record<Class, string> = {
  Apex:      "oklch(0.55 0.18 30)",   // red — top of food chain
  Hunter:    "oklch(0.60 0.12 50)",   // amber
  Grazer:    "oklch(0.65 0.10 130)",  // green
  Scavenger: "oklch(0.65 0.10 80)",   // yellow
  Burrower:  "oklch(0.55 0.06 50)",   // brown
  Shadow:    "oklch(0.40 0.08 280)",  // purple
};

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

/* Locked species list — drives the card metadata, art mapping, and rarity tier.
   Rarity here uses "how likely is the average person to find this scat?" as the rule:
     - Common:    in your backyard / city
     - Uncommon:  encounter on a typical hike
     - Rare:      need to actively go looking
     - Legendary: trophy-tier, deep wilderness or specific regions only */
export interface SpeciesSpec {
  species: string;
  speciesScientific: string;
  rarity: Rarity;
  element: Element;
  class: Class;
  artFile: string;
  conservationFlag: boolean;
  conservationNote?: string;
  defaultFunFact: string;
  defaultStats: { size: number; smell: number; danger: number };
}

export const SPECIES_LIST: SpeciesSpec[] = [
  // ───── Legendary (5) — trophy-tier ─────
  {
    species: "Brown Bear",
    speciesScientific: "Ursus arctos",
    rarity: "Legendary",
    element: "Forest",
    class: "Apex",
    artFile: "brown_bear.png",
    conservationFlag: true,
    conservationNote: "Threatened in the lower 48. Sightings valuable to USFWS.",
    defaultFunFact: "Brown bears can identify over 80 different berry species by smell alone.",
    defaultStats: { size: 9, smell: 8, danger: 9 },
  },
  {
    species: "Gray Wolf",
    speciesScientific: "Canis lupus",
    rarity: "Legendary",
    element: "Forest",
    class: "Apex",
    artFile: "gray_wolf.png",
    conservationFlag: true,
    conservationNote: "Protected in many states. Range expanding from reintroduction efforts.",
    defaultFunFact: "Wolf packs can travel up to 20 miles a day on a single hunt.",
    defaultStats: { size: 7, smell: 7, danger: 8 },
  },
  {
    species: "Mountain Lion",
    speciesScientific: "Puma concolor",
    rarity: "Legendary",
    element: "Mountain",
    class: "Apex",
    artFile: "mountain_lion.png",
    conservationFlag: false,
    defaultFunFact: "Mountain lions can leap 40 feet horizontally and 18 feet straight up.",
    defaultStats: { size: 6, smell: 6, danger: 9 },
  },
  {
    species: "Moose",
    speciesScientific: "Alces alces",
    rarity: "Legendary",
    element: "Forest",
    class: "Grazer",
    artFile: "moose.png",
    conservationFlag: false,
    defaultFunFact: "A single moose can leave 6,000–8,000 pellets in a year. They drop them while walking.",
    defaultStats: { size: 7, smell: 4, danger: 7 },
  },
  {
    species: "American Bison",
    speciesScientific: "Bison bison",
    rarity: "Legendary",
    element: "Plains",
    class: "Grazer",
    artFile: "bison.png",
    conservationFlag: true,
    conservationNote: "Near threatened. Once 30 million strong, hunted to ~1,000 by 1900.",
    defaultFunFact: "A single bison can drop 30–50 lbs of dung per day across the prairie.",
    defaultStats: { size: 8, smell: 5, danger: 8 },
  },

  // ───── Rare (5) — elusive specialists ─────
  {
    species: "Bobcat",
    speciesScientific: "Lynx rufus",
    rarity: "Rare",
    element: "Forest",
    class: "Hunter",
    artFile: "bobcat.png",
    conservationFlag: false,
    defaultFunFact: "Bobcats often bury or scrape soil over their scat — look for the rake marks.",
    defaultStats: { size: 4, smell: 5, danger: 6 },
  },
  {
    species: "Fisher",
    speciesScientific: "Pekania pennanti",
    rarity: "Rare",
    element: "Forest",
    class: "Hunter",
    artFile: "fisher.png",
    conservationFlag: true,
    conservationNote: "Recently relisted as threatened in parts of the western US.",
    defaultFunFact: "Fishers are one of the only predators that hunt porcupines successfully.",
    defaultStats: { size: 4, smell: 6, danger: 4 },
  },
  {
    species: "Pronghorn",
    speciesScientific: "Antilocapra americana",
    rarity: "Rare",
    element: "Plains",
    class: "Grazer",
    artFile: "pronghorn.png",
    conservationFlag: false,
    defaultFunFact: "Pronghorns are the fastest land animals in North America — 55 mph.",
    defaultStats: { size: 3, smell: 3, danger: 2 },
  },
  {
    species: "North American River Otter",
    speciesScientific: "Lontra canadensis",
    rarity: "Rare",
    element: "Water",
    class: "Hunter",
    artFile: "river_otter.png",
    conservationFlag: false,
    defaultFunFact: "Otters use communal latrines called \"haul-outs\" near water — fish scales visible.",
    defaultStats: { size: 4, smell: 8, danger: 2 },
  },
  {
    species: "Ringtail",
    speciesScientific: "Bassariscus astutus",
    rarity: "Rare",
    element: "Desert",
    class: "Shadow",
    artFile: "ringtail.png",
    conservationFlag: false,
    defaultFunFact: "Ringtails were once kept by miners to control mice — they're called \"miner's cats.\"",
    defaultStats: { size: 3, smell: 6, danger: 2 },
  },

  // ───── Uncommon (5) — hike-and-find ─────
  {
    species: "North American Porcupine",
    speciesScientific: "Erethizon dorsatum",
    rarity: "Uncommon",
    element: "Forest",
    class: "Burrower",
    artFile: "porcupine.png",
    conservationFlag: false,
    defaultFunFact: "Porcupines have 30,000+ quills. They can't shoot them — that's a myth.",
    defaultStats: { size: 3, smell: 4, danger: 5 },
  },
  {
    species: "American Beaver",
    speciesScientific: "Castor canadensis",
    rarity: "Uncommon",
    element: "Water",
    class: "Grazer",
    artFile: "beaver.png",
    conservationFlag: false,
    defaultFunFact: "Beaver scat contains so much wood fiber that it floats — search downstream of dams.",
    defaultStats: { size: 4, smell: 4, danger: 1 },
  },
  {
    species: "Big-Eared Woodrat",
    speciesScientific: "Neotoma macrotis",
    rarity: "Uncommon",
    element: "Desert",
    class: "Burrower",
    artFile: "woodrat.png",
    conservationFlag: false,
    defaultFunFact: "Also called \"trade rats\" — they swap whatever shiny object they're carrying for any new shiny they find.",
    defaultStats: { size: 1, smell: 2, danger: 1 },
  },
  {
    species: "Wild Boar",
    speciesScientific: "Sus scrofa",
    rarity: "Uncommon",
    element: "Forest",
    class: "Scavenger",
    artFile: "wild_boar.png",
    conservationFlag: false,
    defaultFunFact: "Invasive in the US — wild boars cause $2.5B in agricultural damage annually.",
    defaultStats: { size: 6, smell: 8, danger: 7 },
  },
  {
    species: "Black-Tailed Jackrabbit",
    speciesScientific: "Lepus californicus",
    rarity: "Uncommon",
    element: "Desert",
    class: "Burrower",
    artFile: "jackrabbit.png",
    conservationFlag: false,
    defaultFunFact: "Jackrabbits are actually hares — they're born fully-furred and ready to hop.",
    defaultStats: { size: 2, smell: 3, danger: 1 },
  },

  // ───── Common (5) — backyard finds ─────
  {
    species: "Coyote",
    speciesScientific: "Canis latrans",
    rarity: "Common",
    element: "Forest",
    class: "Hunter",
    artFile: "coyote.png",
    conservationFlag: false,
    defaultFunFact: "Coyote scat often contains fur and bone — visible signs of a mesopredator diet.",
    defaultStats: { size: 5, smell: 7, danger: 4 },
  },
  {
    species: "Red Fox",
    speciesScientific: "Vulpes vulpes",
    rarity: "Common",
    element: "Forest",
    class: "Hunter",
    artFile: "red_fox.png",
    conservationFlag: false,
    defaultFunFact: "Foxes use scent posts to mark territory edges, often on raised objects.",
    defaultStats: { size: 4, smell: 6, danger: 2 },
  },
  {
    species: "Common Raccoon",
    speciesScientific: "Procyon lotor",
    rarity: "Common",
    element: "Urban",
    class: "Scavenger",
    artFile: "raccoon.png",
    conservationFlag: false,
    defaultFunFact: "Raccoons designate communal latrines — multiple raccoons use one spot over months.",
    defaultStats: { size: 4, smell: 7, danger: 3 },
  },
  {
    species: "Striped Skunk",
    speciesScientific: "Mephitis mephitis",
    rarity: "Common",
    element: "Urban",
    class: "Scavenger",
    artFile: "skunk.png",
    conservationFlag: false,
    defaultFunFact: "Skunk scat is often loaded with insect exoskeletons — they're voracious bug hunters.",
    defaultStats: { size: 3, smell: 10, danger: 5 },
  },
  {
    species: "White-Tailed Deer",
    speciesScientific: "Odocoileus virginianus",
    rarity: "Common",
    element: "Forest",
    class: "Grazer",
    artFile: "white_tailed_deer.png",
    conservationFlag: false,
    defaultFunFact: "Pellet group counts indicate herd size — start counting if you see piles.",
    defaultStats: { size: 3, smell: 3, danger: 1 },
  },
];

/* Map: species common name → art file path (relative to /public).
   Species not in this map render with the placeholder graphic in ScatCard. */
export const ART_BY_SPECIES: Record<string, string> = Object.fromEntries(
  SPECIES_LIST.map((s) => [s.species, `/art/${s.artFile}`])
);

/* Pick a sensible default rarity for species we haven't explicitly classified.
   These are fallbacks for any model output not in SPECIES_LIST above. */
const LEGENDARY_FALLBACK = new Set([
  "African Leopard", "Indian Elephant", "Savanna Elephant",
  "Common Hippopotamus", "Caracal", "Wapiti",
]);
const RARE_FALLBACK = new Set([
  "Wolverine", "Caribou", "Cape Eland", "Blue Wildebeest", "Bighorn Sheep",
]);
const UNCOMMON_FALLBACK = new Set([
  "Gray Fox", "Kit Fox", "Island Fox", "Mule Deer",
  "Common Hedgehog", "European Badger", "American Mink",
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
