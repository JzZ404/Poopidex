"use client";

import {
  ART_BY_SPECIES,
  Rarity,
  ScatCard as ScatCardData,
  findSpec,
  ELEMENT_LABELS,
  ELEMENT_ART,
  CLASS_LABELS,
  ELEMENT_COLORS,
  CLASS_COLORS,
} from "@/lib/types";

const RARITY: Record<Rarity, { color: string; bg: string; label: string; glyph: string }> = {
  Common:    { color: "var(--r-common)",    bg: "var(--r-common-bg)",    label: "Common",    glyph: "●" },
  Uncommon:  { color: "var(--r-uncommon)",  bg: "var(--r-uncommon-bg)",  label: "Uncommon",  glyph: "◆" },
  Rare:      { color: "var(--r-rare)",      bg: "var(--r-rare-bg)",      label: "Rare",      glyph: "✦" },
  Legendary: { color: "var(--r-legendary)", bg: "var(--r-legendary-bg)", label: "Legendary", glyph: "✺" },
};

/* Per-rarity backdrop — color tint only, no pattern. */
function rarityBackdrop(rarity: Rarity): { background: string } {
  const r = RARITY[rarity];
  return {
    background: `linear-gradient(180deg, oklch(from ${r.bg} calc(l - 0.025) c h) 0%, ${r.bg} 100%)`,
  };
}

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return h;
}

interface CardArtProps {
  species: string;
  rarity: Rarity;
  variant: string;
  size?: "lg" | "sm";
}

function CardArt({ species, rarity, variant, size = "lg" }: CardArtProps) {
  const big = size === "lg";
  const r = RARITY[rarity];
  const src = ART_BY_SPECIES[species];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 0.78",
        borderRadius: 12,
        overflow: "hidden",
        background: "linear-gradient(180deg, var(--paper-2) 0%, var(--paper) 100%)",
        border: "1px solid rgba(70,40,20,.06)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-10%",
          background: `radial-gradient(55% 50% at 50% 55%, ${r.bg} 0%, transparent 70%)`,
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          bottom: big ? "20%" : "22%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(70,40,20,.10) 30%, rgba(70,40,20,.10) 70%, transparent)",
        }}
      />
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={species}
          style={{
            position: "absolute",
            inset: big ? "8% 6% 12% 6%" : "10% 8% 14% 8%",
            width: "calc(100% - 12%)",
            height: "calc(100% - 20%)",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      ) : (
        <ArtPlaceholder rarity={rarity} size={size} />
      )}
      {big && (
        <div
          className="sd-mono"
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            fontSize: 9,
            letterSpacing: ".12em",
            color: "var(--ink-4)",
          }}
        >
          № {String((Math.abs(hash(species + rarity)) % 9000) + 1000)}
        </div>
      )}
      {big && variant && (
        <div
          className="sd-mono"
          style={{
            position: "absolute",
            left: 12,
            bottom: 10,
            fontSize: 9,
            letterSpacing: ".08em",
            color: "var(--ink-4)",
            fontStyle: "italic",
          }}
        >
          {variant}
        </div>
      )}
    </div>
  );
}

function ArtPlaceholder({ rarity, size }: { rarity: Rarity; size: "lg" | "sm" }) {
  const r = RARITY[rarity];
  const big = size === "lg";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          width: big ? 96 : 60,
          height: big ? 96 : 60,
          borderRadius: 999,
          background: r.color,
          opacity: 0.18,
        }}
      />
      <div
        className="sd-mono"
        style={{
          fontSize: 9,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "var(--ink-4)",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        illustration
        <br />
        placeholder
      </div>
    </div>
  );
}

interface StatDotsProps {
  label: string;
  value: number;
  big: boolean;
}

function StatDots({ label, value, big }: StatDotsProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: big ? 8 : 6 }}>
      <div
        className="sd-mono"
        style={{
          flex: "0 0 auto",
          width: big ? 38 : 28,
          fontSize: big ? 9 : 8,
          letterSpacing: ".10em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: big ? 3 : 2, flex: 1 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: big ? 5 : 3.5,
              borderRadius: 999,
              background: i < value ? "var(--ink)" : "rgba(70,40,20,.10)",
            }}
          />
        ))}
      </div>
      <div
        className="sd-mono"
        style={{
          flex: "0 0 auto",
          width: big ? 18 : 14,
          fontSize: big ? 10 : 8,
          color: "var(--ink-2)",
          textAlign: "right",
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function RarityStamp({ rarity, small = false }: { rarity: Rarity; small?: boolean }) {
  const r = RARITY[rarity];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: small ? 4 : 6,
        padding: small ? "2px 7px" : "3px 10px",
        background: r.color,
        color: "white",
        borderRadius: 999,
        fontSize: small ? 8.5 : 10,
        fontWeight: 700,
        letterSpacing: ".12em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ fontSize: small ? 9 : 11, lineHeight: 1 }}>{r.glyph}</span>
      {r.label}
    </div>
  );
}

/* Element + Class badges — shown below the rarity stamp.
   Looked up from SPECIES_LIST so cards stay in sync if you re-tier later. */
export function TypeBadges({ species, small = false }: { species: string; small?: boolean }) {
  const spec = findSpec(species);
  if (!spec) return null;

  const elementColor = ELEMENT_COLORS[spec.element];
  const classColor = CLASS_COLORS[spec.class];

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        marginBottom: small ? 8 : 12,
      }}
    >
      <Badge color={elementColor} small={small}>
        <span style={{ fontSize: small ? 11 : 13 }}>{ELEMENT_LABELS[spec.element]}</span>
        <span>{spec.element}</span>
      </Badge>
      <Badge color={classColor} small={small}>
        <span style={{ fontSize: small ? 11 : 13 }}>{CLASS_LABELS[spec.class]}</span>
        <span>{spec.class}</span>
      </Badge>
    </div>
  );
}

function Badge({
  color,
  small,
  children,
}: {
  color: string;
  small: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: small ? 3 : 4,
        padding: small ? "2px 6px" : "3px 8px",
        background: `${color}`,
        color: "white",
        borderRadius: 6,
        fontSize: small ? 8.5 : 10,
        fontWeight: 600,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        opacity: 0.92,
      }}
    >
      {children}
    </div>
  );
}

interface ScatCardProps {
  card: ScatCardData;
  size?: "lg" | "sm";
  className?: string;
  style?: React.CSSProperties;
}

export default function ScatCard({ card, size = "lg", className, style }: ScatCardProps) {
  const r = RARITY[card.rarity];
  const big = size === "lg";
  const isLegend = card.rarity === "Legendary";
  const W = big ? 320 : 220;
  // Fixed total height — ensures every card in the grid is the same size,
  // regardless of whether it has a conservation banner or longer fun fact.
  const H = big ? 580 : 360;

  // Legendary cards get a pulsing gold halo via box-shadow.
  // Other rarities get a soft shadow tinted to their rarity color.
  const legendaryHalo =
    "0 0 0 1px oklch(0.85 0.14 80 / .55), " +
    "0 0 18px 2px oklch(0.85 0.18 80 / .55), " +
    "0 0 38px 6px oklch(0.82 0.20 70 / .35), " +
    "var(--sh-card)";

  return (
    <div
      className={className}
      style={{
        width: W,
        height: H,
        borderRadius: big ? 18 : 14,
        padding: big ? 3 : 2,
        background: `linear-gradient(160deg, ${r.color} 0%, oklch(from ${r.color} calc(l + 0.08) c h) 100%)`,
        boxShadow: isLegend
          ? legendaryHalo
          : big
          ? `0 8px 24px -10px ${r.color}, var(--sh-card)`
          : "var(--sh-2)",
        position: "relative",
        fontFamily: "var(--font-ui)",
        animation: isLegend && big ? "sd-legend-pulse 2.4s ease-in-out infinite" : undefined,
        ...style,
      }}
    >
      {isLegend && big && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background:
              "linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(255,250,235,.55) 50%, rgba(255,255,255,0) 65%), linear-gradient(45deg, oklch(0.85 0.10 80), oklch(0.78 0.12 50), oklch(0.85 0.10 95))",
            backgroundSize: "300% 300%, 200% 200%",
            mixBlendMode: "soft-light",
            opacity: 0.6,
            animation: "sd-holo 7s linear infinite",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          // Rarity-specific backdrop: color tint + a distinguishing pattern
          // (dots / stripes / crosshatch / sunburst).
          ...rarityBackdrop(card.rarity),
          borderRadius: big ? 15 : 12,
          // Extra top padding on big cards so the rarity pill doesn't hug the
          // edge — matches the visual breathing room of the small cards.
          padding: big ? "20px 16px 16px 16px" : 10,
          position: "relative",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ─── Header: rarity pill + name (top-left) + element circle (top-right) ─── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: big ? 10 : 6,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: big ? 6 : 4 }}>
              <RarityStamp rarity={card.rarity} small={!big} />
            </div>
            <div
              className="sd-display"
              style={{
                fontSize: big ? 24 : 16,
                fontWeight: 700,
                lineHeight: 1.05,
                color: "var(--ink)",
                letterSpacing: "-0.015em",
                fontVariationSettings: `'opsz' ${big ? 32 : 20}`,
              }}
            >
              {card.species}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: big ? 11 : 9,
                color: "var(--ink-3)",
                marginTop: 2,
                fontWeight: 400,
              }}
            >
              {card.speciesScientific}
            </div>
          </div>
          <ElementCircle species={card.species} rarity={card.rarity} big={big} />
        </div>

        {/* ─── Illustration ─── */}
        <CardArt
          species={card.species}
          rarity={card.rarity}
          variant={card.illustrationVariant}
          size={size}
        />

        {/* ─── Field note (description below pic) ─── shown on both sizes
              for visual consistency. flex:1 makes it absorb any extra vertical
              space so all cards end up the same total height. */}
        <div
          style={{
            marginTop: big ? 10 : 6,
            padding: big ? "8px 10px 8px 12px" : "5px 7px 5px 8px",
            borderLeft: "2px solid var(--bone-3)",
            fontSize: big ? 12 : 9.5,
            lineHeight: 1.4,
            color: "var(--ink-2)",
            fontStyle: "italic",
            fontFamily: "var(--font-display)",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <span
            className="sd-mono"
            style={{
              fontSize: big ? 8 : 7,
              textTransform: "uppercase",
              letterSpacing: ".16em",
              color: "var(--ink-3)",
              display: "block",
              marginBottom: big ? 4 : 2,
              fontStyle: "normal",
            }}
          >
            Field note
          </span>
          {card.funFact}
        </div>

        {/* ─── Conservation banner ─── only on big */}
        {card.conservationFlag && big && (
          <div
            style={{
              marginTop: 8,
              padding: "6px 10px",
              background: "oklch(0.95 0.05 28)",
              border: "1px solid oklch(0.78 0.12 28)",
              color: "var(--danger)",
              borderRadius: 8,
              fontSize: 10.5,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 12 }}>⚠</span>
            <span style={{ flex: 1 }}>
              {card.conservationNote || "Flagged species — report to conservation."}
            </span>
          </div>
        )}

        {/* ─── Stat boxes (Pokemon TCG style three-column) ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: big ? 6 : 4,
            marginTop: big ? 10 : 6,
          }}
        >
          <StatBox label="Size"   value={card.stats.size}   big={big} />
          <StatBox label="Smell"  value={card.stats.smell}  big={big} />
          <StatBox label="Danger" value={card.stats.danger} big={big} />
        </div>

        {/* ─── Footer: freshness + serial ─── */}
        <div
          style={{
            marginTop: big ? 10 : 6,
            paddingTop: big ? 8 : 5,
            borderTop: "1px solid var(--bone-3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-mono)",
            fontSize: big ? 9.5 : 8,
            color: "var(--ink-3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "var(--ink-2)",
              letterSpacing: ".04em",
            }}
          >
            <span
              style={{
                width: big ? 6 : 5,
                height: big ? 6 : 5,
                borderRadius: 999,
                background: card.freshness.startsWith("<")
                  ? "var(--ok)"
                  : card.freshness.includes("1+")
                  ? "var(--ink-4)"
                  : "var(--warn)",
              }}
            />
            {card.freshness}
          </div>
          <div style={{ textAlign: "right", letterSpacing: ".04em" }}>
            {card.serial}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Element circle (top-right of card) ──────────────────────
   Big colored circle with the element emoji centered.
   The border ring picks up the rarity color for visual hierarchy. */
function ElementCircle({
  species,
  rarity,
  big,
}: {
  species: string;
  rarity: Rarity;
  big: boolean;
}) {
  const spec = findSpec(species);
  if (!spec) return null;

  const size = big ? 80 : 52;
  const fontSize = big ? 36 : 24;
  const elementColor = ELEMENT_COLORS[spec.element];
  const ringColor = RARITY[rarity].color;
  const artSrc = ELEMENT_ART[spec.element];

  return (
    <div
      style={{
        flex: "0 0 auto",
        width: size,
        height: size,
        borderRadius: 999,
        // When art exists, let the image fill the circle. Otherwise show the
        // colored gradient so the emoji fallback has something to sit on.
        background: artSrc
          ? "transparent"
          : `radial-gradient(circle at 30% 30%, oklch(from ${elementColor} calc(l + 0.12) c h) 0%, ${elementColor} 100%)`,
        border: `${big ? 3 : 2}px solid ${ringColor}`,
        boxShadow: `0 2px 6px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.15)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        lineHeight: 1,
        overflow: "hidden",
      }}
      title={spec.element}
    >
      {artSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={artSrc}
          alt={spec.element}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        ELEMENT_LABELS[spec.element]
      )}
    </div>
  );
}

/* ─── Class row (below illustration) ────────────────────────────
   Smaller circle + class label. Pokemon TCG style "energy" indicator. */
function ClassRow({ species }: { species: string }) {
  const spec = findSpec(species);
  if (!spec) return null;

  const classColor = CLASS_COLORS[spec.class];

  return (
    <div
      style={{
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: `radial-gradient(circle at 30% 30%, oklch(from ${classColor} calc(l + 0.12) c h) 0%, ${classColor} 100%)`,
          border: "2px solid var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          lineHeight: 1,
          flex: "0 0 auto",
        }}
        title={spec.class}
      >
        {CLASS_LABELS[spec.class]}
      </div>
      <div
        className="sd-mono"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "var(--ink-2)",
        }}
      >
        {spec.class}
      </div>
    </div>
  );
}

/* ─── Stat box (Pokemon TCG bottom three-column) ────────────── */
function StatBox({ label, value, big }: { label: string; value: number; big: boolean }) {
  return (
    <div
      style={{
        background: "var(--bone)",
        border: "1px solid var(--bone-3)",
        borderRadius: 6,
        padding: big ? "5px 6px" : "3px 4px",
        textAlign: "center",
      }}
    >
      <div
        className="sd-mono"
        style={{
          fontSize: big ? 8 : 7,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          marginBottom: 1,
        }}
      >
        {label}
      </div>
      <div
        className="sd-display"
        style={{
          fontSize: big ? 18 : 13,
          fontWeight: 700,
          color: "var(--ink)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function LockedCard({ size = "sm" }: { size?: "lg" | "sm" }) {
  const big = size === "lg";
  const W = big ? 320 : 220;
  const H = big ? 580 : 360;
  return (
    <div
      style={{
        width: W,
        height: H,
        borderRadius: big ? 18 : 14,
        background: "repeating-linear-gradient(45deg, var(--bone-2) 0 6px, var(--bone) 6px 12px)",
        border: "2px dashed var(--bone-3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
        color: "var(--ink-4)",
      }}
    >
      <div
        className="sd-display"
        style={{
          fontSize: big ? 60 : 46,
          fontWeight: 700,
          letterSpacing: "0.06em",
          lineHeight: 1,
        }}
      >
        ???
      </div>
      <div
        className="sd-mono"
        style={{ fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase" }}
      >
        Undiscovered
      </div>
    </div>
  );
}
