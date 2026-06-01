import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import ScatCard from "@/components/cards/ScatCard";
import HeroCardDeck from "@/components/cards/HeroCardDeck";
import { ScatCard as ScatCardData } from "@/lib/types";

const heroCards: ScatCardData[] = [
  // [0] center / front — Legendary · Forest
  {
    species: "Brown Bear",
    speciesScientific: "Ursus arctos",
    rarity: "Legendary",
    freshness: "< 1 hour",
    funFact: "Grizzly diets shift with the season — late summer scat is mostly salmon.",
    illustrationVariant: "A — Foraging",
    conservationFlag: true,
    conservationNote: "Threatened in lower 48 — auto-routed to USFWS.",
    stats: { size: 10, smell: 8, danger: 9 },
    identifiedAt: "Apr 18 · 7:14 AM",
    location: "Katmai NP, AK",
    coords: "58.5973° N, 155.0260° W",
    serial: "104 / 200",
  },
  // [1] lower-right layer, partly visible — Rare · Desert
  {
    species: "Ringtail",
    speciesScientific: "Bassariscus astutus",
    rarity: "Rare",
    freshness: "2–4 hours",
    funFact: "Ringtails were once kept by miners to control mice — they're called \"miner's cats.\"",
    illustrationVariant: "B — Canyon edge",
    conservationFlag: false,
    stats: { size: 3, smell: 6, danger: 2 },
    identifiedAt: "Apr 17 · 8:26 AM",
    location: "Joshua Tree, CA",
    coords: "33.8734° N, 115.9010° W",
    serial: "081 / 200",
  },
  // [2] back-left — Uncommon · Water
  {
    species: "American Beaver",
    speciesScientific: "Castor canadensis",
    rarity: "Uncommon",
    freshness: "< 1 hour",
    funFact: "Beaver scat contains so much wood fiber that it floats — search downstream of dams.",
    illustrationVariant: "B — Pond edge",
    conservationFlag: false,
    stats: { size: 4, smell: 4, danger: 1 },
    identifiedAt: "Apr 11 · 4:22 PM",
    location: "Yellowstone, WY",
    coords: "44.4280° N, 110.5885° W",
    serial: "047 / 200",
  },
  // [3] lowest layer — Common · Urban
  {
    species: "Common Raccoon",
    speciesScientific: "Procyon lotor",
    rarity: "Common",
    freshness: "2–4 hours",
    funFact: "Raccoons designate communal latrines — multiple raccoons use one spot over months.",
    illustrationVariant: "A — Alley",
    conservationFlag: false,
    stats: { size: 4, smell: 7, danger: 3 },
    identifiedAt: "Apr 17 · 11:14 AM",
    location: "Brooklyn, NY",
    coords: "40.6782° N, 73.9442° W",
    serial: "034 / 200",
  },
];

const recentFinds: ScatCardData[] = [
  heroCards[2],
  heroCards[3],
  {
    species: "Bobcat",
    speciesScientific: "Lynx rufus",
    rarity: "Rare",
    freshness: "< 1 hour",
    funFact: "Bobcats often bury or scrape soil over their scat — look for the rake marks.",
    illustrationVariant: "A — Trail edge",
    conservationFlag: false,
    stats: { size: 4, smell: 5, danger: 6 },
    identifiedAt: "Apr 17 · 5:01 PM",
    location: "Great Smoky, TN",
    coords: "35.6532° N, 83.5070° W",
    serial: "008 / 200",
  },
  {
    species: "Striped Skunk",
    speciesScientific: "Mephitis mephitis",
    rarity: "Common",
    freshness: "1+ day",
    funFact: "Yes, the scat is smelly. No, that's not the dangerous part of a skunk.",
    illustrationVariant: "B — Tail up",
    conservationFlag: false,
    stats: { size: 3, smell: 10, danger: 5 },
    identifiedAt: "Apr 16 · 8:50 AM",
    location: "Shenandoah, VA",
    coords: "38.5333° N, 78.3500° W",
    serial: "029 / 200",
  },
];

const features = [
  {
    icon: "🔍",
    title: "Identify",
    body: "Drop a photo. Our model returns a species ID, freshness window, and confidence score in seconds.",
    link: "Try it →",
    href: "/identify",
  },
  {
    icon: "🗂",
    title: "My Collection",
    body: "Every find earns a collectible card. Hunt rarities, complete sets, brag responsibly.",
    link: "Open your Dex →",
    href: "/collection",
  },
  {
    icon: "🌲",
    title: "Conservation",
    body: "Flagged sightings auto-route to research partners. Your trail walks become data.",
    link: "How it works →",
    href: "/conservation",
  },
];

const stats = [
  { n: "12,847", l: "species identified" },
  { n: "3,210", l: "active explorers" },
  { n: "418", l: "conservation reports" },
  { n: "94.2%", l: "model accuracy" },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(80% 60% at 20% 0%, oklch(0.93 0.05 75) 0%, transparent 60%)," +
            "radial-gradient(70% 70% at 100% 100%, oklch(0.91 0.05 130) 0%, transparent 60%)," +
            "var(--bone)",
          color: "var(--ink)",
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, opacity: 0.1 }}
          aria-hidden="true"
        >
          <defs>
            <pattern id="home-topo" width="180" height="120" patternUnits="userSpaceOnUse">
              <path d="M0 90 Q45 60 90 90 T180 90" fill="none" stroke="oklch(0.40 0.05 80)" strokeWidth="0.8" />
              <path d="M0 50 Q45 20 90 50 T180 50" fill="none" stroke="oklch(0.40 0.05 80)" strokeWidth="0.8" />
              <path d="M0 130 Q45 100 90 130 T180 130" fill="none" stroke="oklch(0.40 0.05 80)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#home-topo)" />
        </svg>
        <Container style={{ position: "relative", paddingTop: 80, paddingBottom: 100 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 60,
              alignItems: "center",
            }}
          >
            <div>
              <div className="sd-eyebrow" style={{ marginBottom: 18 }}>
                ◆ a field guide · v2.4 · {recentFinds.length}+ species cataloged
              </div>
              <h1
                className="sd-display"
                style={{
                  fontSize: 96,
                  fontWeight: 500,
                  lineHeight: 0.98,
                  margin: 0,
                  textWrap: "balance",
                  letterSpacing: "-0.025em",
                  fontVariationSettings: "'opsz' 60",
                }}
              >
                Gotta log
                <br />
                <i style={{ fontWeight: 500 }}>&apos;em all.</i>
              </h1>
              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.6,
                  maxWidth: 470,
                  marginTop: 26,
                  color: "var(--ink-2)",
                }}
              >
                Snap a photo of any wild scat you find on the trail. Our model identifies the
                species, issues you a collectible card, and quietly contributes to wildlife
                conservation research.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
                <Link
                  href="/identify"
                  className="sd-btn sd-btn-primary"
                  style={{ padding: "14px 22px", fontSize: 15, textDecoration: "none" }}
                >
                  Identify Your First Find →
                </Link>
                <Link
                  href="/collection"
                  className="sd-btn sd-btn-ghost"
                  style={{ padding: "14px 22px", fontSize: 15, textDecoration: "none" }}
                >
                  Browse the Dex
                </Link>
              </div>
              <div
                className="sd-mono"
                style={{
                  marginTop: 28,
                  fontSize: 11,
                  color: "var(--ink-3)",
                  display: "flex",
                  gap: 18,
                  letterSpacing: ".10em",
                }}
              >
                <span>↑ DRAG · DROP · 🔍</span>
                <span>NO ACCOUNT NEEDED</span>
                <span>WORKS OFFLINE</span>
              </div>
            </div>
            <HeroCardDeck cards={heroCards} />
          </div>
        </Container>
      </section>

      {/* Feature cards */}
      <section style={{ padding: "80px 0", background: "var(--bone)" }}>
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                style={{
                  padding: 28,
                  background: "var(--paper)",
                  borderRadius: 18,
                  border: "1px solid var(--bone-3)",
                  boxShadow: "var(--sh-1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  minHeight: 220,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform .14s, box-shadow .14s",
                }}
                className="hover:[box-shadow:var(--sh-2)]"
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--bone-2)",
                    border: "1px solid var(--bone-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  className="sd-display"
                  style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--ink-2)",
                    flex: 1,
                  }}
                >
                  {f.body}
                </p>
                <span style={{ color: "var(--forest)", fontWeight: 600, fontSize: 13.5 }}>
                  {f.link}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Recent finds */}
      <section
        style={{
          padding: "40px 0 80px",
          background: "var(--bone-2)",
          borderTop: "1px solid var(--bone-3)",
          borderBottom: "1px solid var(--bone-3)",
        }}
      >
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 28,
            }}
          >
            <div>
              <div className="sd-eyebrow" style={{ marginBottom: 6 }}>
                RECENT FINDS
              </div>
              <h2
                className="sd-display"
                style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: "-0.025em" }}
              >
                Fresh from the trail
              </h2>
            </div>
            <Link
              href="/collection"
              style={{
                color: "var(--forest)",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 8 }}>
            {recentFinds.map((card, i) => (
              <div key={i} style={{ flex: "0 0 auto" }}>
                <ScatCard card={card} size="sm" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats strip */}
      <section style={{ padding: "60px 0", background: "var(--bone)" }}>
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {stats.map((s) => (
              <div key={s.l} style={{ borderLeft: "2px solid var(--forest)", paddingLeft: 16 }}>
                <div
                  className="sd-display"
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {s.n}
                </div>
                <div
                  className="sd-mono"
                  style={{
                    marginTop: 6,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: ".1em",
                    color: "var(--ink-3)",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 0", background: "var(--ink)", color: "oklch(0.78 0.01 150)" }}>
        <Container
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={22} />
            <div
              className="sd-display"
              style={{ fontSize: 16, fontWeight: 700, color: "var(--bone)" }}
            >
              Poopidex
            </div>
          </div>
          <div className="sd-mono" style={{ fontSize: 11, letterSpacing: ".1em" }}>
            © 2026 · A FIELD GUIDE FOR THE CURIOUS · MADE WITH 🌲
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              About
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Partners
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Privacy
            </a>
          </div>
        </Container>
      </footer>
    </main>
  );
}
