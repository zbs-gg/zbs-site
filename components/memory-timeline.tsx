"use client";

import { useEffect, useRef, useState, useMemo } from "react";

type EventDot = {
  text: string;
  daysAgo: number;
  base: number; // initial salience 0..1
  anchor: boolean;
};

// 40 events spread over ~365 days. 5 anchors + 35 regular.
// Mix of life events and work moments — generic enough to read as
// "any user's life", anchored where structural truth would anchor.
const EVENTS: EventDot[] = [
  // anchors (user_flag=true) — life-defining structural events
  { text: "started a new job",            daysAgo: 332, base: 0.95, anchor: true  },
  { text: "moved across the world",       daysAgo: 268, base: 0.95, anchor: true  },
  { text: "lost a parent",                daysAgo: 187, base: 0.97, anchor: true  },
  { text: "decided to quit drinking",     daysAgo: 109, base: 0.92, anchor: true  },
  { text: "released first paper",         daysAgo: 41,  base: 0.91, anchor: true  },
  // regular events — work + life
  { text: "found a great cafe",           daysAgo: 358, base: 0.55, anchor: false },
  { text: "long meeting",                 daysAgo: 348, base: 0.40, anchor: false },
  { text: "shipped retrieval refactor",   daysAgo: 339, base: 0.65, anchor: false },
  { text: "gym session",                  daysAgo: 326, base: 0.30, anchor: false },
  { text: "lunch with K.",                daysAgo: 318, base: 0.50, anchor: false },
  { text: "fixed extractor bug",          daysAgo: 305, base: 0.55, anchor: false },
  { text: "sleepless night",              daysAgo: 295, base: 0.78, anchor: false },
  { text: "weekend trip",                 daysAgo: 281, base: 0.62, anchor: false },
  { text: "argument with partner",        daysAgo: 263, base: 0.81, anchor: false },
  { text: "shipped v2 of bench",          daysAgo: 251, base: 0.72, anchor: false },
  { text: "ran out of coffee",            daysAgo: 240, base: 0.20, anchor: false },
  { text: "ran a marathon",               daysAgo: 224, base: 0.86, anchor: false },
  { text: "broke laptop",                 daysAgo: 213, base: 0.55, anchor: false },
  { text: "doctor appointment",           daysAgo: 200, base: 0.75, anchor: false },
  { text: "first 1k stars on github",     daysAgo: 178, base: 0.83, anchor: false },
  { text: "gym session",                  daysAgo: 165, base: 0.30, anchor: false },
  { text: "good chat with old friend",    daysAgo: 154, base: 0.68, anchor: false },
  { text: "found a leak in pulse",        daysAgo: 142, base: 0.74, anchor: false },
  { text: "argument resolved",            daysAgo: 131, base: 0.55, anchor: false },
  { text: "first pulse paying user",      daysAgo: 122, base: 0.80, anchor: false },
  { text: "small panic attack",           daysAgo: 113, base: 0.86, anchor: false },
  { text: "got an interview",             daysAgo: 99,  base: 0.78, anchor: false },
  { text: "shipped hearth alpha",         daysAgo: 87,  base: 0.84, anchor: false },
  { text: "weekend away",                 daysAgo: 78,  base: 0.66, anchor: false },
  { text: "gym session",                  daysAgo: 70,  base: 0.30, anchor: false },
  { text: "investor said no",             daysAgo: 64,  base: 0.78, anchor: false },
  { text: "fixed slow query",             daysAgo: 55,  base: 0.50, anchor: false },
  { text: "good morning swim",            daysAgo: 47,  base: 0.42, anchor: false },
  { text: "long writing session",         daysAgo: 38,  base: 0.62, anchor: false },
  { text: "anxiety spike",                daysAgo: 32,  base: 0.80, anchor: false },
  { text: "pulse v3 SOTA on bench",       daysAgo: 24,  base: 0.88, anchor: false },
  { text: "great evening with E.",        daysAgo: 17,  base: 0.79, anchor: false },
  { text: "lunch by myself",              daysAgo: 12,  base: 0.30, anchor: false },
  { text: "shipped multi-provider layer", daysAgo: 6,   base: 0.74, anchor: false },
  { text: "morning coffee",               daysAgo: 1,   base: 0.40, anchor: false },
];

// decay constants — match Pulse v3 paper defaults
const LAMBDA_REG     = 0.005;   // half-life ~139 days
const LAMBDA_ANCHOR  = 0.0005;  // half-life ~1386 days
const ANCHOR_FLOOR   = 0.85;    // anchor never sinks below this (× base)

function salience(e: EventDot, anchorAware: boolean): number {
  const lambda = anchorAware && e.anchor ? LAMBDA_ANCHOR : LAMBDA_REG;
  let s = e.base * Math.exp(-lambda * e.daysAgo);
  if (anchorAware && e.anchor) {
    s = Math.max(s, e.base * ANCHOR_FLOOR);
  }
  return Math.max(0, Math.min(1, s));
}

const MAX_DAYS = 365;
const PADDING = { left: 56, right: 24, top: 28, bottom: 36 };
const POINTER_RADIUS_PX = 22;

export function MemoryTimeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 280 });
  const [anchorAware, setAnchorAware] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Compute current salience for both modes (we always have both ready
  // so the toggle animation is instant).
  const computed = useMemo(
    () => EVENTS.map((e, i) => ({
      i,
      e,
      sOn:  salience(e, true),
      sOff: salience(e, false),
    })),
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.floor(rect.width), h: 280 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Map (daysAgo, salience) to (x, y) pixels.
  const xy = (daysAgo: number, s: number) => {
    const x = PADDING.left + (1 - daysAgo / MAX_DAYS) * (size.w - PADDING.left - PADDING.right);
    const y = PADDING.top + (1 - s) * (size.h - PADDING.top - PADDING.bottom);
    return { x, y };
  };

  // Render
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width  = size.w * dpr;
    c.height = size.h * dpr;
    c.style.width  = `${size.w}px`;
    c.style.height = `${size.h}px`;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, size.w, size.h);

    // Axes
    ctx.strokeStyle = "rgba(245,245,245,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING.left, PADDING.top);
    ctx.lineTo(PADDING.left, size.h - PADDING.bottom);
    ctx.lineTo(size.w - PADDING.right, size.h - PADDING.bottom);
    ctx.stroke();

    // Y ticks: 0 / 0.5 / 1.0
    ctx.fillStyle = "rgba(245,245,245,0.45)";
    ctx.font = '10px ui-monospace, "SF Mono", monospace';
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    [0, 0.5, 1.0].forEach((s) => {
      const { y } = xy(0, s);
      ctx.fillText(s.toFixed(1), PADDING.left - 8, y);
      ctx.strokeStyle = "rgba(245,245,245,0.06)";
      ctx.beginPath();
      ctx.moveTo(PADDING.left, y);
      ctx.lineTo(size.w - PADDING.right, y);
      ctx.stroke();
    });
    ctx.save();
    ctx.translate(14, (size.h - PADDING.bottom + PADDING.top) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(245,245,245,0.55)";
    ctx.fillText("salience", 0, 0);
    ctx.restore();

    // X ticks: today, -90d, -180d, -365d
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(245,245,245,0.45)";
    [
      { d: 0,   l: "today" },
      { d: 90,  l: "−90d" },
      { d: 180, l: "−180d" },
      { d: 365, l: "−365d" },
    ].forEach(({ d, l }) => {
      const { x } = xy(d, 0);
      ctx.fillText(l, x, size.h - PADDING.bottom + 6);
    });

    // Plot order: regular first (so anchors render on top)
    const ordered = [...computed].sort((a, b) => Number(a.e.anchor) - Number(b.e.anchor));

    for (const item of ordered) {
      const s = anchorAware ? item.sOn : item.sOff;
      const { x, y } = xy(item.e.daysAgo, s);

      const alpha = Math.min(1, 0.25 + s * 0.85);
      const isAnchor = item.e.anchor;
      const r = isAnchor ? 4.5 : 2.6;

      ctx.fillStyle = isAnchor
        ? `rgba(255, 255, 255, ${0.45 + s * 0.55})`
        : `rgba(245, 245, 245, ${alpha * 0.85})`;

      ctx.beginPath();
      if (isAnchor) {
        // Diamond shape for anchors
        ctx.moveTo(x, y - r);
        ctx.lineTo(x + r, y);
        ctx.lineTo(x, y + r);
        ctx.lineTo(x - r, y);
        ctx.closePath();
      } else {
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill();

      // Anchor crisp outline
      if (isAnchor) {
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Highlight hovered
      if (hoverIdx === item.i) {
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, r + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }, [size, anchorAware, hoverIdx, computed]);

  // Pointer hit-test (find nearest dot within radius)
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    let best: { i: number; d: number } | null = null;
    for (const item of computed) {
      const s = anchorAware ? item.sOn : item.sOff;
      const { x, y } = xy(item.e.daysAgo, s);
      const d = Math.hypot(x - px, y - py);
      if (!best || d < best.d) best = { i: item.i, d };
    }
    if (best && best.d <= POINTER_RADIUS_PX) {
      setHoverIdx(best.i);
      setHoverPos({ x: px, y: py });
    } else {
      setHoverIdx(null);
    }
  };

  const onPointerLeave = () => setHoverIdx(null);

  const hovered = hoverIdx != null ? computed[hoverIdx] : null;
  const hoveredS = hovered ? (anchorAware ? hovered.sOn : hovered.sOff) : 0;

  return (
    <div className="mt-wrap" ref={containerRef}>
      <div className="mt-head">
        <div className="mt-title">
          <span className="mt-title-key">salience over 365 days</span>
          <span className="mt-title-sub">
            (◆ = structural anchors · ● = regular events)
          </span>
        </div>
        <button
          type="button"
          className={`mt-toggle ${anchorAware ? "is-on" : "is-off"}`}
          onClick={() => setAnchorAware((v) => !v)}
        >
          anchor-aware decay: {anchorAware ? "ON" : "OFF"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ display: "block", width: "100%", height: 280 }}
      />

      {hovered && (
        <div
          className="mt-tip"
          style={{
            transform: `translate(${Math.min(hoverPos.x + 14, size.w - 220)}px, ${
              hoverPos.y + 14
            }px)`,
          }}
        >
          <div className="mt-tip-text">{hovered.e.text}</div>
          <div className="mt-tip-meta">
            <span>{hovered.e.daysAgo}d ago</span>
            <span>{hovered.e.anchor ? "anchor" : "event"}</span>
            <span className="mt-tip-s">salience {hoveredS.toFixed(2)}</span>
          </div>
          {hovered.e.anchor && (
            <div className="mt-tip-note">
              {anchorAware
                ? "preserved by anchor-aware decay (λ=0.0005, floor 0.85)"
                : "lost in noise without anchor-aware decay"}
            </div>
          )}
        </div>
      )}

      <div className="mt-legend">
        <span>
          regular: <code>s = base · exp(−0.005 · days)</code> → half-life ≈ 139d
        </span>
        <span>
          anchor: <code>s = max(base · exp(−0.0005 · days), base · 0.85)</code> → preserved
        </span>
      </div>
    </div>
  );
}
