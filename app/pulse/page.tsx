import ClientBg from "@/components/client-bg";
import { ScrambleText } from "@/components/scramble-text";
import { Brand } from "@/components/brand";
import { Crumbs } from "@/components/crumbs";
import { CopyButton } from "@/components/copy-button";
import { MemoryTimeline } from "@/components/memory-timeline";
import { TwoQualities } from "@/components/pulse/qualities";
import { TheProblem } from "@/components/pulse/problem";
import { RetrievalContrast } from "@/components/pulse/retrieval-contrast";
import { Comparison } from "@/components/pulse/comparison";
import { InstallButtons, StickyInstallBar } from "@/components/pulse/install";
import Link from "next/link";

export const metadata = {
  title: "pulse — one endless conversation that knows what matters · zbs.gg",
  description:
    "Pulse gives every AI agent two things it doesn't have on its own: one conversation that never resets, and the sense that it knows what you're talking about right now. Local-first, state-aware memory for any MCP host. Raw transcript capture off by default.",
};

const repoUrl = "https://github.com/zbs-gg/pulse";
const primaryCommand = "npx @zbs-gg/pulse@preview init claude-code";
const demoVideoUrl = "https://www.zbs.gg/pulse-demo.mp4";

export default function PulsePage() {
  return (
    <>
      <ClientBg
        src="/elle-1.mp4"
        fallbackSrc="/pulse-demo.mp4"
        cellSize={8}
        mouseGlowEnabled
        mouseGlowIntensity={0.3}
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
            <a href="#qualities">
              <ScrambleText text="two qualities" />
            </a>
            <a href="#problem">
              <ScrambleText text="problem" />
            </a>
            <a href="#how">
              <ScrambleText text="how it works" />
            </a>
            <a href="#compare">
              <ScrambleText text="compare" />
            </a>
            <a href="#install">
              <ScrambleText text="install" />
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
          ]}
        />

        {/* SECTION 0 — Hero */}
        <section className="hero install-hero" id="hero">
          <h1 className="hero-line">
            <ScrambleText text="One endless conversation with your AI." />
          </h1>
          <p className="install-lede">
            Pulse gives every AI agent two things it doesn&rsquo;t have on its
            own: the feeling of <em>one conversation that never resets</em>, and
            the sense that it actually <em>knows what you&rsquo;re talking about
            right now</em>. Whatever it does under the hood &mdash; memory,
            notes, a graph &mdash; doesn&rsquo;t matter. Those two qualities do.
            Local-first, structured memories, raw transcript capture off by
            default.
          </p>

          <div className="cmd-block" aria-label="Pulse install — Claude Code, full engine">
            <span className="cmd-label">install — Claude Code, full engine</span>
            <div className="cmd-row">
              <code>{primaryCommand}</code>
              <CopyButton text={primaryCommand} label="copy command" />
            </div>
          </div>

          <p className="status-line">
            <span className="live">● live on npm</span> · developer preview ·
            local-first · backend LLM off by default
          </p>
        </section>

        {/* SECTION 1 — Two Qualities */}
        <TwoQualities />

        {/* SECTION 2 — The Problem */}
        <TheProblem />

        {/* SECTION 3 — How Pulse holds both */}
        <section className="evidence" id="how">
          <h2 className="section-label">
            <ScrambleText text="// how pulse holds both" />
          </h2>
          <p className="install-lede">
            Two mechanisms, mapped to the two qualities. <em>What survives</em>{" "}
            keeps the conversation continuous. <em>What surfaces now</em> is how
            it knows what you&rsquo;re talking about.
          </p>

          {/* 3a — Continuity → MemoryTimeline */}
          <p className="ev-note">
            ◆ structural anchors stay bright. ● regular events fade. Anchor-aware
            decay decides what stays vivid and what&rsquo;s allowed to blur
            &mdash; so months later the call you couldn&rsquo;t take is still
            there, and Tuesday&rsquo;s coffee isn&rsquo;t in the way. That&rsquo;s
            continuity that doesn&rsquo;t drown.
          </p>
          <MemoryTimeline />

          {/* 3b — Understanding → RetrievalContrast */}
          <p className="install-lede" style={{ marginTop: "2.5rem" }}>
            Same question, different state, different memory &mdash; with the
            reason on every card. Drag the state toggle: the agent navigates the{" "}
            <em>same</em> history two different ways depending on what you
            actually need right now.
          </p>
          <RetrievalContrast />

          {/* 3c — See it run → recorded demo */}
          <p className="install-lede" style={{ marginTop: "2.5rem" }}>
            A real run of <code>pulse demo</code> on the live engine: a labeled,
            simulated corpus seeds in, one question runs in three user states,
            three different answers come back with their reasons &mdash; then the
            continuity pack the next session receives, then the wipe.
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

        {/* SECTION 4 — Comparison */}
        <Comparison />

        {/* SECTION 5 — Install CTA */}
        <section className="evidence" id="install">
          <h2 className="section-label">
            <ScrambleText text="// install" />
          </h2>
          <InstallButtons />
        </section>

        <footer className="contact" id="contact">
          <div className="col">
            <p className="col-title">contact</p>
            <p>
              <a href="mailto:team@zbs.gg">team@zbs.gg</a>
            </p>
          </div>
          <div className="col">
            <p className="col-title">source</p>
            <p>
              <a href={repoUrl} target="_blank" rel="noopener">
                github.com/zbs-gg/pulse
              </a>
            </p>
            <p>local-first, auditable.</p>
          </div>
          <div className="col">
            <p className="col-title">bench</p>
            <p>
              <Link href="/bench">zbs.gg/bench</Link>
            </p>
            <p>numbers + full methodology.</p>
          </div>
          <div className="col">
            <p className="col-title">entity</p>
            <p>ZBS GG Consulting</p>
            <p>Delaware LLC</p>
            <p>Phuket, Thailand</p>
          </div>
        </footer>
      </main>

      <StickyInstallBar hideWhenInstallVisible />
    </>
  );
}
