/**
 * EyeHowItWorks — the "// how it works" explainer for the ZBS Eye section (/eye).
 *
 * A single on-brand pipeline a user grasps in ~3 seconds, read left → right:
 *   [ screen + audio ]  →  [ read · transcribe · index — on your Mac ]  →
 *   [ search · timeline · ask · agents ]
 * The whole pipeline lives inside ONE dashed "your Mac" frame, so "100% local"
 * is a boundary you can SEE, not a claim you read. The only arrow that would
 * leave the box — to a cloud — is drawn as absent.
 *
 * Server component (no hooks). Uses vanilla globals.css classes only
 * (.evidence, .section-label, .hiw*, .hiw-engine, .hiw-arrow, .hiw-cloud) plus
 * the shared ScrambleText for the header. Honesty canon: on-device, zero
 * egress; no overclaim, no invented numbers. Reflows to a vertical stack on
 * narrow screens (see the .hiw-flow @media rule).
 */

import { Fragment } from "react";
import { ScrambleText } from "@/components/scramble-text";

type Node = { label: string; desc: string };
type Stage = { title: string; engine?: boolean; nodes: Node[] };

const stages: Stage[] = [
  {
    title: "in",
    nodes: [
      { label: "screen", desc: "everything on your displays" },
      { label: "audio", desc: "your calls & mic — meetings-only by default, to save disk" },
    ],
  },
  {
    title: "on your Mac",
    engine: true,
    nodes: [
      { label: "read", desc: "OCR + accessibility text — the words off the pixels" },
      { label: "transcribe", desc: "speech → text on-device; silence & music skipped" },
      { label: "index", desc: "full-text + semantic search, fused" },
    ],
  },
  {
    title: "to you",
    nodes: [
      { label: "search", desc: "find any moment in seconds — even across languages" },
      { label: "timeline", desc: "scrub your day back, 1×/2×/4×" },
      { label: "ask", desc: "a local LLM answers, with citations you click" },
      { label: "your agents", desc: "your tools reach it via a local API + MCP" },
    ],
  },
];

export function EyeHowItWorks() {
  return (
    <section className="evidence" id="how">
      <h2 className="section-label">
        <ScrambleText text="// how it works" />
      </h2>

      <p className="install-lede">
        Screen and audio go in; searchable memory comes out — and every step
        happens <em>on your Mac</em>.
      </p>

      <figure
        className="hiw"
        role="img"
        aria-label="Pipeline, entirely on your Mac: your screen and audio are read, transcribed and indexed on-device, then given back to you as search, a timeline, a local ask, and access for your own agents. Nothing leaves the machine."
      >
        <div className="hiw-frame">
          <figcaption className="hiw-legend">
            <span className="lock">⌂</span> your Mac — nothing in this box ever
            leaves it
          </figcaption>

          <div className="hiw-flow">
            {stages.map((stage, i) => (
              <Fragment key={stage.title}>
                <div
                  className={
                    stage.engine ? "hiw-stage hiw-engine" : "hiw-stage"
                  }
                >
                  <p className="hiw-col-title">{stage.title}</p>
                  {stage.nodes.map((node) => (
                    <div key={node.label} className="hiw-node">
                      <b>{node.label}</b>
                      <span>{node.desc}</span>
                    </div>
                  ))}
                </div>
                {i < stages.length - 1 && (
                  <div className="hiw-arrow" aria-hidden="true">
                    →
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        <p className="hiw-cloud">
          the one arrow that would go to a cloud: <span className="cut">✕</span>{" "}
          there isn&apos;t one. no server, no account, no telemetry.
        </p>
      </figure>
    </section>
  );
}
