import Link from "next/link";
import { CardData, Rarity } from "@/lib/types";

const mockCollection: CardData[] = [
  {
    species: "Red Fox", species_scientific: "Vulpes vulpes", rarity: "uncommon",
    freshness: "2–4 hours", fun_fact: "Red foxes can hear a watch ticking from 40 yards away.",
    illustration_variant: "adult_with_hat", conservation_flag: false, conservation_note: null,
    stats: { size: 4, smell: 6, danger: 2 }, identified_at: "2026-04-12T10:30:00Z", location: "Trail 7, Olympic NP",
  },
  {
    species: "Black Bear", species_scientific: "Ursus americanus", rarity: "rare",
    freshness: "< 1 hour", fun_fact: "Black bears can run up to 35 mph.",
    illustration_variant: "adult_fishing", conservation_flag: false, conservation_note: null,
    stats: { size: 9, smell: 8, danger: 8 }, identified_at: "2026-04-10T08:15:00Z", location: "Ridge Loop, Olympic NP",
  },
];

const rarityBorder: Record<Rarity, string> = {
  common: "border-gray-300", uncommon: "border-green-400", rare: "border-blue-400", legendary: "border-yellow-400",
};
const rarityBg: Record<Rarity, string> = {
  common: "bg-gray-50", uncommon: "bg-green-50", rare: "bg-blue-50", legendary: "bg-yellow-50",
};

export default function CollectionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col">
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-black text-green-800">My Collection</h1>
        <p className="text-gray-500 text-sm mt-1">{mockCollection.length} cards collected</p>
      </div>

      <div className="flex gap-2 px-6 overflow-x-auto pb-2">
        {["All", "Common", "Uncommon", "Rare", "Legendary"].map((f) => (
          <button key={f} className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${f === "All" ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-600 border-gray-300"}`}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 mt-2 pb-10">
        {mockCollection.map((card, i) => (
          <div key={i} className={`rounded-2xl border-2 ${rarityBorder[card.rarity]} ${rarityBg[card.rarity]} p-3 flex flex-col items-center gap-2 shadow-sm`}>
            <div className="w-full h-24 bg-white/60 rounded-xl flex items-center justify-center text-4xl">🦊</div>
            <p className="text-xs font-bold text-gray-800 text-center leading-tight">{card.species}</p>
            <span className="text-xs text-gray-500 italic capitalize">{card.rarity}</span>
            {card.identified_at && <p className="text-xs text-gray-400">{new Date(card.identified_at).toLocaleDateString()}</p>}
            {card.location && <p className="text-xs text-gray-400 text-center">📍 {card.location}</p>}
          </div>
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`unknown-${i}`} className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-3 flex flex-col items-center gap-2">
            <div className="w-full h-24 bg-gray-100 rounded-xl flex items-center justify-center opacity-40 text-4xl">❓</div>
            <p className="text-xs font-bold text-gray-300">???</p>
          </div>
        ))}
      </div>

      {mockCollection.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="text-6xl">📭</div>
          <p className="text-gray-500 font-medium">Your collection is empty</p>
          <Link href="/identify" className="mt-2 bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold text-sm">Identify a Poop</Link>
        </div>
      )}
    </main>
  );
}
