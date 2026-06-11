import ClientBg from "@/components/client-bg";
import { ScrambleText } from "@/components/scramble-text";
import { Brand } from "@/components/brand";
import { Crumbs } from "@/components/crumbs";
import { CopyButton } from "@/components/copy-button";
import Link from "next/link";

export const metadata = {
  title: "install pulse — zbs.gg",
  description:
    "Pulse MCP developer preview. Local-first memory for Claude Code and MCP hosts. One command, no daemon, no API keys. Structured memories, never raw transcripts.",
};

const zeroConfigCommand = "claude mcp add pulse -- npx -y @zbs-gg/pulse@preview mcp";
const fullEngineCommand = "npx @zbs-gg/pulse@preview init claude-code";
const repoUrl = "https://github.com/zbs-gg/pulse";
const demoVideoUrl = "https://www.zbs.gg/pulse-demo.mp4";

const agentPrompt = `Hi. Please check whether it is safe to install Pulse MCP:
${repoUrl}

This is a local-first memory manager for AI agents: it stores structured
memory capsules locally, never raw transcripts, and needs no model API keys.

1. Read README.md, AGENTS.md, and llms.txt in the repo (they are written for you).
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
  "Save one small memory.",
  "Open a fresh session — even a different agent.",
  "Ask: where did we leave off?",
  "It answers without you re-explaining.",
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
        src="/elle-2.mp4"
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
                <ScrambleText text="pulse keeps the thread." />
              </h1>
              <p className="install-lede">
                local-first memory for Claude Code and MCP hosts. what you tell
                one agent, your other agents and sessions remember —{" "}
                <em>structured memories, never raw transcripts</em>. one
                command, no daemon, no API keys.
              </p>

              <div className="cmd-block" aria-label="zero-config install command">
                <span className="cmd-label">install — the whole thing</span>
                <div className="cmd-row">
                  <code>{zeroConfigCommand}</code>
                  <CopyButton text={zeroConfigCommand} label="copy command" />
                </div>
              </div>

              <div className="cmd-block" aria-label="agent install prompt">
                <span className="cmd-label">
                  or let your agent audit first — paste one prompt into Claude
                  Code, Codex, or Cursor
                </span>
                <div className="cmd-row">
                  <span className="cmd-note">
                    safe-install walkthrough, confirmation before any write
                  </span>
                  <CopyButton
                    text={agentPrompt}
                    label="copy install prompt"
                    doneLabel="prompt copied"
                  />
                </div>
              </div>

              <p className="status-line">
                <span className="live">● live on npm</span> · v0.5.0 developer
                preview · zero-config install · backend LLM off by default ·
                raw capture off by default
              </p>
            </div>

            <aside className="resume-card" aria-label="what Pulse will tell Claude next">
              <p className="rc-label">
                what Pulse will tell Claude next — example after your first save
              </p>
              <h2>
                <span className="heart">♥</span> pulse resume
              </h2>
              <div className="rc-lines">
                <div>
                  <b>where we left off</b>
                  <span>No active thread yet.</span>
                </div>
                <div>
                  <b>first memory</b>
                  <span>You installed Pulse MCP and connected it to Claude Code.</span>
                </div>
                <div>
                  <b>next</b>
                  <span>Save one decision, then open a fresh session.</span>
                </div>
              </div>
              <p className="rc-foot">stored locally / yours to inspect / yours to forget</p>
            </aside>
          </div>
        </section>

        <section className="evidence" id="agent">
          <h2 className="section-label">
            <ScrambleText text="// install with your agent" />
          </h2>
          <div className="prompt-card">
            <p>
              let your agent <em>audit Pulse before it installs anything</em>.
              the agent reads the repo, shows the plan, asks confirmation,
              installs, proves one memory, then shows wipe.
            </p>
            <textarea readOnly value={agentPrompt} aria-label="Pulse agent install prompt" />
            <div>
              <CopyButton
                text={agentPrompt}
                label="copy install prompt"
                doneLabel="prompt copied"
              />
            </div>
          </div>

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
              <h3>full engine — optional upgrade</h3>
              <ul>
                <li>zero-config path uses a built-in lite store</li>
                <li>retrieval engine, viewer, lifecycle hooks come with:</li>
              </ul>
              <div className="mini-cmds">
                <div className="cmd-block">
                  <span className="cmd-label">requires Node 18+ and Claude Code CLI</span>
                  <div className="cmd-row">
                    <code>{fullEngineCommand}</code>
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
            <ScrambleText text="// first proof" />
          </h2>
          <p className="install-lede">
            the first two minutes should prove <em>continuity</em>, not teach
            every feature. one memory, one fresh session, one viewer.
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
            <ScrambleText text="// 90 seconds, nothing staged" />
          </h2>
          <p className="install-lede">
            a real run: the repo, the agent instruction, the one-command
            install, an agent saving a thread — and a different session picking
            it up.
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
