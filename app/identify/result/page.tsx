"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CardReveal from "@/components/cards/CardReveal";
import Link from "next/link";
import { CardData } from "@/lib/types";

const mockCard: CardData = {
  species: "Red Fox",
  species_scientific: "Vulpes vulpes",
  rarity: "uncommon",
  freshness: "2–4 hours",
  fun_fact: "Red foxes can hear a watch ticking from 40 yards away.",
  illustration_variant: "adult_with_hat",
  conservation_flag: false,
  conservation_note: null,
  stats: { size: 4, smell: 6, danger: 2 },
  identified_at: new Date().toISOString(),
  location: "Trail 7, Olympic National Park",
};

function ResultContent() {
  const searchParams = useSearchParams();
  const card = searchParams.get("mock") === "true" ? mockCard : mockCard;

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 flex flex-col">
      <div className="flex items-center gap-3 px-6 pt-8 pb-6">
        <Link href="/identify" className="text-gray-500 hover:text-gray-800">← Back</Link>
        <h1 className="text-2xl font-black text-green-800">Your Find!</h1>
      </div>
      <div className="flex flex-col items-center px-6 gap-6 pb-10">
        <p className="text-gray-500 text-sm text-center">AI has identified your scat. Tap the card to reveal!</p>
        <CardReveal card={card} onCollect={() => console.log("Collecting:", card)} />
        <Link href="/collection" className="text-green-700 text-sm font-semibold underline">View My Collection →</Link>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}
