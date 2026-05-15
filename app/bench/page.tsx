import ClientBg from "@/components/client-bg";
import { ScrambleText } from "@/components/scramble-text";
import { Brand } from "@/components/brand";
import Link from "next/link";

export const metadata = {
  title: "bench — zbs.gg",
  description:
    "Empathic Memory Benchmark v3. Pulse v3 vs Mem0, Graphiti (Zep), LangMem, LlamaIndex, OpenAI Memory. Open source, reproducible.",
};

type Row = {
  system: string;
  overall: number;
  core: number;
  stateful: number;
  multi: number;
  chain: number;
  isOurs?: boolean;
};

const LEADERBOARD: Row[] = [
  { system: "Pulse v3 (bge-m3 fine-tuned, zero-shot)", overall: 0.238, core: 0.333, stateful: 0.367, multi: 0.3, chain: 0.0, isOurs: true },
  { system: "Pulse v3 (Cohere embed-v4.0)", overall: 0.21, core: 0.267, stateful: 0.3, multi: 0.3, chain: 0.0, isOurs: true },
  { system: "Pulse v3 (text-embedding-3-small, backbone-matched)", overall: 0.19, core: 0.2, stateful: 0.267, multi: 0.3, chain: 0.0, isOurs: true },
  { system: "cosine (Cohere)", overall: 0.181, core: 0.4, stateful: 0.2, multi: 0.233, chain: 0.0 },
  { system: "Mem0 (text-embedding-3-small)", overall: 0.171, core: 0.333, stateful: 0.2, multi: 0.233, chain: 0.0 },
  { system: "LangMem (text-embedding-3-small)", overall: 0.162, core: 0.4, stateful: 0.167, multi: 0.2, chain: 0.0 },
  { system: "LlamaIndex Memory (text-embedding-3-small)", overall: 0.162, core: 0.4, stateful: 0.167, multi: 0.2, chain: 0.0 },
  { system: "OpenAI Memory (text-embedding-3-large)", overall: 0.152, core: 0.267, stateful: 0.2, multi: 0.2, chain: 0.0 },
  { system: "hybrid (Cohere)", overall: 0.152, core: 0.4, stateful: 0.133, multi: 0.2, chain: 0.0 },
  { system: "bm25", overall: 0.067, core: 0.2, stateful: 0.067, multi: 0.067, chain: 0.0 },
  { system: "Graphiti (Zep) (text-embedding-3-small)", overall: 0.048, core: 0.2, stateful: 0.033, multi: 0.033, chain: 0.0 },
  { system: "cross-encoder (bge-reranker-v2-m3, state-conditioned)", overall: 0.105, core: 0.333, stateful: 0.133, multi: 0.067, chain: 0.0 },
];

function fmt(n: number) {
  return n.toFixed(3);
}

export default function BenchPage() {
  const pulse = LEADERBOARD[0].overall;
  return (
    <>
      <ClientBg
        src="/elle-1.mp4"
        cellSize={8}
        mouseGlowEnabled
        mouseGlowIntensity={0.28}
        mouseGlowRadius={200}
        contrastAdjust={1.25}
        brightnessAdjust={-0.05}
        vignetteIntensity={0.7}
      />

      <main className="page">
        <header className="topbar">
          <Brand />
          <nav className="ascii-nav" aria-label="primary">
            <Link href="/">
              <ScrambleText text="home" />
            </Link>
            <a href="https://github.com/zbs-gg/emo-bench" target="_blank" rel="noopener">
              <ScrambleText text="source" />
            </a>
            <a href="#" aria-disabled="true">
              <ScrambleText text="paper · soon" />
            </a>
            <a href="mailto:team@zbs.gg">
              <ScrambleText text="contact" />
            </a>
          </nav>
        </header>

        <section className="hero" id="hero">
          <h1 className="hero-line">
            <ScrambleText text="empathic memory bench v3" />
          </h1>
          <p className="hero-sub">
            <span className="dim">recall@3 · n=35 corpus · 10 systems · open source · 2026-05-15 SOTA: Pulse v3 + bge-m3 fine-tuned (strict zero-shot)</span>
          </p>
        </section>

        <section className="evidence">
          <h2 className="section-label">
            <ScrambleText text="// leaderboard" />
          </h2>

          <div className="bench-table-wrap">
            <table className="bench-table">
              <thead>
                <tr>
                  <th>system</th>
                  <th>overall R@3</th>
                  <th>core</th>
                  <th>stateful</th>
                  <th>multi-signal</th>
                  <th>chain*</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.map((row) => (
                  <tr key={row.system} className={row.isOurs ? "ours" : ""}>
                    <td className="sys">{row.system}</td>
                    <td className={row.isOurs ? "num holo" : "num"}>{fmt(row.overall)}</td>
                    <td className="num dim">{fmt(row.core)}</td>
                    <td className={row.isOurs ? "num holo" : "num dim"}>{fmt(row.stateful)}</td>
                    <td className={row.isOurs ? "num holo" : "num dim"}>{fmt(row.multi)}</td>
                    <td className="num faint">{fmt(row.chain)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="section-label" style={{ marginTop: "3rem" }}>
            <ScrambleText text="// delta vs pulse v3" />
          </h2>
          <ul className="ev-rows">
            {LEADERBOARD.slice(1).map((row) => {
              const delta = pulse - row.overall;
              const rel = row.overall > 0 ? Math.round((pulse / row.overall - 1) * 100) : 0;
              return (
                <li key={row.system}>
                  <span className="ev-key">{row.system}</span>
                  <span className="ev-val">
                    +<span className="holo">{delta.toFixed(3)}</span> R@3 · <span className="holo">+{rel}%</span> relative
                  </span>
                </li>
              );
            })}
          </ul>

          <h2 className="section-label" style={{ marginTop: "3rem" }}>
            <ScrambleText text="// method" />
          </h2>
          <ul className="ev-rows">
            <li>
              <span className="ev-key">Corpus</span>
              <span className="ev-val">60 events + 35 probes, behavioural memory tests for AI companions. Four probe types: core, stateful, multi-signal, chain.</span>
            </li>
            <li>
              <span className="ev-key">Metric</span>
              <span className="ev-val">R@3 = |retrieved_top_3 ∩ ideal_top_3| / |ideal_top_3|, averaged across 35 probes.</span>
            </li>
            <li>
              <span className="ev-key">Backbone</span>
              <span className="ev-val">All five production memory systems run with the same OpenAI gpt-4o-mini + text-embedding-3-{"{small,large}"}. No backbone advantage for Pulse.</span>
            </li>
            <li>
              <span className="ev-key">*chain footnote</span>
              <span className="ev-val">Chain probes (10/35) lack ideal_top_3_event_ids in the corpus — they are judge-evaluated on the chain axis in the paper, see §5. Strict R@3 credits 0 to every system on chain uniformly. Pulse v3 chain advantage shows up in the judge-rated table, not this one.</span>
            </li>
            <li>
              <span className="ev-key">Reproduce</span>
              <span className="ev-val">
                <a href="https://github.com/zbs-gg/emo-bench" target="_blank" rel="noopener"><em>github.com/zbs-gg/emo-bench</em></a>.
                {" "}Adapters in <code>external-evals/scripts/run_*_on_v3_bench.py</code>, raw retrievals in <code>external-evals/results/</code>, leaderboard in <code>external-evals/results/leaderboard-v3.{"{md,csv}"}</code>.
              </span>
            </li>
            <li>
              <span className="ev-key">Snapshot</span>
              <span className="ev-val">2026-05-11 · graphiti-core 0.29.0 · mem0 2.0.0 · langmem 0.0.30 · llama-index 0.13 · openai-python 2.32.0</span>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
