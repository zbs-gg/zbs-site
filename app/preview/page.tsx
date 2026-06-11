import Image from "next/image";
import Link from "next/link";
import { AgentPromptCopy } from "./AgentPromptCopy";

const zeroConfigCommand = "claude mcp add pulse -- npx -y @zbs-gg/pulse@preview mcp";
const fullEngineCommand = "npx @zbs-gg/pulse@preview init claude-code";
const repoUrl = "https://github.com/zbs-gg/pulse";
const demoVideoUrl = "https://www.zbs.gg/pulse-demo.mp4";

const agentPrompt = `Hi. Please check whether it is safe to install Pulse:
${repoUrl}

This is a local-first memory manager for AI agents: it stores structured
memory capsules locally, never raw transcripts, and needs no model API keys.

1. Read README.md and AGENTS.md in the repo (they are written for you).
2. Verify the npm package is published and recent:
   npm view @zbs-gg/pulse dist-tags   (needs preview >= 0.5.0)
3. Tell me in plain words what an install will do and write, and how to
   erase everything (claude mcp remove pulse + rm -rf ~/.pulse/standalone).
4. Ask me for confirmation.
5. After confirmation, install with one command:
   ${zeroConfigCommand}
6. Call pulse_status: while the store is empty it returns a first_run block
   with a short guided demo. Walk me through it — save one real thing I am
   working on, then prove it from a different session via pulse_resume.
7. Finish by showing what is stored (pulse_recall) and how to wipe it
   (pulse_wipe).

Important:
- do not import old chats without separate confirmation;
- do not store raw transcript;
- do not print secrets;
- if anything looks unsafe, stop and explain.`;

const statusPills = [
  "live on npm",
  "zero-config install",
  "developer preview",
  "backend LLM off by default",
  "raw capture off by default",
];

const agentChecks = [
  "what files Pulse writes",
  "whether backend API keys are required",
  "whether raw transcript capture is off",
  "where memory is stored",
  "how to wipe and disconnect",
  "whether setup is project-local",
];

const proofSteps = [
  "Save one small memory.",
  "Open a fresh session — even a different agent.",
  "Ask: where did we leave off?",
  "It answers without you re-explaining.",
];

const sources = [
  ["Claude Code", "Connector after install. Sessions are not scanned yet.", "Preview later"],
  ["Codex", "Connector available later. Sessions are not scanned yet.", "Preview later"],
  ["ChatGPT archive", "Choose an export file only when you want to preview.", "Choose file"],
  ["Claude app archive", "Preview threads first. Import nothing by default.", "Choose file"],
];

export default function PreviewPage() {
  return (
    <main className="pulse-preview-page">
      <section className="pulse-preview-hero" id="install">
        <video
          className="pulse-preview-video"
          src="/elle-2.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="pulse-preview-scrim" />

        <nav className="pulse-preview-nav" aria-label="Pulse preview">
          <Link href="/" className="pulse-preview-brand">
            <Image src="/logo-mark.png" alt="" width={28} height={28} priority />
            <span>ZBS / Pulse</span>
          </Link>
          <div className="pulse-preview-links">
            <a href="#agent">Agent install</a>
            <a href="#proof">Proof</a>
            <a href="#leave">Wipe</a>
          </div>
        </nav>

        <div className="pulse-preview-hero-grid">
          <div className="pulse-preview-copy">
            <p className="pulse-preview-kicker">Pulse MCP Preview · v0.5.0 on npm</p>
            <h1>Pulse keeps the thread.</h1>
            <p className="pulse-preview-lede">
              Local-first memory for Claude Code and MCP hosts. What you tell one agent,
              your other agents and sessions remember — structured memories, never raw
              transcripts. One command, no daemon, no API keys.
            </p>

            <div className="pulse-preview-command" aria-label="Zero-config install command">
              <span>Install — the whole thing</span>
              <code>{zeroConfigCommand}</code>
            </div>

            <div className="pulse-preview-status" aria-label="Preview status">
              {statusPills.map((pill, index) => (
                <span key={pill} className={index === 0 ? "is-alive" : undefined}>
                  {index === 0 ? "♥ " : ""}
                  {pill}
                </span>
              ))}
            </div>

            <div className="pulse-preview-actions" aria-label="Preview actions">
              <a href="#agent">Copy install prompt</a>
              <a href={demoVideoUrl} target="_blank" rel="noopener">
                Open the 90s demo video
              </a>
            </div>
          </div>

          <aside className="pulse-preview-resume-card" aria-label="What Pulse will tell Claude next">
            <div className="pulse-preview-heart" aria-hidden="true">
              <span>♥</span>
            </div>
            <p className="pulse-preview-card-label">
              What Pulse will tell Claude next — example after your first save
            </p>
            <h2>Pulse Resume</h2>
            <div className="pulse-preview-resume-lines">
              <div>
                <b>Where we left off</b>
                <span>No active thread yet.</span>
              </div>
              <div>
                <b>First memory</b>
                <span>You installed Pulse MCP and connected it to Claude Code.</span>
              </div>
              <div>
                <b>Next</b>
                <span>Save one decision, then open a fresh session.</span>
              </div>
            </div>
            <p className="pulse-preview-footnote">
              stored locally / yours to inspect / yours to forget
            </p>
          </aside>
        </div>
      </section>

      <section className="pulse-preview-agent" id="agent">
        <AgentPromptCopy prompt={agentPrompt} />
      </section>

      <section className="pulse-preview-trust" aria-label="What your agent will check">
        <article>
          <p className="pulse-preview-label">What your agent will check</p>
          <h2>Audit first. Install after confirmation.</h2>
          <ul>
            {agentChecks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        </article>

        <article id="manual">
          <p className="pulse-preview-label">Zero-config install</p>
          <h2>One command. The agent does the rest.</h2>
          <div className="pulse-preview-command" aria-label="Zero-config install command">
            <span>Run from your project folder</span>
            <code>{zeroConfigCommand}</code>
            <p className="pulse-preview-prereqs">
              Requires Node 18+ and Claude Code CLI. No daemon, no Go toolchain, no
              API keys. On the first tool call Pulse creates a local store and
              returns a guided first-run demo to your agent. Full local engine
              (retrieval engine, viewer, lifecycle hooks) is an optional upgrade:{" "}
              <code className="pulse-preview-inline-code">{fullEngineCommand}</code>
            </p>
          </div>
        </article>

        <article>
          <p className="pulse-preview-label">Trust boundary</p>
          <h2>What stays off by default</h2>
          <ul>
            <li>No backend OpenAI, Anthropic, or Cohere key is required.</li>
            <li>No raw full transcript capture is enabled.</li>
            <li>Archive import is optional and not part of the first proof.</li>
            <li>Memory can be deleted or wiped locally.</li>
          </ul>
        </article>
      </section>

      <section className="pulse-preview-proof" id="proof">
        <div className="pulse-preview-section-head">
          <p className="pulse-preview-label">First proof</p>
          <h2>One memory, one fresh session, one viewer.</h2>
          <p>
            The first two minutes should prove continuity, not teach every Pulse feature.
          </p>
        </div>

        <div className="pulse-preview-proof-grid">
          <article className="pulse-preview-memory-card">
            <div className="pulse-preview-saved-row">
              <span>first thread kept ♥</span>
              <small>saved locally after install</small>
            </div>
            <h3>Your first memory</h3>
            <blockquote>
              &quot;You installed Pulse MCP and connected it to Claude Code.&quot;
            </blockquote>
            <p>
              Pulse works quietly even if you never import old chats. Feedback only makes it
              more personal.
            </p>
            <div className="pulse-preview-emotion">
              <span>Pulse guess: maybe curiosity?</span>
              <i>Curious</i>
              <i>Relieved</i>
              <i>Skeptical</i>
              <i>Skip</i>
            </div>
            <small>No emotion is stored until you choose one. Silence is not consent.</small>
          </article>

          <ol className="pulse-preview-checklist" aria-label="First proof checklist">
            {proofSteps.map((step) => (
              <li key={step}>
                <span aria-hidden="true" />
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pulse-preview-demo" id="demo" aria-label="Demo video">
        <div className="pulse-preview-section-head">
          <p className="pulse-preview-label">90 seconds, nothing staged</p>
          <h2>Watch the whole loop.</h2>
          <p>
            A real run: the repo, the agent instruction, the one-command install, an agent
            saving a thread — and a different session picking it up.
          </p>
        </div>
        <video
          className="pulse-preview-demo-video"
          src="/pulse-demo.mp4"
          controls
          preload="metadata"
          playsInline
        />
        <p className="pulse-preview-demo-fallback">
          If the embedded player does not start,{" "}
          <a href={demoVideoUrl} target="_blank" rel="noopener">
            open the demo video directly
          </a>
          .
        </p>
      </section>

      <section className="pulse-preview-sources" aria-label="Import old context later">
        <div className="pulse-preview-section-head">
          <p className="pulse-preview-label">Import old context later</p>
          <h2>Start with one memory first. Old chats can wait.</h2>
        </div>
        <div className="pulse-preview-source-grid">
          {sources.map(([name, detail, action]) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>{detail}</p>
              <span>{action}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="pulse-preview-limits" id="limits">
        <div className="pulse-preview-section-head">
          <p className="pulse-preview-label">What this is not</p>
          <h2>Use this as a technical preview.</h2>
        </div>
        <div className="pulse-preview-limit-copy" id="leave">
          <p>
            This is not a broad consumer installer, not Pulse Cloud, and not a ChatGPT Store
            or Claude Directory connector. It is the Claude Code-first path for technical friends,
            partners, and early reviewers.
          </p>
          <div className="pulse-preview-mini-command">
            <span>Wipe local memory</span>
            <code>ask your agent: pulse_wipe, confirm &quot;wipe pulse memory&quot;</code>
          </div>
          <div className="pulse-preview-mini-command">
            <span>Disconnect this project</span>
            <code>claude mcp remove pulse</code>
          </div>
          <div className="pulse-preview-mini-command">
            <span>Remove the store</span>
            <code>rm -rf ~/.pulse/standalone</code>
          </div>
          <p className="pulse-preview-quiet">Pulse memory wiped. Quiet again.</p>
        </div>
      </section>
    </main>
  );
}
