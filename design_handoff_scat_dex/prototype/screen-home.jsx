// screen-home.jsx — landing page

function HomeScreen({ interactive = false }) {
  return (
    <Screen width={1280} height={900} url="scat.dex/">
      <Nav active="home" />
      <div style={{ overflow: 'auto', height: 'calc(100% - 65px)' }}>
        <HeroSection />
        <FeatureCards />
        <RecentFinds />
        <StatStrip />
        <Footer />
      </div>
    </Screen>
  );
}

function HeroSection() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background:
        'radial-gradient(80% 60% at 20% 0%, oklch(0.93 0.05 75) 0%, transparent 60%),' +
        'radial-gradient(70% 70% at 100% 100%, oklch(0.91 0.05 130) 0%, transparent 60%),' +
        'var(--bone)',
      color: 'var(--ink)',
    }}>
      {/* topo backdrop */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.10 }} aria-hidden="true">
        <defs>
          <pattern id="home-topo" width="180" height="120" patternUnits="userSpaceOnUse">
            <path d="M0 90 Q45 60 90 90 T180 90" fill="none" stroke="oklch(0.40 0.05 80)" strokeWidth="0.8" />
            <path d="M0 50 Q45 20 90 50 T180 50" fill="none" stroke="oklch(0.40 0.05 80)" strokeWidth="0.8" />
            <path d="M0 130 Q45 100 90 130 T180 130" fill="none" stroke="oklch(0.40 0.05 80)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#home-topo)" />
      </svg>

      <Container style={{ position: 'relative', paddingTop: 80, paddingBottom: 100 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div className="sd-eyebrow" style={{ marginBottom: 18 }}>
              ◆ a field guide · v2.4 · 200 species cataloged
            </div>
            <h1 className="sd-display" style={{
              fontSize: 96, fontWeight: 500, lineHeight: 0.98,
              margin: 0, textWrap: 'balance', letterSpacing: '-0.025em',
              fontVariationSettings: "'opsz' 60",
            }}>
              Gotta log<br/><i style={{ fontWeight: 500 }}>'em all.</i>
            </h1>
            <p style={{
              fontSize: 18, lineHeight: 1.6, maxWidth: 470,
              marginTop: 26, color: 'var(--ink-2)',
            }}>
              Snap a photo of any wild scat you find on the trail. Our model identifies the species,
              issues you a collectible card, and quietly contributes to wildlife conservation research.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
              <button className="sd-btn sd-btn-primary" style={{
                padding: '14px 22px', fontSize: 15,
              }}>
                Identify Your First Find →
              </button>
              <button className="sd-btn sd-btn-ghost" style={{
                padding: '14px 22px', fontSize: 15,
              }}>
                Browse the Dex
              </button>
            </div>
            <div className="sd-mono" style={{
              marginTop: 28, fontSize: 11, color: 'var(--ink-3)',
              display: 'flex', gap: 18, letterSpacing: '.10em',
            }}>
              <span>↑ DRAG · DROP · 🔍</span>
              <span>NO ACCOUNT NEEDED</span>
              <span>WORKS OFFLINE</span>
            </div>
          </div>

          {/* Hero card stack — features real illustrations */}
          <div style={{ position: 'relative', height: 500 }}>
            <div style={{ position: 'absolute', top: 40, left: 0, transform: 'rotate(-9deg)' }}>
              <ScatCard rarity="Uncommon" species="Red Fox" speciesScientific="Vulpes vulpes"
                freshness="< 1 hour" stats={{ size: 4, smell: 6, danger: 2 }}
                location="Mt. Tam, CA" coords="37.9235° N, 122.5965° W"
                identifiedAt="Apr 11 · 4:22 PM" serial="047 / 200"
                funFact="Foxes use raised objects as scent posts at territory edges."
                illustrationVariant="C — Trotting" />
            </div>
            <div style={{ position: 'absolute', top: 0, left: 150, transform: 'rotate(3deg)', zIndex: 2 }}>
              <ScatCard rarity="Legendary" species="Brown Bear" speciesScientific="Ursus arctos"
                freshness="< 1 hour" stats={{ size: 10, smell: 8, danger: 9 }}
                location="Katmai NP, AK" coords="58.5973° N, 155.0260° W"
                identifiedAt="Apr 18 · 7:14 AM" serial="104 / 200"
                funFact="Grizzly diets shift with the season — late summer scat is mostly salmon."
                conservationFlag
                conservationNote="Threatened in lower 48 — auto-routed to USFWS."
                illustrationVariant="A — Foraging" />
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(10deg)' }}>
              <ScatCard rarity="Rare" species="Coyote" speciesScientific="Canis latrans"
                freshness="2–4 hours" stats={{ size: 5, smell: 7, danger: 4 }}
                location="Joshua Tree, CA" coords="33.8734° N, 115.9010° W"
                identifiedAt="Apr 17 · 11:14 AM" serial="034 / 200"
                funFact="Coyote scat is twisted at one end and usually packed with rodent fur."
                illustrationVariant="A — Mature" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FeatureCards() {
  const features = [
    { icon: '🔍', title: 'Identify', body: 'Drop a photo. Our model returns a species ID, freshness window, and confidence score in seconds.', link: 'Try it →' },
    { icon: '🗂', title: 'My Collection', body: 'Every find earns a collectible card. Hunt rarities, complete sets, brag responsibly.', link: 'Open your Dex →' },
    { icon: '🌲', title: 'Conservation', body: 'Flagged sightings auto-route to research partners. Your trail walks become data.', link: 'How it works →' },
  ];
  return (
    <section style={{ padding: '80px 0', background: 'var(--bone)' }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: 28, background: 'var(--paper)', borderRadius: 18,
              border: '1px solid var(--bone-3)', boxShadow: 'var(--sh-1)',
              display: 'flex', flexDirection: 'column', gap: 14,
              minHeight: 220,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--bone-2)', border: '1px solid var(--bone-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>{f.icon}</div>
              <h3 className="sd-display" style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', flex: 1 }}>{f.body}</p>
              <a href="#" style={{ color: 'var(--forest)', fontWeight: 600, fontSize: 13.5, textDecoration: 'none' }}>{f.link}</a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function RecentFinds() {
  const finds = [
    { rarity: 'Uncommon', species: 'Red Fox', sci: 'Vulpes vulpes', freshness: '< 1 hour', stats: { size: 4, smell: 6, danger: 2 }, location: 'Mt. Tam, CA', coords: '37.9235° N, 122.5965° W', date: 'Apr 18 · 7:22 AM', serial: '047 / 200', variant: 'C — Trotting', fact: 'Foxes mark territory edges on raised stones and stumps.' },
    { rarity: 'Rare', species: 'Coyote', sci: 'Canis latrans', freshness: '2–4 hours', stats: { size: 5, smell: 7, danger: 4 }, location: 'Joshua Tree, CA', coords: '33.8734° N, 115.9010° W', date: 'Apr 17 · 11:14 AM', serial: '034 / 200', variant: 'A — Mature', fact: 'Coyote scat is twisted at one end and packed with rodent fur.' },
    { rarity: 'Common', species: 'Raccoon', sci: 'Procyon lotor', freshness: '< 1 hour', stats: { size: 3, smell: 4, danger: 3 }, location: 'Great Smoky, TN', coords: '35.6532° N, 83.5070° W', date: 'Apr 17 · 5:01 PM', serial: '008 / 200', variant: 'A — Forest floor', fact: 'Raccoons use shared latrines — assume several individuals nearby.' },
    { rarity: 'Uncommon', species: 'Striped Skunk', sci: 'Mephitis mephitis', freshness: '1+ day', stats: { size: 3, smell: 10, danger: 4 }, location: 'Shenandoah, VA', coords: '38.5333° N, 78.3500° W', date: 'Apr 16 · 8:50 AM', serial: '029 / 200', variant: 'B — Tail up', fact: 'Yes, the scat is smelly. No, that\u2019s not the dangerous part of a skunk.' },
  ];
  return (
    <section style={{ padding: '40px 0 80px', background: 'var(--bone-2)', borderTop: '1px solid var(--bone-3)', borderBottom: '1px solid var(--bone-3)' }}>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
          <div>
            <div className="sd-eyebrow" style={{ marginBottom: 6 }}>RECENT FINDS</div>
            <h2 className="sd-display" style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: '-0.025em' }}>
              Fresh from the trail
            </h2>
          </div>
          <a href="#" style={{ color: 'var(--forest)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>View all →</a>
        </div>
        <div style={{ display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 8 }}>
          {finds.map((f, i) => (
            <div key={i} style={{ flex: '0 0 auto' }}>
              <ScatCard size="sm" rarity={f.rarity} species={f.species} speciesScientific={f.sci}
                freshness={f.freshness} stats={f.stats} location={f.location} coords={f.coords}
                identifiedAt={f.date} serial={f.serial} illustrationVariant={f.variant} funFact={f.fact} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StatStrip() {
  const stats = [
    { n: '12,847', l: 'species identified' },
    { n: '3,210', l: 'active explorers' },
    { n: '418', l: 'conservation reports' },
    { n: '94.2%', l: 'model accuracy' },
  ];
  return (
    <section style={{ padding: '60px 0', background: 'var(--bone)' }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ borderLeft: '2px solid var(--forest)', paddingLeft: 16 }}>
              <div className="sd-display" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em' }}>{s.n}</div>
              <div className="sd-mono" style={{ marginTop: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ink-3)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: '40px 0', background: 'var(--ink)', color: 'oklch(0.78 0.01 150)' }}>
      <Container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={22} />
          <div className="sd-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--bone)' }}>Scat·Dex</div>
        </div>
        <div className="sd-mono" style={{ fontSize: 11, letterSpacing: '.1em' }}>
          © 2026 · A FIELD GUIDE FOR THE CURIOUS · MADE WITH 🌲
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Partners</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
        </div>
      </Container>
    </footer>
  );
}

Object.assign(window, { HomeScreen });
