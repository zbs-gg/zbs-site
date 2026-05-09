"use client";

import { useEffect, useRef, useState } from "react";

const WIPE_CHARS = "@%#*+=-:·.░▒▓█▌▐■◆◇◐◑▲▼◢◣◤◥/\\|<>[]{}()";
const wipePick = () => WIPE_CHARS[(Math.random() * WIPE_CHARS.length) | 0];

type WipeState = {
  on: boolean;
  x: number;
  y: number;
  label: string;
  action: (() => void) | null;
};

const initialState: WipeState = {
  on: false,
  x: 0,
  y: 0,
  label: "",
  action: null,
};

export function ClickWipe() {
  const [state, setState] = useState<WipeState>(initialState);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Document-level click handler — intercepts <a href> and triggers wipe.
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      if (ev.button !== 0) return;
      const target = ev.target as HTMLElement | null;
      const a = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

      ev.preventDefault();
      const rect = a.getBoundingClientRect();
      const x = ev.clientX || rect.left + rect.width / 2;
      const y = ev.clientY || rect.top + rect.height / 2;
      const label = (a.textContent || href).trim().slice(0, 40);
      const isExternal = a.target === "_blank" || /^https?:/.test(href);
      const isHash = href.startsWith("#");

      const action = () => {
        if (isHash) {
          const el = document.querySelector(href);
          if (el) (el as HTMLElement).scrollIntoView({ behavior: "auto", block: "start" });
        } else if (isExternal) {
          window.open(href, a.target || "_blank", "noopener,noreferrer");
        } else {
          window.location.href = href;
        }
      };

      // prefers-reduced-motion: skip the wipe entirely, just navigate.
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        action();
        return;
      }

      setState({ on: true, x, y, label, action });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Animation effect — runs when state.on flips to true.
  useEffect(() => {
    if (!state.on) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = window.innerWidth;
    const H = window.innerHeight;
    cvs.width = W * dpr;
    cvs.height = H * dpr;
    cvs.style.width = W + "px";
    cvs.style.height = H + "px";
    ctx.scale(dpr, dpr);

    const cell = 14;
    const cols = Math.ceil(W / cell);
    const rows = Math.ceil(H / cell);
    const cx = Math.round(state.x / cell);
    const cy = Math.round(state.y / cell);
    const maxR = Math.hypot(Math.max(cx, cols - cx), Math.max(cy, rows - cy));

    type Cell = { ch: string; jitter: number };
    const grid: (Cell | null)[] = new Array(cols * rows).fill(null);

    const phaseInMs = 380;
    const holdMs = 220;
    const phaseOutMs = 320;
    const total = phaseInMs + holdMs + phaseOutMs;

    const t0 = performance.now();
    let donePosted = false;
    let raf = 0;
    const navAction = state.action;

    const tick = (now: number) => {
      const t = now - t0;
      let alpha = 1;
      let frontR = 0;

      if (t < phaseInMs) {
        frontR = (t / phaseInMs) * maxR * 1.05;
      } else if (t < phaseInMs + holdMs) {
        frontR = maxR + 2;
      } else if (t < total) {
        frontR = maxR + 2;
        alpha = 1 - (t - phaseInMs - holdMs) / phaseOutMs;
      } else {
        return;
      }

      // fire navigation halfway through hold so the page is moving
      // by the time the wipe begins to dissolve.
      if (!donePosted && t > phaseInMs + holdMs * 0.4) {
        donePosted = true;
        navAction?.();
      }

      ctx.clearRect(0, 0, W, H);
      ctx.font = '600 12px ui-monospace, "JetBrains Mono", monospace';
      ctx.textBaseline = "top";

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const r = Math.hypot(i - cx, j - cy);
          if (r > frontR) continue;
          const idx = j * cols + i;
          if (!grid[idx]) {
            grid[idx] = { ch: wipePick(), jitter: Math.random() };
          }
          const c = grid[idx]!;
          const dist = frontR - r;
          if (dist < 4 || Math.random() < 0.04) {
            c.ch = wipePick();
          }
          const px = i * cell;
          const py = j * cell;
          const fillA = alpha * Math.min(1, dist / 3);
          ctx.fillStyle = `rgba(8,8,8,${fillA.toFixed(3)})`;
          ctx.fillRect(px, py, cell, cell);
          const glyphA = alpha * (0.55 + 0.45 * c.jitter);
          ctx.fillStyle = `rgba(245,245,245,${glyphA.toFixed(3)})`;
          ctx.fillText(c.ch, px + 1, py + 1);
        }
      }

      // ring scanline at the leading edge during wipe-in
      if (t < phaseInMs) {
        ctx.strokeStyle = "rgba(124,252,0,0.55)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx * cell, cy * cell, frontR * cell, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const clearId = setTimeout(() => setState(initialState), 1000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(clearId);
    };
    // we intentionally re-run only on .on flipping; coordinates and
    // action are captured at start.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.on]);

  if (!state.on) return null;

  return (
    <div className="wipe-root" aria-hidden="true">
      <canvas ref={canvasRef} className="wipe-canvas" />
      {state.label && (
        <div className="wipe-label">
          <span className="wipe-arrow">▸</span>
          <span className="wipe-text">{state.label}</span>
          <span className="wipe-cursor" />
        </div>
      )}
    </div>
  );
}
