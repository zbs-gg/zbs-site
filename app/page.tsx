import ClientBg from "@/components/client-bg";
import { ScrambleText } from "@/components/scramble-text";
import { MemoryTimeline } from "@/components/memory-timeline";
import { Brand } from "@/components/brand";
import { HeroCycle } from "@/components/hero-cycle";
import { HoverFact } from "@/components/hover-fact";
import { HL } from "@/components/highlight";
import { ClickWipe } from "@/components/click-wipe";

export default function Page() {
  return (
    <>
      <ClickWipe />
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
              <ScrambleText text="hearth" />
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
                Pulse v3 leads on all 5 axes vs 8 baselines (incl.
                Mem0, qdrant_filter) · 11 judges, 6 vendor families ·
                κ_stateful = <span className="holo">0.815</span> label-disclosed,{" "}
                <span className="holo">α_stateful = 0.699</span> in cross-vendor
                label-blind re-run (Anthropic + OpenAI + xAI) · stateful Δ vs
                strongest baseline +2.07 (label-blind) · own corpus, judge
                prompts open
              </span>
            </li>
            <li>
              <span className="ev-key">LongMemEval_S</span>
              <span className="ev-val">68.89% · published 500-question long-context evaluation (independent corpus)</span>
            </li>
            <li>
              <span className="ev-key">ES-MemEval</span>
              <span className="ev-val">76% (LLM-judge) · 1427 questions across 18 seekers (independent corpus)</span>
            </li>
            <li>
              <span className="ev-key">LoCoMo</span>
              <span className="ev-val">32.51% F1 · 62.78% adversarial refusal · ACL 2024 corpus (independent)</span>
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
              label="evaluation / α_stateful = 0.699 cross-vendor label-blind"
              body="11-judge label-disclosed pool (anthropic, openai, google, alibaba/qwen, zhipu/glm, moonshot/kimi) gives κ_stateful=0.815. To check disclosed-label anchoring, we ran a label-blind condition with 3 distinct vendor families (Claude Sonnet + OpenAI GPT-5.4 + xAI Grok 4): α_stateful drops to 0.699 (above tentative threshold, expected when judges have genuinely different priors), and Pulse v3 still leads every system on every axis. Raw JSON per judge per condition in the public bench."
              side="top"
            >
              11 LLM judges + cross-vendor label-blind α = 0.699
            </HoverFact>
            <span className="receipts-sep"> · </span>
            <HoverFact
              label="continuity / no reset"
              body="one and the same companion across every model upgrade. previous companions broke on provider switch — same API name, different identity overnight. Pulse holds identity and state outside the model."
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
                  empathic memory engine — Go, MIT. anchor-aware decay,
                  conditional emotional and stateful boost signals,
                  chain-expanded recall. multi-provider model layer (anthropic,
                  openai, kimi, glm, local OAI-compatible).
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
                  public landing + hosted Elle. shared root for the
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
              <a href="#" aria-disabled="true">
                <span className="proj-name"><ScrambleText text="paper" /></span>
                <span className="proj-desc">
                  <em>Hearth and Pulse: A Twelve-Month Case Study of
                  State-Aware Empathic Memory in Production</em> — arXiv
                  preprint, <em>soon.</em>
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
