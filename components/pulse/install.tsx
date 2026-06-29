"use client";

/**
 * components/pulse/install.tsx — Install CTA for the /pulse landing page.
 *
 * Exports TWO components:
 *
 *   <InstallButtons />
 *     Props: none.
 *     The §5 Install CTA body: the PRIMARY full-engine path (Claude Code deep
 *     link + copy-command fallback) and the SECONDARY "Safe Mode · keyword
 *     recall" fallbacks (Cursor / VS Code / Codex), each deep-link paired with
 *     a runnable copy command. Owns every encoded URL from the INSTALL SPEC.
 *     Renders inside the page's <section id="install"> (the section wrapper +
 *     section-label header live in app/pulse/page.tsx).
 *
 *   <StickyInstallBar hideWhenInstallVisible?: boolean />
 *     Props:
 *       hideWhenInstallVisible?: boolean (default false)
 *         When true, the bar fades out once #install scrolls into view
 *         (IntersectionObserver) so it doesn't duplicate the final CTA.
 *         When false (default), the bar is always pinned.
 *     A bottom-pinned mono row: label, primary "Open in Claude Code" deep link,
 *     primary copy-command button, and a "Safe Mode ↓" anchor that scrolls to
 *     #install. Collapses to two lines under 820px.
 *
 * Style: reuses existing globals.css classes (.cmd-block/.cmd-row/.cmd-label/
 * .cmd-note/.btn-ascii/.status-line/.install-cols/.ev-note/.faint/.install-lede)
 * plus inline style props + one <style jsx> block scoped to the sticky bar.
 * globals.css is NOT edited.
 *
 * Honesty canon (AGENTS.md): Safe Mode is labeled keyword recall, never "Pulse"
 * or "Lite Pulse"; no benchmark numbers appear anywhere here; no "ready"/
 * "production" claims; every deep link is twinned with a runnable command.
 */

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/copy-button";

// ── Verbatim, pre-encoded strings from the INSTALL SPEC (do not re-encode) ──

const PRIMARY_CMD = "npx @zbs-gg/pulse@preview init claude-code";

const CLAUDE_HREF =
  "claude-cli://open?q=Install%20Pulse%20Local%20Preview%20%E2%80%94%20run%3A%20npx%20%40zbs-gg/pulse%40preview%20init%20claude-code";

const CURSOR_HREF =
  "cursor://anysphere.cursor-deeplink/mcp/install?name=pulse&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkB6YnMtZ2cvcHVsc2VAcHJldmlldyIsIm1jcCJdfQ==";

const VSCODE_HREF =
  "vscode:mcp/install?%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40zbs-gg/pulse%40preview%22%2C%22mcp%22%5D%7D";

const RAW_MCP_CMD = "npx -y @zbs-gg/pulse@preview mcp";

const CODEX_CMD = "codex mcp add pulse -- npx -y @zbs-gg/pulse@preview mcp";

// ─────────────────────────────────────────────────────────────────────────────

export function InstallButtons() {
  return (
    <div>
      <p className="install-lede">
        One command for the full engine in Claude Code. Or add the
        compatibility fallback to another host — clearly labeled, because it&apos;s
        keyword recall, not the Pulse engine.
      </p>

      {/* PRIMARY — full engine (Claude Code) */}
      <div className="cmd-block" aria-label="Pulse full engine — Claude Code">
        <span className="cmd-label">full engine — Claude Code</span>
        <div className="cmd-row" style={{ marginBottom: "0.7rem" }}>
          <a className="btn-ascii" href={CLAUDE_HREF}>
            Open in Claude Code
          </a>
          <span className="cmd-note" style={{ flex: "0 1 auto" }}>
            deep link — if nothing opens, run the command below
          </span>
        </div>
        <div className="cmd-row">
          <code>{PRIMARY_CMD}</code>
          <CopyButton text={PRIMARY_CMD} label="copy command" />
        </div>
        <div className="cmd-row" style={{ marginTop: "0.5rem" }}>
          <span className="cmd-note">
            this is the full state-aware engine · then run pulse doctor, then
            pulse demo
          </span>
        </div>
      </div>

      <p className="status-line">
        <span className="live">● live on npm</span> · developer preview ·
        local-first · backend LLM off by default
      </p>

      {/* SECONDARY — Safe Mode (clearly labeled fallback) */}
      <div style={{ marginTop: "2rem" }}>
        <h3
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.03em",
            color: "var(--fg)",
            margin: "0 0 0.5rem",
          }}
        >
          Safe Mode · keyword recall (not the full engine)
        </h3>
        <p className="ev-note faint" style={{ borderTop: "none", paddingTop: 0, marginTop: 0 }}>
          keyword recall only — this is the compatibility fallback, not Pulse
          retrieval. no benchmark claim applies here, and pulse doctor will say
          so.
        </p>

        <div className="install-cols">
          {/* Cursor */}
          <article>
            <h3>Add to Cursor</h3>
            <div className="cmd-block" aria-label="Add Pulse Safe Mode to Cursor">
              <div className="cmd-row" style={{ marginBottom: "0.7rem" }}>
                <a className="btn-ascii" href={CURSOR_HREF}>
                  Add to Cursor
                </a>
              </div>
              <div className="cmd-row">
                <code>{RAW_MCP_CMD}</code>
                <CopyButton text={RAW_MCP_CMD} label="copy command" />
              </div>
              <div className="cmd-row" style={{ marginTop: "0.5rem" }}>
                <span className="cmd-note">
                  or add this as a stdio MCP server named &quot;pulse&quot; in
                  Cursor settings
                </span>
              </div>
            </div>
          </article>

          {/* VS Code */}
          <article>
            <h3>Install in VS Code</h3>
            <div className="cmd-block" aria-label="Install Pulse Safe Mode in VS Code">
              <div className="cmd-row" style={{ marginBottom: "0.7rem" }}>
                <a className="btn-ascii" href={VSCODE_HREF}>
                  Install in VS Code
                </a>
              </div>
              <div className="cmd-row">
                <code>{RAW_MCP_CMD}</code>
                <CopyButton text={RAW_MCP_CMD} label="copy server command" />
              </div>
              <div className="cmd-row" style={{ marginTop: "0.5rem" }}>
                <span className="cmd-note">
                  or add a stdio MCP server &quot;pulse&quot; running this command
                </span>
              </div>
            </div>
          </article>

          {/* Codex */}
          <article>
            <h3>Codex</h3>
            <div className="cmd-block" aria-label="Add Pulse Safe Mode to Codex">
              <span className="cmd-label">Codex</span>
              <div className="cmd-row">
                <code>{CODEX_CMD}</code>
                <CopyButton text={CODEX_CMD} label="copy for Codex" />
              </div>
              <div className="cmd-row" style={{ marginTop: "0.5rem" }}>
                <span className="cmd-note">no deep link — copy and run</span>
              </div>
            </div>
          </article>
        </div>

        {/* claude.ai — no button */}
        <p className="quiet-line">
          claude.ai supports remote connectors only — there&apos;s no local
          install here. Use Claude Code, Cursor, VS Code, or another local MCP
          host above.
        </p>
      </div>
    </div>
  );
}

type StickyInstallBarProps = {
  /** Fade the bar out once #install scrolls into view. Default false (always-on). */
  hideWhenInstallVisible?: boolean;
};

export function StickyInstallBar({
  hideWhenInstallVisible = false,
}: StickyInstallBarProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!hideWhenInstallVisible) return;
    const target = document.getElementById("install");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [hideWhenInstallVisible]);

  return (
    <div
      className="pulse-sticky-bar"
      role="region"
      aria-label="install Pulse"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: "rgba(5, 5, 5, 0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderTop: "1px solid var(--rule)",
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(100%)" : "translateY(0)",
        pointerEvents: hidden ? "none" : "auto",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      <div
        className="pulse-sticky-inner"
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "0.6rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          fontFamily: "var(--mono)",
        }}
      >
        <span
          className="pulse-sticky-label"
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.78rem",
            letterSpacing: "0.04em",
            color: "var(--fg-dim)",
            whiteSpace: "nowrap",
          }}
        >
          pulse · local preview
        </span>

        <a className="btn-ascii" href={CLAUDE_HREF} style={{ fontSize: "0.8rem" }}>
          Open in Claude Code
        </a>

        <CopyButton text={PRIMARY_CMD} label="copy command" />

        <a
          href="#install"
          className="pulse-sticky-safe"
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.76rem",
            color: "var(--fg-faint)",
            textDecoration: "none",
            borderBottom: "1px dotted var(--fg-faint)",
            marginLeft: "auto",
            whiteSpace: "nowrap",
          }}
        >
          Safe Mode ↓
        </a>
      </div>

      {/* Scoped layout-only CSS. No animation here, so no reduced-motion gate
          needed; the (transition) fade above is a tiny opacity tween that
          respects the global reduced-motion handling of the page. */}
      <style jsx>{`
        @media (max-width: 820px) {
          .pulse-sticky-inner {
            row-gap: 0.4rem;
          }
          .pulse-sticky-label {
            flex-basis: 100%;
          }
          .pulse-sticky-safe {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
