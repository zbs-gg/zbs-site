import ClientBg from "@/components/client-bg";
import { ScrambleText } from "@/components/scramble-text";
import { Brand } from "@/components/brand";
import { Crumbs } from "@/components/crumbs";
import { CopyButton } from "@/components/copy-button";
import Link from "next/link";

export const metadata = {
  title: "cartographer — a quiet map of a person, so agents do what you mean · zbs.gg",
  description:
    "Cartographer maps a person from how they actually talk and choose, keeps every trait falsifiable (evidence for AND against), and aligns agents with what the person really wants. Local-first, free, no account. Delete-my-data really deletes. Developer preview — the MCP core ships today.",
};

const runCommand = "node <CARTO>/mcp/bin/cartographer-mcp.js";

export default function CartographerPage() {
  return (
    <>
      <ClientBg
        src="/hero-bg-1.mp4"
        fallbackSrc="/pulse-demo.mp4"
        cellSize={8}
        mouseGlowEnabled
        mouseGlowIntensity={0.28}
        mouseGlowRadius={200}
        contrastAdjust={1.2}
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
            <a href="#problem">
              <ScrambleText text="problem" />
            </a>
            <a href="#how">
              <ScrambleText text="how it maps" />
            </a>
            <a href="#today">
              <ScrambleText text="what ships" />
            </a>
            <a href="#data">
              <ScrambleText text="your data" />
            </a>
            <Link href="/pulse">
              <ScrambleText text="pulse" />
            </Link>
          </nav>
        </header>

        <Crumbs
          trail={[
            { label: "zbs.gg", href: "/" },
            { label: "cartographer" },
          ]}
        />

        {/* SECTION 0 — Hero */}
        <section className="hero install-hero" id="hero">
          <h1 className="hero-line">
            <ScrambleText text="A quiet map of you — so agents do what you mean." />
          </h1>
          <p className="install-lede">
            You are bad at saying what you want. Everyone is &mdash; we
            under-specify, contradict ourselves, ask for one thing while our
            choices reveal another. A project manager normally absorbs that; with
            an AI, nobody does. Cartographer is that missing role: it maps you from
            how you actually talk and choose, and keeps the map <em>honest</em>
            &mdash; every trait is a hypothesis with evidence <em>for</em> and{" "}
            <em>against</em>, and something that would change its mind.
          </p>

          <p className="status-line">
            <span className="live">● developer preview</span> · local-first ·
            free, no account · delete-my-data really deletes
          </p>
        </section>

        {/* SECTION 1 — The problem */}
        <section className="evidence" id="problem">
          <h2 className="section-label">
            <ScrambleText text="// the problem" />
          </h2>
          <p className="install-lede">
            An agent does exactly what you said &mdash; and exactly the wrong
            thing &mdash; because what you said isn&rsquo;t what you meant.
            Alignment isn&rsquo;t only a model problem; it&rsquo;s a{" "}
            <em>knowing-the-person</em> problem. Cartographer works on that: it
            figures out what you actually want and hands the confirmed signal to
            the agents, so tasks land closer to the mark.
          </p>
        </section>

        {/* SECTION 2 — How it maps */}
        <section className="evidence" id="how">
          <h2 className="section-label">
            <ScrambleText text="// how it maps" />
          </h2>
          <p className="install-lede">
            A unit of knowledge is not a verdict (&ldquo;avoids
            closeness&rdquo;) but a <em>hypothesis</em>: a claim with scope, the
            episodes for it and against it, alternative explanations, and a
            falsifier. The <em>status</em> is derived by code &mdash; never an
            LLM confidence number. It works mostly in silence and earns, at most,
            one gentle question when the answer would actually decide between two
            live guesses:
          </p>
          <p className="install-lede">
            <em>&ldquo;looks like you actually want this &mdash; your actions 1,
            2, 3 say so &mdash; does that ring true?&rdquo;</em>
          </p>
          <p className="install-lede">
            It says <em>&ldquo;I don&rsquo;t know yet&rdquo;</em> more than{" "}
            <em>&ldquo;I figured you out.&rdquo;</em> Depth comes from independent
            confirmations across time and contexts, and from trying to{" "}
            <em>disprove</em> its own guesses.
          </p>
        </section>

        {/* SECTION 3 — What ships today (honest) */}
        <section className="evidence" id="today">
          <h2 className="section-label">
            <ScrambleText text="// what ships today" />
          </h2>
          <p className="install-lede">
            An honest preview. The deterministic engine is done and hardened; the
            passive and conversational layers are the next build.
          </p>
          <ul className="install-lede" style={{ listStyle: "none", paddingLeft: 0 }}>
            <li>
              <span className="live">● done</span> &mdash; the epistemic kernel
              (event journal, replay, status policy, redaction, invariants) and an
              MCP server exposing four tools: <code>ingest</code>,{" "}
              <code>map</code>, <code>review</code>, <code>redact</code>. Runs in
              any MCP host.
            </li>
            <li style={{ marginTop: ".6rem" }}>
              <span style={{ opacity: 0.55 }}>○ next</span> &mdash; hooks (passive
              mapping from a session, no manual step), a skill surface, the
              analysis subagents, and a <Link href="/pulse">Pulse</Link> bridge so
              the map is built from your memories.
            </li>
          </ul>

          <div className="cmd-block" aria-label="Cartographer — run the MCP server (developer preview)">
            <span className="cmd-label">run the MCP server — developer preview</span>
            <div className="cmd-row">
              <code>{runCommand}</code>
              <CopyButton text={runCommand} label="copy command" />
            </div>
          </div>
          <p className="status-line">
            local dev preview · not yet published to npm · source on request
          </p>
        </section>

        {/* SECTION 4 — Your data */}
        <section className="evidence" id="data">
          <h2 className="section-label">
            <ScrambleText text="// your data" />
          </h2>
          <p className="install-lede">
            The map lives on your machine. Raw capture is off by default. You can
            read what&rsquo;s on the map, correct it (corrections add history,
            they don&rsquo;t overwrite it), and wipe any of it &mdash; deletion is
            physical and cascades, so evidence built on a deleted memory stops
            counting. No account. No emotional certainty claimed. Ever.
          </p>
        </section>

        <footer>
          <p className="status-line">
            <Link href="/">zbs.gg</Link> · cartographer · a companion to{" "}
            <Link href="/pulse">pulse</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
