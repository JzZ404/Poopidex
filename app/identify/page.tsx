"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import ScatCard from "@/components/cards/ScatCard";
import { addToCollection } from "@/lib/collection";
import { ScatCard as ScatCardData } from "@/lib/types";
import { identifyPhoto, IdentifyResult } from "@/lib/identify";

type Phase = "upload" | "analyzing" | "reveal";

export default function IdentifyPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [card, setCard] = useState<ScatCardData | null>(null);
  const [identifyResult, setIdentifyResult] = useState<IdentifyResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [collected, setCollected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: U opens file picker on upload screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === "upload" && e.key.toLowerCase() === "u") {
        fileInputRef.current?.click();
      } else if (e.key === "Escape") {
        reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  function reset() {
    setPhase("upload");
    setPreview(null);
    setCard(null);
    setIdentifyResult(null);
    setFeedback(null);
    setCollected(false);
  }

  async function handleFile(file: File) {
    const dataUrl = await readAsDataURL(file);
    setPreview(dataUrl);
    setPhase("analyzing");

    // Minimum 2s "AI is sniffing around..." theatre even if YOLO returns faster
    const [result] = await Promise.all([
      identifyPhoto(file, dataUrl),
      new Promise((r) => setTimeout(r, 2000)),
    ]);

    setCard(result.card);
    setIdentifyResult(result);
    setPhase("reveal");
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }

  function onCollect() {
    if (!card || collected) return;
    addToCollection(card);
    setCollected(true);
    setTimeout(() => router.push("/collection"), 600);
  }

  return (
    <main style={{ padding: phase === "reveal" ? "0" : "48px 0" }}>
      {phase === "upload" && (
        <Container>
          <div style={{ marginBottom: 32 }}>
            <div className="sd-eyebrow" style={{ marginBottom: 8 }}>
              STEP 1 of 2 · UPLOAD
            </div>
            <h1
              className="sd-display"
              style={{
                margin: 0,
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              What did you find out there?
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--ink-2)", maxWidth: 580 }}>
              Drop a photo of fresh scat. Phone shot is fine — our model handles dim light, motion
              blur, and unfortunate angles.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
            <DropZone
              dragging={dragging}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onPickClick={() => fileInputRef.current?.click()}
            />
            <TipsPanel />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              style={{ display: "none" }}
              onChange={onFileChange}
            />
          </div>
        </Container>
      )}

      {phase === "analyzing" && (
        <Container>
          <div style={{ marginBottom: 32 }}>
            <div className="sd-eyebrow" style={{ marginBottom: 8 }}>
              STEP 2 of 2 · ANALYZING
            </div>
            <h1
              className="sd-display"
              style={{
                margin: 0,
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              AI is sniffing around…
            </h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
            <AnalyzingPreview src={preview} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <SkeletonCard />
              <StatusList />
            </div>
          </div>
        </Container>
      )}

      {phase === "reveal" && card && (
        <RevealView
          card={card}
          photo={preview}
          collected={collected}
          feedback={feedback}
          onFeedback={setFeedback}
          onCollect={onCollect}
          onAgain={reset}
          result={identifyResult}
        />
      )}
    </main>
  );
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ───────────────────────── Upload state ───────────────────────── */

function DropZone({
  dragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onPickClick,
}: {
  dragging: boolean;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDragLeave: React.DragEventHandler<HTMLDivElement>;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onPickClick: () => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onPickClick}
      style={{
        background: "var(--paper)",
        border: `2px dashed ${dragging ? "var(--forest)" : "var(--ink-4)"}`,
        borderRadius: 20,
        padding: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: 460,
        position: "relative",
        gap: 16,
        cursor: "pointer",
        transition: "border-color .14s, background .14s",
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 22,
          background: "var(--bone-2)",
          border: "1px solid var(--bone-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
        }}
      >
        📷
      </div>
      <div>
        <div
          className="sd-display"
          style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Drop a photo here
        </div>
        <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6 }}>
          or click to browse · JPG, PNG, HEIC up to 20MB
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button
          className="sd-btn sd-btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            onPickClick();
          }}
        >
          Choose File
        </button>
        <button
          className="sd-btn sd-btn-soft"
          onClick={(e) => {
            e.stopPropagation();
            onPickClick();
          }}
        >
          📸 Use Camera
        </button>
      </div>
      <div
        className="sd-mono"
        style={{
          position: "absolute",
          bottom: 18,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 10,
          letterSpacing: ".14em",
          color: "var(--ink-4)",
        }}
      >
        ⌨ PRESS <Kbd>U</Kbd> TO UPLOAD · <Kbd>ESC</Kbd> TO CANCEL
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        padding: "1px 6px",
        border: "1px solid var(--bone-3)",
        background: "var(--bone)",
        borderRadius: 4,
        marginInline: 2,
        fontFamily: "var(--font-mono)",
        fontSize: 10,
      }}
    >
      {children}
    </kbd>
  );
}

function TipsPanel() {
  const tips = [
    { n: "01", t: "Get close", d: "Fill the frame. The model needs texture and shape detail." },
    { n: "02", t: "Good lighting", d: "Avoid harsh shadows. Overcast or open shade is ideal." },
    { n: "03", t: "Scale reference", d: "A coin, a hiking pole, or your boot works perfectly." },
    { n: "04", t: "Don't touch", d: "Seriously. Some species carry transmissible pathogens." },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          background: "var(--paper)",
          border: "1px solid var(--bone-3)",
          borderRadius: 16,
          padding: 22,
        }}
      >
        <div className="sd-eyebrow" style={{ marginBottom: 12 }}>
          📖 FIELD TIPS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tips.map((tp) => (
            <div
              key={tp.n}
              style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 14 }}
            >
              <div
                className="sd-mono"
                style={{ fontSize: 13, color: "var(--forest)", fontWeight: 600 }}
              >
                {tp.n}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{tp.t}</div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-3)",
                    marginTop: 2,
                    lineHeight: 1.45,
                  }}
                >
                  {tp.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: "var(--paper)",
          border: "1px solid var(--bone-3)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <div className="sd-eyebrow" style={{ marginBottom: 10 }}>
          EXAMPLE SHOTS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {["good · scale", "good · close", "bad · blurry"].map((label, i) => (
            <div
              key={label}
              className="sd-ph"
              style={{ aspectRatio: "1", position: "relative" }}
            >
              <span style={{ position: "absolute", bottom: 6, left: 6, right: 6 }}>{label}</span>
              {i === 2 && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    fontSize: 11,
                    background: "var(--danger)",
                    color: "white",
                    padding: "1px 6px",
                    borderRadius: 4,
                  }}
                >
                  ✕
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          padding: "14px 16px",
          borderRadius: 12,
          background: "oklch(0.95 0.04 145)",
          border: "1px solid oklch(0.78 0.10 145)",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <div style={{ fontSize: 18 }}>🔬</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-2)" }}>
          <b>Why we ask.</b> Anonymized photos help train the model and feed the National Mammal
          Tracking Initiative&apos;s range maps. Opt out anytime in settings.
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Analyzing state ───────────────────────── */

function AnalyzingPreview({ src }: { src: string | null }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid var(--bone-3)",
        background: "var(--paper)",
        minHeight: 460,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Your photo"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          className="sd-ph"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 0,
            background: "linear-gradient(180deg, oklch(0.55 0.04 90), oklch(0.40 0.05 70))",
            color: "oklch(0.92 0.02 80)",
          }}
        >
          user photo · trail bed · fresh sample
        </div>
      )}
      <div
        className="sd-scan"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, var(--ok), transparent)",
          boxShadow: "0 0 18px var(--ok)",
        }}
      />
      {[
        { t: 12, l: 12, bt: 1, bl: 1 },
        { t: 12, r: 12, bt: 1, br: 1 },
        { b: 12, l: 12, bb: 1, bl: 1 },
        { b: 12, r: 12, bb: 1, br: 1 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: p.t,
            bottom: p.b,
            left: p.l,
            right: p.r,
            width: 22,
            height: 22,
            borderTop: p.bt ? "2px solid var(--ok)" : "none",
            borderBottom: p.bb ? "2px solid var(--ok)" : "none",
            borderLeft: p.bl ? "2px solid var(--ok)" : "none",
            borderRight: p.br ? "2px solid var(--ok)" : "none",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          background: "rgba(0,0,0,.55)",
          backdropFilter: "blur(8px)",
          borderRadius: 10,
          padding: "10px 14px",
          color: "white",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: ".06em",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>▸ EXTRACTING TEXTURE FEATURES</span>
          <span style={{ color: "oklch(0.85 0.10 145)" }}>74%</span>
        </div>
        <div
          style={{
            height: 3,
            background: "rgba(255,255,255,.2)",
            marginTop: 8,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div style={{ width: "74%", height: "100%", background: "var(--ok)" }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        width: 320,
        borderRadius: 18,
        padding: 4,
        background: "var(--bone-3)",
        boxShadow: "var(--sh-2)",
      }}
    >
      <div
        style={{
          background: "var(--paper)",
          borderRadius: 14,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SkelLine w={64} h={18} radius={999} />
          <SkelLine w={48} h={12} />
        </div>
        <SkelLine w="100%" h={170} radius={10} />
        <SkelLine w="70%" h={20} />
        <SkelLine w="50%" h={12} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 4 }}>
          <SkelLine h={26} radius={6} />
          <SkelLine h={26} radius={6} />
          <SkelLine h={26} radius={6} />
        </div>
        <SkelLine h={36} radius={6} />
      </div>
    </div>
  );
}

function SkelLine({
  w = "100%",
  h = 12,
  radius = 4,
}: {
  w?: string | number;
  h?: number;
  radius?: number;
}) {
  return <div className="sd-skeleton" style={{ width: w, height: h, borderRadius: radius }} />;
}

function StatusList() {
  const lines = [
    { sym: "✓", color: "var(--ok)", text: "photo received" },
    { sym: "✓", color: "var(--ok)", text: "background segmented" },
    { sym: "✓", color: "var(--ok)", text: "shape signature extracted" },
    { sym: "●", color: "var(--warn)", text: "matching against 200 species…", dim: false },
    { sym: "◌", color: "var(--ink-4)", text: "generating card", dim: true },
    { sym: "◌", color: "var(--ink-4)", text: "checking conservation flags", dim: true },
  ];
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        background: "var(--bone-2)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--ink-3)",
        lineHeight: 1.8,
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ opacity: l.dim ? 0.4 : 1 }}>
          ▸ <span style={{ color: l.color }}>{l.sym}</span> {l.text}
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Reveal state ───────────────────────── */

function RevealView({
  card,
  photo,
  collected,
  feedback,
  onFeedback,
  onCollect,
  onAgain,
  result,
}: {
  card: ScatCardData;
  photo: string | null;
  collected: boolean;
  feedback: "up" | "down" | null;
  onFeedback: (v: "up" | "down") => void;
  onCollect: () => void;
  onAgain: () => void;
  result: IdentifyResult | null;
}) {
  const confPct = result && result.confidence > 0 ? (result.confidence * 100).toFixed(1) : null;
  const usedFallback = result?.source === "mock";
  const noMatch = usedFallback && result?.errorReason === "no_match";

  const sourceBadge: Record<string, { label: string; color: string }> = {
    yolo: { label: "YOLO · AnimalClue", color: "var(--forest)" },
    claude: { label: "Claude Vision", color: "var(--clay)" },
    claude_fallback: { label: "Claude (YOLO was unsure)", color: "var(--clay)" },
    mock: { label: "sample card", color: "var(--ink-3)" },
  };
  const badge = result ? sourceBadge[result.source] : null;
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 50% at 50% 35%, oklch(0.93 0.08 80) 0%, var(--bone) 70%)",
          pointerEvents: "none",
        }}
      />
      <Container style={{ position: "relative", paddingTop: 36, paddingBottom: 60 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="sd-eyebrow" style={{ marginBottom: 8 }}>
            ✨ IDENTIFICATION COMPLETE
          </div>
          <h1
            className="sd-display"
            style={{
              margin: 0,
              fontSize: 56,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              fontVariationSettings: "'opsz' 48",
            }}
          >
            You found a <i style={{ color: "var(--clay)" }}>{card.rarity}</i>.
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--ink-2)" }}>
            {noMatch ? (
              <>
                <span style={{ color: "var(--warn)" }}>⚠ no scat detected in this photo</span> ·
                showing a sample card
              </>
            ) : usedFallback ? (
              <>
                <span style={{ color: "var(--warn)" }}>⚠ model offline</span> · showing a sample
                card
              </>
            ) : badge && confPct ? (
              <>
                Model confidence: <b style={{ color: "var(--ink)" }}>{confPct}%</b> ·{" "}
                <span style={{ color: badge.color, fontWeight: 600 }}>{badge.label}</span>
              </>
            ) : (
              <>Identification complete</>
            )}
          </p>
          {result?.reasoning && (
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: "var(--ink-3)",
                fontStyle: "italic",
                maxWidth: 640,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              &ldquo;{result.reasoning}&rdquo;
            </p>
          )}
          {result?.source === "claude_fallback" && result.yoloPick && (
            <p
              className="sd-mono"
              style={{
                margin: "8px 0 0",
                fontSize: 11,
                color: "var(--ink-3)",
                letterSpacing: ".08em",
              }}
            >
              YOLO guessed: {result.yoloPick.species} ({(result.yoloPick.confidence * 100).toFixed(1)}%) — too low to trust
            </p>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 32,
            alignItems: "center",
            marginBottom: 36,
          }}
        >
          <div style={{ justifySelf: "end", maxWidth: 280 }}>
            <div className="sd-eyebrow" style={{ marginBottom: 8 }}>
              YOUR SHOT
            </div>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt="Your shot"
                style={{ width: 240, height: 240, objectFit: "cover", borderRadius: 14 }}
              />
            ) : (
              <div
                className="sd-ph"
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 14,
                  background:
                    "linear-gradient(180deg, oklch(0.55 0.04 90), oklch(0.40 0.05 70))",
                  color: "oklch(0.92 0.02 80)",
                }}
              >
                user photo · trail bed
              </div>
            )}
            <div
              className="sd-mono"
              style={{
                fontSize: 10,
                color: "var(--ink-3)",
                marginTop: 8,
                letterSpacing: ".08em",
              }}
            >
              IMG · uploaded just now
              <br />
              {card.identifiedAt}
              <br />
              {card.location}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: -30,
                background:
                  "radial-gradient(50% 50% at 50% 50%, oklch(0.85 0.18 80 / 0.45), transparent 70%)",
                filter: "blur(20px)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }} className="sd-card-reveal">
              <ScatCard card={card} />
            </div>
          </div>

          <div style={{ maxWidth: 280 }}>
            <div className="sd-eyebrow" style={{ marginBottom: 8 }}>
              DID WE GET IT RIGHT?
            </div>
            <div
              style={{
                background: "var(--paper)",
                border: "1px solid var(--bone-3)",
                borderRadius: 14,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "var(--ink-2)",
                  marginBottom: 12,
                }}
              >
                {feedback === "up"
                  ? "Thanks! Glad we got it."
                  : feedback === "down"
                  ? "Got it — we'll review."
                  : "Your feedback trains the model. Be honest — even a wrong guess teaches us."}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="sd-btn sd-btn-soft"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    background: feedback === "up" ? "var(--bone-2)" : undefined,
                  }}
                  onClick={() => onFeedback("up")}
                >
                  👍 Nailed it
                </button>
                <button
                  className="sd-btn sd-btn-soft"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    background: feedback === "down" ? "var(--bone-2)" : undefined,
                  }}
                  onClick={() => onFeedback("down")}
                >
                  👎 Off
                </button>
              </div>
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: "1px solid var(--bone-3)",
                }}
              >
                <div
                  className="sd-mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: ".1em",
                    color: "var(--ink-3)",
                    marginBottom: 6,
                  }}
                >
                  NEXT BEST GUESS
                </div>
                {result?.runnerUp ? (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{result.runnerUp.species}</div>
                    <div
                      className="sd-mono"
                      style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}
                    >
                      {(result.runnerUp.confidence * 100).toFixed(1)}% · CLAIM INSTEAD →
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: "var(--ink-3)", fontStyle: "italic" }}>
                    No close second.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button
            className="sd-btn sd-btn-primary"
            style={{ padding: "14px 24px", fontSize: 15 }}
            onClick={onCollect}
            disabled={collected}
          >
            {collected ? "✓ Added!" : "＋ Add to Collection"}
          </button>
          <button
            className="sd-btn sd-btn-ghost"
            style={{ padding: "14px 24px", fontSize: 15 }}
            onClick={onAgain}
          >
            Identify Another
          </button>
          <button
            className="sd-btn sd-btn-soft"
            style={{ padding: "14px 24px", fontSize: 15 }}
            onClick={() => alert("Map pin: coming soon.")}
          >
            📍 Pin to Map
          </button>
        </div>
      </Container>
    </div>
  );
}
