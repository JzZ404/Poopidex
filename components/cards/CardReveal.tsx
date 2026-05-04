"use client";

import { useState } from "react";
import { CardData } from "@/lib/types";
import PoopidexCard from "./PoopidexCard";

interface CardRevealProps {
  card: CardData;
  onCollect: () => void;
}

export default function CardReveal({ card, onCollect }: CardRevealProps) {
  const [collected, setCollected] = useState(false);
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div
          className="w-72 h-96 rounded-3xl bg-gradient-to-b from-green-800 to-green-600 border-4 border-amber-400 shadow-2xl flex items-center justify-center cursor-pointer animate-pulse"
          onClick={() => setRevealed(true)}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">💩</div>
            <p className="text-amber-300 font-bold text-lg">Tap to Reveal!</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm">Your Poopidex card is ready</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <PoopidexCard card={card} onCollect={() => { setCollected(true); onCollect(); }} collected={collected} />
      {collected && <p className="text-green-700 font-semibold text-sm animate-bounce">Added to your collection!</p>}
    </div>
  );
}
