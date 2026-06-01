"use client";

import { useState } from "react";
import ScatCard from "@/components/cards/ScatCard";
import { ScatCard as ScatCardData } from "@/lib/types";

const CARD_POSITIONS = [
  { top: 0, left: 150, rotate: 3, zIndex: 3 },
  { top: 168, left: 204, rotate: 14, zIndex: 4 },
  { top: 40, left: 0, rotate: -9, zIndex: 2 },
  { bottom: 0, right: 0, rotate: 10, zIndex: 1 },
];

const RARITY_COLORS: Record<ScatCardData["rarity"], string> = {
  Common: "var(--r-common)",
  Uncommon: "var(--r-uncommon)",
  Rare: "var(--r-rare)",
  Legendary: "var(--r-legendary)",
};

const SPRINKLES = [
  { x: -44, y: -44, delay: 0 },
  { x: 8, y: -62, delay: 30 },
  { x: 54, y: -42, delay: 60 },
  { x: 72, y: 6, delay: 20 },
  { x: 58, y: 56, delay: 80 },
  { x: 6, y: 72, delay: 40 },
  { x: -48, y: 58, delay: 70 },
  { x: -70, y: 8, delay: 10 },
];

export default function HeroCardDeck({ cards }: { cards: ScatCardData[] }) {
  const [frontCard, setFrontCard] = useState(1);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [burstCard, setBurstCard] = useState<number | null>(null);
  const [motionKey, setMotionKey] = useState(0);

  function bringToFront(index: number) {
    setFrontCard(index);
    setBurstCard(index);
    setMotionKey((key) => key + 1);
  }

  return (
    <div
      style={{ position: "relative", height: 500 }}
      aria-label="Interactive collectible card deck"
    >
      {cards.map((card, index) => {
        const position = CARD_POSITIONS[index];
        const isFront = index === frontCard;
        const isHovered = index === hoveredCard;
        const scale = isHovered ? (isFront ? 1.07 : 1.035) : isFront ? 1.035 : 1;

        return (
          <button
            key={`${card.species}-${isFront ? motionKey : "resting"}`}
            type="button"
            aria-label={`Bring ${card.species} card to the front`}
            aria-pressed={isFront}
            onClick={() => bringToFront(index)}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onFocus={() => setHoveredCard(index)}
            onBlur={() => setHoveredCard(null)}
            className={isFront ? "sd-deck-card sd-deck-card-front" : "sd-deck-card"}
            style={{
              position: "absolute",
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              right: position.right,
              zIndex: isFront ? 10 : position.zIndex,
              border: 0,
              padding: 0,
              background: "transparent",
              cursor: "pointer",
              color: "inherit",
              font: "inherit",
              textAlign: "left",
              transform: `translateY(${isFront ? -16 : isHovered ? -8 : 0}px) rotate(${position.rotate}deg) scale(${scale})`,
              transformOrigin: "center center",
              transition:
                "transform 300ms cubic-bezier(.2,.8,.2,1), filter 300ms ease",
              filter: isFront
                ? "drop-shadow(0 22px 18px rgba(70,40,20,.18))"
                : "none",
            }}
          >
            <ScatCard card={card} />
            {burstCard === index && (
              <span className="sd-deck-sprinkles" key={`burst-${motionKey}`} aria-hidden="true">
                {SPRINKLES.map((sprinkle, sprinkleIndex) => (
                  <span
                    key={sprinkleIndex}
                    className="sd-deck-sprinkle"
                    style={
                      {
                        "--sprinkle-x": `${sprinkle.x}px`,
                        "--sprinkle-y": `${sprinkle.y}px`,
                        "--sprinkle-delay": `${sprinkle.delay}ms`,
                        background: RARITY_COLORS[card.rarity],
                      } as React.CSSProperties
                    }
                  />
                ))}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
