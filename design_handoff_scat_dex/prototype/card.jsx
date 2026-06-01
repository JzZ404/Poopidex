// card.jsx — illustrated field-guide card (v2)
// The animal illustration is the focal point. Cream paper base, soft
// watercolor wash tinted by rarity, serif name block, dotted stat counters,
// and a quiet field-note for the fun fact.

const RARITY = {
  Common:    { color: 'var(--r-common)',    bg: 'var(--r-common-bg)',    label: 'Common',    glyph: '●' },
  Uncommon:  { color: 'var(--r-uncommon)',  bg: 'var(--r-uncommon-bg)',  label: 'Uncommon',  glyph: '◆' },
  Rare:      { color: 'var(--r-rare)',      bg: 'var(--r-rare-bg)',      label: 'Rare',      glyph: '✦' },
  Legendary: { color: 'var(--r-legendary)', bg: 'var(--r-legendary-bg)', label: 'Legendary', glyph: '✺' },
};

// Built-in art bank. Defaults to a placeholder for species we don't have
// illustrations for yet.
const ART = {
  'Red Fox': 'art/red_fox.png',
  'Coyote': 'art/coyote.png',
  'Raccoon': 'art/raccoon.png',
  'Brown Bear': 'art/brown_bear.png',
  'Grizzly Bear': 'art/brown_bear.png',
  'Black Bear': 'art/brown_bear.png',
  'Striped Skunk': 'art/skunk.png',
  'Skunk': 'art/skunk.png',
};

function hash(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return h; }

// Illustration panel — animal centered over a soft watercolor wash on cream.
function CardArt({ species, rarity, variant, size = 'lg' }) {
  const big = size === 'lg';
  const r = RARITY[rarity];
  const src = ART[species];
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: big ? '1 / 0.78' : '1 / 0.78',
      borderRadius: 12,
      overflow: 'hidden',
      background: `linear-gradient(180deg, var(--paper-2) 0%, var(--paper) 100%)`,
      border: '1px solid rgba(70,40,20,.06)',
    }}>
      {/* Watercolor wash tinted by rarity */}
      <div style={{
        position: 'absolute', inset: '-10%',
        background: `radial-gradient(55% 50% at 50% 55%, ${r.bg} 0%, transparent 70%)`,
        filter: 'blur(1px)',
      }} />

      {/* Faint horizon line for "ground" — matches the ground-shadow in the art */}
      <div style={{
        position: 'absolute', left: '10%', right: '10%', bottom: big ? '20%' : '22%',
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(70,40,20,.10) 30%, rgba(70,40,20,.10) 70%, transparent)',
      }} />

      {/* Animal */}
      {src ? (
        <img src={src} alt={species} style={{
          position: 'absolute',
          inset: big ? '8% 6% 12% 6%' : '10% 8% 14% 8%',
          width: 'calc(100% - 12%)', height: 'calc(100% - 20%)',
          objectFit: 'contain', objectPosition: 'center',
        }} />
      ) : (
        <ArtPlaceholder species={species} rarity={rarity} variant={variant} size={size} />
      )}

      {/* Corner serial */}
      {big && (
        <div className="sd-mono" style={{
          position: 'absolute', top: 10, right: 12,
          fontSize: 9, letterSpacing: '.12em', color: 'var(--ink-4)',
        }}>№ {String(Math.abs(hash(species + rarity)) % 9000 + 1000)}</div>
      )}

      {/* Variant tag (bottom-left, like a museum label) */}
      {big && variant && (
        <div className="sd-mono" style={{
          position: 'absolute', left: 12, bottom: 10,
          fontSize: 9, letterSpacing: '.08em', color: 'var(--ink-4)', fontStyle: 'italic',
        }}>{variant}</div>
      )}
    </div>
  );
}

function ArtPlaceholder({ species, rarity, variant, size }) {
  const r = RARITY[rarity];
  const big = size === 'lg';
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8,
    }}>
      <div style={{
        width: big ? 96 : 60, height: big ? 96 : 60, borderRadius: 999,
        background: r.color, opacity: 0.18,
      }} />
      <div className="sd-mono" style={{
        fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase',
        color: 'var(--ink-4)', textAlign: 'center', lineHeight: 1.4,
      }}>
        illustration<br/>placeholder
      </div>
    </div>
  );
}

// Stat row — 10 small dots: filled to value
function StatDots({ label, value, big }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: big ? 8 : 6 }}>
      <div className="sd-mono" style={{
        flex: '0 0 auto', width: big ? 38 : 28,
        fontSize: big ? 9 : 8, letterSpacing: '.10em', textTransform: 'uppercase',
        color: 'var(--ink-3)',
      }}>{label}</div>
      <div style={{ display: 'flex', gap: big ? 3 : 2, flex: 1 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: big ? 5 : 3.5, borderRadius: 999,
            background: i < value ? 'var(--ink)' : 'rgba(70,40,20,.10)',
          }} />
        ))}
      </div>
      <div className="sd-mono" style={{
        flex: '0 0 auto', width: big ? 18 : 14,
        fontSize: big ? 10 : 8, color: 'var(--ink-2)', textAlign: 'right', fontWeight: 600,
      }}>{value}</div>
    </div>
  );
}

function ScatCard({
  species = 'Red Fox',
  speciesScientific = 'Vulpes vulpes',
  rarity = 'Common',
  freshness = '< 1 hour',
  funFact = 'Foxes use scent posts to mark territory edges, often on raised objects.',
  illustrationVariant = 'A — Standard',
  conservationFlag = false,
  conservationNote = '',
  stats = { size: 4, smell: 6, danger: 2 },
  identifiedAt = 'Apr 18 · 4:22 PM',
  location = 'Mt. Tam, CA',
  coords = '37.9235° N, 122.5965° W',
  size = 'lg',
  serial = '047 / 200',
}) {
  const r = RARITY[rarity];
  const big = size === 'lg';
  const isLegend = rarity === 'Legendary';
  const W = big ? 320 : 200;

  return (
    <div style={{
      width: W,
      borderRadius: big ? 18 : 14,
      padding: big ? 3 : 2,
      background: `linear-gradient(160deg, ${r.color} 0%, oklch(from ${r.color} calc(l + 0.08) c h) 100%)`,
      boxShadow: big ? 'var(--sh-card)' : 'var(--sh-2)',
      position: 'relative',
      fontFamily: 'var(--font-ui)',
    }}>
      {/* Legendary holo overlay — soft warm shimmer, not neon */}
      {isLegend && big && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          background: 'linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(255,250,235,.55) 50%, rgba(255,255,255,0) 65%), linear-gradient(45deg, oklch(0.85 0.10 80), oklch(0.78 0.12 50), oklch(0.85 0.10 95))',
          backgroundSize: '300% 300%, 200% 200%',
          mixBlendMode: 'soft-light',
          opacity: 0.6,
          animation: 'sd-holo 7s linear infinite',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{
        background: 'var(--paper)',
        borderRadius: big ? 15 : 12,
        padding: big ? 14 : 9,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: big ? 10 : 6 }}>
          <RarityStamp rarity={rarity} small={!big} />
          <div className="sd-mono" style={{
            fontSize: big ? 10 : 8.5, color: 'var(--ink-2)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: freshness.startsWith('<') ? 'var(--ok)' : freshness.includes('1+') ? 'var(--ink-4)' : 'var(--warn)',
            }}/>
            {freshness}
          </div>
        </div>

        {/* Illustration */}
        <CardArt species={species} rarity={rarity} variant={illustrationVariant} size={size} />

        {/* Name block — serif display */}
        <div style={{ marginTop: big ? 12 : 7 }}>
          <div className="sd-display" style={{
            fontSize: big ? 26 : 16, fontWeight: 600, lineHeight: 1.0, color: 'var(--ink)',
            fontVariationSettings: `'opsz' ${big ? 36 : 18}`,
          }}>{species}</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic', fontSize: big ? 13 : 10, color: 'var(--ink-3)', marginTop: 3,
            fontWeight: 400,
          }}>{speciesScientific}</div>
        </div>

        {/* Stat dots */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: big ? 5 : 3,
          marginTop: big ? 12 : 7,
          padding: big ? '10px 12px' : '6px 8px',
          background: 'var(--bone)',
          borderRadius: big ? 10 : 7,
          border: '1px solid var(--bone-3)',
        }}>
          <StatDots label="Size" value={stats.size} big={big} />
          <StatDots label="Smell" value={stats.smell} big={big} />
          <StatDots label="Danger" value={stats.danger} big={big} />
        </div>

        {/* Fun fact — field-note margin style */}
        {big && (
          <div style={{
            marginTop: 10, padding: '8px 10px 8px 12px',
            background: 'transparent',
            borderLeft: '2px solid var(--bone-3)',
            fontSize: 12, lineHeight: 1.5, color: 'var(--ink-2)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-display)',
          }}>
            <span className="sd-mono" style={{
              fontSize: 8, textTransform: 'uppercase', letterSpacing: '.16em',
              color: 'var(--ink-3)', display: 'block', marginBottom: 4, fontStyle: 'normal',
            }}>Field note</span>
            {funFact}
          </div>
        )}

        {/* Conservation banner */}
        {conservationFlag && big && (
          <div style={{
            marginTop: 8, padding: '7px 10px',
            background: 'oklch(0.95 0.05 28)',
            border: '1px solid oklch(0.78 0.12 28)',
            color: 'var(--danger)',
            borderRadius: 8, fontSize: 10.5, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 12 }}>⚠</span>
            <span style={{ flex: 1 }}>{conservationNote || 'Flagged species — report to conservation.'}</span>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: big ? 12 : 7,
          paddingTop: big ? 10 : 6,
          borderTop: '1px solid var(--bone-3)',
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)', fontSize: big ? 9.5 : 8,
          letterSpacing: '.04em', color: 'var(--ink-3)',
        }}>
          <div>
            <div>{identifiedAt}</div>
            <div style={{ color: 'var(--ink-2)' }}>{location}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>{coords}</div>
            <div>{serial}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RarityStamp({ rarity, small }) {
  const r = RARITY[rarity];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: small ? 4 : 6,
      padding: small ? '2px 7px' : '3px 10px',
      background: r.color, color: 'white',
      borderRadius: 999, fontSize: small ? 8.5 : 10, fontWeight: 700,
      letterSpacing: '.12em', textTransform: 'uppercase',
    }}>
      <span style={{ fontSize: small ? 9 : 11, lineHeight: 1 }}>{r.glyph}</span>
      {r.label}
    </div>
  );
}

// Locked silhouette for undiscovered slots
function LockedCard({ size = 'sm' }) {
  const big = size === 'lg';
  const W = big ? 320 : 200;
  return (
    <div style={{
      width: W, aspectRatio: '0.66',
      borderRadius: big ? 18 : 14,
      background:
        `repeating-linear-gradient(45deg, var(--bone-2) 0 6px, var(--bone) 6px 12px)`,
      border: '2px dashed var(--bone-3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 8,
      color: 'var(--ink-4)',
    }}>
      <div className="sd-display" style={{ fontSize: big ? 60 : 46, fontWeight: 700, letterSpacing: '0.06em', lineHeight: 1 }}>???</div>
      <div className="sd-mono" style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase' }}>Undiscovered</div>
    </div>
  );
}

Object.assign(window, { ScatCard, LockedCard, RARITY, ART });
