import ClientBg from "@/components/client-bg";
import { ScrambleText } from "@/components/scramble-text";
import { Brand } from "@/components/brand";
import { Crumbs } from "@/components/crumbs";
import Link from "next/link";

export const metadata = {
  title: "bench — zbs.gg",
  description:
    "Empathic Memory Benchmark v3, n=100 probe suite. Pulse v3 vs cosine/hybrid baselines and Mem0, Graphiti (Zep), LangMem, LlamaIndex, OpenAI Memory, claude-mem adapters. Pulse leads the stateful axis; cosine leads overall. Open source, reproducible.",
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

// Primary n=100 deterministic Recall@3 suite (paper Table 1, Cohere embed-v4.0
// backbone, frozen 2026-05-16 snapshot). Honest ordering by overall R@3:
// cosine leads overall, core and chain. Pulse v3 leads stateful and
// multi-signal. The paper states this plainly and so do we.
const PRIMARY: Row[] = [
  { system: "cosine", overall: 0.420, core: 0.583, stateful: 0.343, multi: 0.307, chain: 0.533 },
  { system: "Pulse v3", overall: 0.416, core: 0.517, stateful: 0.419, multi: 0.333, chain: 0.412, isOurs: true },
  { system: "cosine_state", overall: 0.390, core: 0.517, stateful: 0.314, multi: 0.293, chain: 0.517 },
  { system: "hybrid", overall: 0.285, core: 0.500, stateful: 0.219, multi: 0.173, chain: 0.325 },
  { system: "hybrid_state", overall: 0.262, core: 0.433, stateful: 0.219, multi: 0.133, chain: 0.325 },
  { system: "state_concat_only", overall: 0.203, core: 0.100, stateful: 0.124, multi: 0.147, chain: 0.517 },
  { system: "bm25", overall: 0.156, core: 0.350, stateful: 0.086, multi: 0.080, chain: 0.179 },
];

// Adapterized memory-system sanity checks (paper Table 3), same n=100 corpus.
// Rows not marked Cohere use OpenAI text-embedding-3-small (OpenAI Memory:
// 3-large). Pulse v3 (TE3-small) is the backbone-matched comparator: NOT the
// overall adapter winner — it trails claude-mem / LangMem / LlamaIndex on
// overall, and leads the cohort on stateful.
const MEMORY_SYSTEMS: Row[] = [
  { system: "Pulse v3 (Cohere embed-v4.0)", overall: 0.416, core: 0.517, stateful: 0.419, multi: 0.333, chain: 0.412, isOurs: true },
  { system: "claude-mem", overall: 0.400, core: 0.600, stateful: 0.305, multi: 0.333, chain: 0.450 },
  { system: "LangMem", overall: 0.397, core: 0.617, stateful: 0.352, multi: 0.253, chain: 0.433 },
  { system: "LlamaIndex Memory", overall: 0.397, core: 0.617, stateful: 0.352, multi: 0.253, chain: 0.433 },
  { system: "Pulse v3 (TE3-small, backbone-matched)", overall: 0.375, core: 0.467, stateful: 0.390, multi: 0.280, chain: 0.375, isOurs: true },
  { system: "Mem0", overall: 0.347, core: 0.567, stateful: 0.257, multi: 0.280, chain: 0.371 },
  { system: "OpenAI Memory (TE3-large)", overall: 0.307, core: 0.550, stateful: 0.257, multi: 0.107, chain: 0.404 },
  { system: "Graphiti (Zep)", overall: 0.120, core: 0.433, stateful: 0.038, multi: 0.040, chain: 0.050 },
];

function fmt(n: number) {
  return n.toFixed(3);
}

// holo highlight is applied per column, and only on columns where our row
// actually leads the table — never on overall in the primary suite, where
// cosine leads. The visual layer must agree with the prose.
function BenchTable({ rows, holoCols }: { rows: Row[]; holoCols: Array<"overall" | "stateful" | "multi"> }) {
  const holo = (row: Row, col: "overall" | "stateful" | "multi", base: string) =>
    row.isOurs && holoCols.includes(col) ? "num holo" : base;
  return (
    <div className="bench-table-wrap">
      <table className="bench-table">
        <thead>
          <tr>
            <th>system</th>
            <th>overall R@3</th>
            <th>core</th>
            <th>stateful</th>
            <th>multi-signal</th>
            <th>chain</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.system} className={row.isOurs ? "ours" : ""}>
              <td className="sys">{row.system}</td>
              <td className={holo(row, "overall", "num")}>{fmt(row.overall)}</td>
              <td className="num dim">{fmt(row.core)}</td>
              <td className={holo(row, "stateful", "num dim")}>{fmt(row.stateful)}</td>
              <td className={holo(row, "multi", "num dim")}>{fmt(row.multi)}</td>
              <td className="num faint">{fmt(row.chain)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BenchPage() {
  const pulseStateful = 0.419;
  return (
    <>
      <ClientBg
        src="/elle-1.mp4"
        fallbackSrc="/pulse-demo.mp4"
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
            <a href="https://github.com/zbs-gg/pulse-paper" target="_blank" rel="noopener">
              <ScrambleText text="paper" />
            </a>
            <a href="mailto:team@zbs.gg">
              <ScrambleText text="contact" />
            </a>
          </nav>
        </header>

        <Crumbs
          trail={[
            { label: "zbs.gg", href: "/" },
            { label: "bench" },
          ]}
        />

        <section className="hero" id="hero">
          <h1 className="hero-line">
            <ScrambleText text="empathic memory bench v3" />
          </h1>
          <p className="hero-sub">
            <span className="dim">
              recall@3 · n=100 probe suite · 60 events · cosine leads overall
              (0.420 vs 0.416) · Pulse v3 leads the stateful axis (0.419 vs
              cosine_state 0.314) · we say both plainly
            </span>
          </p>
        </section>

        <section className="evidence">
          <h2 className="section-label">
            <ScrambleText text="// primary suite — retrieval baselines" />
          </h2>
          <BenchTable rows={PRIMARY} holoCols={["stateful", "multi"]} />

          <h2 className="section-label" style={{ marginTop: "3rem" }}>
            <ScrambleText text="// memory-system adapters, same corpus" />
          </h2>
          <BenchTable rows={MEMORY_SYSTEMS} holoCols={["stateful"]} />

          <h2 className="section-label" style={{ marginTop: "3rem" }}>
            <ScrambleText text="// stateful axis — delta vs pulse v3" />
          </h2>
          <ul className="ev-rows">
            {[...PRIMARY.filter((r) => !r.isOurs), ...MEMORY_SYSTEMS.filter((r) => !r.isOurs)].map((row) => {
              const delta = pulseStateful - row.stateful;
              const rel = row.stateful > 0 ? Math.round((pulseStateful / row.stateful - 1) * 100) : 0;
              return (
                <li key={row.system}>
                  <span className="ev-key">{row.system}</span>
                  <span className="ev-val">
                    +<span className="holo">{delta.toFixed(3)}</span> stateful R@3 · <span className="holo">+{rel}%</span> relative
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="ev-note">
            the stateful axis is the paper&apos;s supported claim: same query,
            different user state, different ideal episode. on overall R@3
            Pulse v3 does <em>not</em> lead — cosine does (+0.004), and cosine
            also leads core and chain. backbone-matched Pulse (TE3-small) is
            not the overall adapter winner either — claude-mem, LangMem and
            LlamaIndex are ahead on overall. what survives every cut is the
            stateful lead.
          </p>

          <h2 className="section-label" style={{ marginTop: "3rem" }}>
            <ScrambleText text="// method" />
          </h2>
          <ul className="ev-rows">
            <li>
              <span className="ev-key">Corpus</span>
              <span className="ev-val">60 events + 100 probes (original 35 preserved byte-for-byte + 65 new, stratified), behavioural memory tests for AI companions. Four probe types: core, stateful, multi-signal, chain. All 60 events referenced in at least one ideal_top_3 / ideal_chain.</span>
            </li>
            <li>
              <span className="ev-key">Metric</span>
              <span className="ev-val">R@3 = |retrieved_top_3 ∩ ideal_top_3| / |ideal_top_3|. Chain probes scored as unordered membership against ideal_chain from saved top-5 retrievals.</span>
            </li>
            <li>
              <span className="ev-key">Backbone</span>
              <span className="ev-val">Primary suite: Cohere embed-v4.0 across all baseline rows — no backbone advantage for Pulse. Adapter table: OpenAI gpt-4o-mini + text-embedding-3-{"{small,large}"}, with a backbone-matched Pulse (TE3-small) row as the fair comparator.</span>
            </li>
            <li>
              <span className="ev-key">Fine-tune ablation</span>
              <span className="ev-val">An earlier n=35 bge-m3 fine-tune lift (+0.067 stateful) did not survive expansion: at n=100 the fine-tuned backbone is a negative absolute result (stateful 0.378 ± 0.072 across 3 seeds vs Cohere 0.419). What is preserved across backbones is the stateful lead over hybrid_state: +0.200 on Cohere, +0.226 on fine-tuned bge-m3. We report this as disclosed in the paper.</span>
            </li>
            <li>
              <span className="ev-key">Scope</span>
              <span className="ev-val">Single-user deployment regression suite derived from twelve months of real companion use. Not a cross-user benchmark; no claim of broad memory-system superiority. Adapter rows are protocol sanity checks, not native-system evaluations.</span>
            </li>
            <li>
              <span className="ev-key">Reproduce</span>
              <span className="ev-val">
                <a href="https://github.com/zbs-gg/emo-bench" target="_blank" rel="noopener"><em>github.com/zbs-gg/emo-bench</em></a>.
                {" "}Adapters in <code>external-evals/scripts/run_*_on_v3_bench.py</code>, raw retrievals in <code>external-evals/results/</code>. Paper source + PDF:{" "}
                <a href="https://github.com/zbs-gg/pulse-paper" target="_blank" rel="noopener"><em>github.com/zbs-gg/pulse-paper</em></a>.
              </span>
            </li>
            <li>
              <span className="ev-key">Snapshot</span>
              <span className="ev-val">primary n=100 run 2026-05-16 (frozen JSON canonical) · adapter snapshot 2026-05-11 · graphiti-core 0.29.0 · mem0 2.0.0 · langmem 0.0.30 · llama-index 0.13 · openai-python 2.32.0 · live-endpoint drift check 2026-06-02 preserved central stateful values (0.419 / 0.314).</span>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
