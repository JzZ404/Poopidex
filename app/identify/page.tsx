"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import ScatCard from "@/components/cards/ScatCard";
import { addToCollection, getCollection } from "@/lib/collection";
import { ScatCard as ScatCardData } from "@/lib/types";
import { identifyPhoto, IdentifyResult, IdentifyStep } from "@/lib/identify";
import {
  UserHints,
  SizeBucket,
  ContentTag,
  HabitatTag,
  SIZE_LABELS,
  CONTENT_LABELS,
  HABITAT_LABELS,
} from "@/lib/speciesAttributes";

type Phase = "upload" | "analyzing" | "reveal";

/* Maps backend step events → status-list step index (0-based).
   Backend emits 5 events; StatusList shows 5 steps in the same order. */
const STEP_INDEX: Record<IdentifyStep, number> = {
  photo_received: 1,   // step 0 done → step 1 active
  hints_filtered: 2,   // step 1 done → step 2 active
  clip_done:      3,   // step 2 done → step 3 active
  claude_done:    4,   // step 3 done → step 4 active
  result:         5,   // step 4 done → all done
};

export default function IdentifyPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [hints, setHints] = useState<UserHints>({});
  const [card, setCard] = useState<ScatCardData | null>(null);
  const [identifyResult, setIdentifyResult] = useState<IdentifyResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [collected, setCollected] = useState(false);
  const [existingSpeciesCount, setExistingSpeciesCount] = useState(0);
  // Real-time analyzing progress (driven by SSE events from /api/identify)
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setPhase("upload");
    setPreview(null);
    setPendingFile(null);
    setHints({});
    setCard(null);
    setIdentifyResult(null);
    setFeedback(null);
    setCollected(false);
    setExistingSpeciesCount(0);
    setAnalyzeStep(0);
  }, []);

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
  }, [phase, reset]);

  async function handleFile(file: File) {
    const dataUrl = await readAsDataURL(file);
    setPendingFile(file);
    setPreview(dataUrl);
    // Don't auto-identify — wait for user to click "Identify" so they can fill hints first
  }

  // All three field-detail inputs are required before the user can identify.
  // The Identify button is disabled until this is true.
  const hintsComplete = Boolean(
    hints.size && hints.habitat && hints.contents && hints.contents.length > 0
  );

  async function runIdentify() {
    if (!pendingFile || !preview || !hintsComplete) return;
    setPhase("analyzing");
    setAnalyzeStep(0);

    // Stream pipeline progress from the server — onStep advances the bar in
    // real time as each backend stage completes.
    const result = await identifyPhoto(pendingFile, preview, hints, (step) => {
      setAnalyzeStep(STEP_INDEX[step] ?? 0);
    });

    setCard(result.card);
    setIdentifyResult(result);
    setExistingSpeciesCount(
      getCollection().filter((entry) => entry.card.species === result.card.species).length
    );
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
              preview={preview}
              hintsComplete={hintsComplete}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onPickClick={() => fileInputRef.current?.click()}
              onIdentify={runIdentify}
              onClear={() => {
                setPendingFile(null);
                setPreview(null);
              }}
            />
            <HintsPanel hints={hints} setHints={setHints} />
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
              <StatusList currentStep={analyzeStep} />
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
          existingSpeciesCount={existingSpeciesCount}
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
  preview,
  hintsComplete,
  onDragOver,
  onDragLeave,
  onDrop,
  onPickClick,
  onIdentify,
  onClear,
}: {
  dragging: boolean;
  preview: string | null;
  hintsComplete: boolean;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDragLeave: React.DragEventHandler<HTMLDivElement>;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onPickClick: () => void;
  onIdentify: () => void;
  onClear: () => void;
}) {
  // When a file is selected, show the preview + identify CTA
  if (preview) {
    return (
      <div
        style={{
          background: "var(--paper)",
          border: "1px solid var(--bone-3)",
          borderRadius: 20,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          minHeight: 460,
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
            borderRadius: 14,
            overflow: "hidden",
            background: "var(--bone-2)",
            minHeight: 340,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Your photo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
          <button
            className="sd-btn sd-btn-soft"
            onClick={onClear}
            style={{ padding: "10px 18px" }}
          >
            ✕ Use a different photo
          </button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <button
              className="sd-btn sd-btn-primary"
              onClick={onIdentify}
              disabled={!hintsComplete}
              style={{ padding: "10px 24px", fontSize: 15 }}
              title={hintsComplete ? undefined : "Fill in all three field details first"}
            >
              🔍 Identify this find →
            </button>
            {!hintsComplete && (
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ink-3)",
                  fontStyle: "italic",
                }}
              >
                Fill in all three field details to continue →
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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

/* ───────────────────────── Hints panel ─────────────────────────────
   User-provided cues that help disambiguate when the model is uncertain.
   All optional. Size is the strongest disambiguator (bear vs raccoon, etc.). */
function HintsPanel({
  hints,
  setHints,
}: {
  hints: UserHints;
  setHints: (h: UserHints) => void;
}) {
  const sizeOpts = Object.keys(SIZE_LABELS) as SizeBucket[];
  const contentOpts = Object.keys(CONTENT_LABELS) as ContentTag[];
  const habitatOpts = Object.keys(HABITAT_LABELS) as HabitatTag[];

  const anyHints = Boolean(
    hints.size ||
      hints.habitat ||
      (hints.contents && hints.contents.length > 0)
  );

  function toggleContent(c: ContentTag) {
    const cur = hints.contents ?? [];
    setHints({
      ...hints,
      contents: cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c],
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          background: "var(--paper)",
          border: "1px solid var(--bone-3)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <div className="sd-eyebrow">📐 FIELD DETAILS</div>
          {anyHints && (
            <button
              onClick={() => setHints({})}
              style={{
                background: "none",
                border: "none",
                color: "var(--ink-3)",
                fontSize: 11,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              clear all
            </button>
          )}
        </div>
        <p style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.5, margin: "0 0 18px" }}>
          <b style={{ color: "var(--danger)" }}>All fields required.</b> These observations are crucial for accurate ID — the model can&apos;t see size, smell, or where you actually are.
        </p>

        {/* SIZE */}
        <HintSection label="Size" complete={Boolean(hints.size)}>
          {sizeOpts.map((s) => (
            <Chip
              key={s}
              active={hints.size === s}
              onClick={() => setHints({ ...hints, size: hints.size === s ? undefined : s })}
            >
              {SIZE_LABELS[s]}
            </Chip>
          ))}
        </HintSection>

        {/* CONTENTS (multi-select) */}
        <HintSection
          label="Visible contents · pick at least one"
          complete={Boolean(hints.contents && hints.contents.length > 0)}
        >
          {contentOpts.map((c) => (
            <Chip
              key={c}
              active={(hints.contents ?? []).includes(c)}
              onClick={() => toggleContent(c)}
            >
              {CONTENT_LABELS[c]}
            </Chip>
          ))}
        </HintSection>

        {/* HABITAT */}
        <HintSection label="Habitat" complete={Boolean(hints.habitat)}>
          {habitatOpts.map((h) => (
            <Chip
              key={h}
              active={hints.habitat === h}
              onClick={() => setHints({ ...hints, habitat: hints.habitat === h ? undefined : h })}
            >
              {HABITAT_LABELS[h]}
            </Chip>
          ))}
        </HintSection>
      </div>

      <div
        style={{
          padding: "12px 14px",
          borderRadius: 12,
          background: "oklch(0.95 0.04 145)",
          border: "1px solid oklch(0.78 0.10 145)",
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <div style={{ fontSize: 16 }}>💡</div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--ink-2)" }}>
          Even one hint helps a lot. <b>Size alone</b> usually settles bear vs. raccoon vs. deer.
        </div>
      </div>
    </div>
  );
}

function HintSection({
  label,
  complete,
  children,
}: {
  label: string;
  complete: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        className="sd-mono"
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: ".12em",
          color: "var(--ink-3)",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>{label}</span>
        {complete ? (
          <span style={{ color: "var(--ok)", fontSize: 11 }}>✓</span>
        ) : (
          <span style={{ color: "var(--danger)", fontSize: 11, fontWeight: 700 }}>* required</span>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        fontSize: 12.5,
        fontWeight: 500,
        cursor: "pointer",
        border: `1px solid ${active ? "var(--ink)" : "var(--bone-3)"}`,
        background: active ? "var(--ink)" : "var(--bone)",
        color: active ? "var(--bone)" : "var(--ink-2)",
        transition: "background .12s, color .12s, border-color .12s",
        fontFamily: "inherit",
        textAlign: "left",
        lineHeight: 1.25,
      }}
    >
      {children}
    </button>
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

/* Analyzing status list — controlled by the parent via `currentStep`.
   Step indices match the IdentifyStep events emitted by /api/identify, so
   the UI advances in real lockstep with the server pipeline.

     0 = waiting to start
     1 = "photo_received" fired      → "Applying field details" active
     2 = "hints_filtered" fired      → "Specialist model voting" active
     3 = "clip_done" fired           → "Senior naturalist analyzing" active
     4 = "claude_done" fired         → "Finalizing identification" active
     5 = "result" fired              → all steps done */
const STATUS_STEPS = [
  "Photo received",
  "Applying your field details",
  "Specialist model voting",
  "Senior naturalist analyzing photo",
  "Finalizing identification",
];

function StatusList({ currentStep }: { currentStep: number }) {
  // Progress bar: percent of completed steps. Snaps to step boundaries.
  // CSS transition smooths the visual transition between snaps.
  const progress = Math.min(100, (currentStep / STATUS_STEPS.length) * 100);

  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        background: "var(--bone-2)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--ink-3)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Progress bar */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "var(--ink-3)",
            marginBottom: 4,
            letterSpacing: ".08em",
          }}
        >
          <span>ANALYZING…</span>
          <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>
            {progress.toFixed(0)}%
          </span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 999,
            background: "var(--bone-3)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--forest), var(--moss))",
              borderRadius: 999,
              transition: "width .12s linear",
            }}
          />
        </div>
      </div>

      {/* Step list */}
      <div style={{ lineHeight: 1.8 }}>
        {STATUS_STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          const sym = done ? "✓" : active ? "●" : "◌";
          const color = done
            ? "var(--ok)"
            : active
            ? "var(--warn)"
            : "var(--ink-4)";
          return (
            <div
              key={i}
              style={{
                opacity: done ? 0.55 : active ? 1 : 0.35,
                color: active ? "var(--ink)" : "var(--ink-3)",
                transition: "opacity .25s ease, color .25s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ▸
              <span
                style={{
                  color,
                  display: "inline-flex",
                  alignItems: "center",
                  width: 14,
                  animation: active ? "sd-pulse 1.2s ease-in-out infinite" : "none",
                }}
              >
                {sym}
              </span>
              <span>{step}</span>
              {active && (
                <span
                  className="sd-mono"
                  style={{
                    marginLeft: "auto",
                    fontSize: 9,
                    color: "var(--ink-4)",
                    letterSpacing: ".08em",
                  }}
                >
                  in progress
                </span>
              )}
            </div>
          );
        })}
      </div>
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
  existingSpeciesCount,
}: {
  card: ScatCardData;
  photo: string | null;
  collected: boolean;
  feedback: "up" | "down" | null;
  onFeedback: (v: "up" | "down") => void;
  onCollect: () => void;
  onAgain: () => void;
  result: IdentifyResult | null;
  existingSpeciesCount: number;
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
  const rarityColor: Record<ScatCardData["rarity"], string> = {
    Common: "var(--r-common)",
    Uncommon: "var(--r-uncommon)",
    Rare: "var(--r-rare)",
    Legendary: "var(--r-legendary)",
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
            You found a <i style={{ color: rarityColor[card.rarity] }}>{card.rarity}</i>.
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
              CLIP guessed: {result.yoloPick.species} ({(result.yoloPick.confidence * 100).toFixed(1)}%) — too low to trust
            </p>
          )}
          {result?.hintChangedTop && result.yoloPick && card && (
            <div
              style={{
                margin: "12px auto 0",
                maxWidth: 600,
                padding: "10px 14px",
                background: "oklch(0.95 0.05 70)",
                border: "1px solid oklch(0.78 0.10 70)",
                borderRadius: 10,
                fontSize: 12.5,
                lineHeight: 1.5,
                color: "var(--ink-2)",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 14 }}>🎯</span>
              <span>
                <b>Your details narrowed it down.</b> The model originally leaned{" "}
                <b>{result.yoloPick.species}</b>, but your size / shape / habitat hints pointed to{" "}
                <b>{card.species}</b>.
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 280px",
            gap: 32,
            alignItems: "start",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <div>
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
                {existingSpeciesCount === 0 && (
                  <div
                    className="sd-mono"
                    style={{
                      position: "absolute",
                      top: -14,
                      left: -16,
                      zIndex: 4,
                      padding: "8px 11px",
                      borderRadius: 999,
                      background: "var(--forest)",
                      color: "white",
                      border: "3px solid var(--bone)",
                      boxShadow: "var(--sh-2)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".12em",
                    }}
                  >
                    NEW
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                width: 320,
                marginTop: 14,
                textAlign: "center",
                fontSize: 13,
                color: "var(--ink-2)",
                lineHeight: 1.45,
              }}
            >
              {existingSpeciesCount > 0 ? (
                <>
                  Already in your Dex ·{" "}
                  <b style={{ color: "var(--ink)" }}>
                    {existingSpeciesCount} {existingSpeciesCount === 1 ? "card" : "cards"} owned
                  </b>
                </>
              ) : (
                <b style={{ color: "var(--forest)" }}>New discovery · not yet in your Dex</b>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div className="sd-eyebrow" style={{ marginBottom: 8 }}>
                YOUR SHOT
              </div>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt="Your shot"
                  style={{ width: 280, height: 180, objectFit: "cover", borderRadius: 14 }}
                />
              ) : (
                <div
                  className="sd-ph"
                  style={{
                    width: 280,
                    height: 180,
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
            className="sd-btn sd-btn-soft"
            style={{ padding: "14px 24px", fontSize: 15, color: "var(--danger)" }}
            onClick={onAgain}
          >
            ✕ Discard Card
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
