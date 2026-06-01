"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ScatCard, { LockedCard } from "@/components/cards/ScatCard";
import {
  CollectionEntry, Rarity, SPECIES_LIST, Element,
  ELEMENT_LABELS, ELEMENT_COLORS, findSpec,
} from "@/lib/types";
import { getCollection, removeFromCollection } from "@/lib/collection";

const RARITY_GLYPHS: Record<Rarity, { glyph: string; color: string }> = {
  Common: { glyph: "●", color: "var(--r-common)" },
  Uncommon: { glyph: "◆", color: "var(--r-uncommon)" },
  Rare: { glyph: "✦", color: "var(--r-rare)" },
  Legendary: { glyph: "✺", color: "var(--r-legendary)" },
};

const ALL_ELEMENTS: Element[] = ["Forest", "Mountain", "Desert", "Water", "Plains", "Urban", "Shadow"];

const TOTAL_TARGET = 20; // total species in the Poopidex

type RarityFilter = "All" | Rarity;
type ElementFilter = "All" | Element;

export default function CollectionPage() {
  const [entries, setEntries] = useState<CollectionEntry[]>([]);
  const [filter, setFilter] = useState<RarityFilter>("All");
  const [elementFilter, setElementFilter] = useState<ElementFilter>("All");
  // Sort mode — recent (newest first) vs rarity (legendary first)
  const [sortMode, setSortMode] = useState<"recent" | "rarity">("recent");
  // Multi-select / discard
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  function discardSelected() {
    if (selectedIds.size === 0) return;
    const n = selectedIds.size;
    const ok = window.confirm(
      `Discard ${n} card${n > 1 ? "s" : ""} from your collection? This cannot be undone.`
    );
    if (!ok) return;
    for (const id of selectedIds) {
      removeFromCollection(id);
    }
    exitSelectMode();
  }

  function selectAllVisible(ids: string[]) {
    setSelectedIds(new Set(ids));
  }

  useEffect(() => {
    const sync = () => setEntries(getCollection());
    sync();
    // Re-sync on:
    //  - storage event (changes from other tabs)
    //  - custom collection-updated event (changes from this tab via addToCollection)
    //  - focus event (user comes back to the tab — catches edge cases)
    window.addEventListener("storage", sync);
    window.addEventListener("poopidex:collection-updated", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("poopidex:collection-updated", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  // Filter counts now reflect the user's ACTUAL collection only — no longer
  // mixed with PREVIEW_SPECIES (that was misleading, made it look like the
  // demo cards counted toward your dex).
  const entrySpecs = useMemo(() => {
    return entries
      .map((e) => findSpec(e.card.species))
      .filter((s): s is NonNullable<typeof s> => !!s);
  }, [entries]);

  const counts = useMemo(() => {
    const c: Record<RarityFilter, number> = {
      All: entrySpecs.length,
      Common: 0,
      Uncommon: 0,
      Rare: 0,
      Legendary: 0,
    };
    for (const s of entrySpecs) c[s.rarity]++;
    return c;
  }, [entrySpecs]);

  const elementCounts = useMemo(() => {
    const c: Record<ElementFilter, number> = {
      All: entrySpecs.length, Forest: 0, Mountain: 0, Desert: 0, Water: 0,
      Plains: 0, Urban: 0, Shadow: 0,
    };
    for (const s of entrySpecs) c[s.element]++;
    return c;
  }, [entrySpecs]);

  const filtered = useMemo(() => {
    const list = entries.filter((e) => {
      const passRarity = filter === "All" || e.card.rarity === filter;
      if (!passRarity) return false;
      if (elementFilter === "All") return true;
      const spec = findSpec(e.card.species);
      return spec?.element === elementFilter;
    });
    // Sort the filtered list
    if (sortMode === "rarity") {
      const rarityOrder: Record<Rarity, number> = {
        Legendary: 0,
        Rare: 1,
        Uncommon: 2,
        Common: 3,
      };
      return [...list].sort(
        (a, b) => rarityOrder[a.card.rarity] - rarityOrder[b.card.rarity]
      );
    }
    // Default: recent first (by collectedAt desc)
    return [...list].sort((a, b) =>
      b.collectedAt > a.collectedAt ? 1 : -1
    );
  }, [entries, filter, elementFilter, sortMode]);

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

          {/* Action row — sort + select/discard toggle */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() =>
                setSortMode((s) => (s === "recent" ? "rarity" : "recent"))
              }
              className="sd-chip"
              style={{ background: "var(--bone)", border: "1px solid var(--bone-3)" }}
              title="Click to toggle sort order"
            >
              Sort:{" "}
              <b style={{ color: "var(--ink)", marginLeft: 4 }}>
                {sortMode === "recent" ? "Recent ↓" : "Rarity ↓"}
              </b>
            </button>
            <div style={{ flex: 1 }} />
            {entries.length > 0 && (
              <>
                {selectMode && filtered.length > 0 && (
                  <button
                    onClick={() => selectAllVisible(filtered.map((e) => e.id))}
                    className="sd-chip"
                    style={{ border: "1px solid var(--bone-3)" }}
                  >
                    Select all visible ({filtered.length})
                  </button>
                )}
                <button
                  onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
                  className="sd-chip"
                  data-active={selectMode}
                  style={{
                    border: `1px solid ${selectMode ? "var(--danger)" : "var(--bone-3)"}`,
                    color: selectMode ? "var(--danger)" : "var(--ink-2)",
                    fontWeight: 600,
                  }}
                >
                  {selectMode ? "✕ Cancel" : "☑ Select"}
                </button>
              </>
            )}
          </div>
        </div>

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
            {filtered.map((e) => {
              const isSelected = selectedIds.has(e.id);
              return (
                <div
                  key={e.id}
                  onClick={selectMode ? () => toggleSelect(e.id) : undefined}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    cursor: selectMode ? "pointer" : "default",
                    transition: "transform .14s ease",
                    transform: selectMode && isSelected ? "scale(0.94)" : "scale(1)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      filter:
                        selectMode && !isSelected
                          ? "grayscale(.5) opacity(.6)"
                          : "none",
                      transition: "filter .14s ease",
                    }}
                  >
                    <ScatCard card={e.card} size="sm" />
                  </div>
                  {selectMode && (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        background: isSelected ? "var(--danger)" : "var(--paper)",
                        border: `2px solid ${
                          isSelected ? "var(--danger)" : "var(--bone-3)"
                        }`,
                        color: isSelected ? "white" : "var(--ink-3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        boxShadow: "var(--sh-1)",
                        pointerEvents: "none",
                      }}
                    >
                      {isSelected ? "✓" : ""}
                    </div>
                  )}
                </div>
              );
            })}
            {!selectMode &&
              Array.from({ length: lockedSlots }).map((_, i) => (
                <div key={`l${i}`} style={{ display: "flex", justifyContent: "center" }}>
                  <LockedCard />
                </div>
              ))}
          </div>
        )}

        {/* Floating bulk-action bar — appears when any card is selected */}
        {selectMode && selectedIds.size > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              padding: "12px 18px",
              background: "var(--ink)",
              color: "var(--bone)",
              borderRadius: 999,
              boxShadow: "var(--sh-3)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span>
              {selectedIds.size} card{selectedIds.size > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={discardSelected}
              style={{
                padding: "8px 16px",
                background: "var(--danger)",
                color: "white",
                border: "none",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              🗑 Discard
            </button>
            <button
              onClick={exitSelectMode}
              style={{
                padding: "8px 14px",
                background: "transparent",
                color: "var(--bone)",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
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
