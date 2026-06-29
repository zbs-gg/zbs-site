import ClientBg from "@/components/client-bg";
import { ScrambleText } from "@/components/scramble-text";
import { Brand } from "@/components/brand";
import { Crumbs } from "@/components/crumbs";
import { CopyButton } from "@/components/copy-button";
import Link from "next/link";

export const metadata = {
  title: "install pulse — zbs.gg",
  description:
    "Pulse MCP developer preview. Local-first memory for Claude Code and MCP hosts. One command, no daemon, no API keys. Structured memories; raw transcript capture is off by default.",
};

const localPreviewCommand = "npx @zbs-gg/pulse@preview init claude-code";
const safeModeCommand = "claude mcp add pulse -- npx -y @zbs-gg/pulse@preview mcp";
const repoUrl = "https://github.com/zbs-gg/pulse";
const demoVideoUrl = "https://www.zbs.gg/pulse-demo.mp4";

const agentPrompt = `Hi. Please check whether it is safe to install Pulse:
${repoUrl}

Pulse is a local-first, state-aware memory engine for AI agents: structured
memories; raw transcript capture is off by default; wipe always available.

1. Read README.md, AGENTS.md, and llms.txt (they are written for you).
2. Verify the npm package: npm view @zbs-gg/pulse dist-tags
   (preview should be 0.6.4 or newer).
3. Explain in plain words what an install writes and how to erase it.
4. Ask me for confirmation.
5. After confirmation, install the Local Preview:
   ${localPreviewCommand}
6. Run pulse doctor and tell me honestly which mode this machine gets.
   If full retrieval is enabled, run pulse demo and walk me through what
   it proves (same question, three user states, different memories, with
   reasons; then the continuity pack the next agent receives).
   If full retrieval is NOT enabled, say so plainly — safe fallback memory
   still works, but do not present it as the Pulse engine.
7. Show me the wipe path: pulse demo --clean, pulse wipe, claude mcp remove.

Important: no old-chat import without separate confirmation; no raw
transcripts; no secrets in output; stop and explain if anything looks unsafe.`;

const agentChecks = [
  "what files Pulse writes",
  "whether backend API keys are required",
  "whether raw transcript capture is off",
  "where memory is stored",
  "how to wipe and disconnect",
  "whether setup is project-local",
];

const trustBoundary = [
  "no backend OpenAI, Anthropic, or Cohere key is required",
  "no raw full transcript capture is enabled",
  "archive import is optional, never part of the first proof",
  "memory can be deleted or wiped locally",
];

const proofSteps = [
  "pulse demo seeds an isolated, labeled SIMULATED corpus — never your data.",
  "One question runs in three user states: drained, restored, angry.",
  "Different episodes surface — each line shows why: state x1.15 · anchor x1.05 · emotion x1.15.",
  "An old structural anchor outranks this week's noise, and the breakdown proves it.",
  "The continuity pack shows exactly what your next agent session receives.",
  "pulse demo --clean erases the whole demo store.",
];

// Statuses mirror the Compatible Harnesses table in zbs-gg/pulse README —
// keep in sync with the repo, do not promote a status the repo doesn't claim.
const harnesses: Array<[string, string]> = [
  ["Claude Code", "primary supported path — the one-command install above"],
  ["Claude Desktop / local MCP clients", "compatible — add a stdio MCP server running the same npx command"],
  ["Cursor", "compatible — add Pulse as a stdio MCP server if your setup supports MCP tools"],
  ["Windsurf / other MCP-capable coding agents", "compatible — same stdio npx command"],
  ["Codex / OpenAI agent harnesses", "MCP-compatible target — use the stdio command where MCP config is available"],
  ["Gemini CLI / Gemini agent harnesses", "MCP-compatible target — use the stdio command where MCP config is available"],
  ["LangChain / CrewAI apps", "developer integration target — run Pulse MCP as a local tool server"],
  ["ChatGPT app / store connector", "later — not in this preview"],
  ["Claude Directory / hosted connector", "later — not in this preview"],
  ["Pulse Cloud", "later — not in this preview"],
];

const importSources: Array<[string, string]> = [
  ["Claude Code sessions", "connector after install. sessions are not scanned yet."],
  ["Codex sessions", "connector available later. sessions are not scanned yet."],
  ["ChatGPT archive", "choose an export file only when you want a preview of it."],
  ["Claude app archive", "preview threads first. nothing enters memory by default."],
];

export default function PreviewPage() {
  return (
    <>
      <ClientBg
        src="/hero-bg-2.mp4"
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
            <a href="#agent">
              <ScrambleText text="agent install" />
            </a>
            <a href="#harnesses">
              <ScrambleText text="harnesses" />
            </a>
            <a href="#demo">
              <ScrambleText text="demo" />
            </a>
            <a href="#limits">
              <ScrambleText text="wipe" />
            </a>
            <a href={repoUrl} target="_blank" rel="noopener">
              <ScrambleText text="source" />
            </a>
          </nav>
        </header>

        <Crumbs
          trail={[
            { label: "zbs.gg", href: "/" },
            { label: "pulse" },
            { label: "install preview" },
          ]}
        />

        <section className="hero install-hero" id="install">
          <div className="install-hero-grid">
            <div>
              <h1 className="hero-line">
                <ScrambleText text="memory that knows what matters right now." />
              </h1>
              <p className="install-lede">
                Pulse is a state-aware memory engine for agents: it retrieves
                the right remembered episode for <em>this</em> moment — not the
                closest text match — and shows <em>why</em> it surfaced.
                local-first, <em>structured memories; raw transcript capture off by default</em>.
              </p>

              <div className="cmd-block" aria-label="Pulse Local Preview install">
                <span className="cmd-label">
                  install Pulse Local Preview — then pulse doctor, then pulse demo
                </span>
                <div className="cmd-row">
                  <code>{localPreviewCommand}</code>
                  <CopyButton text={localPreviewCommand} label="copy command" />
                </div>
              </div>

              <p className="status-line">
                <span className="live">● live on npm</span> · v0.6.4 developer
                preview · doctor-gated demo, no fake results · backend LLM off
                by default · raw capture off by default
              </p>
            </div>

            <aside className="prompt-card hero-prompt" aria-label="agent install prompt">
              <p className="rc-label">for your agent — paste this, it does the rest</p>
              <textarea readOnly value={agentPrompt} aria-label="Pulse agent install prompt" />
              <div className="hero-prompt-actions">
                <CopyButton
                  text={agentPrompt}
                  label="copy install prompt"
                  doneLabel="prompt copied"
                />
                <span className="cmd-note">audit first · confirmation before any write</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="evidence" id="agent">
          <h2 className="section-label">
            <ScrambleText text="// install with your agent" />
          </h2>
          <p className="install-lede">
            the prompt at the top of this page makes your agent{" "}
            <em>audit Pulse before it installs anything</em>: read the repo,
            explain what gets written, ask confirmation, run doctor, then run
            the demo — honestly.
          </p>

          <div className="install-cols">
            <article>
              <h3>what your agent will check</h3>
              <ul>
                {agentChecks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>trust boundary — off by default</h3>
              <ul>
                {trustBoundary.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>safe mode — fallback, not the product</h3>
              <ul>
                <li>for machines that can&apos;t run the engine: structured local memory, inspect, wipe — keyword recall only</li>
                <li>no benchmark claim applies to this mode, and pulse doctor will say so</li>
              </ul>
              <div className="mini-cmds">
                <div className="cmd-block">
                  <span className="cmd-label">requires only Node 18+</span>
                  <div className="cmd-row">
                    <code>{safeModeCommand}</code>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="evidence" id="harnesses">
          <h2 className="section-label">
            <ScrambleText text="// compatible harnesses" />
          </h2>
          <ul className="ev-rows">
            {harnesses.map(([name, status]) => (
              <li key={name}>
                <span className="ev-key">{name}</span>
                <span className="ev-val">{status}</span>
              </li>
            ))}
          </ul>
          <p className="ev-note">
            Pulse is an MCP server — it runs anywhere a host can start a local
            stdio command with npx. the preview proves the Claude Code path
            first; the same MCP tools (pulse_remember, pulse_recall,
            pulse_resume, pulse_status, pulse_wipe and friends) answer any
            compatible host. statuses mirror the{" "}
            <a href={`${repoUrl}#compatible-harnesses`} target="_blank" rel="noopener">
              <em>Compatible Harnesses</em>
            </a>{" "}
            table in the repo.
          </p>
        </section>

        <section className="evidence" id="proof">
          <h2 className="section-label">
            <ScrambleText text="// what the demo proves" />
          </h2>
          <p className="install-lede">
            not &quot;it remembers across sessions&quot; — everyone has that.
            the demo proves the part others don&apos;t show:{" "}
            <em>same query, different state, different memory — with the
            reason visible on every line.</em>{" "}
            and friction is signal: a tense session, a hard week — when state
            and salience signals are present, Pulse can rank which memory
            matters now (shown in the demo on a labeled simulated corpus).
          </p>
          <ol className="proof-steps" aria-label="first proof checklist">
            {proofSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="ev-note">
            your first memory will read something like &quot;You installed
            Pulse MCP and connected it to Claude Code.&quot; Pulse may guess an
            emotion (maybe curiosity?) — curious / relieved / skeptical / skip
            — but no emotion is stored until you choose one. silence is not
            consent. Pulse works quietly even if you never import old chats.
          </p>
        </section>

        <section className="evidence" id="demo">
          <h2 className="section-label">
            <ScrambleText text="// the demo, recorded live" />
          </h2>
          <p className="install-lede">
            a real run of <code>pulse demo</code> on the real engine (local
            MLX embeddings): simulated labeled corpus seeds in, one question
            runs in three user states, three different answers come back with
            their reasons — then the continuity pack, then the wipe.
          </p>
          <video
            className="demo-video"
            src="/pulse-demo.mp4"
            controls
            preload="metadata"
            playsInline
          />
          <p className="demo-fallback">
            if the embedded player does not start,{" "}
            <a href={demoVideoUrl} target="_blank" rel="noopener">
              open the demo video directly
            </a>
            .
          </p>
        </section>

        <section className="evidence" id="import">
          <h2 className="section-label">
            <ScrambleText text="// import old context later" />
          </h2>
          <p className="install-lede">
            start with one memory first. old chats can wait — import is opt-in,
            previewed before anything enters memory.
          </p>
          <ul className="ev-rows">
            {importSources.map(([name, detail]) => (
              <li key={name}>
                <span className="ev-key">{name}</span>
                <span className="ev-val">{detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="evidence" id="limits">
          <h2 className="section-label">
            <ScrambleText text="// what this is not" />
          </h2>
          <p className="install-lede">
            this is a technical preview — not a broad consumer installer, not
            Pulse Cloud, not a ChatGPT Store or Claude Directory connector. it
            is the Claude Code-first path for technical friends, partners, and
            early reviewers. leaving is one command:
          </p>
          <div className="mini-cmds">
            <div className="cmd-block">
              <span className="cmd-label">wipe local memory</span>
              <div className="cmd-row">
                <code>ask your agent: pulse_wipe, confirm &quot;wipe pulse memory&quot;</code>
              </div>
            </div>
            <div className="cmd-block">
              <span className="cmd-label">disconnect this project</span>
              <div className="cmd-row">
                <code>claude mcp remove pulse</code>
                <CopyButton text="claude mcp remove pulse" label="copy" />
              </div>
            </div>
            <div className="cmd-block">
              <span className="cmd-label">remove the store</span>
              <div className="cmd-row">
                <code>rm -rf ~/.pulse/standalone</code>
                <CopyButton text="rm -rf ~/.pulse/standalone" label="copy" />
              </div>
            </div>
          </div>
          <p className="quiet-line">pulse memory wiped. quiet again.</p>
        </section>
      </main>
    </>
  );
}
