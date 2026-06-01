// shell.jsx — shared screen frame, nav, and helpers.

// Faux desktop browser frame so the artboards feel like product screens.
function Screen({ children, width = 1280, height = 820, bg = 'var(--bone)', url = 'scat.dex/home' }) {
  return (
    <div className="sd-root" style={{
      width, height, background: bg, position: 'relative',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      borderRadius: 14, isolation: 'isolate',
    }}>
      <BrowserBar url={url} />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

function BrowserBar({ url }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', borderBottom: '1px solid var(--bone-3)',
      background: 'var(--bone-2)', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: 999, background: c, opacity: 0.9 }} />
        ))}
      </div>
      <div style={{
        marginLeft: 14, padding: '4px 12px', borderRadius: 999, background: 'var(--bone)',
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
        border: '1px solid var(--bone-3)', display: 'inline-flex', alignItems: 'center', gap: 6,
        flex: '0 0 auto',
      }}>
        <span style={{ color: 'var(--ok)' }}>●</span> {url}
      </div>
    </div>
  );
}

// Top nav used across the app
function Nav({ active = 'home' }) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'identify', label: 'Identify' },
    { id: 'collection', label: 'Collection' },
    { id: 'conservation', label: 'Conservation' },
  ];
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 40px', borderBottom: '1px solid var(--bone-3)',
      background: 'var(--bone)', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo />
        <div className="sd-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Scat<span style={{ color: 'var(--forest)' }}>·</span>Dex
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {items.map(it => (
          <a key={it.id} href="#" style={{
            padding: '8px 14px', borderRadius: 999,
            fontSize: 13.5, fontWeight: 600, color: active === it.id ? 'var(--bone)' : 'var(--ink-2)',
            background: active === it.id ? 'var(--ink)' : 'transparent',
            textDecoration: 'none',
          }}>{it.label}</a>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
          padding: '6px 10px', background: 'var(--bone-2)', borderRadius: 999,
        }}>47 / 200</div>
        <div style={{
          width: 32, height: 32, borderRadius: 999, background: 'var(--forest)',
          color: 'var(--bone)', fontFamily: 'var(--font-display)', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
        }}>RV</div>
      </div>
    </nav>
  );
}

function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="lg-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.46 0.08 150)" />
          <stop offset="100%" stopColor="oklch(0.30 0.06 150)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#lg-g)" />
      {/* abstract pine + drop motif */}
      <path d="M16 7 L22 16 L19 16 L24 23 L8 23 L13 16 L10 16 Z" fill="var(--bone)" opacity="0.95" />
      <circle cx="16" cy="26" r="1.6" fill="var(--bone)" />
    </svg>
  );
}

// Generic section wrapper with the 1200px container
function Container({ children, style }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', ...style }}>
      {children}
    </div>
  );
}

function RarityBadge({ rarity }) {
  const r = (window.RARITY || {})[rarity] || { border: 'var(--ink-3)', label: rarity, glyph: '●' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 999,
      fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
      background: r.border, color: 'white',
    }}>
      <span>{r.glyph}</span>{r.label}
    </span>
  );
}

Object.assign(window, { Screen, Nav, Container, Logo, RarityBadge });
