"use client";

import { ART_BY_SPECIES, Rarity, ScatCard as ScatCardData } from "@/lib/types";

const RARITY: Record<Rarity, { color: string; bg: string; label: string; glyph: string }> = {
  Common:    { color: "var(--r-common)",    bg: "var(--r-common-bg)",    label: "Common",    glyph: "●" },
  Uncommon:  { color: "var(--r-uncommon)",  bg: "var(--r-uncommon-bg)",  label: "Uncommon",  glyph: "◆" },
  Rare:      { color: "var(--r-rare)",      bg: "var(--r-rare-bg)",      label: "Rare",      glyph: "✦" },
  Legendary: { color: "var(--r-legendary)", bg: "var(--r-legendary-bg)", label: "Legendary", glyph: "✺" },
};

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
  const W = big ? 320 : 200;

  return (
    <div
      className={className}
      style={{
        width: W,
        borderRadius: big ? 18 : 14,
        padding: big ? 3 : 2,
        background: `linear-gradient(160deg, ${r.color} 0%, oklch(from ${r.color} calc(l + 0.08) c h) 100%)`,
        boxShadow: big ? "var(--sh-card)" : "var(--sh-2)",
        position: "relative",
        fontFamily: "var(--font-ui)",
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
          background: "var(--paper)",
          borderRadius: big ? 15 : 12,
          padding: big ? 14 : 9,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: big ? 10 : 6,
          }}
        >
          <RarityStamp rarity={card.rarity} small={!big} />
          <div
            className="sd-mono"
            style={{
              fontSize: big ? 10 : 8.5,
              color: "var(--ink-2)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
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
        </div>

        {/* Illustration */}
        <CardArt
          species={card.species}
          rarity={card.rarity}
          variant={card.illustrationVariant}
          size={size}
        />

        {/* Name block */}
        <div style={{ marginTop: big ? 12 : 7 }}>
          <div
            className="sd-display"
            style={{
              fontSize: big ? 26 : 16,
              fontWeight: 600,
              lineHeight: 1.0,
              color: "var(--ink)",
              fontVariationSettings: `'opsz' ${big ? 36 : 18}`,
            }}
          >
            {card.species}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: big ? 13 : 10,
              color: "var(--ink-3)",
              marginTop: 3,
              fontWeight: 400,
            }}
          >
            {card.speciesScientific}
          </div>
        </div>

        {/* Stat dots */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: big ? 5 : 3,
            marginTop: big ? 12 : 7,
            padding: big ? "10px 12px" : "6px 8px",
            background: "var(--bone)",
            borderRadius: big ? 10 : 7,
            border: "1px solid var(--bone-3)",
          }}
        >
          <StatDots label="Size" value={card.stats.size} big={big} />
          <StatDots label="Smell" value={card.stats.smell} big={big} />
          <StatDots label="Danger" value={card.stats.danger} big={big} />
        </div>

        {/* Field note */}
        {big && (
          <div
            style={{
              marginTop: 10,
              padding: "8px 10px 8px 12px",
              background: "transparent",
              borderLeft: "2px solid var(--bone-3)",
              fontSize: 12,
              lineHeight: 1.5,
              color: "var(--ink-2)",
              fontStyle: "italic",
              fontFamily: "var(--font-display)",
            }}
          >
            <span
              className="sd-mono"
              style={{
                fontSize: 8,
                textTransform: "uppercase",
                letterSpacing: ".16em",
                color: "var(--ink-3)",
                display: "block",
                marginBottom: 4,
                fontStyle: "normal",
              }}
            >
              Field note
            </span>
            {card.funFact}
          </div>
        )}

        {/* Conservation banner */}
        {card.conservationFlag && big && (
          <div
            style={{
              marginTop: 8,
              padding: "7px 10px",
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

        {/* Footer */}
        <div
          style={{
            marginTop: big ? 12 : 7,
            paddingTop: big ? 10 : 6,
            borderTop: "1px solid var(--bone-3)",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-mono)",
            fontSize: big ? 9.5 : 8,
            letterSpacing: ".04em",
            color: "var(--ink-3)",
          }}
        >
          <div>
            <div>{card.identifiedAt}</div>
            <div style={{ color: "var(--ink-2)" }}>{card.location}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>{card.coords}</div>
            <div>{card.serial}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LockedCard({ size = "sm" }: { size?: "lg" | "sm" }) {
  const big = size === "lg";
  const W = big ? 320 : 200;
  return (
    <div
      style={{
        width: W,
        aspectRatio: "0.66",
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
