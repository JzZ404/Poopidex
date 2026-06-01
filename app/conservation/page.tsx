"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { CollectionEntry, Rarity } from "@/lib/types";
import { getCollection } from "@/lib/collection";

export default function ConservationPage() {
  const [entries, setEntries] = useState<CollectionEntry[]>([]);

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

  return (
    <main style={{ padding: "36px 0 60px" }}>
      <Container>
        <div style={{ marginBottom: 36 }}>
          <div className="sd-eyebrow" style={{ marginBottom: 8 }}>
            CONSERVATION
          </div>
          <h1
            className="sd-display"
            style={{
              margin: 0,
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              maxWidth: 760,
            }}
          >
            Your trail walks <span style={{ color: "var(--forest)" }}>are research</span>.
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 15,
              color: "var(--ink-2)",
              maxWidth: 620,
            }}
          >
            Every scat you log helps wildlife biologists track population, range, and health.
            Flagged species auto-route to our research partners within 24 hours.
          </p>
        </div>

        <SectionHeader
          emoji="🚨"
          title="Species Alerts"
          subtitle="Flagged species reported in your area this month"
        />
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            paddingBottom: 8,
            marginBottom: 48,
          }}
        >
          <AlertCard
            severity="critical"
            species="Mexican Gray Wolf"
            sci="Canis lupus baileyi"
            note="Population: ~196 wild. Range expanding from AZ into NM. Report all sightings."
            partners="USFWS · Wolf Conservation Center"
          />
          <AlertCard
            severity="critical"
            species="Black-footed Ferret"
            sci="Mustela nigripes"
            note="Once thought extinct. Tied to prairie dog colonies — scat is small and dark."
            partners="WWF · USFWS"
          />
          <AlertCard
            severity="watch"
            species="Wolverine"
            sci="Gulo gulo"
            note="Climate-vulnerable. Found in snowy alpine terrain above 5,000 ft."
            partners="Wolverine Watchers · USGS"
          />
          <AlertCard
            severity="watch"
            species="Pacific Fisher"
            sci="Pekania pennanti"
            note="Recently relisted as threatened. Old-growth forests, west coast."
            partners="Conservation NW"
          />
        </div>

        <SectionHeader
          emoji="📍"
          title="My Scat Log"
          subtitle={`${entries.length} ${entries.length === 1 ? "find" : "finds"} pinned`}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 20,
            marginBottom: 48,
          }}
        >
          <MapPanel entries={entries} />
          <LogList entries={entries} />
        </div>

        <SectionHeader emoji="🔬" title="Contribute to Science" subtitle="" />
        <ScienceBanner reportCount={entries.length} />
      </Container>
    </main>
  );
}

function SectionHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <h2
        className="sd-display"
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.025em",
        }}
      >
        {title}
      </h2>
      {subtitle && <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{subtitle}</span>}
    </div>
  );
}

function AlertCard({
  severity,
  species,
  sci,
  note,
  partners,
}: {
  severity: "critical" | "watch";
  species: string;
  sci: string;
  note: string;
  partners: string;
}) {
  const isCritical = severity === "critical";
  return (
    <div
      style={{
        flex: "0 0 320px",
        padding: 18,
        background: "var(--paper)",
        border: `2px solid ${isCritical ? "var(--danger)" : "var(--warn)"}`,
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: 4,
            background: isCritical ? "var(--danger)" : "var(--warn)",
            color: "white",
          }}
        >
          {isCritical ? "⚠ Critical" : "◐ Watch"}
        </span>
        <span className="sd-mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
          · 3 logged near you
        </span>
      </div>
      <div>
        <div
          className="sd-display"
          style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          {species}
        </div>
        <div style={{ fontSize: 12, fontStyle: "italic", color: "var(--ink-3)" }}>{sci}</div>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ink-2)", flex: 1 }}>{note}</div>
      <div
        style={{
          paddingTop: 10,
          borderTop: "1px solid var(--bone-3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          className="sd-mono"
          style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".06em" }}
        >
          via {partners}
        </span>
        <a
          href="#"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--forest)",
            textDecoration: "none",
          }}
        >
          Learn more →
        </a>
      </div>
    </div>
  );
}

const PIN_LOCATIONS = [
  { x: "22%", y: "32%" },
  { x: "38%", y: "58%" },
  { x: "55%", y: "40%" },
  { x: "64%", y: "70%" },
  { x: "74%", y: "32%" },
  { x: "46%", y: "78%" },
  { x: "82%", y: "60%" },
  { x: "30%", y: "78%" },
];

function MapPanel({ entries }: { entries: CollectionEntry[] }) {
  const pins =
    entries.length > 0
      ? entries.slice(0, PIN_LOCATIONS.length).map((e, i) => ({
          ...PIN_LOCATIONS[i % PIN_LOCATIONS.length],
          rarity: e.card.rarity,
        }))
      : PIN_LOCATIONS.map((p, i) => ({
          ...p,
          rarity: (["Legendary", "Rare", "Uncommon", "Common"][i % 4] as Rarity),
        }));

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid var(--bone-3)",
        minHeight: 440,
        background: "linear-gradient(160deg, oklch(0.86 0.04 145) 0%, oklch(0.78 0.06 200) 100%)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        <g fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1">
          <path d="M-20 80 Q200 40 420 90 T880 110" />
          <path d="M-20 140 Q200 100 420 150 T880 170" />
          <path d="M-20 200 Q200 160 420 210 T880 230" />
          <path d="M-20 260 Q200 220 420 270 T880 290" />
          <path d="M-20 320 Q200 280 420 330 T880 350" />
          <path d="M-20 380 Q200 340 420 390 T880 410" />
        </g>
        <path
          d="M40 280 Q150 220 260 280 Q340 340 250 400 Q120 420 60 360 Z"
          fill="oklch(0.74 0.07 220)"
          opacity="0.85"
        />
        <path
          d="M460 60 Q550 40 620 70 Q700 100 650 170 Q580 200 490 170 Q440 130 460 60 Z"
          fill="oklch(0.50 0.08 145)"
          opacity="0.65"
        />
        <path
          d="M540 280 Q640 260 720 300 Q770 360 700 400 Q620 420 550 380 Q510 340 540 280 Z"
          fill="oklch(0.50 0.08 145)"
          opacity="0.55"
        />
        <path
          d="M0 240 Q220 230 360 260 T720 280 L880 270"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
        />
      </svg>

      {pins.map((p, i) => (
        <MapPin key={i} x={p.x} y={p.y} rarity={p.rarity} />
      ))}

      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 14,
          padding: "10px 12px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.86)",
          backdropFilter: "blur(8px)",
          display: "flex",
          gap: 14,
          alignItems: "center",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--ink-2)",
        }}
      >
        <span>
          <span style={{ color: "var(--r-legendary)" }}>●</span> Legendary
        </span>
        <span>
          <span style={{ color: "var(--r-rare)" }}>●</span> Rare
        </span>
        <span>
          <span style={{ color: "var(--r-uncommon)" }}>●</span> Uncommon
        </span>
        <span>
          <span style={{ color: "var(--r-common)" }}>●</span> Common
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          padding: "6px 10px",
          borderRadius: 6,
          background: "rgba(255,255,255,0.86)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--ink-3)",
          letterSpacing: ".08em",
        }}
      >
        {entries.length} PINS · LAST 12 MONTHS
      </div>
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          background: "rgba(255,255,255,0.86)",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {["＋", "－", "⊙"].map((c, i) => (
          <button
            key={i}
            style={{
              width: 32,
              height: 32,
              border: 0,
              background: "transparent",
              borderBottom: i < 2 ? "1px solid var(--bone-3)" : "none",
              cursor: "pointer",
              fontSize: 14,
              color: "var(--ink-2)",
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function MapPin({ x, y, rarity }: { x: string; y: string; rarity: Rarity }) {
  const color = `var(--r-${rarity.toLowerCase()})`;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -100%)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          background: color,
          border: "2px solid white",
          boxShadow: "0 4px 10px rgba(0,0,0,.25)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 26,
          left: "50%",
          transform: "translateX(-50%)",
          width: 8,
          height: 4,
          borderRadius: "50%",
          background: "rgba(0,0,0,.2)",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}

const RARITY_BADGE: Record<Rarity, { color: string; label: string }> = {
  Common: { color: "var(--r-common)", label: "C" },
  Uncommon: { color: "var(--r-uncommon)", label: "U" },
  Rare: { color: "var(--r-rare)", label: "R" },
  Legendary: { color: "var(--r-legendary)", label: "L" },
};

function LogList({ entries }: { entries: CollectionEntry[] }) {
  const list = entries.length > 0 ? entries : [];

  return (
    <div
      style={{
        border: "1px solid var(--bone-3)",
        borderRadius: 16,
        background: "var(--paper)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 440,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--bone-3)",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: ".1em",
          color: "var(--ink-3)",
        }}
      >
        <span>LOG · {list.length} ENTRIES</span>
        <span>SORT: NEWEST ↓</span>
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        {list.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--ink-3)",
              fontSize: 13,
            }}
          >
            No finds logged yet — head to{" "}
            <a
              href="/identify"
              style={{ color: "var(--forest)", fontWeight: 600, textDecoration: "none" }}
            >
              Identify
            </a>{" "}
            to log your first.
          </div>
        ) : (
          list.map((e, i) => (
            <div
              key={e.id}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 12,
                padding: "12px 16px",
                borderBottom: i < list.length - 1 ? "1px solid var(--bone-3)" : "none",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: RARITY_BADGE[e.card.rarity].color,
                  color: "white",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".06em",
                }}
              >
                {RARITY_BADGE[e.card.rarity].label}
              </span>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {e.card.species}
                  {e.card.conservationFlag && (
                    <span
                      style={{
                        fontSize: 9,
                        padding: "1px 5px",
                        borderRadius: 3,
                        background: "var(--danger)",
                        color: "white",
                        letterSpacing: ".06em",
                      }}
                    >
                      FLAGGED
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{e.card.location}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="sd-mono" style={{ fontSize: 10.5, color: "var(--ink-2)" }}>
                  {e.card.identifiedAt}
                </div>
                <div
                  className="sd-mono"
                  style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}
                >
                  {e.card.freshness}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ScienceBanner({ reportCount }: { reportCount: number }) {
  const stats = [
    { n: String(reportCount), l: "your reports filed" },
    { n: "12", l: "partner orgs" },
    { n: "94.2%", l: "verified accurate" },
    { n: "3", l: "species range maps updated" },
  ];
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        padding: "44px 48px",
        background:
          "linear-gradient(120deg, oklch(0.36 0.05 80) 0%, oklch(0.40 0.06 100) 50%, oklch(0.42 0.05 130) 100%)",
        color: "var(--bone)",
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: 40,
        alignItems: "center",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.15 }}
        aria-hidden="true"
      >
        <defs>
          <pattern id="sci-topo" width="100" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 40 Q25 25 50 40 T100 40" fill="none" stroke="white" strokeWidth="0.6" />
            <path d="M0 20 Q25 5 50 20 T100 20" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sci-topo)" />
      </svg>

      <div style={{ position: "relative" }}>
        <div
          className="sd-mono"
          style={{
            fontSize: 11,
            letterSpacing: ".16em",
            color: "oklch(0.85 0.05 150)",
            marginBottom: 14,
          }}
        >
          🔬 PARTNERSHIP · U.S. FISH &amp; WILDLIFE · WWF · USGS
        </div>
        <h3
          className="sd-display"
          style={{
            margin: 0,
            fontSize: 44,
            fontWeight: 500,
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            maxWidth: 520,
            fontVariationSettings: "'opsz' 48",
          }}
        >
          Your weekend hike is now a <i>peer-reviewed data point</i>.
        </h3>
        <p
          style={{
            marginTop: 14,
            fontSize: 15,
            lineHeight: 1.55,
            maxWidth: 460,
            color: "oklch(0.92 0.02 150)",
          }}
        >
          Logged sightings (with location and timestamp) feed into open species-range databases
          maintained by our research partners. You stay anonymous. The wolves don&apos;t.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            className="sd-btn"
            style={{ background: "var(--bone)", color: "var(--ink)", padding: "14px 22px" }}
            onClick={() => alert("Report submitted to partner orgs (mock)")}
          >
            Report My Findings →
          </button>
          <button
            className="sd-btn sd-btn-ghost"
            style={{ color: "var(--bone)", borderColor: "oklch(0.78 0.05 150)" }}
            onClick={() => alert("Data & Privacy page: coming soon")}
          >
            Data &amp; Privacy
          </button>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.l}
            style={{
              padding: 18,
              borderRadius: 14,
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.14)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              className="sd-display"
              style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              {s.n}
            </div>
            <div
              className="sd-mono"
              style={{
                fontSize: 10,
                marginTop: 4,
                letterSpacing: ".1em",
                color: "oklch(0.85 0.04 150)",
              }}
            >
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
