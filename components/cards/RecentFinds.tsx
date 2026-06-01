"use client";

import { useEffect, useState } from "react";
import ScatCard from "@/components/cards/ScatCard";
import { ScatCard as ScatCardData, CollectionEntry } from "@/lib/types";
import { getCollection } from "@/lib/collection";

/* Recent Finds row — pulls from the user's actual localStorage collection,
   sorted by collectedAt (newest first). Falls back to the hardcoded sample
   cards if the user has nothing collected yet (so the home page never looks
   empty for first-time visitors). */
export default function RecentFinds({
  fallback,
  limit = 4,
}: {
  fallback: ScatCardData[];
  limit?: number;
}) {
  const [entries, setEntries] = useState<CollectionEntry[]>([]);

  useEffect(() => {
    const sync = () => setEntries(getCollection());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("poopidex:collection-updated", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("poopidex:collection-updated", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  // Newest first, capped at `limit`
  const recent = [...entries]
    .sort((a, b) => (b.collectedAt > a.collectedAt ? 1 : -1))
    .slice(0, limit)
    .map((e) => e.card);

  const cards = recent.length > 0 ? recent : fallback;
  const isFallback = recent.length === 0;

  return (
    <div>
      {isFallback && (
        <div
          className="sd-mono"
          style={{
            fontSize: 10,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            marginBottom: 10,
            fontStyle: "italic",
          }}
        >
          ↓ sample cards · identify a photo to see your own
        </div>
      )}
      <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 8 }}>
        {cards.map((card, i) => (
          <div key={isFallback ? `f-${i}` : card.serial + i} style={{ flex: "0 0 auto" }}>
            <ScatCard card={card} size="sm" noGlow />
          </div>
        ))}
      </div>
    </div>
  );
}
