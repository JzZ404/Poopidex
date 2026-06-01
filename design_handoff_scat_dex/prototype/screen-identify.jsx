// screen-identify.jsx — three states: upload, loading, reveal

function IdentifyUploadScreen() {
  return (
    <Screen width={1280} height={820} url="scat.dex/identify">
      <Nav active="identify" />
      <div style={{ overflow: 'auto', height: 'calc(100% - 65px)', padding: '48px 0' }}>
        <Container>
          <div style={{ marginBottom: 32 }}>
            <div className="sd-eyebrow" style={{ marginBottom: 8 }}>STEP 1 of 2 · UPLOAD</div>
            <h1 className="sd-display" style={{ margin: 0, fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em' }}>
              What did you find out there?
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--ink-2)', maxWidth: 580 }}>
              Drop a photo of fresh scat. Phone shot is fine — our model handles dim light, motion blur, and unfortunate angles.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
            <DropZone />
            <TipsPanel />
          </div>
        </Container>
      </div>
    </Screen>
  );
}

function DropZone() {
  return (
    <div style={{
      background: 'var(--paper)', border: '2px dashed var(--ink-4)',
      borderRadius: 20, padding: 60,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', minHeight: 460, position: 'relative', gap: 16,
    }}>
      {/* upload glyph */}
      <div style={{
        width: 88, height: 88, borderRadius: 22,
        background: 'var(--bone-2)', border: '1px solid var(--bone-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36,
      }}>📷</div>
      <div>
        <div className="sd-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Drop a photo here
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6 }}>
          or click to browse · JPG, PNG, HEIC up to 20MB
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="sd-btn sd-btn-primary">Choose File</button>
        <button className="sd-btn sd-btn-soft">📸 Use Camera</button>
      </div>
      <div className="sd-mono" style={{
        position: 'absolute', bottom: 18, left: 0, right: 0,
        textAlign: 'center', fontSize: 10, letterSpacing: '.14em', color: 'var(--ink-4)',
      }}>
        ⌨ PRESS <kbd style={kbd}>U</kbd> TO UPLOAD · <kbd style={kbd}>ESC</kbd> TO CANCEL
      </div>
    </div>
  );
}

const kbd = {
  padding: '1px 6px', border: '1px solid var(--bone-3)',
  background: 'var(--bone)', borderRadius: 4, marginInline: 2, fontFamily: 'var(--font-mono)',
  fontSize: 10,
};

function TipsPanel() {
  const tips = [
    { n: '01', t: 'Get close', d: 'Fill the frame. The model needs texture and shape detail.' },
    { n: '02', t: 'Good lighting', d: 'Avoid harsh shadows. Overcast or open shade is ideal.' },
    { n: '03', t: 'Scale reference', d: 'A coin, a hiking pole, or your boot works perfectly.' },
    { n: '04', t: 'Don\'t touch', d: 'Seriously. Some species carry transmissible pathogens.' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{
        background: 'var(--paper)', border: '1px solid var(--bone-3)', borderRadius: 16,
        padding: 22,
      }}>
        <div className="sd-eyebrow" style={{ marginBottom: 12 }}>📖 FIELD TIPS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tips.map(tp => (
            <div key={tp.n} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 14 }}>
              <div className="sd-mono" style={{ fontSize: 13, color: 'var(--forest)', fontWeight: 600 }}>{tp.n}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{tp.t}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.45 }}>{tp.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'var(--paper)', border: '1px solid var(--bone-3)', borderRadius: 16,
        padding: 18,
      }}>
        <div className="sd-eyebrow" style={{ marginBottom: 10 }}>EXAMPLE SHOTS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {['good · scale', 'good · close', 'bad · blurry'].map((label, i) => (
            <div key={i} className="sd-ph" style={{ aspectRatio: '1', position: 'relative' }}>
              <span style={{ position: 'absolute', bottom: 6, left: 6, right: 6 }}>{label}</span>
              {i === 2 && <span style={{
                position: 'absolute', top: 6, right: 6, fontSize: 11,
                background: 'var(--danger)', color: 'white', padding: '1px 6px', borderRadius: 4,
              }}>✕</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '14px 16px', borderRadius: 12,
        background: 'oklch(0.95 0.04 145)', border: '1px solid oklch(0.78 0.10 145)',
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <div style={{ fontSize: 18 }}>🔬</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink-2)' }}>
          <b>Why we ask.</b> Anonymized photos help train the model and feed the National Mammal Tracking
          Initiative's range maps. Opt out anytime in settings.
        </div>
      </div>
    </div>
  );
}

// ─── Loading state ───
function IdentifyLoadingScreen() {
  return (
    <Screen width={1280} height={820} url="scat.dex/identify">
      <Nav active="identify" />
      <div style={{ height: 'calc(100% - 65px)', padding: '48px 0', overflow: 'auto' }}>
        <Container>
          <div style={{ marginBottom: 32 }}>
            <div className="sd-eyebrow" style={{ marginBottom: 8 }}>STEP 2 of 2 · ANALYZING</div>
            <h1 className="sd-display" style={{ margin: 0, fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em' }}>
              AI is sniffing around…
            </h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
            {/* uploaded photo + scanning overlay */}
            <div style={{
              position: 'relative', borderRadius: 20, overflow: 'hidden',
              border: '1px solid var(--bone-3)', background: 'var(--paper)', minHeight: 460,
            }}>
              <div className="sd-ph" style={{
                position: 'absolute', inset: 0, borderRadius: 0,
                background: 'linear-gradient(180deg, oklch(0.55 0.04 90), oklch(0.40 0.05 70))',
                color: 'oklch(0.92 0.02 80)',
              }}>
                user photo · trail bed · fresh sample
              </div>
              {/* scan line */}
              <div style={{
                position: 'absolute', left: 0, right: 0, top: '40%', height: 2,
                background: 'linear-gradient(90deg, transparent, var(--ok), transparent)',
                boxShadow: '0 0 18px var(--ok)',
              }} />
              {/* corner brackets */}
              {[[8,8,'tl'],[8,8,'tr'],[8,8,'bl'],[8,8,'br']].map(([_, __, p], i) => (
                <div key={i} style={{
                  position: 'absolute',
                  ...(p.includes('t') ? { top: 12 } : { bottom: 12 }),
                  ...(p.includes('l') ? { left: 12 } : { right: 12 }),
                  width: 22, height: 22,
                  borderTop: p.includes('t') ? '2px solid var(--ok)' : 'none',
                  borderBottom: p.includes('b') ? '2px solid var(--ok)' : 'none',
                  borderLeft: p.includes('l') ? '2px solid var(--ok)' : 'none',
                  borderRight: p.includes('r') ? '2px solid var(--ok)' : 'none',
                }} />
              ))}
              <div style={{
                position: 'absolute', bottom: 16, left: 16, right: 16,
                background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(8px)',
                borderRadius: 10, padding: '10px 14px', color: 'white',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.06em',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>▸ EXTRACTING TEXTURE FEATURES</span>
                  <span style={{ color: 'oklch(0.85 0.10 145)' }}>74%</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,.2)', marginTop: 8, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '74%', height: '100%', background: 'var(--ok)' }} />
                </div>
              </div>
            </div>

            {/* skeleton card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SkeletonCard />
              <div style={{
                padding: 14, borderRadius: 12, background: 'var(--bone-2)',
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
                lineHeight: 1.8,
              }}>
                <div>▸ <span style={{ color: 'var(--ok)' }}>✓</span> photo received</div>
                <div>▸ <span style={{ color: 'var(--ok)' }}>✓</span> background segmented</div>
                <div>▸ <span style={{ color: 'var(--ok)' }}>✓</span> shape signature extracted</div>
                <div style={{ color: 'var(--ink) ' }}>▸ <span style={{ color: 'var(--warn)' }}>●</span> matching against 200 species…</div>
                <div style={{ opacity: 0.4 }}>▸ ◌ generating card</div>
                <div style={{ opacity: 0.4 }}>▸ ◌ checking conservation flags</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Screen>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      width: 320,
      borderRadius: 18,
      padding: 4,
      background: 'var(--bone-3)',
      boxShadow: 'var(--sh-2)',
    }}>
      <div style={{
        background: 'var(--paper)', borderRadius: 14, padding: 14,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SkelLine w={64} h={18} radius={999} />
          <SkelLine w={48} h={12} />
        </div>
        <SkelLine w="100%" h={170} radius={10} />
        <SkelLine w="70%" h={20} />
        <SkelLine w="50%" h={12} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
          <SkelLine h={26} radius={6} />
          <SkelLine h={26} radius={6} />
          <SkelLine h={26} radius={6} />
        </div>
        <SkelLine h={36} radius={6} />
      </div>
    </div>
  );
}

function SkelLine({ w = '100%', h = 12, radius = 4 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: 'linear-gradient(90deg, var(--bone-2) 0%, var(--bone-3) 50%, var(--bone-2) 100%)',
      backgroundSize: '200% 100%',
      animation: 'sd-holo 2s linear infinite',
    }} />
  );
}

// ─── Reveal state ───
function IdentifyRevealScreen() {
  return (
    <Screen width={1280} height={900} url="scat.dex/identify/result">
      <Nav active="identify" />
      <div style={{ height: 'calc(100% - 65px)', overflow: 'auto', position: 'relative' }}>
        {/* radial spotlight backdrop */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(60% 50% at 50% 35%, oklch(0.93 0.08 80) 0%, var(--bone) 70%)',
          pointerEvents: 'none',
        }} />
        <Container style={{ position: 'relative', paddingTop: 36, paddingBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="sd-eyebrow" style={{ marginBottom: 8 }}>✨ IDENTIFICATION COMPLETE</div>
            <h1 className="sd-display" style={{
              margin: 0, fontSize: 56, fontWeight: 500, letterSpacing: '-0.025em',
              fontVariationSettings: "'opsz' 48",
            }}>
              You found a <i style={{ color: 'var(--clay)' }}>Legendary</i>.
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--ink-2)' }}>
              Model confidence: <b style={{ color: 'var(--ink)' }}>96.4%</b> · checked against 12 lookalikes
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto 1fr',
            gap: 32, alignItems: 'center', marginBottom: 36,
          }}>
            {/* Left: original photo */}
            <div style={{ justifySelf: 'end', maxWidth: 280 }}>
              <div className="sd-eyebrow" style={{ marginBottom: 8 }}>YOUR SHOT</div>
              <div className="sd-ph" style={{
                width: 240, height: 240, borderRadius: 14,
                background: 'linear-gradient(180deg, oklch(0.55 0.04 90), oklch(0.40 0.05 70))',
                color: 'oklch(0.92 0.02 80)',
              }}>
                user photo · trail bed
              </div>
              <div className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 8, letterSpacing: '.08em' }}>
                IMG_4421.HEIC · 4.2 MB<br/>
                Apr 18, 2026 · 6:32 AM<br/>
                Lamar Valley, WY · 44.8910° N
              </div>
            </div>

            {/* Center: the card */}
            <div style={{ position: 'relative' }}>
              {/* glow */}
              <div style={{
                position: 'absolute', inset: -30,
                background: 'radial-gradient(50% 50% at 50% 50%, oklch(0.85 0.18 80 / 0.45), transparent 70%)',
                filter: 'blur(20px)', pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative' }}>
                <ScatCard rarity="Legendary" species="Brown Bear" speciesScientific="Ursus arctos"
                  freshness="< 1 hour" stats={{ size: 10, smell: 8, danger: 9 }}
                  location="Katmai NP, AK" coords="58.5973° N, 155.0260° W"
                  identifiedAt="Apr 18 · 7:14 AM" serial="104 / 200"
                  conservationFlag
                  conservationNote="Threatened in lower 48 — auto-routed to USFWS."
                  funFact="Late-summer grizzly scat is mostly salmon — bright pink, hard to miss."
                  illustrationVariant="A — Foraging" />
              </div>
            </div>

            {/* Right: feedback */}
            <div style={{ maxWidth: 280 }}>
              <div className="sd-eyebrow" style={{ marginBottom: 8 }}>DID WE GET IT RIGHT?</div>
              <div style={{
                background: 'var(--paper)', border: '1px solid var(--bone-3)',
                borderRadius: 14, padding: 18,
              }}>
                <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)', marginBottom: 12 }}>
                  Your feedback trains the model. Be honest — even a wrong guess teaches us.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="sd-btn sd-btn-soft" style={{ flex: 1, justifyContent: 'center' }}>
                    👍 Nailed it
                  </button>
                  <button className="sd-btn sd-btn-soft" style={{ flex: 1, justifyContent: 'center' }}>
                    👎 Off
                  </button>
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--bone-3)' }}>
                  <div className="sd-mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--ink-3)', marginBottom: 6 }}>
                    NEXT BEST GUESS
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Coyote <span style={{ color: 'var(--ink-3)', fontWeight: 400, fontStyle: 'italic' }}>· Canis latrans</span></div>
                  <div className="sd-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>2.8% · CLAIM INSTEAD →</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button className="sd-btn sd-btn-primary" style={{ padding: '14px 24px', fontSize: 15 }}>
              ＋ Add to Collection
            </button>
            <button className="sd-btn sd-btn-ghost" style={{ padding: '14px 24px', fontSize: 15 }}>
              Identify Another
            </button>
            <button className="sd-btn sd-btn-soft" style={{ padding: '14px 24px', fontSize: 15 }}>
              📍 Pin to Map
            </button>
          </div>
        </Container>
      </div>
    </Screen>
  );
}

Object.assign(window, { IdentifyUploadScreen, IdentifyLoadingScreen, IdentifyRevealScreen });
