// screen-collection.jsx — the user's Dex grid

function CollectionScreen() {
  const finds = [
    { rarity: 'Legendary', species: 'Brown Bear', sci: 'Ursus arctos', freshness: '< 1 hour', stats: { size: 10, smell: 8, danger: 9 }, location: 'Katmai NP, AK', date: 'Apr 18', variant: 'A — Foraging', serial: '104 / 200', fact: 'Late-summer grizzly scat is mostly salmon — bright pink, hard to miss.', conservationFlag: true },
    { rarity: 'Rare', species: 'Coyote', sci: 'Canis latrans', freshness: '2–4 hours', stats: { size: 5, smell: 7, danger: 4 }, location: 'Joshua Tree, CA', date: 'Apr 17', variant: 'A — Mature', serial: '034 / 200', fact: 'Coyote scat is twisted at one end and packed with rodent fur.' },
    { rarity: 'Rare', species: 'Mountain Lion', sci: 'Puma concolor', freshness: '1+ day', stats: { size: 6, smell: 6, danger: 9 }, location: 'Sequoia NP, CA', date: 'Apr 10', variant: 'B — Stalking', serial: '061 / 200', fact: 'Cougars scrape soil near their scat — watch for the rake marks.' },
    { rarity: 'Uncommon', species: 'Red Fox', sci: 'Vulpes vulpes', freshness: '< 1 hour', stats: { size: 4, smell: 6, danger: 2 }, location: 'Mt. Tam, CA', date: 'Apr 11', variant: 'C — Trotting', serial: '047 / 200', fact: 'Foxes place scat on raised objects to mark territory edges.' },
    { rarity: 'Uncommon', species: 'Striped Skunk', sci: 'Mephitis mephitis', freshness: '1+ day', stats: { size: 3, smell: 10, danger: 4 }, location: 'Shenandoah, VA', date: 'Apr 16', variant: 'B — Tail up', serial: '029 / 200', fact: 'You\u2019ll usually smell skunk territory long before you see the sign.' },
    { rarity: 'Common', species: 'Raccoon', sci: 'Procyon lotor', freshness: '< 1 hour', stats: { size: 3, smell: 4, danger: 3 }, location: 'Great Smoky, TN', date: 'Apr 17', variant: 'A — Forest floor', serial: '008 / 200', fact: 'Raccoons share latrines — assume several individuals are nearby.' },
    { rarity: 'Common', species: 'White-tailed Deer', sci: 'Odocoileus virginianus', freshness: '< 1 hour', stats: { size: 4, smell: 3, danger: 1 }, location: 'Acadia, ME', date: 'Apr 18', variant: 'A — Browse', serial: '012 / 200', fact: 'Pellet groups indicate herd size — start counting.' },
    { rarity: 'Common', species: 'River Otter', sci: 'Lontra canadensis', freshness: '2–4 hours', stats: { size: 5, smell: 9, danger: 2 }, location: 'Olympic NP, WA', date: 'Apr 17', variant: 'B — Fishing', serial: '064 / 200', fact: 'Otters use communal latrines called "haul-outs" near water.' },
  ];
  return (
    <Screen width={1280} height={1300} url="scat.dex/collection">
      <Nav active="collection" />
      <div style={{ overflow: 'auto', height: 'calc(100% - 65px)', padding: '36px 0 60px' }}>
        <Container>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div className="sd-eyebrow" style={{ marginBottom: 8 }}>YOUR DEX</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
              <h1 className="sd-display" style={{ margin: 0, fontSize: 46, fontWeight: 700, letterSpacing: '-0.03em' }}>
                Ranger Velazquez's Collection
              </h1>
              <div style={{ textAlign: 'right' }}>
                <div className="sd-display" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em' }}>
                  47<span style={{ color: 'var(--ink-3)', fontWeight: 500 }}> / 200</span>
                </div>
                <div className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em' }}>
                  SPECIES DISCOVERED
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, height: 8, borderRadius: 999, background: 'var(--bone-2)', overflow: 'hidden' }}>
              <div style={{ width: '23.5%', height: '100%', background: 'linear-gradient(90deg, var(--forest), var(--moss))', borderRadius: 999 }} />
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)' }}>
              <span><b style={{ color: 'var(--ink) ' }}>23.5%</b> complete</span>
              <span>153 left to discover</span>
            </div>
          </div>

          {/* Filter row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px', background: 'var(--paper)',
            border: '1px solid var(--bone-3)', borderRadius: 14, marginBottom: 28,
          }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="sd-chip" data-active="true">All · 47</span>
              <span className="sd-chip"><span style={{ color: 'var(--r-common)' }}>●</span> Common · 24</span>
              <span className="sd-chip"><span style={{ color: 'var(--r-uncommon)' }}>◆</span> Uncommon · 14</span>
              <span className="sd-chip"><span style={{ color: 'var(--r-rare)' }}>✦</span> Rare · 8</span>
              <span className="sd-chip"><span style={{ color: 'var(--r-legendary)' }}>✺</span> Legendary · 1</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', background: 'var(--bone-2)', borderRadius: 999,
                fontSize: 13, color: 'var(--ink-3)', minWidth: 220,
              }}>
                🔍 <span>Search species, location…</span>
              </div>
              <div className="sd-chip" style={{ background: 'var(--bone)', border: '1px solid var(--bone-3)' }}>
                Sort: <b style={{ color: 'var(--ink)', marginLeft: 4 }}>Rarity ↓</b>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="sd-grid-cards">
            {finds.map((f, i) => (
              <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <ScatCard size="sm" rarity={f.rarity} species={f.species} speciesScientific={f.sci}
                  freshness={f.freshness} stats={f.stats} location={f.location} coords=""
                  identifiedAt={f.date} serial={f.serial} illustrationVariant={f.variant}
                  funFact={f.fact} conservationFlag={f.conservationFlag} />
              </div>
            ))}
            {/* Locked slots */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`l${i}`} style={{ display: 'flex', justifyContent: 'center' }}>
                <LockedCard />
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 32, padding: '20px 24px',
            background: 'var(--bone-2)', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div className="sd-display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
                Hunting for that Legendary?
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
                Snow leopards have been logged 14 times globally. Make it 15.
              </div>
            </div>
            <button className="sd-btn sd-btn-primary">Show Rarity Map →</button>
          </div>
        </Container>
      </div>
    </Screen>
  );
}

Object.assign(window, { CollectionScreen });
