import ClientBg from "@/components/client-bg";
import { ScrambleText } from "@/components/scramble-text";
import { MemoryTimeline } from "@/components/memory-timeline";
import { Brand } from "@/components/brand";
import { HeroCycle } from "@/components/hero-cycle";
import { HoverFact } from "@/components/hover-fact";
import { HL } from "@/components/highlight";

export default function Page() {
  return (
    <>
      <ClientBg
        src="/elle-1.mp4"
        cellSize={8}
        mouseGlowEnabled
        mouseGlowIntensity={0.32}
        mouseGlowRadius={200}
        contrastAdjust={1.25}
        brightnessAdjust={-0.05}
        vignetteIntensity={0.7}
      />

      <main className="page">
        <a className="try-banner" href="/preview">
          <span className="try-banner-dot" aria-hidden="true" />
          <span>
            Pulse MCP is live on npm — one command, no daemon, no API keys.{" "}
            <b>Try it out →</b>
          </span>
        </a>

        <header className="topbar">
          <Brand />

          <nav className="ascii-nav" aria-label="primary">
            <a href="#evidence">
              <ScrambleText text="numbers" />
            </a>
            <a href="#projects">
              <ScrambleText text="projects" />
            </a>
            <a href="https://github.com/zbs-gg/pulse" target="_blank" rel="noopener">
              <ScrambleText text="pulse" />
            </a>
            <a href="https://github.com/zbs-gg/hearth" target="_blank" rel="noopener">
              <ScrambleText text="heart" />
            </a>
            <a href="/preview">
              <ScrambleText text="install" />
            </a>
            <a href="/bench">
              <ScrambleText text="bench" />
            </a>
            <a href="https://nik.care" target="_blank" rel="noopener">
              <ScrambleText text="writing" />
            </a>
            <a href="mailto:team@zbs.gg">
              <ScrambleText text="contact" />
            </a>
          </nav>
        </header>

        <section className="hero" id="hero">
          <HeroCycle />
        </section>

        <section className="evidence" id="evidence">
          <h2 className="section-label">
            <ScrambleText text="// what i have" />
          </h2>
          <ul className="ev-rows">
            <li>
              <span className="ev-key">Empathic Memory Bench v3</span>
              <span className="ev-val">
                n=100 deterministic probe suite. Pulse v3 leads the stateful
                axis: <span className="holo">stateful R@3 = 0.419</span> vs
                cosine_state 0.314, hybrid_state 0.219 — same query, different
                user state, different ideal episode (stateless cosine itself:
                0.343 stateful). on overall R@3 cosine leads Pulse{" "}
                <span className="holo">0.420 vs 0.416</span> and we say so
                plainly · vs 7 retrieval baselines + 6 memory-system
                adapters (Mem0, Graphiti/Zep, LangMem, LlamaIndex, OpenAI
                Memory, claude-mem) · label-blind judge check: Pulse{" "}
                <span className="holo">7.722 vs 4.278</span> stateful fit over
                a Mem0 adapter, α = <span className="holo">0.910</span>{" "}
                (multi-vendor: 8.0 vs 5.4, α = 0.699, tentative) · own corpus,
                judge prompts open
              </span>
            </li>
            <li>
              <span className="ev-key">LongMemEval_S</span>
              <span className="ev-val">68.89% · published 500-question long-context evaluation · sanity check of the cosine+recency base (public benchmarks carry no state fields, so the state layer collapses to identity)</span>
            </li>
            <li>
              <span className="ev-key">EM-IB (internal)</span>
              <span className="ev-val">76% (single LLM-judge) · 1427 questions across 18 simulated seekers · internal empathic-support benchmark we built, corpus unreleased pending privacy review — self-reported, not third-party reproduced; not the external benchmark of similar former name (arXiv:2602.01885)</span>
            </li>
            <li>
              <span className="ev-key">LoCoMo</span>
              <span className="ev-val">32.51% F1 · 62.78% adversarial refusal · ACL 2024 corpus · base-retriever cross-check, not comparable to Mem0/Zep native J-score protocol</span>
            </li>
            <li>
              <span className="ev-key">replication</span>
              <span className="ev-val">
                MIT · all corpora, judge prompts, scripts at
                {" "}
                <a href="https://github.com/zbs-gg/emo-bench" target="_blank" rel="noopener"><em>github.com/zbs-gg/emo-bench</em></a>
                {" "}· scope: single-user deployment corpus (year-long real-use
                logs); external benchmarks cross-check the foundation, v3
                conditional boosts validated only on bench v3 · scripts default
                to a now-closed inference backend, see REPRODUCIBILITY.md for
                migration path · no third-party run yet — invite open
              </span>
            </li>
          </ul>

          <MemoryTimeline />

          <p className="ev-note">
            simulated memory corpus, illustrative — not anyone&apos;s real store.
            ◆ structural anchors stay bright. ● regular events fade.
            anchor-aware decay covers{" "}
            <HL tip="which past events stay vivid, which fade. user-flagged structural moments — breakups, breakthroughs, the call you couldn't take — keep weight indefinitely. regular noise decays on a schedule.">
              what should survive
            </HL>
            . state-aware retrieval covers{" "}
            <HL tip="retrieval that respects your current mood, time of day, and what the question is actually asking. surfaces different memories at 3am vs noon, in grief vs after a win.">
              what should surface for THIS moment
            </HL>
            {" "}— mood, time, intent of the question. that's the
            stateful axis where Pulse v3 leads on the bench.
          </p>
        </section>

        <section className="receipts" id="receipts">
          <h2 className="section-label">
            <ScrambleText text="// receipts" />
          </h2>
          <p className="receipts-intro">three facts worth hovering over.</p>
          <p className="receipts-line">
            <HoverFact
              label="corpus / Emo.Bench v3"
              body="emotionally loaded conversations across every sphere — grief, intimacy, anxiety, sleep, money, family. dense enough to routinely trip OpenAI and Anthropic guardrails. de-duplicated, anchor-tagged, never synthetic. what Pulse v3 learns on to separate the moment from the token."
              side="bottom"
            >
              200 MB of living dialogues
            </HoverFact>
            <span className="receipts-sep"> · </span>
            <HoverFact
              label="evaluation / label-blind judge check, α = 0.910"
              body="main judge-bias check: ideal answers removed from the judge prompt entirely. In the label-blind Mem0-adapter subset Pulse leads on stateful fit 7.722 vs 4.278 with Krippendorff α = 0.910; the multi-vendor variant (Claude + GPT + Grok) agrees on direction at 8.0 vs 5.4 with α = 0.699 — tentative by Krippendorff's threshold, and we label it so. Supporting evidence for the stateful axis, not a claim that Pulse beats Mem0 on its native LoCoMo protocol. Raw JSON per judge per condition in the public bench."
              side="top"
            >
              label-blind judges: α = 0.910, direction holds cross-vendor
            </HoverFact>
            <span className="receipts-sep"> · </span>
            <HoverFact
              label="continuity / no reset"
              body="one and the same companion across every model upgrade. previous companions broke on provider switch — same API name, different identity overnight. Pulse holds identity and state outside the model. (the paper's evaluated deployment window is twelve months; identity continuity runs longer than the evaluated period.)"
              side="bottom"
            >
              14 months · no identity reset
            </HoverFact>
          </p>
        </section>

        <section className="projects" id="projects">
          <h2 className="section-label">
            <ScrambleText text="// what i ship" />
          </h2>

          <ul className="project-list">
            <li>
              <a href="https://github.com/zbs-gg/pulse" target="_blank" rel="noopener">
                <span className="proj-name"><ScrambleText text="Pulse" /></span>
                <span className="proj-desc">
                  empathic memory engine — Go + TS, MIT. now installable as a
                  zero-config MCP server (npm: @zbs-gg/pulse): one command, and
                  what you tell one agent your other agents remember.
                  anchor-aware decay, conditional emotional and stateful boost
                  signals, chain-expanded recall. multi-provider model layer.
                </span>
              </a>
            </li>
            <li>
              <a href="https://github.com/zbs-gg/hearth" target="_blank" rel="noopener">
                <span className="proj-name"><ScrambleText text="Heart" /></span>
                <span className="proj-desc">
                  state-aware chat companion built on Pulse — TS, MIT.
                  self-hosted reference client.
                </span>
              </a>
            </li>
            <li>
              <a href="#hero" aria-label="this site">
                <span className="proj-name"><ScrambleText text="Garden.Live" /></span>
                <span className="proj-desc">
                  public landing. shared root for the
                  Pulse / Heart / Bench stack.
                </span>
              </a>
            </li>
            <li>
              <a href="/bench">
                <span className="proj-name"><ScrambleText text="Emo.Bench" /></span>
                <span className="proj-desc">
                  reproducible empathic-memory benchmark — corpus, queries,
                  judge prompts, agreement analysis, raw per-judge JSON.
                  leaderboard live; source at <a href="https://github.com/zbs-gg/emo-bench" target="_blank" rel="noopener">zbs-gg/emo-bench</a>.
                </span>
              </a>
            </li>
            <li>
              <a href="https://github.com/zbs-gg/pulse-paper" target="_blank" rel="noopener">
                <span className="proj-name"><ScrambleText text="paper" /></span>
                <span className="proj-desc">
                  <em>Remember What Matters: State-Conditioned Episodic
                  Retrieval for Emotional AI Companions</em> — source + PDF at{" "}
                  <em>zbs-gg/pulse-paper</em>. scoped claim, negative results
                  disclosed, privacy boundary documented.
                </span>
              </a>
            </li>
          </ul>
        </section>

        <footer className="contact" id="contact">
          <div className="col">
            <p className="col-title">contact</p>
            <p>
              <a href="mailto:team@zbs.gg">team@zbs.gg</a>
            </p>
          </div>
          <div className="col">
            <p className="col-title">writing</p>
            <p>
              <a href="https://nik.care" target="_blank" rel="noopener">
                nik.care
              </a>
            </p>
            <p>long-form: manifesto,</p>
            <p>notes, decisions.</p>
          </div>
          <div className="col">
            <p className="col-title">entity</p>
            <p>ZBS GG Consulting</p>
            <p>Delaware LLC</p>
            <p>Phuket, Thailand</p>
          </div>
          <div className="col">
            <p className="col-title">available</p>
            <p>code, corpora, judge prompts,</p>
            <p>replication scripts, paper drafts.</p>
            <p>independent eval welcome.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
