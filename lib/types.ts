export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export interface CardData {
  id?: string;
  species: string;
  species_scientific: string;
  rarity: Rarity;
  freshness: string;
  fun_fact: string;
  illustration_variant: string;
  conservation_flag: boolean;
  conservation_note: string | null;
  stats: { size: number; smell: number; danger: number };
  image_url?: string;
  lat?: number;
  lng?: number;
  location?: string;
  identified_at?: string;
}

export interface CollectionEntry {
  id: string;
  card: CardData;
  collected_at: string;
}
