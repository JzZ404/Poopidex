// screen-styleguide.jsx

function StyleGuideScreen() {
  return (
    <Screen width={1280} height={1700} url="scat.dex/system">
      <Nav active="home" />
      <div style={{ overflow: 'auto', height: 'calc(100% - 65px)', padding: '36px 0 60px' }}>
        <Container>
          <div style={{ marginBottom: 32 }}>
            <div className="sd-eyebrow" style={{ marginBottom: 8 }}>DESIGN SYSTEM · v0.1</div>
            <h1 className="sd-display" style={{ margin: 0, fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em' }}>
              Scat·Dex Style Guide
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', maxWidth: 620, marginTop: 6 }}>
              Tokens, type, the card system. Keep it tight: outdoorsy field-guide × trading card game.
            </p>
          </div>

          {/* Color tokens */}
          <SGSection title="Color · Surfaces">
            <SwatchRow swatches={[
              ['--bone', 'oklch(0.97 0.012 80)', 'Bone · page'],
              ['--bone-2', 'oklch(0.94 0.014 80)', 'Bone 2 · panel'],
              ['--bone-3', 'oklch(0.91 0.016 80)', 'Bone 3 · divider'],
              ['--paper', 'oklch(0.995 0.005 80)', 'Paper · card surface'],
            ]} />
          </SGSection>
          <SGSection title="Color · Ink">
            <SwatchRow swatches={[
              ['--ink', 'oklch(0.20 0.018 150)', 'Ink · primary text', 'dark'],
              ['--ink-2', 'oklch(0.34 0.018 150)', 'Ink 2 · body', 'dark'],
              ['--ink-3', 'oklch(0.52 0.014 150)', 'Ink 3 · muted'],
              ['--ink-4', 'oklch(0.70 0.010 150)', 'Ink 4 · placeholder'],
            ]} />
          </SGSection>
          <SGSection title="Color · Brand & Semantic">
            <SwatchRow swatches={[
              ['--forest', 'oklch(0.34 0.06 150)', 'Forest · primary', 'dark'],
              ['--forest-2', 'oklch(0.46 0.07 150)', 'Forest 2', 'dark'],
              ['--moss', 'oklch(0.62 0.10 145)', 'Moss · accent'],
              ['--clay', 'oklch(0.62 0.10 55)', 'Clay · warm accent'],
              ['--danger', 'oklch(0.55 0.20 25)', 'Danger', 'dark'],
              ['--ok', 'oklch(0.58 0.13 145)', 'OK'],
            ]} />
          </SGSection>
          <SGSection title="Color · Rarity">
            <SwatchRow swatches={[
              ['--r-common', 'oklch(0.62 0.012 250)', '● Common'],
              ['--r-uncommon', 'oklch(0.58 0.13 145)', '◆ Uncommon'],
              ['--r-rare', 'oklch(0.55 0.16 245)', '✦ Rare', 'dark'],
              ['--r-legendary', 'oklch(0.72 0.16 80)', '✺ Legendary'],
            ]} />
          </SGSection>

          {/* Type scale */}
          <SGSection title="Type · Scale">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 24, background: 'var(--paper)', borderRadius: 14, border: '1px solid var(--bone-3)' }}>
              {[
                ['D1 · Hero', 88, 500, 'display', "Gotta log 'em all"],
                ['D2 · Page', 46, 500, 'display', 'Your collection'],
                ['D3 · Section', 28, 500, 'display', 'Species alerts'],
                ['T1 · Body L', 18, 400, 'ui', 'Snap a photo of any wild scat you find.'],
                ['T2 · Body', 14, 400, 'ui', 'The model returns a species ID in seconds.'],
                ['T3 · Caption', 12, 500, 'ui', 'Field note · attached as metadata'],
                ['M1 · Mono', 11, 500, 'mono', '37.9235° N · 122.5965° W'],
                ['M2 · Eyebrow', 11, 500, 'mono-eyebrow', 'STEP 1 of 2 · UPLOAD'],
              ].map(([name, size, weight, kind, sample]) => (
                <div key={name} style={{
                  display: 'grid', gridTemplateColumns: '180px 100px 1fr',
                  alignItems: 'baseline', gap: 16, padding: '10px 0',
                  borderBottom: '1px solid var(--bone-3)',
                }}>
                  <span className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em' }}>{name}</span>
                  <span className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{size}px / {weight}</span>
                  <span style={{
                    fontFamily: kind === 'display' ? 'var(--font-display)' : kind.startsWith('mono') ? 'var(--font-mono)' : 'var(--font-ui)',
                    fontSize: size, fontWeight: weight,
                    letterSpacing: kind === 'display' ? '-0.025em' : kind === 'mono-eyebrow' ? '.14em' : 0,
                    textTransform: kind === 'mono-eyebrow' ? 'uppercase' : 'none',
                    lineHeight: 1.05, color: 'var(--ink)',
                  }}>{sample}</span>
                </div>
              ))}
            </div>
          </SGSection>

          <SGSection title="Type · Family">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                ['Display', 'Newsreader', 'AaBb 1234', 'var(--font-display)'],
                ['UI', 'Plus Jakarta Sans', 'AaBb 1234', 'var(--font-ui)'],
                ['Mono', 'JetBrains Mono', 'AaBb 1234', 'var(--font-mono)'],
              ].map(([k, name, sample, ff]) => (
                <div key={k} style={{
                  padding: 18, background: 'var(--paper)',
                  borderRadius: 12, border: '1px solid var(--bone-3)',
                }}>
                  <div className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em' }}>{k.toUpperCase()}</div>
                  <div style={{ fontFamily: ff, fontSize: 36, fontWeight: 700, marginTop: 6, letterSpacing: k === 'Display' ? '-0.02em' : 0 }}>{sample}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{name}</div>
                </div>
              ))}
            </div>
          </SGSection>

          {/* Spacing & radii */}
          <SGSection title="Spacing & Radius">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 18, background: 'var(--paper)', borderRadius: 12, border: '1px solid var(--bone-3)' }}>
                <div className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em', marginBottom: 14 }}>SPACING SCALE</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  {[4, 8, 12, 16, 24, 32, 48, 64].map(n => (
                    <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: n, height: n, background: 'var(--forest)', borderRadius: 2 }} />
                      <div className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{n}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: 18, background: 'var(--paper)', borderRadius: 12, border: '1px solid var(--bone-3)' }}>
                <div className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em', marginBottom: 14 }}>RADIUS</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[['xs', 6], ['sm', 10], ['md', 14], ['lg', 20], ['xl', 28]].map(([k, n]) => (
                    <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 56, height: 56, background: 'var(--bone-2)',
                        border: '1px solid var(--bone-3)', borderRadius: n,
                      }} />
                      <div className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{k} · {n}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SGSection>

          {/* Buttons */}
          <SGSection title="Buttons">
            <div style={{ padding: 24, background: 'var(--paper)', borderRadius: 12, border: '1px solid var(--bone-3)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="sd-btn sd-btn-primary">Primary action →</button>
              <button className="sd-btn sd-btn-ghost">Ghost action</button>
              <button className="sd-btn sd-btn-soft">Soft action</button>
              <span className="sd-chip" data-active="true">Chip · active</span>
              <span className="sd-chip">Chip · idle</span>
            </div>
          </SGSection>

          {/* Card anatomy */}
          <SGSection title="The Card System">
            <div style={{
              padding: 28, background: 'var(--paper)', borderRadius: 16,
              border: '1px solid var(--bone-3)',
              display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'flex-start',
            }}>
              <ScatCard rarity="Rare" species="Coyote" speciesScientific="Canis latrans"
                freshness="2–4 hours" stats={{ size: 5, smell: 7, danger: 4 }}
                location="Joshua Tree, CA" coords="33.8734° N, 115.9010° W"
                identifiedAt="Apr 17 · 11:14 AM" serial="034 / 200"
                funFact="Coyote scat is twisted at one end and packed with rodent fur — a useful tell."
                illustrationVariant="A — Mature" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Border', 'Rarity-coded · 4px frame, gradient fill (Legendary holos animate)'],
                  ['Header strip', 'Rarity stamp left · freshness indicator right (dot = ok/warn/old)'],
                  ['Illustration', 'Variant-driven artwork (cub, hat, foraging…) — drives replay'],
                  ['Name block', 'Display common name · italic Latin · same line height 1.05'],
                  ['Stat grid', '3 columns · Size / Smell / Danger · 1–10 scale, mono labels'],
                  ['Fun fact', 'Dashed-border note · max ~110 chars'],
                  ['Conservation banner', 'Conditional · red tint when species is flagged'],
                  ['Footer', 'Mono · date/location left · coords/serial right'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--bone-3)' }}>
                    <div className="sd-mono" style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--ink-3)' }}>{k.toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </SGSection>

          {/* All four rarity tiers */}
          <SGSection title="All Four Rarity Tiers">
            <div style={{
              display: 'flex', gap: 20, padding: 28, background: 'var(--paper)',
              borderRadius: 16, border: '1px solid var(--bone-3)', overflowX: 'auto',
            }}>
              <ScatCard size="sm" rarity="Common" species="Raccoon" speciesScientific="Procyon lotor"
                freshness="< 1 hour" stats={{ size: 3, smell: 4, danger: 3 }}
                location="Great Smoky, TN" coords="35.6532° N, 83.5070° W"
                identifiedAt="Apr 17 · 5:01 PM" serial="008 / 200"
                funFact="Raccoons share latrines." />
              <ScatCard size="sm" rarity="Uncommon" species="Red Fox" speciesScientific="Vulpes vulpes"
                freshness="< 1 hour" stats={{ size: 4, smell: 6, danger: 2 }}
                location="Mt. Tam, CA" coords="37.9235° N, 122.5965° W"
                identifiedAt="Apr 11 · 4:22 PM" serial="047 / 200"
                illustrationVariant="C — Trotting"
                funFact="Foxes mark territory edges on raised stones." />
              <ScatCard size="sm" rarity="Rare" species="Coyote" speciesScientific="Canis latrans"
                freshness="2–4 hours" stats={{ size: 5, smell: 7, danger: 4 }}
                location="Joshua Tree, CA" coords="33.8734° N, 115.9010° W"
                identifiedAt="Apr 17 · 11:14 AM" serial="034 / 200"
                funFact="Twisted, fur-packed scat is a coyote tell." />
              <ScatCard size="sm" rarity="Legendary" species="Brown Bear" speciesScientific="Ursus arctos"
                freshness="< 1 hour" stats={{ size: 10, smell: 8, danger: 9 }}
                location="Katmai NP, AK" coords="58.5973° N, 155.0260° W"
                identifiedAt="Apr 18 · 7:14 AM" serial="104 / 200"
                conservationFlag
                funFact="Late-summer grizzly scat is mostly salmon." />
            </div>
          </SGSection>
        </Container>
      </div>
    </Screen>
  );
}

function SGSection({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div className="sd-eyebrow" style={{ marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function SwatchRow({ swatches }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${swatches.length}, 1fr)`, gap: 12 }}>
      {swatches.map(([token, val, label, dark]) => (
        <div key={token} style={{
          padding: 0, borderRadius: 12, overflow: 'hidden',
          border: '1px solid var(--bone-3)', background: 'var(--paper)',
        }}>
          <div style={{ height: 80, background: val }} />
          <div style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
            <div className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>{token}</div>
            <div className="sd-mono" style={{ fontSize: 9.5, color: 'var(--ink-4)', marginTop: 2 }}>{val}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { StyleGuideScreen });
