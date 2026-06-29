// components/pulse/comparison.tsx
//
// Comparison — Pulse vs claude-mem vs Mem0, judged strictly along the two
// qualities that matter (continuity + state-aware understanding) plus fit.
//
// Honest by design: it says where each tool is genuinely good and where it may
// not fit, never invents a weakness, and carries NO benchmark numbers (canon —
// bench claims live only on /bench, not here, and never near a fallback).
//
// Pure copy, no interactivity → server component (no "use client" directive).
// Renders the §4 section: its own <section className="evidence" id="compare">
// wrapper + <h2 className="section-label"> header (composed via ScrambleText)
// so the page integrator only has to drop <Comparison /> in.
//
// Props: none.
// Export: Comparison

import { ScrambleText } from "@/components/scramble-text";

export function Comparison() {
  return (
    <section className="evidence" id="compare">
      <h2 className="section-label">
        <ScrambleText text="// pulse vs the alternatives" />
      </h2>

      <p className="install-lede">
        Other tools do real things well. Here&apos;s an honest read along the
        only two axes that matter — and where each one may not fit.
      </p>

      <div className="install-cols">
        <article>
          <h3>claude-mem</h3>
          <ul>
            <li>
              <em style={{ color: "var(--fg)", fontStyle: "normal" }}>
                good at:
              </em>{" "}
              clean, automatic capture of your Claude sessions — solid
              continuity inside Claude
            </li>
            <li>
              <em style={{ color: "var(--fg)", fontStyle: "normal" }}>
                may not fit:
              </em>{" "}
              it&apos;s tied to the Claude/Claude-Code world; it recalls what you
              discussed, not the <em style={{ fontStyle: "italic" }}>right</em>{" "}
              moment for your current state
            </li>
            <li>
              one quality strong (continuity in-tool), the second thinner (no
              state-aware surfacing)
            </li>
          </ul>
        </article>

        <article>
          <h3>Mem0</h3>
          <ul>
            <li>
              <em style={{ color: "var(--fg)", fontStyle: "normal" }}>
                good at:
              </em>{" "}
              a capable, general memory API — facts and notes you can query from
              your own app
            </li>
            <li>
              <em style={{ color: "var(--fg)", fontStyle: "normal" }}>
                may not fit:
              </em>{" "}
              it&apos;s a backend you wire up and host; it stores what was said,
              with no notion of <em style={{ fontStyle: "italic" }}>which</em>{" "}
              memory matters for <em style={{ fontStyle: "italic" }}>this</em>{" "}
              moment
            </li>
            <li>
              great building block; not a drop-in companion that just works in
              your agent
            </li>
          </ul>
        </article>

        <article>
          <h3>Pulse</h3>
          <ul>
            <li>
              works in <em style={{ fontStyle: "italic" }}>every</em> harness —
              Claude Code, Cursor, VS Code, Codex, any MCP host
            </li>
            <li>configurable to any setup, and one-touch to install</li>
            <li>
              local embedders option — your memory and your context stay on your
              machine
            </li>
            <li>
              both qualities by design: continuity that doesn&apos;t drown, and
              state-aware surfacing that knows what you mean now
            </li>
          </ul>
        </article>
      </div>

      <p className="ev-note">
        Pulse isn&apos;t &ldquo;more memory.&rdquo; It&apos;s the two qualities,
        in whatever tool you already use, with nothing leaving the machine unless
        you turn it on.
      </p>

      <p className="ev-note faint">
        no benchmark numbers on this page — those, with full methodology, live at{" "}
        <a href="/bench">zbs.gg/bench</a>.
      </p>
    </section>
  );
}
