// app.jsx — main canvas layout + tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryHue": 135,
  "displayFont": "Newsreader",
  "uiFont": "Plus Jakarta Sans",
  "showHolo": true,
  "rarityStyle": "filled"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Live-apply tweaks via CSS vars on the root
  React.useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--forest', `oklch(0.38 0.055 ${t.primaryHue})`);
    r.style.setProperty('--forest-2', `oklch(0.50 0.070 ${t.primaryHue})`);
    r.style.setProperty('--moss', `oklch(0.62 0.080 ${t.primaryHue - 5})`);
    r.style.setProperty('--font-display', `"${t.displayFont}", Georgia, serif`);
    r.style.setProperty('--font-ui', `"${t.uiFont}", ui-sans-serif, system-ui, sans-serif`);
  }, [t.primaryHue, t.displayFont, t.uiFont]);

  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection id="brand" title="Style Guide" subtitle="Design system, tokens, the card anatomy">
          <DCArtboard id="styleguide" label="System · v0.1" width={1280} height={1700}>
            <StyleGuideScreen />
          </DCArtboard>
        </DCSection>

        <DCSection id="home" title="Home / Landing" subtitle="Hero, features, recent finds, stats">
          <DCArtboard id="home-default" label="Home — full page" width={1280} height={900}>
            <HomeScreen />
          </DCArtboard>
        </DCSection>

        <DCSection id="identify" title="Identify Flow" subtitle="Upload → Loading → Reveal · three states">
          <DCArtboard id="upload" label="01 · Upload" width={1280} height={820}>
            <IdentifyUploadScreen />
          </DCArtboard>
          <DCArtboard id="loading" label="02 · Analyzing" width={1280} height={820}>
            <IdentifyLoadingScreen />
          </DCArtboard>
          <DCArtboard id="reveal" label="03 · Card reveal" width={1280} height={900}>
            <IdentifyRevealScreen />
          </DCArtboard>
        </DCSection>

        <DCSection id="collection" title="My Collection" subtitle="Filter row, 4-col grid, locked slots">
          <DCArtboard id="collection-default" label="Collection — grid" width={1280} height={1300}>
            <CollectionScreen />
          </DCArtboard>
        </DCSection>

        <DCSection id="conservation" title="Conservation" subtitle="Alerts, scat log + map, science partnership">
          <DCArtboard id="conservation-default" label="Conservation — full page" width={1280} height={1500}>
            <ConservationScreen />
          </DCArtboard>
        </DCSection>

        <DCSection id="card-tiers" title="The Card — all four tiers" subtitle="Side by side · large size · including the holographic Legendary">
          <DCArtboard id="card-common" label="Common · Raccoon" width={360} height={580} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bone)' }}>
            <ScatCard rarity="Common" species="Raccoon" speciesScientific="Procyon lotor"
              freshness="< 1 hour" stats={{ size: 3, smell: 4, danger: 3 }}
              location="Great Smoky, TN" coords="35.6532° N, 83.5070° W"
              identifiedAt="Apr 17 · 5:01 PM" serial="008 / 200"
              funFact="Raccoons share latrines — assume several individuals are nearby."
              illustrationVariant="A — Forest floor" />
          </DCArtboard>
          <DCArtboard id="card-uncommon" label="Uncommon · Red Fox" width={360} height={580} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bone)' }}>
            <ScatCard rarity="Uncommon" species="Red Fox" speciesScientific="Vulpes vulpes"
              freshness="< 1 hour" stats={{ size: 4, smell: 6, danger: 2 }}
              location="Mt. Tam, CA" coords="37.9235° N, 122.5965° W"
              identifiedAt="Apr 11 · 4:22 PM" serial="047 / 200"
              illustrationVariant="C — Trotting"
              funFact="Foxes use raised objects as scent posts at territory edges." />
          </DCArtboard>
          <DCArtboard id="card-rare" label="Rare · Coyote" width={360} height={580} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bone)' }}>
            <ScatCard rarity="Rare" species="Coyote" speciesScientific="Canis latrans"
              freshness="2–4 hours" stats={{ size: 5, smell: 7, danger: 4 }}
              location="Joshua Tree, CA" coords="33.8734° N, 115.9010° W"
              identifiedAt="Apr 17 · 11:14 AM" serial="034 / 200"
              funFact="Coyote scat is twisted at one end and packed with rodent fur."
              illustrationVariant="A — Mature" />
          </DCArtboard>
          <DCArtboard id="card-legendary" label="Legendary · Brown Bear (holo)" width={360} height={600} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'oklch(0.94 0.03 75)' }}>
            <ScatCard rarity="Legendary" species="Brown Bear" speciesScientific="Ursus arctos"
              freshness="< 1 hour" stats={{ size: 10, smell: 8, danger: 9 }}
              location="Katmai NP, AK" coords="58.5973° N, 155.0260° W"
              identifiedAt="Apr 18 · 7:14 AM" serial="104 / 200"
              conservationFlag
              conservationNote="Threatened in lower 48 — auto-routed to USFWS."
              funFact="Late-summer grizzly scat is mostly salmon — bright pink, hard to miss."
              illustrationVariant="A — Foraging" />
          </DCArtboard>
        </DCSection>

        <DCPostIt x={40} y={40} width={240}>
          <b>Hi! Read me first.</b><br/><br/>
          Each section is a real screen at desktop dimensions (1280px wide). Drag to pan, scroll to zoom, click any artboard's ⤢ icon to view it fullscreen.<br/><br/>
          The collectible card is the design's soul — see all four rarity tiers in the bottom row. Legendary has an animated holo shimmer.<br/><br/>
          Toggle <i>Tweaks</i> in the toolbar to swap brand hue and fonts live.
        </DCPostIt>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakSlider label="Primary hue" value={t.primaryHue} min={20} max={320} step={5}
          unit="°" onChange={v => setTweak('primaryHue', v)} />
        <TweakSection label="Typography" />
        <TweakSelect label="Display font" value={t.displayFont}
          options={['Newsreader', 'Source Serif 4', 'Fraunces', 'Instrument Serif', 'Bricolage Grotesque']}
          onChange={v => setTweak('displayFont', v)} />
        <TweakSelect label="UI font" value={t.uiFont}
          options={['Plus Jakarta Sans', 'Geist', 'Outfit', 'IBM Plex Sans', 'Manrope']}
          onChange={v => setTweak('uiFont', v)} />
        <TweakSection label="Card system" />
        <TweakToggle label="Holo shimmer on Legendary" value={t.showHolo}
          onChange={v => {
            setTweak('showHolo', v);
            document.documentElement.style.setProperty('--holo-display', v ? 'block' : 'none');
          }} />
        <TweakRadio label="Rarity badge" value={t.rarityStyle} options={['filled', 'outline']}
          onChange={v => setTweak('rarityStyle', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

// Mount any time after fonts/scripts are ready
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
