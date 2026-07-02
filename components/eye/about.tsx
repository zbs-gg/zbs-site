// EyeAbout — the "what it is / how it works / why it's compelling" block for the
// ZBS Eye section (/eye). Renders two sibling <section className="evidence">
// blocks:
//   §2c  "// what it is"          — install-lede + 9-row ev-rows breakdown of how
//                                   Eye captures, searches, and remembers, every
//                                   line framed as on-device; closes with an
//                                   ev-note about the 127.0.0.1 / Bearer-token
//                                   trust boundary.
//   §2d  "// why it's compelling" — a manifesto block (lead + body + signoff)
//                                   on the "everything stays with you" stance.
//
// Copy is verbatim from the build-brief (sourced from eye/README.md,
// eye/docs/ABOUT.md). Honesty canon: 100% local, zero egress, no cloud / account
// / subscription / telemetry; no overclaim; no invented benchmark numbers.
//
// This is a server component (zero interactivity, no hooks). It uses only
// existing globals.css classes (evidence, section-label, install-lede, ev-rows,
// ev-key, ev-val, ev-note, manifesto, lead, signoff, holo) plus the shared
// ScrambleText client component for the section headers.
//
// Export: EyeAbout — named export, no props.

import { ScrambleText } from "@/components/scramble-text";

type Row = { key: string; val: string };

const rows: Row[] = [
  {
    key: "Screen capture",
    val:
      "Accessibility text where apps expose it (accurate, battery-friendly) + OCR where they don't. Frames in HEIC with perceptual-hash dedup — identical screens aren't stored twice. Adaptive per app, decided at runtime.",
  },
  {
    key: "Audio + transcription",
    val:
      "System audio (calls, meetings, video) and microphone → on-device transcription (SFSpeech). Meetings-only by default: audio records only while a call is detected (a meeting app using the mic), off otherwise to save disk — plus always / off modes and a menu-bar force on/off. VAD skips silence and music.",
  },
  {
    key: "Hybrid search",
    val:
      "Full-text (FTS5) + semantic (multilingual-e5, 384-dim) fused via RRF. Cross-lingual: search in one language, find a moment in another.",
  },
  {
    key: "Timeline",
    val:
      "Scrub through time with activity density, a 1×/2×/4× player, and day/hour/10-minute zoom. Frames served back as images, transcripts as text.",
  },
  {
    key: "Ask your memory",
    val:
      'Ask a question → hybrid search finds the fragments → a local LLM answers with citations you can click to jump on the timeline. A local equivalent of "Ask Rewind" — the model is whatever you\'ve loaded in LM Studio or Ollama.',
  },
  {
    key: "Daily Insights",
    val:
      "A daily on-device insight: a local LLM reads the day's activity — top apps (browsers broken down by site, not lumped as one), context switches, topics — and gives 2–3 concrete observations. On-device only.",
  },
  {
    key: "Access for AI agents",
    val:
      "A local REST API (127.0.0.1, Bearer token) plus MCP over stdio, so your own LLMs and agents can work with your memory as a tool. Zero egress.",
  },
  {
    key: "Storage you own",
    val:
      "Kept forever by default. Move it to an external SSD in one click. Optional iCloud backup as a compressed snapshot (the live database never leaves the disk). Import previous history; daily summary and export.",
  },
  {
    key: "Privacy controls",
    val:
      "Pause per app, exclude apps, delete by time range. The app never records itself. Everything stays on the device.",
  },
];

export function EyeAbout() {
  return (
    <>
      <section className="evidence" id="about">
        <h2 className="section-label">
          <ScrambleText text="// what it is" />
        </h2>

        <p className="install-lede">
          A quiet, always-on memory of your work at the computer. Everything
          below runs <em>on-device</em> — nothing leaves the Mac.
        </p>

        <ul className="ev-rows">
          {rows.map((row) => (
            <li key={row.key}>
              <span className="ev-key">{row.key}</span>
              <span className="ev-val">{row.val}</span>
            </li>
          ))}
        </ul>

        <p className="ev-note">
          the server listens only on{" "}
          <code style={{ color: "var(--fg)" }}>127.0.0.1</code>; everything
          except a health check sits behind a Bearer token in the Keychain.
          there is no outbound traffic to disable — there is none.
        </p>
      </section>

      <section className="evidence">
        <h2 className="section-label">
          <ScrambleText text="// why it matters" />
        </h2>

        <div className="manifesto">
          <p className="lead">
            Your Mac already sees everything you do. ZBS Eye is the part that{" "}
            <strong>remembers</strong> it — and keeps it.
          </p>
          <p>
            A scrubbable, searchable, ask-able memory of your screen and your
            calls that lives entirely on your machine. No cloud to trust, no
            account to create, no subscription to renew, no telemetry to opt out
            of.
          </p>
          <p>
            The category leader got acquired and gutted; the alternatives went
            to <em>$25–50/mo plus a mandatory cloud</em> — where the most
            personal thing you have, the record of what you actually do, goes.
            ZBS Eye takes the same niche from the opposite stance:{" "}
            <strong>everything stays with you.</strong>
          </p>
          <p className="signoff">
            it sees everything.{" "}
            <span className="holo">it remembers everything.</span> and it all
            stays with you.
          </p>
        </div>
      </section>
    </>
  );
}
