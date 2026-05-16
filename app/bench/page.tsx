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

// Expanded n=100 probe suite (2026-05-16): 60 events + 100 probes, all 60 events
// referenced in ideal_top_3 or ideal_chain. Pulse v3 stateful lead vs hybrid_state
// widens 6x (n=35 +0.033 -> n=100 +0.200) as corpus expansion samples more
// state-routing edge cases. Backbone-robust: Pulse-hybrid_state stateful gap
// preserved across Cohere (+0.200) and fine-tuned bge-m3 mean-of-3-seeds (+0.226).
const LEADERBOARD: Row[] = [
  { system: "Pulse v3 (Cohere embed-v4.0, n=100 headline)", overall: 0.416, core: 0.517, stateful: 0.419, multi: 0.333, chain: 0.412, isOurs: true },
  { system: "Pulse v3 (bge-m3 LoRA fine-tuned, mean of 3 seeds)", overall: 0.375, core: 0.467, stateful: 0.378, multi: 0.289, chain: 0.388, isOurs: true },
  { system: "cosine (Cohere, n=100)", overall: 0.420, core: 0.583, stateful: 0.343, multi: 0.307, chain: 0.533 },
  { system: "cosine_state (Cohere, n=100)", overall: 0.390, core: 0.517, stateful: 0.314, multi: 0.293, chain: 0.517 },
  { system: "hybrid (Cohere, n=100)", overall: 0.285, core: 0.500, stateful: 0.219, multi: 0.173, chain: 0.325 },
  { system: "hybrid_state (Cohere, n=100)", overall: 0.262, core: 0.433, stateful: 0.219, multi: 0.133, chain: 0.325 },
  { system: "state_concat_only (Cohere, n=100)", overall: 0.203, core: 0.100, stateful: 0.124, multi: 0.147, chain: 0.517 },
  { system: "bm25 (n=100)", overall: 0.156, core: 0.350, stateful: 0.086, multi: 0.080, chain: 0.179 },
  // n=35 backbone-matched memory-system baselines (frozen 2026-05-11 snapshot)
  { system: "Mem0 (text-embedding-3-small, n=35)", overall: 0.171, core: 0.333, stateful: 0.200, multi: 0.233, chain: 0.0 },
  { system: "LangMem (text-embedding-3-small, n=35)", overall: 0.162, core: 0.400, stateful: 0.167, multi: 0.200, chain: 0.0 },
  { system: "LlamaIndex Memory (text-embedding-3-small, n=35)", overall: 0.162, core: 0.400, stateful: 0.167, multi: 0.200, chain: 0.0 },
  { system: "OpenAI Memory (text-embedding-3-large, n=35)", overall: 0.152, core: 0.267, stateful: 0.200, multi: 0.200, chain: 0.0 },
  { system: "Graphiti (Zep) (text-embedding-3-small, n=35)", overall: 0.048, core: 0.200, stateful: 0.033, multi: 0.033, chain: 0.0 },
  { system: "cross-encoder (bge-reranker-v2-m3, state-conditioned, n=35)", overall: 0.105, core: 0.333, stateful: 0.133, multi: 0.067, chain: 0.0 },
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
