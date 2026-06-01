"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ScatCard, { LockedCard } from "@/components/cards/ScatCard";
import {
  CollectionEntry, Rarity, SPECIES_LIST, Element, ScatCard as ScatCardData,
  ELEMENT_LABELS, ELEMENT_COLORS, findSpec,
} from "@/lib/types";
import { getCollection } from "@/lib/collection";

/* Sample cards — one per rarity + one per element. Uses real SPECIES_LIST
   entries so the cards reflect actual art / element / rarity assignments.
   These are display-only; they don't go into the user's collection. */
const PREVIEW_SPECIES = [
  "Brown Bear",          // Legendary · Forest
  "Mountain Lion",       // Legendary · Mountain
  "American Bison",      // Legendary · Plains
  "Bobcat",              // Rare · Forest
  "North American River Otter", // Rare · Water
  "Ringtail",            // Rare · Desert
  "North American Porcupine",   // Uncommon · Forest
  "Coyote",              // Common · Forest
  "Common Raccoon",      // Common · Urban
];

function buildPreviewCard(species: string): ScatCardData | null {
  const spec = findSpec(species);
  if (!spec) return null;
  return {
    species: spec.species,
    speciesScientific: spec.speciesScientific,
    rarity: spec.rarity,
    freshness: "< 1 hour",
    funFact: spec.defaultFunFact,
    illustrationVariant: "Preview",
    conservationFlag: spec.conservationFlag,
    conservationNote: spec.conservationNote,
    stats: spec.defaultStats,
    identifiedAt: "Preview",
    location: "Sample",
    coords: "—",
    serial: "PREVIEW",
  };
}

const RARITY_GLYPHS: Record<Rarity, { glyph: string; color: string }> = {
  Common: { glyph: "●", color: "var(--r-common)" },
  Uncommon: { glyph: "◆", color: "var(--r-uncommon)" },
  Rare: { glyph: "✦", color: "var(--r-rare)" },
  Legendary: { glyph: "✺", color: "var(--r-legendary)" },
};

const ALL_ELEMENTS: Element[] = ["Forest", "Mountain", "Desert", "Water", "Plains", "Urban", "Shadow"];

const TOTAL_TARGET = 200;

type RarityFilter = "All" | Rarity;
type ElementFilter = "All" | Element;

export default function CollectionPage() {
  const [entries, setEntries] = useState<CollectionEntry[]>([]);
  const [filter, setFilter] = useState<RarityFilter>("All");
  const [elementFilter, setElementFilter] = useState<ElementFilter>("All");

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

  // Specs for both the user's real entries and the preview cards — used
  // for filter counts so chips show non-zero numbers even when the user
  // hasn't collected anything yet.
  const allSpecs = useMemo(() => {
    const fromEntries = entries
      .map((e) => findSpec(e.card.species))
      .filter((s): s is NonNullable<typeof s> => !!s);
    const fromPreview = PREVIEW_SPECIES
      .map((s) => findSpec(s))
      .filter((s): s is NonNullable<typeof s> => !!s);
    return [...fromEntries, ...fromPreview];
  }, [entries]);

  const counts = useMemo(() => {
    const c: Record<RarityFilter, number> = {
      All: allSpecs.length,
      Common: 0,
      Uncommon: 0,
      Rare: 0,
      Legendary: 0,
    };
    for (const s of allSpecs) c[s.rarity]++;
    return c;
  }, [allSpecs]);

  const elementCounts = useMemo(() => {
    const c: Record<ElementFilter, number> = {
      All: allSpecs.length, Forest: 0, Mountain: 0, Desert: 0, Water: 0,
      Plains: 0, Urban: 0, Shadow: 0,
    };
    for (const s of allSpecs) c[s.element]++;
    return c;
  }, [allSpecs]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const passRarity = filter === "All" || e.card.rarity === filter;
      if (!passRarity) return false;
      if (elementFilter === "All") return true;
      const spec = findSpec(e.card.species);
      return spec?.element === elementFilter;
    });
  }, [entries, filter, elementFilter]);

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
            flexDirection: "column",
            padding: "14px 16px",
            background: "var(--paper)",
            border: "1px solid var(--bone-3)",
            borderRadius: 14,
            marginBottom: 28,
            gap: 12,
          }}
        >
          {/* Rarity row */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <div
              className="sd-mono"
              style={{
                fontSize: 10,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginRight: 4,
              }}
            >
              Rarity
            </div>
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

          {/* Element row */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <div
              className="sd-mono"
              style={{
                fontSize: 10,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginRight: 4,
              }}
            >
              Element
            </div>
            <FilterChip
              active={elementFilter === "All"}
              onClick={() => setElementFilter("All")}
              label={`All · ${elementCounts.All}`}
            />
            {ALL_ELEMENTS.map((el) => (
              <FilterChip
                key={el}
                active={elementFilter === el}
                onClick={() => setElementFilter(el)}
                label={
                  <>
                    <span style={{ color: ELEMENT_COLORS[el] }}>
                      {ELEMENT_LABELS[el]}
                    </span>{" "}
                    {el} · {elementCounts[el]}
                  </>
                }
              />
            ))}
          </div>

          {/* Search + sort row */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
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
                flex: 1,
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

        {/* Style preview — one sample per rarity & element.
            Only shown when the user has no actual finds yet, so it doesn't
            visually compete with their real collection. Respects active filters. */}
        {entries.length === 0 && (() => {
          const previewCards = PREVIEW_SPECIES
            .map((s) => ({ s, card: buildPreviewCard(s), spec: findSpec(s) }))
            .filter(({ card, spec }) => {
              if (!card || !spec) return false;
              if (filter !== "All" && card.rarity !== filter) return false;
              if (elementFilter !== "All" && spec.element !== elementFilter) return false;
              return true;
            });
          if (previewCards.length === 0) return null;
          return (
            <div style={{ marginBottom: 32 }}>
              <div
                className="sd-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: 10,
                }}
              >
                Style preview · one per rarity & element
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 20,
                  padding: 18,
                  background: "var(--bone-2)",
                  border: "1px dashed var(--bone-3)",
                  borderRadius: 14,
                }}
              >
                {previewCards.map(({ s, card }) => (
                  <div key={s} style={{ display: "flex", justifyContent: "center" }}>
                    <ScatCard card={card!} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Your finds — the actual user collection grid */}
        {entries.length > 0 && (
          <div
            className="sd-mono"
            style={{
              fontSize: 11,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
              marginBottom: 14,
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <span style={{ fontWeight: 700 }}>📚 Your Finds</span>
            <span style={{ color: "var(--ink-3)", letterSpacing: ".10em" }}>
              · {filtered.length} of {entries.length} shown
            </span>
          </div>
        )}
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
