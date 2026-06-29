"use client";

import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

// === ZBS easter eggs + memes (spec §4) ===
// Single site-wide client component mounted in app/layout.tsx, next to
// <ClickWipe />. Renders `null` until a trigger fires, then a single fixed,
// dismissible ASCII popup in the mono/holo house style. No external images.
//
// Hard constraints honored here:
//  - never modal, never traps focus (no overlay; only the popup gets pointer
//    events; we never auto-focus it).
//  - dismissible via close button, Escape, or 6s auto-timeout.
//  - reduced-motion safe: no entrance animation when the user opts out.
//  - each meme fires at most once per page load; one popup at a time.
//  - event-delegation on document/window only — no edits to other components.

type Meme = { key: string; title: string; body: string };

const MEMES: Record<string, Meme> = {
  konami: {
    key: "konami",
    title: "↑↑↓↓←→←→ B A",
    body: `it sees everything.
it remembers everything.
it even remembers THAT.
      — no reset. no amnesia.`,
  },
  brand7: {
    key: "brand7",
    title: "zbs (adj.) — genuinely excellent",
    body: `you clicked the mark seven times.
logged. timestamped. yours.
(locally. obviously.)`,
  },
  footer: {
    key: "footer",
    title: "you reached the end",
    body: ` ___
(o o)   the Eye already knew
 \\_/    you'd scroll this far.`,
  },
  clicks42: {
    key: "clicks42",
    title: "42 clicks",
    body: `the Eye is taking notes.
on-device. nothing leaves.`,
  },
};

// up up down down left right left right b a
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const BRAND_CLICK_TARGET = 7;
const BRAND_WINDOW_MS = 1200;
const TOTAL_CLICK_TARGET = 42;
const AUTO_DISMISS_MS = 6000;

export function EasterEggs() {
  const [active, setActive] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);

  // Resolve reduced-motion once, at first render, so the popup never flashes
  // an entrance animation for users who opted out.
  const [reduce] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );

  // Trigger bookkeeping that must not cause re-renders.
  const fired = useRef<Set<string>>(new Set());
  const konamiBuf = useRef<string[]>([]);
  const totalClicks = useRef(0);
  const brandClicks = useRef(0);
  const brandLastClick = useRef(0);

  const fire = useCallback((key: string) => {
    if (fired.current.has(key)) return; // at most once per page load
    if (!MEMES[key]) return;
    fired.current.add(key);
    setEntered(false);
    setActive(key); // a new trigger replaces whatever is showing
  }, []);

  const dismiss = useCallback(() => setActive(null), []);

  // --- keydown: Konami sequence + Escape-to-dismiss ---
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        setActive((cur) => (cur ? null : cur));
        return; // Escape never feeds the Konami buffer
      }
      // Don't capture keys while the user is typing in a field.
      const ae = document.activeElement as HTMLElement | null;
      const tag = ae?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || ae?.isContentEditable) return;

      const k = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
      const buf = konamiBuf.current;
      buf.push(k);
      if (buf.length > KONAMI.length) buf.shift();
      if (
        buf.length === KONAMI.length &&
        KONAMI.every((v, i) => v === buf[i])
      ) {
        konamiBuf.current = [];
        fire("konami");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fire]);

  // --- document click: total-click counter + brand multi-click ---
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const now = Date.now();

      totalClicks.current += 1;
      if (totalClicks.current === TOTAL_CLICK_TARGET) fire("clicks42");

      const target = ev.target as HTMLElement | null;
      if (target?.closest?.(".brand")) {
        // Rolling window: a gap of >1.2s since the *previous* brand click
        // resets the streak, so each rapid click extends it.
        if (now - brandLastClick.current > BRAND_WINDOW_MS) {
          brandClicks.current = 0;
        }
        brandLastClick.current = now;
        brandClicks.current += 1;
        if (brandClicks.current >= BRAND_CLICK_TARGET) {
          brandClicks.current = 0;
          fire("brand7");
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [fire]);

  // --- footer reached: IntersectionObserver on .contact ---
  useEffect(() => {
    const el = document.querySelector(".contact");
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            fire("footer");
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fire]);

  // --- entrance animation + 6s auto-dismiss, per active meme ---
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    if (reduce) {
      setEntered(true);
    } else {
      raf = requestAnimationFrame(() => setEntered(true));
    }
    const t = window.setTimeout(() => setActive(null), AUTO_DISMISS_MS);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [active, reduce]);

  if (!active) return null;
  const meme = MEMES[active];
  if (!meme) return null;

  const visible = reduce || entered;

  const wrapStyle: CSSProperties = {
    position: "fixed",
    bottom: "1.25rem",
    right: "1.25rem",
    maxWidth: "min(340px, 86vw)",
    zIndex: 8000, // below ClickWipe's 9000
    fontFamily: "var(--mono)",
    background: "rgba(8,8,10,0.94)",
    border: "1px solid var(--rule)",
    borderRadius: 4,
    color: "var(--fg-dim)",
    fontSize: "0.74rem",
    lineHeight: 1.5,
    padding: "0.85rem 1rem",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    pointerEvents: "auto",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(8px)",
    transition: reduce ? "none" : "opacity 220ms ease, transform 220ms ease",
  };

  return (
    <div role="status" aria-live="polite" style={wrapStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "0.75rem",
          marginBottom: "0.55rem",
        }}
      >
        <span className="holo" style={{ fontSize: "0.8rem", letterSpacing: "0.02em" }}>
          {meme.title}
        </span>
        <button
          type="button"
          className="btn-ascii"
          aria-label="dismiss"
          onClick={dismiss}
          style={{ fontSize: "0.7rem", flexShrink: 0 }}
        >
          x
        </button>
      </div>

      <pre
        style={{
          margin: 0,
          whiteSpace: "pre",
          fontFamily: "var(--mono)",
          color: "var(--fg-dim)",
          fontSize: "0.74rem",
          lineHeight: 1.5,
          overflowX: "auto",
        }}
      >
        {meme.body}
      </pre>

      <div
        style={{
          color: "var(--fg-faint)",
          fontSize: "0.66rem",
          marginTop: "0.55rem",
        }}
      >
        press esc to dismiss
      </div>
    </div>
  );
}

export default EasterEggs;
