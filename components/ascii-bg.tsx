"use client";

import { useEffect, useRef } from "react";

export type AsciiBgProps = {
  src: string;
  cellSize?: number;
  mouseGlowEnabled?: boolean;
  mouseGlowIntensity?: number;
  mouseGlowRadius?: number;
  vignetteIntensity?: number;
  contrastAdjust?: number;
  brightnessAdjust?: number;
  glitch?: number;
  // Accepted-but-ignored for back-compat with old VideoScene props:
  style?: unknown;
  colorMode?: boolean;
  invert?: boolean;
  scanlineIntensity?: number;
  postfx?: unknown;
};

const RAMP = "  ..::--==";
const FG = "#f5f5f5";
const ACCENT = "#ffffff";
const BG = "#050505";

export default function AsciiBg({
  src,
  cellSize = 8,
  mouseGlowEnabled = true,
  mouseGlowIntensity = 0.32,
  mouseGlowRadius = 200,
  vignetteIntensity = 0.7,
  contrastAdjust = 1.25,
  brightnessAdjust = -0.05,
  glitch = 0,
}: AsciiBgProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ mx: -9999, my: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const sample = document.createElement("canvas");
    const sctx = sample.getContext("2d", { willReadFrequently: true });
    if (!sctx) return;

    const video = document.createElement("video");
    video.src = src;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    const wake = () => tryPlay();
    window.addEventListener("pointerdown", wake, { once: true });

    const onMove = (e: PointerEvent) => {
      mouseRef.current.mx = e.clientX;
      mouseRef.current.my = e.clientY;
    };
    window.addEventListener("pointermove", onMove);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const ramp = RAMP;
    const rampN = ramp.length - 1;

    let raf = 0;
    let last = 0;
    const targetMs = 1000 / 30;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < targetMs) return;
      last = t;

      const cs = Math.max(4, cellSize);
      const cols = Math.ceil(W / cs);
      const rows = Math.ceil(H / cs);

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      let lum: Uint8ClampedArray | null = null;
      if (video.videoWidth) {
        sample.width = cols;
        sample.height = rows;
        const va = video.videoWidth / video.videoHeight;
        const ca = cols / rows;
        let sx: number;
        let sy: number;
        let sw: number;
        let sh: number;
        if (va > ca) {
          sh = video.videoHeight;
          sw = sh * ca;
          sx = (video.videoWidth - sw) / 2;
          sy = 0;
        } else {
          sw = video.videoWidth;
          sh = sw / ca;
          sx = 0;
          sy = (video.videoHeight - sh) / 2;
        }
        sctx.drawImage(video, sx, sy, sw, sh, 0, 0, cols, rows);
        lum = sctx.getImageData(0, 0, cols, rows).data;
      }

      const monoFont =
        getComputedStyle(document.documentElement).getPropertyValue("--mono") ||
        "monospace";
      ctx.font = `${Math.max(8, Math.floor(cs * 1.05))}px ${monoFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = FG;

      const glitchProb = glitch / 600;
      const { mx, my } = mouseRef.current;
      const glowR2 = mouseGlowRadius * mouseGlowRadius;
      const half = cs / 2;
      const useGlow = mouseGlowEnabled && mouseGlowIntensity > 0;
      const pivot = 0.5 + brightnessAdjust;

      for (let y = 0; y < rows; y++) {
        const py = y * cs + half;
        const vy = (y / rows - 0.5) * 2;
        const vy2 = vy * vy;
        for (let x = 0; x < cols; x++) {
          if (!lum) continue;
          const i = (y * cols + x) * 4;
          let l =
            (lum[i] * 0.299 + lum[i + 1] * 0.587 + lum[i + 2] * 0.114) / 255;
          l = (l - 0.5) * contrastAdjust + pivot;

          if (vignetteIntensity > 0) {
            const vx = (x / cols - 0.5) * 2;
            const vd2 = vx * vx + vy2;
            if (vd2 > 0.16) l -= (Math.sqrt(vd2) - 0.4) * vignetteIntensity;
          }

          if (useGlow) {
            const px0 = x * cs + half;
            const dx = px0 - mx;
            const dy = py - my;
            const d2 = dx * dx + dy * dy;
            if (d2 < glowR2) l += (1 - d2 / glowR2) * mouseGlowIntensity;
          }

          if (l <= 0.04) continue;
          if (l > 1) l = 1;

          const idx = Math.min(rampN, Math.floor(l * rampN));
          const ch = ramp[idx];
          if (ch === " ") continue;

          const px = x * cs + half;

          if (glitchProb > 0 && Math.random() < glitchProb) {
            const off = (Math.random() - 0.5) * cs * 5;
            ctx.fillStyle = "#ff3355";
            ctx.fillText(ch, px + off, py);
            ctx.fillStyle = FG;
            continue;
          }
          if (l > 0.85) {
            ctx.fillStyle = ACCENT;
            ctx.fillText(ch, px, py);
            ctx.fillStyle = FG;
          } else {
            ctx.fillText(ch, px, py);
          }
        }
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", wake);
      try {
        video.pause();
      } catch {}
      video.removeAttribute("src");
      video.load();
    };
  }, [
    src,
    cellSize,
    mouseGlowEnabled,
    mouseGlowIntensity,
    mouseGlowRadius,
    vignetteIntensity,
    contrastAdjust,
    brightnessAdjust,
    glitch,
  ]);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}
