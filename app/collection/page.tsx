"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ScatCard, { LockedCard } from "@/components/cards/ScatCard";
import { CollectionEntry, Rarity, SPECIES_LIST } from "@/lib/types";
import { getCollection } from "@/lib/collection";

const RARITY_GLYPHS: Record<Rarity, { glyph: string; color: string }> = {
  Common: { glyph: "●", color: "var(--r-common)" },
  Uncommon: { glyph: "◆", color: "var(--r-uncommon)" },
  Rare: { glyph: "✦", color: "var(--r-rare)" },
  Legendary: { glyph: "✺", color: "var(--r-legendary)" },
};

const TOTAL_TARGET = 200;

type FilterKey = "All" | Rarity;

export default function CollectionPage() {
  const [entries, setEntries] = useState<CollectionEntry[]>([]);
  const [filter, setFilter] = useState<FilterKey>("All");

  useEffect(() => {
    const sync = () => setEntries(getCollection());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("poopidex:collection-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("poopidex:collection-updated", sync);
    };
  }, []);

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = {
      All: entries.length,
      Common: 0,
      Uncommon: 0,
      Rare: 0,
      Legendary: 0,
    };
    for (const e of entries) c[e.card.rarity]++;
    return c;
  }, [entries]);

  const filtered = useMemo(
    () => (filter === "All" ? entries : entries.filter((e) => e.card.rarity === filter)),
    [entries, filter]
  );

  const discovered = new Set(entries.map((e) => e.card.species));
  const speciesDiscoveredCount = discovered.size;
  const pct = (speciesDiscoveredCount / TOTAL_TARGET) * 100;
  const remaining = Math.max(0, TOTAL_TARGET - speciesDiscoveredCount);

  // Locked slots — fill grid out to a nice number
  const lockedSlots = Math.max(0, 4 - (filtered.length % 4 || 4)) + (filtered.length < 4 ? 4 - filtered.length : 0);

  return (
    <main style={{ padding: "36px 0 60px" }}>
      <Container>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div className="sd-eyebrow" style={{ marginBottom: 8 }}>
            YOUR DEX
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <h1
              className="sd-display"
              style={{
                margin: 0,
                fontSize: 46,
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              Your Collection
            </h1>
            <div style={{ textAlign: "right" }}>
              <div
                className="sd-display"
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {speciesDiscoveredCount}
                <span style={{ color: "var(--ink-3)", fontWeight: 500 }}> / {TOTAL_TARGET}</span>
              </div>
              <div
                className="sd-mono"
                style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".1em" }}
              >
                SPECIES DISCOVERED
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              height: 8,
              borderRadius: 999,
              background: "var(--bone-2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: "linear-gradient(90deg, var(--forest), var(--moss))",
                borderRadius: 999,
                transition: "width .35s ease",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--ink-3)",
            }}
          >
            <span>
              <b style={{ color: "var(--ink)" }}>{pct.toFixed(1)}%</b> complete
            </span>
            <span>{remaining} left to discover</span>
          </div>
        </div>

        {/* Filter row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            background: "var(--paper)",
            border: "1px solid var(--bone-3)",
            borderRadius: 14,
            marginBottom: 28,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <FilterChip
              active={filter === "All"}
              onClick={() => setFilter("All")}
              label={`All · ${counts.All}`}
            />
            {(["Common", "Uncommon", "Rare", "Legendary"] as const).map((r) => (
              <FilterChip
                key={r}
                active={filter === r}
                onClick={() => setFilter(r)}
                label={
                  <>
                    <span style={{ color: RARITY_GLYPHS[r].color }}>
                      {RARITY_GLYPHS[r].glyph}
                    </span>{" "}
                    {r} · {counts[r]}
                  </>
                }
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: "var(--bone-2)",
                borderRadius: 999,
                fontSize: 13,
                color: "var(--ink-3)",
                minWidth: 220,
              }}
            >
              🔍 <span>Search species, location…</span>
            </div>
            <div
              className="sd-chip"
              style={{ background: "var(--bone)", border: "1px solid var(--bone-3)" }}
            >
              Sort: <b style={{ color: "var(--ink)", marginLeft: 4 }}>Rarity ↓</b>
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}
          >
            {filtered.map((e) => (
              <div
                key={e.id}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <ScatCard card={e.card} size="sm" />
              </div>
            ))}
            {Array.from({ length: lockedSlots }).map((_, i) => (
              <div key={`l${i}`} style={{ display: "flex", justifyContent: "center" }}>
                <LockedCard />
              </div>
            ))}
          </div>
        )}

        {/* Bottom callout */}
        <div
          style={{
            marginTop: 32,
            padding: "20px 24px",
            background: "var(--bone-2)",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div
              className="sd-display"
              style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Hunting for that Legendary?
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
              {SPECIES_LIST.filter((s) => s.rarity === "Legendary" && !discovered.has(s.species))
                .map((s) => s.species)
                .join(", ") || "You've found them all. Keep exploring for variants."}
              {SPECIES_LIST.filter((s) => s.rarity === "Legendary" && !discovered.has(s.species))
                .length > 0
                ? " — still uncatalogued."
                : ""}
            </div>
          </div>
          <Link
            href="/conservation"
            className="sd-btn sd-btn-primary"
            style={{ textDecoration: "none" }}
          >
            Show Rarity Map →
          </Link>
        </div>
      </Container>
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: React.ReactNode;
}) {
  return (
    <button
      className="sd-chip"
      data-active={active}
      onClick={onClick}
      style={{ border: "1px solid var(--bone-3)" }}
    >
      {label}
    </button>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: "60px 40px",
        textAlign: "center",
        background: "var(--paper)",
        border: "1px dashed var(--bone-3)",
        borderRadius: 18,
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>🌲</div>
      <div
        className="sd-display"
        style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}
      >
        Your collection is empty
      </div>
      <p style={{ color: "var(--ink-3)", marginTop: 8, marginBottom: 24 }}>
        Go find something on the trail.
      </p>
      <Link
        href="/identify"
        className="sd-btn sd-btn-primary"
        style={{ textDecoration: "none" }}
      >
        Identify Your First Find →
      </Link>
    </div>
  );
}
