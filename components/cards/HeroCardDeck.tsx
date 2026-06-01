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

/* Sprinkles distributed around the card's PERIMETER, not its center.
   Each sprinkle starts at a point on the card's edge and flies outward
   away from the card, creating a "border burst" effect that wraps the
   whole card instead of a radial firework from the middle.

   Coordinates:
     - top / left / right / bottom: starting position on the perimeter (% or 0)
     - dx / dy: outward displacement (px) — direction it flies
     - delay: stagger so sprinkles don't all fire at once
*/
type Sprinkle = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  dx: number;
  dy: number;
  delay: number;
};

const SPRINKLES: Sprinkle[] = [
  // ── Top edge — fly up
  { top: "0%", left: "15%", dx: -18, dy: -55, delay: 0 },
  { top: "0%", left: "38%", dx: -4, dy: -70, delay: 40 },
  { top: "0%", left: "62%", dx: 12, dy: -65, delay: 80 },
  { top: "0%", left: "85%", dx: 26, dy: -50, delay: 20 },
  // ── Right edge — fly right
  { top: "18%", right: "0%", dx: 55, dy: -22, delay: 60 },
  { top: "42%", right: "0%", dx: 65, dy: -2, delay: 100 },
  { top: "66%", right: "0%", dx: 58, dy: 22, delay: 30 },
  { top: "88%", right: "0%", dx: 45, dy: 40, delay: 70 },
  // ── Bottom edge — fly down
  { bottom: "0%", left: "78%", dx: 20, dy: 50, delay: 10 },
  { bottom: "0%", left: "55%", dx: 6, dy: 62, delay: 50 },
  { bottom: "0%", left: "32%", dx: -10, dy: 58, delay: 90 },
  { bottom: "0%", left: "10%", dx: -28, dy: 48, delay: 25 },
  // ── Left edge — fly left
  { top: "75%", left: "0%", dx: -52, dy: 28, delay: 65 },
  { top: "50%", left: "0%", dx: -65, dy: 4, delay: 105 },
  { top: "25%", left: "0%", dx: -58, dy: -20, delay: 35 },
  { top: "5%", left: "0%", dx: -48, dy: -42, delay: 75 },
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
                        top: sprinkle.top,
                        left: sprinkle.left,
                        right: sprinkle.right,
                        bottom: sprinkle.bottom,
                        "--sprinkle-x": `${sprinkle.dx}px`,
                        "--sprinkle-y": `${sprinkle.dy}px`,
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
