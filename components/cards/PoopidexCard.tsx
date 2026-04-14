import { CardData, Rarity } from "@/lib/types";
import Button from "@/components/ui/Button";

const rarityStyles: Record<Rarity, string> = {
  common: "from-gray-300 to-gray-100 border-gray-400",
  uncommon: "from-green-300 to-emerald-100 border-green-500",
  rare: "from-blue-400 to-indigo-100 border-blue-500",
  legendary: "from-yellow-400 to-amber-100 border-yellow-500",
};

const rarityLabel: Record<Rarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  legendary: "✨ Legendary",
};

interface PoopidexCardProps {
  card: CardData;
  onCollect?: () => void;
  collected?: boolean;
}

export default function PoopidexCard({ card, onCollect, collected = false }: PoopidexCardProps) {
  return (
    <div className={`relative w-72 rounded-3xl border-4 bg-gradient-to-b ${rarityStyles[card.rarity]} shadow-2xl overflow-hidden`}>
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-bold text-gray-700">
        {rarityLabel[card.rarity]}
      </div>

      <div className="flex items-center justify-center h-48 bg-white/30 mx-4 mt-4 rounded-2xl">
        <div className="text-7xl">🦊</div>
      </div>

      <div className="px-4 py-3 space-y-2">
        <div>
          <h2 className="text-xl font-black text-gray-900">{card.species}</h2>
          <p className="text-xs italic text-gray-600">{card.species_scientific}</p>
        </div>

        <div className="grid grid-cols-3 gap-1 text-center">
          {(["size", "smell", "danger"] as const).map((stat) => (
            <div key={stat} className="bg-white/50 rounded-xl py-1">
              <p className="text-xs text-gray-500 capitalize">{stat}</p>
              <p className="text-lg font-bold text-gray-900">{card.stats[stat]}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white/50 rounded-xl px-3 py-1.5">
          <span className="text-sm">⏱</span>
          <span className="text-xs font-medium text-gray-700">
            Freshness: <span className="font-bold">{card.freshness}</span>
          </span>
        </div>

        <div className="bg-white/50 rounded-xl px-3 py-2">
          <p className="text-xs text-gray-600 leading-relaxed">💡 {card.fun_fact}</p>
        </div>

        {card.conservation_flag && (
          <div className="bg-red-100 border border-red-300 rounded-xl px-3 py-1.5">
            <p className="text-xs text-red-700 font-semibold">⚠️ Conservation Alert</p>
            {card.conservation_note && <p className="text-xs text-red-600 mt-0.5">{card.conservation_note}</p>}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>📅 {card.identified_at ? new Date(card.identified_at).toLocaleDateString() : new Date().toLocaleDateString()}</span>
          {card.location && <span className="text-right">📍 {card.location}</span>}
        </div>

        {onCollect && (
          <Button variant={collected ? "ghost" : "primary"} size="md" className="w-full mt-1" onClick={onCollect} disabled={collected}>
            {collected ? "✓ Collected" : "Collect Card"}
          </Button>
        )}
      </div>
    </div>
  );
}
