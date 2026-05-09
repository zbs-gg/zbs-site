"use client";

import { useState, useMemo } from "react";
import ClientBg from "@/components/client-bg";
import type { AsciiPostFx } from "@/components/ascii-effect";

type Settings = {
  src: string;
  cellSize: number;
  invert: boolean;
  colorMode: boolean;
  style: "standard" | "dense" | "minimal" | "blocks";
  postfx: Required<Pick<AsciiPostFx,
    | "mouseGlowEnabled" | "mouseGlowRadius" | "mouseGlowIntensity"
    | "contrastAdjust" | "brightnessAdjust"
    | "vignetteIntensity" | "vignetteRadius"
    | "scanlineIntensity" | "scanlineCount"
    | "aberrationStrength"
    | "noiseIntensity" | "noiseScale" | "noiseSpeed"
    | "waveAmplitude" | "waveFrequency" | "waveSpeed"
    | "glitchIntensity" | "glitchFrequency"
    | "jitterIntensity" | "jitterSpeed"
    | "curvature" | "targetFPS"
    | "colorPalette"
  >>;
};

const DEFAULTS: Settings = {
  src: "/elle-1.mp4",
  cellSize: 9,
  invert: false,
  colorMode: false,
  style: "standard",
  postfx: {
    mouseGlowEnabled: true,
    mouseGlowRadius: 220,
    mouseGlowIntensity: 0.35,
    contrastAdjust: 1.15,
    brightnessAdjust: -0.05,
    vignetteIntensity: 0.35,
    vignetteRadius: 0.85,
    scanlineIntensity: 0,
    scanlineCount: 200,
    aberrationStrength: 0,
    noiseIntensity: 0,
    noiseScale: 1,
    noiseSpeed: 1,
    waveAmplitude: 0,
    waveFrequency: 10,
    waveSpeed: 1,
    glitchIntensity: 0,
    glitchFrequency: 0,
    jitterIntensity: 0,
    jitterSpeed: 1,
    curvature: 0,
    targetFPS: 0,
    colorPalette: "original",
  },
};

export default function DevPage() {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [collapsed, setCollapsed] = useState(false);

  const setPostfx = <K extends keyof Settings["postfx"]>(k: K, v: Settings["postfx"][K]) =>
    setS((p) => ({ ...p, postfx: { ...p.postfx, [k]: v } }));

  const sceneProps = useMemo(
    () => ({
      src: s.src,
      cellSize: s.cellSize,
      invert: s.invert,
      colorMode: s.colorMode,
      style: s.style,
      postfx: s.postfx,
    }),
    [s]
  );

  const presetJson = useMemo(() => JSON.stringify(s, null, 2), [s]);

  return (
    <>
      <ClientBg {...sceneProps} />

      <div className={`dev-panel ${collapsed ? "collapsed" : ""}`}>
        <div className="dev-head">
          <span>ZBS · ASCII dev</span>
          <button onClick={() => setCollapsed((c) => !c)} className="ico">
            {collapsed ? "+" : "–"}
          </button>
        </div>

        {!collapsed && (
          <div className="dev-body">
            <Section title="source">
              <Select
                label="video"
                value={s.src}
                options={[
                  { value: "/elle-1.mp4", label: "elle-1.mp4" },
                  { value: "/elle-2.mp4", label: "elle-2.mp4" },
                ]}
                onChange={(v) => setS((p) => ({ ...p, src: v }))}
              />
              <Select
                label="style"
                value={s.style}
                options={[
                  { value: "standard", label: "standard" },
                  { value: "dense", label: "dense" },
                  { value: "minimal", label: "minimal" },
                  { value: "blocks", label: "blocks" },
                ]}
                onChange={(v) => setS((p) => ({ ...p, style: v as Settings["style"] }))}
              />
            </Section>

            <Section title="cell">
              <Range label="cellSize" v={s.cellSize} min={4} max={28} step={1}
                onChange={(v) => setS((p) => ({ ...p, cellSize: v }))} />
              <Toggle label="invert" v={s.invert} onChange={(v) => setS((p) => ({ ...p, invert: v }))} />
              <Toggle label="colorMode" v={s.colorMode} onChange={(v) => setS((p) => ({ ...p, colorMode: v }))} />
            </Section>

            <Section title="image">
              <Range label="contrast"   v={s.postfx.contrastAdjust}   min={0.5} max={2.5} step={0.01}
                onChange={(v) => setPostfx("contrastAdjust", v)} />
              <Range label="brightness" v={s.postfx.brightnessAdjust} min={-0.5} max={0.5} step={0.01}
                onChange={(v) => setPostfx("brightnessAdjust", v)} />
            </Section>

            <Section title="mouse halo">
              <Toggle label="enabled" v={s.postfx.mouseGlowEnabled}
                onChange={(v) => setPostfx("mouseGlowEnabled", v)} />
              <Range label="radius"    v={s.postfx.mouseGlowRadius}    min={50} max={600} step={10}
                onChange={(v) => setPostfx("mouseGlowRadius", v)} />
              <Range label="intensity" v={s.postfx.mouseGlowIntensity} min={0} max={2} step={0.05}
                onChange={(v) => setPostfx("mouseGlowIntensity", v)} />
            </Section>

            <Section title="vignette">
              <Range label="intensity" v={s.postfx.vignetteIntensity} min={0} max={1} step={0.01}
                onChange={(v) => setPostfx("vignetteIntensity", v)} />
              <Range label="radius"    v={s.postfx.vignetteRadius}    min={0.3} max={2} step={0.01}
                onChange={(v) => setPostfx("vignetteRadius", v)} />
            </Section>

            <Section title="scanlines (CRT)">
              <Range label="intensity" v={s.postfx.scanlineIntensity} min={0} max={1} step={0.01}
                onChange={(v) => setPostfx("scanlineIntensity", v)} />
              <Range label="count"     v={s.postfx.scanlineCount}     min={50} max={500} step={10}
                onChange={(v) => setPostfx("scanlineCount", v)} />
            </Section>

            <Section title="aberration">
              <Range label="strength" v={s.postfx.aberrationStrength} min={0} max={0.02} step={0.0005}
                onChange={(v) => setPostfx("aberrationStrength", v)} />
            </Section>

            <Section title="noise">
              <Range label="intensity" v={s.postfx.noiseIntensity} min={0} max={1} step={0.01}
                onChange={(v) => setPostfx("noiseIntensity", v)} />
              <Range label="scale"     v={s.postfx.noiseScale}     min={0.1} max={20} step={0.1}
                onChange={(v) => setPostfx("noiseScale", v)} />
              <Range label="speed"     v={s.postfx.noiseSpeed}     min={0} max={5} step={0.05}
                onChange={(v) => setPostfx("noiseSpeed", v)} />
            </Section>

            <Section title="wave">
              <Range label="amplitude" v={s.postfx.waveAmplitude} min={0} max={0.05} step={0.001}
                onChange={(v) => setPostfx("waveAmplitude", v)} />
              <Range label="frequency" v={s.postfx.waveFrequency} min={1} max={50} step={0.5}
                onChange={(v) => setPostfx("waveFrequency", v)} />
              <Range label="speed"     v={s.postfx.waveSpeed}     min={0} max={5} step={0.05}
                onChange={(v) => setPostfx("waveSpeed", v)} />
            </Section>

            <Section title="glitch">
              <Range label="intensity" v={s.postfx.glitchIntensity} min={0} max={1} step={0.01}
                onChange={(v) => setPostfx("glitchIntensity", v)} />
              <Range label="frequency" v={s.postfx.glitchFrequency} min={0} max={30} step={0.1}
                onChange={(v) => setPostfx("glitchFrequency", v)} />
            </Section>

            <Section title="jitter">
              <Range label="intensity" v={s.postfx.jitterIntensity} min={0} max={1} step={0.01}
                onChange={(v) => setPostfx("jitterIntensity", v)} />
              <Range label="speed"     v={s.postfx.jitterSpeed}     min={0} max={10} step={0.1}
                onChange={(v) => setPostfx("jitterSpeed", v)} />
            </Section>

            <Section title="distort / fps">
              <Range label="curvature" v={s.postfx.curvature} min={0} max={0.5} step={0.01}
                onChange={(v) => setPostfx("curvature", v)} />
              <Range label="targetFPS (0=off)" v={s.postfx.targetFPS} min={0} max={60} step={1}
                onChange={(v) => setPostfx("targetFPS", v)} />
            </Section>

            <Section title="palette">
              <Select
                label="colorPalette"
                value={String(s.postfx.colorPalette ?? "original")}
                options={[
                  { value: "original", label: "original" },
                  { value: "green",    label: "green" },
                  { value: "amber",    label: "amber" },
                  { value: "cyan",     label: "cyan" },
                  { value: "blue",     label: "blue" },
                ]}
                onChange={(v) =>
                  setPostfx(
                    "colorPalette",
                    v as Exclude<AsciiPostFx["colorPalette"], undefined>
                  )
                }
              />
            </Section>

            <div className="dev-actions">
              <button onClick={() => setS(DEFAULTS)}>Reset</button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(presetJson).catch(() => {});
                }}
              >Copy JSON</button>
            </div>

            <details className="dev-json">
              <summary>preset.json</summary>
              <pre>{presetJson}</pre>
            </details>
          </div>
        )}
      </div>

      <style jsx>{`
        .dev-panel {
          position: fixed; top: 1rem; right: 1rem; z-index: 1000;
          width: 320px; max-height: calc(100vh - 2rem); overflow: auto;
          background: rgba(10,10,10,.92); border: 1px solid #222;
          color: #eee; font: 12px/1.4 ui-monospace, "SF Mono", monospace;
          backdrop-filter: blur(8px); border-radius: 6px;
        }
        .dev-panel.collapsed { width: auto; }
        .dev-head {
          display: flex; justify-content: space-between; align-items: center;
          padding: .5rem .75rem; border-bottom: 1px solid #222;
          letter-spacing: .04em; text-transform: uppercase; font-weight: 500;
          position: sticky; top: 0; background: rgba(10,10,10,.95); z-index: 1;
        }
        .ico { background: transparent; border: 1px solid #333; color: #ccc;
               width: 22px; height: 22px; border-radius: 3px; cursor: pointer; }
        .ico:hover { background: #222; }
        .dev-body { padding: .5rem .75rem 1rem; }
        .dev-actions { display: flex; gap: .4rem; margin-top: .75rem; }
        .dev-actions button {
          flex: 1; padding: .5rem; border: 1px solid #333; background: #111;
          color: #eee; cursor: pointer; font: inherit; border-radius: 3px;
        }
        .dev-actions button:hover { background: #181818; }
        .dev-json { margin-top: .75rem; font-size: 11px; opacity: .7; }
        .dev-json pre { margin: .5rem 0 0; max-height: 200px; overflow: auto;
                        white-space: pre-wrap; word-break: break-word; }
      `}</style>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: ".75rem" }}>
      <div style={{
        fontSize: 10, opacity: .55, textTransform: "uppercase", letterSpacing: ".08em",
        marginBottom: ".25rem", paddingBottom: ".15rem", borderBottom: "1px dotted #222",
      }}>{title}</div>
      {children}
    </div>
  );
}

function Range({ label, v, min, max, step, onChange }: {
  label: string; v: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: "block", marginBottom: ".3rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ opacity: .8 }}>{label}</span>
        <span style={{ opacity: .55, fontVariantNumeric: "tabular-nums" }}>{v.toFixed(step >= 1 ? 0 : 3)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={v}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#fff" }}
      />
    </label>
  );
}

function Toggle({ label, v, onChange }: {
  label: string; v: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontSize: 11, marginBottom: ".3rem", cursor: "pointer" }}>
      <span style={{ opacity: .8 }}>{label}</span>
      <input type="checkbox" checked={v} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function Select<T extends string>({ label, value, options, onChange }: {
  label: string; value: string;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontSize: 11, marginBottom: ".3rem" }}>
      <span style={{ opacity: .8 }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={{ background: "#111", color: "#eee", border: "1px solid #333",
                 fontSize: 11, padding: "2px 4px", borderRadius: 3, fontFamily: "inherit" }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
