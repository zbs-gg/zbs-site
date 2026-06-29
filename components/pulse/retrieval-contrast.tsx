"use client";

/**
 * RetrievalContrast — the "it knows what you're talking about" explainer.
 *
 * English React port of atlas/demo_pack/retrieval_contrast.html, restyled to
 * the zbs.gg dark / mono vocabulary. Self-contained widget: all scoped CSS
 * lives in a <style jsx> block inside this file (nothing touches globals.css).
 *
 * What it shows: ONE question runs in TWO user states ("shipping mode" /
 * "reflecting mode") over the SAME history, and a different ranked set of
 * past moments surfaces in each — with the reason on every card, the honest
 * retrieval meta (mode_used / classifier / confidence / reasoning), and a
 * shared mini life-graph that highlights a different path per active state.
 *
 * Honesty canon: every score carries a visible [FIXTURE] / [PRECOMPUTED]
 * source label. The illustrative scores are retrieval scores from a labeled
 * fixture, NOT benchmark claims — this page (and this widget) carry no bench
 * numbers. "Show why", not "sell".
 *
 * Export: RetrievalContrast (named).
 * Props: none. Fully self-contained; drop it inside a section in page.tsx.
 */

import { useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StateKey = "shipping" | "reflecting";
type Tone = "cyan" | "violet" | "gold" | "pink";

type RankedEvent = {
  rank: number;
  event_id: number;
  title: string;
  affective_role: string;
  source_label: string; // "[FIXTURE]" | "[PRECOMPUTED]"
  time_anchor: string;
  score: number;
  why_this_event: string;
  source_quote: string;
  graph_links: string[];
  tone: Tone;
};

type Trace = {
  sourceBoundary: string;
  label: string; // human label for the state
  modeLabel: string; // emotion_role line under the column header
  columnSource: string; // "[FIXTURE]" / "[FIXTURE + PRECOMPUTED]"
  why_this_now: string;
  response: {
    mode_used: string;
    classifier: string;
    confidence: number;
    reasoning: string;
  };
  ranked_events: RankedEvent[];
};

type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  tone: Tone | "fg";
  states: StateKey[];
};

type GraphEdge = {
  from: string;
  to: string;
  state: StateKey | "both";
  tone: Tone;
};

// ---------------------------------------------------------------------------
// Tone → holo palette (cyan = state A / shipping, pink = state B / reflecting)
// ---------------------------------------------------------------------------

const TONE_COLOR: Record<Tone, string> = {
  cyan: "var(--holo-1)", // #7df9ff
  violet: "var(--holo-2)", // #c084fc
  gold: "var(--holo-4)", // #ffe27a
  pink: "var(--holo-3)", // #ff9ad6
};

// raw hex for canvas/SVG fills that can't take CSS vars cleanly inside <title>
const STATE_ACCENT: Record<StateKey, string> = {
  shipping: "#7df9ff",
  reflecting: "#ff9ad6",
};

// ---------------------------------------------------------------------------
// Fixture traces — labeled, simulated, developer work example.
// Query: "where did we land on the retrieval refactor?"
// ---------------------------------------------------------------------------

const QUERY = "where did we land on the retrieval refactor?";

const TRACES: Record<StateKey, Trace> = {
  shipping: {
    sourceBoundary: "[FIXTURE]",
    label: "shipping mode",
    modeLabel: "emotion_role: action-context",
    columnSource: "[FIXTURE]",
    why_this_now:
      "In shipping mode, retrieval pulls the live thread: the last decision, the open action item, and the nearest blocker. It treats the refactor as the thing you're about to touch — what changed, what's unresolved, what to do next.",
    response: {
      mode_used: "empathic",
      classifier: "heuristic",
      confidence: 0.7,
      reasoning: "recent_life_events_7d non-empty",
    },
    ranked_events: [
      {
        rank: 1,
        event_id: 83019,
        title: "Decision: keep hybrid scoring, gate v3 boosts — 3 days ago",
        affective_role: "recent_signal",
        source_label: "[FIXTURE]",
        time_anchor: "2026-06-25",
        score: 0.86,
        why_this_event:
          "Freshest decision on the refactor — the exact line you'd need to pick the work back up without re-deriving it.",
        source_quote:
          "We landed on keeping the hybrid scorer and gating the v3 boosts behind neutral-signal collapse, so it folds back to v2 when state is flat.",
        graph_links: ["refactor", "hybrid scorer", "v3 gate", "recent decision"],
        tone: "cyan",
      },
      {
        rank: 2,
        event_id: 83024,
        title: "Open action item: parity gate skipped in CI",
        affective_role: "action_item",
        source_label: "[FIXTURE]",
        time_anchor: "2026-06-18",
        score: 0.79,
        why_this_event:
          "Shipping mode surfaces the unresolved blocker — the next concrete step, not background context.",
        source_quote:
          "The Go==Python parity gate is still skipped in CI because the golden was private; the next move is wiring a public synthetic fixture.",
        graph_links: ["refactor", "parity gate", "CI", "synthetic fixture"],
        tone: "violet",
      },
      {
        rank: 3,
        event_id: 83031,
        title: "Bench rerun came back clean — last week",
        affective_role: "confirmation_signal",
        source_label: "[FIXTURE]",
        time_anchor: "2026-06-22",
        score: 0.74,
        why_this_event:
          "A recent green signal that tells you the refactor is safe to build on right now.",
        source_quote:
          "Rerun on the public fixture came back clean — the gated v3 path matches the frozen baseline, so the refactor isn't regressing scores.",
        graph_links: ["refactor", "bench rerun", "frozen baseline", "green"],
        tone: "gold",
      },
    ],
  },
  reflecting: {
    sourceBoundary: "[FIXTURE]",
    label: "reflecting mode",
    modeLabel: "emotion_role: meaning-context",
    columnSource: "[FIXTURE + PRECOMPUTED]",
    why_this_now:
      "In reflecting mode, retrieval doesn't chase the nearest blocker. It goes to the origin: why this refactor exists, the period of work that shaped it, and the moment the approach actually clicked. Same graph, a different walk through it.",
    response: {
      mode_used: "empathic",
      classifier: "heuristic",
      confidence: 0.85,
      reasoning: "dominant emotion=trust",
    },
    ranked_events: [
      {
        rank: 1,
        event_id: 72014,
        title: "The first design call where the refactor was framed",
        affective_role: "foundation_moment",
        source_label: "[FIXTURE]",
        time_anchor: "2026-02-22",
        score: 0.88,
        why_this_event:
          "Reflecting mode surfaces the moment the work gained its shape — the why behind every later decision.",
        source_quote:
          "The first call wasn't about code — it was the call where we decided retrieval should be state-aware at all, not just a better text match.",
        graph_links: ["refactor", "state-aware", "first design call", "the why"],
        tone: "cyan",
      },
      {
        rank: 2,
        event_id: 78102,
        title: "The two-week stretch that rebuilt the scorer",
        affective_role: "effort_anchor",
        source_label: "[PRECOMPUTED]",
        time_anchor: "2026-03-01 / 2026-03-14",
        score: 0.82,
        why_this_event:
          "A period-level anchor: dozens of small commits compressed into one stable node of meaning.",
        source_quote:
          "The Cherry-week stretch holds more than a diff — it's the run where the scorer stopped being a hack and became the thing we trust.",
        graph_links: ["refactor", "two-week stretch", "scorer rewrite", "trust"],
        tone: "gold",
      },
      {
        rank: 3,
        event_id: 79544,
        title: "The late-night fix where it finally clicked",
        affective_role: "insight_marker",
        source_label: "[FIXTURE]",
        time_anchor: "2026-03-11",
        score: 0.76,
        why_this_event:
          "Reflecting includes the emotionally loaded turning point that shipping mode deliberately keeps in the background.",
        source_quote:
          "One late fix changed the weight of the whole refactor — the moment gating made the numbers honest instead of just higher.",
        graph_links: ["refactor", "turning point", "gating insight", "honest numbers"],
        tone: "pink",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Shared mini life-graph — one graph, two highlighted walks
// ---------------------------------------------------------------------------

const GRAPH_NODES: GraphNode[] = [
  { id: "refactor", label: "refactor", x: 460, y: 108, r: 30, tone: "fg", states: ["shipping", "reflecting"] },
  // shipping cluster
  { id: "decision", label: "decision", x: 120, y: 66, r: 18, tone: "cyan", states: ["shipping"] },
  { id: "gate", label: "parity gate", x: 260, y: 156, r: 18, tone: "violet", states: ["shipping"] },
  { id: "rerun", label: "rerun", x: 710, y: 62, r: 18, tone: "gold", states: ["shipping"] },
  { id: "ci", label: "CI", x: 825, y: 146, r: 14, tone: "violet", states: ["shipping"] },
  // reflecting cluster
  { id: "firstcall", label: "first call", x: 185, y: 120, r: 17, tone: "cyan", states: ["reflecting"] },
  { id: "stretch", label: "two weeks", x: 364, y: 55, r: 19, tone: "gold", states: ["reflecting"] },
  { id: "click", label: "it clicked", x: 610, y: 160, r: 16, tone: "pink", states: ["reflecting"] },
  { id: "trust", label: "trust", x: 760, y: 104, r: 14, tone: "pink", states: ["reflecting"] },
  // shared
  { id: "baseline", label: "baseline", x: 564, y: 52, r: 15, tone: "violet", states: ["shipping", "reflecting"] },
];

const GRAPH_EDGES: GraphEdge[] = [
  { from: "refactor", to: "decision", state: "shipping", tone: "cyan" },
  { from: "refactor", to: "gate", state: "shipping", tone: "violet" },
  { from: "refactor", to: "rerun", state: "shipping", tone: "gold" },
  { from: "refactor", to: "ci", state: "shipping", tone: "violet" },
  { from: "refactor", to: "firstcall", state: "reflecting", tone: "cyan" },
  { from: "refactor", to: "stretch", state: "reflecting", tone: "gold" },
  { from: "refactor", to: "click", state: "reflecting", tone: "pink" },
  { from: "refactor", to: "trust", state: "reflecting", tone: "pink" },
  { from: "refactor", to: "baseline", state: "both", tone: "violet" },
  { from: "stretch", to: "firstcall", state: "reflecting", tone: "gold" },
  { from: "gate", to: "baseline", state: "shipping", tone: "violet" },
  { from: "rerun", to: "baseline", state: "shipping", tone: "gold" },
];

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

function edgePath(a: GraphNode, b: GraphNode): string {
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2 - 32;
  return `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`;
}

function nodeFill(node: GraphNode): string {
  return node.tone === "fg" ? "var(--fg)" : TONE_COLOR[node.tone];
}

// Tiny per-card glyph: links laid out as a mini chain, color-coded by tone.
function cardGraph(event: RankedEvent) {
  const pts = event.graph_links.map((link, i) => ({
    link,
    cx: 18 + i * 33,
    cy: i % 2 === 0 ? 20 : 38,
  }));
  const color = TONE_COLOR[event.tone];
  return { pts, color };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RetrievalContrast() {
  const [active, setActive] = useState<StateKey>("shipping");
  const [openCards, setOpenCards] = useState<Record<number, boolean>>({});

  // Read deep-link hash on mount (so /pulse#reflecting lands here).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash.includes("reflecting")) setActive("reflecting");
  }, []);

  const trace = TRACES[active];
  const byId = useMemo(
    () => Object.fromEntries(GRAPH_NODES.map((n) => [n.id, n])) as Record<string, GraphNode>,
    []
  );

  const toggleCard = (id: number) =>
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderColumn = (key: StateKey) => {
    const t = TRACES[key];
    const isActive = key === active;
    return (
      <article
        className={`rc-column ${isActive ? "is-active" : "is-dim"}`}
        data-rc-state={key}
        aria-label={`${t.label} retrieval`}
      >
        <div className="rc-col-head">
          <div>
            <h3 className="rc-col-title">state: {t.label}</h3>
            <div className="rc-mode-label">{t.modeLabel}</div>
          </div>
          <span className="rc-col-source">{t.columnSource}</span>
        </div>

        <div className="rc-events">
          {t.ranked_events.map((ev) => {
            const open = !!openCards[ev.event_id];
            const { pts, color } = cardGraph(ev);
            const precomputed = ev.source_label.includes("PRECOMPUTED");
            return (
              <div
                key={ev.event_id}
                className={`rc-card ${open ? "is-open" : ""}`}
                role="button"
                tabIndex={0}
                aria-expanded={open}
                onClick={() => toggleCard(ev.event_id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCard(ev.event_id);
                  }
                }}
              >
                <div className="rc-card-top">
                  <span className="rc-rank">#{ev.rank}</span>
                  <h4 className="rc-card-title">{ev.title}</h4>
                  <span className={`rc-src-mini ${precomputed ? "is-precomputed" : ""}`}>
                    {ev.source_label}
                  </span>
                </div>

                <div className="rc-tag-row">
                  <span className="rc-role-tag" style={{ borderColor: color, color }}>
                    {ev.affective_role}
                  </span>
                  <span className="rc-card-meta">
                    event_id {ev.event_id} · score {ev.score.toFixed(2)} · {ev.time_anchor}
                  </span>
                </div>

                <div className="rc-card-grid">
                  <p className="rc-why-line">{ev.why_this_event}</p>
                  <svg className="rc-mini-graph" viewBox="0 0 136 58" aria-hidden="true">
                    {pts.slice(1).map((node, i) => {
                      const prev = pts[i];
                      return (
                        <path
                          key={`p${i}`}
                          d={`M${prev.cx} ${prev.cy} C ${prev.cx + 12} ${prev.cy - 9}, ${node.cx - 12} ${node.cy + 9}, ${node.cx} ${node.cy}`}
                          stroke={color}
                          strokeWidth={1.6}
                          fill="none"
                          opacity={0.55}
                        />
                      );
                    })}
                    {pts.map((node, i) => (
                      <circle
                        key={`c${i}`}
                        cx={node.cx}
                        cy={node.cy}
                        r={i === 0 ? 6 : 4.5}
                        fill={i === 0 ? "var(--fg)" : color}
                        opacity={i === 0 ? 0.95 : 0.7}
                      >
                        <title>{node.link}</title>
                      </circle>
                    ))}
                  </svg>
                </div>

                <div className="rc-detail">
                  <div className="rc-detail-inner">
                    <p className="rc-quote">&ldquo;{ev.source_quote}&rdquo;</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    );
  };

  return (
    <div className="rc-wrap" data-rc-active={active}>
      {/* Query + state toggle */}
      <header className="rc-top">
        <div className="rc-query-wrap">
          <div className="rc-eyebrow">
            <span>state-aware retrieval contrast</span>
            <span>·</span>
            <span>pulse trace fixture</span>
          </div>
          <div className="rc-query-bar">{QUERY}</div>
          <nav className="rc-pills" aria-label="state toggle">
            <button
              type="button"
              className={`rc-pill ${active === "shipping" ? "is-active" : ""}`}
              data-rc-state="shipping"
              aria-pressed={active === "shipping"}
              onClick={() => setActive("shipping")}
            >
              shipping mode
            </button>
            <button
              type="button"
              className={`rc-pill ${active === "reflecting" ? "is-active" : ""}`}
              data-rc-state="reflecting"
              aria-pressed={active === "reflecting"}
              onClick={() => setActive("reflecting")}
            >
              reflecting mode
            </button>
          </nav>
        </div>
        <div className="rc-truth-label">[FIXTURE · labeled, simulated]</div>
      </header>

      {/* Two columns */}
      <section className="rc-main" aria-label="two-state retrieval comparison">
        {renderColumn("shipping")}
        {renderColumn("reflecting")}
      </section>

      {/* Shared graph + why-this-now */}
      <section className="rc-graph-panel" aria-label="why this now and the shared graph">
        <div className="rc-graph-stage">
          <div className="rc-graph-title">
            same graph · the active state highlights a different path
          </div>
          <svg
            className="rc-life-graph"
            viewBox="0 0 920 230"
            role="img"
            aria-label="shared retrieval mini-graph"
          >
            <line className="rc-axis" x1={70} y1={204} x2={850} y2={204} />
            <text x={70} y={222} className="rc-axis-text">early 2026</text>
            <text x={822} y={222} className="rc-axis-text">now</text>

            {GRAPH_EDGES.map((e, i) => {
              const hot = e.state === active || e.state === "both";
              return (
                <path
                  key={`e${i}`}
                  className={`rc-edge ${hot ? "is-hot" : "is-dim"}`}
                  d={edgePath(byId[e.from], byId[e.to])}
                  stroke={TONE_COLOR[e.tone]}
                >
                  <title>{e.state}</title>
                </path>
              );
            })}

            {GRAPH_NODES.map((node) => {
              const hot = node.states.includes(active);
              const fill = nodeFill(node);
              const textColor = node.tone === "fg" ? "var(--fg)" : fill;
              return (
                <g key={node.id} className={`rc-node ${hot ? "is-hot" : "is-dim"}`}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={fill}
                    opacity={node.tone === "fg" ? 0.92 : 0.7}
                    stroke="rgba(245,245,245,0.28)"
                    strokeWidth={1.2}
                  />
                  <text
                    className="rc-node-label"
                    x={node.x}
                    y={node.y + node.r + 16}
                    fill={textColor}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="rc-legend">
            <span style={{ color: STATE_ACCENT.shipping }}>
              <i className="rc-dot" /> shipping path
            </span>
            <span style={{ color: STATE_ACCENT.reflecting }}>
              <i className="rc-dot" /> reflecting path
            </span>
            <span style={{ color: "var(--fg-dim)" }}>
              <i className="rc-dot" /> shared node
            </span>
          </div>
        </div>

        <aside className="rc-why-panel" aria-label="why this now">
          <div>
            <h4 className="rc-why-head">why this now</h4>
            <p className="rc-why-copy">{trace.why_this_now}</p>
          </div>
          <div className="rc-why-meta">
            <span>{trace.sourceBoundary} source: labeled, simulated corpus</span>
            <span>
              mode_used={trace.response.mode_used} · classifier={trace.response.classifier} ·
              confidence={trace.response.confidence}
            </span>
            <span>reasoning={trace.response.reasoning}</span>
          </div>
        </aside>
      </section>

      <p className="rc-foot">
        scores are illustrative retrieval scores from a labeled [FIXTURE], not
        benchmark numbers — no leaderboard claim lives here.
      </p>

      <style jsx>{`
        .rc-wrap {
          font-family: var(--sans);
          color: var(--fg);
          margin-top: 0.5rem;
        }

        /* --- top: query + toggle --- */
        .rc-top {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          align-items: start;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--rule);
        }
        .rc-query-wrap {
          max-width: 760px;
          min-width: 0;
        }
        .rc-eyebrow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-bottom: 0.75rem;
          font-family: var(--mono);
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--fg-faint);
        }
        .rc-query-bar {
          display: flex;
          align-items: center;
          min-height: 56px;
          padding: 0.75rem 1rem;
          border: 1px solid var(--rule);
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.5);
          font-family: var(--mono);
          font-size: clamp(1.1rem, 2.4vw, 1.6rem);
          line-height: 1.15;
          color: var(--fg);
        }
        .rc-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 0.75rem;
        }
        .rc-pill {
          font-family: var(--mono);
          font-size: 0.8rem;
          padding: 0.5rem 0.85rem;
          border: 1px solid var(--rule);
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.4);
          color: var(--fg-dim);
          cursor: pointer;
          transition: border-color 180ms ease, color 180ms ease,
            box-shadow 180ms ease, background 180ms ease;
        }
        .rc-pill:hover {
          color: var(--fg);
          border-color: var(--fg-faint);
        }
        .rc-pill.is-active[data-rc-state="shipping"] {
          color: #050505;
          background: ${STATE_ACCENT.shipping};
          border-color: ${STATE_ACCENT.shipping};
          box-shadow: 0 0 16px rgba(125, 249, 255, 0.35);
        }
        .rc-pill.is-active[data-rc-state="reflecting"] {
          color: #050505;
          background: ${STATE_ACCENT.reflecting};
          border-color: ${STATE_ACCENT.reflecting};
          box-shadow: 0 0 16px rgba(255, 154, 214, 0.35);
        }
        .rc-truth-label {
          justify-self: end;
          align-self: start;
          font-family: var(--mono);
          font-size: 0.7rem;
          letter-spacing: 0.02em;
          padding: 0.4rem 0.6rem;
          border: 1px solid var(--rule);
          border-radius: 2px;
          background: rgba(245, 245, 245, 0.06);
          color: var(--fg-dim);
          white-space: nowrap;
        }

        /* --- two columns --- */
        .rc-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 1rem;
          margin-top: 1.25rem;
        }
        .rc-column {
          position: relative;
          min-width: 0;
          padding: 1rem;
          border: 1px solid var(--rule);
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.4);
          border-top-width: 3px;
          border-top-color: var(--rule);
          transition: opacity 260ms ease, transform 260ms ease,
            border-color 260ms ease, background 260ms ease;
        }
        .rc-column[data-rc-state="shipping"].is-active {
          border-top-color: ${STATE_ACCENT.shipping};
        }
        .rc-column[data-rc-state="reflecting"].is-active {
          border-top-color: ${STATE_ACCENT.reflecting};
        }
        .rc-column.is-active {
          background: rgba(0, 0, 0, 0.55);
          border-color: var(--fg-faint);
        }
        .rc-column.is-active[data-rc-state="shipping"] {
          border-top-color: ${STATE_ACCENT.shipping};
        }
        .rc-column.is-active[data-rc-state="reflecting"] {
          border-top-color: ${STATE_ACCENT.reflecting};
        }
        .rc-column.is-dim {
          opacity: 0.55;
          transform: translateY(5px) scale(0.99);
        }
        .rc-col-head {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          align-items: start;
          margin-bottom: 1rem;
        }
        .rc-col-title {
          margin: 0;
          font-family: var(--mono);
          font-size: 0.95rem;
          letter-spacing: 0.01em;
          color: var(--fg);
        }
        .rc-mode-label {
          margin-top: 0.35rem;
          font-family: var(--mono);
          font-size: 0.72rem;
          color: var(--fg-faint);
        }
        .rc-col-source {
          flex: 0 0 auto;
          font-family: var(--mono);
          font-size: 0.65rem;
          padding: 0.3rem 0.45rem;
          border: 1px solid var(--rule);
          border-radius: 2px;
          color: var(--fg-dim);
          white-space: nowrap;
        }

        /* --- event cards --- */
        .rc-events {
          display: grid;
          gap: 0.75rem;
        }
        .rc-card {
          position: relative;
          padding: 0.85rem;
          border: 1px solid var(--rule);
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.55);
          cursor: pointer;
          overflow: hidden;
          transition: transform 160ms ease, box-shadow 160ms ease,
            border-color 160ms ease;
        }
        .rc-card:hover {
          transform: translateY(-1px);
          border-color: var(--fg-faint);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        }
        .rc-card:focus-visible {
          outline: 1px solid var(--fg-faint);
          outline-offset: 2px;
        }
        .rc-card.is-open {
          border-color: var(--fg-faint);
        }
        .rc-card-top {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 0.5rem;
          align-items: start;
        }
        .rc-rank {
          font-family: var(--mono);
          font-size: 0.7rem;
          color: var(--fg-faint);
          padding-top: 0.15rem;
        }
        .rc-card-title {
          margin: 0;
          font-family: var(--sans);
          font-size: 0.92rem;
          line-height: 1.3;
          font-weight: 600;
          color: var(--fg);
        }
        .rc-src-mini {
          font-family: var(--mono);
          font-size: 0.6rem;
          padding: 0.25rem 0.4rem;
          border-radius: 2px;
          background: rgba(245, 245, 245, 0.08);
          color: var(--fg-dim);
          white-space: nowrap;
        }
        .rc-src-mini.is-precomputed {
          background: rgba(255, 226, 122, 0.16);
          color: var(--holo-4);
        }
        .rc-tag-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.65rem;
        }
        .rc-role-tag {
          font-family: var(--mono);
          font-size: 0.66rem;
          padding: 0.25rem 0.45rem;
          border-radius: 999px;
          border: 1px solid;
          background: rgba(0, 0, 0, 0.35);
        }
        .rc-card-meta {
          font-family: var(--mono);
          font-size: 0.68rem;
          color: var(--fg-faint);
        }
        .rc-card-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 120px;
          gap: 0.75rem;
          align-items: end;
          margin-top: 0.65rem;
        }
        .rc-why-line {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.45;
          color: var(--fg-dim);
        }
        .rc-mini-graph {
          width: 120px;
          height: 52px;
        }
        .rc-detail {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 220ms ease;
        }
        .rc-detail-inner {
          min-height: 0;
          overflow: hidden;
        }
        .rc-card.is-open .rc-detail {
          grid-template-rows: 1fr;
        }
        .rc-quote {
          margin: 0.85rem 0 0;
          padding-top: 0.75rem;
          border-top: 1px solid var(--rule);
          font-size: 0.88rem;
          font-style: italic;
          line-height: 1.4;
          color: var(--fg);
        }

        /* --- graph + why panel --- */
        .rc-graph-panel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 1rem;
          margin-top: 1.25rem;
          align-items: stretch;
        }
        .rc-graph-stage {
          position: relative;
          overflow: hidden;
          padding: 0.9rem;
          border: 1px solid var(--rule);
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.4);
        }
        .rc-graph-title {
          position: absolute;
          left: 1rem;
          top: 0.9rem;
          z-index: 2;
          font-family: var(--mono);
          font-size: 0.66rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--fg-faint);
        }
        .rc-life-graph {
          width: 100%;
          height: auto;
          min-height: 200px;
          display: block;
        }
        .rc-axis {
          stroke: var(--rule);
          stroke-width: 1;
          stroke-dasharray: 4 7;
        }
        .rc-axis-text {
          font-family: var(--mono);
          font-size: 10px;
          fill: var(--fg-faint);
        }
        .rc-node {
          transition: opacity 220ms ease, transform 220ms ease;
          transform-box: fill-box;
          transform-origin: center;
        }
        .rc-node.is-dim {
          opacity: 0.22;
        }
        .rc-node.is-hot {
          transform: scale(1.1);
        }
        .rc-node-label {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 600;
          text-anchor: middle;
          paint-order: stroke;
          stroke: #050505;
          stroke-width: 4px;
          stroke-linejoin: round;
        }
        .rc-edge {
          fill: none;
          stroke-linecap: round;
          stroke-width: 2;
          opacity: 0.4;
          transition: opacity 220ms ease, stroke-width 220ms ease;
        }
        .rc-edge.is-dim {
          opacity: 0.1;
        }
        .rc-edge.is-hot {
          opacity: 0.78;
          stroke-width: 3;
        }
        .rc-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.5rem;
          font-family: var(--mono);
          font-size: 0.68rem;
          color: var(--fg-dim);
        }
        .rc-legend span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .rc-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: currentColor;
          display: inline-block;
        }
        .rc-why-panel {
          padding: 1rem;
          border: 1px solid var(--rule);
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }
        .rc-why-head {
          margin: 0 0 0.5rem;
          font-family: var(--mono);
          font-size: 0.8rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--fg);
        }
        .rc-why-copy {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.45;
          color: var(--fg-dim);
        }
        .rc-why-meta {
          display: grid;
          gap: 0.3rem;
          font-family: var(--mono);
          font-size: 0.66rem;
          line-height: 1.45;
          color: var(--fg-faint);
          word-break: break-word;
        }
        .rc-foot {
          margin: 1rem 0 0;
          padding-top: 0.75rem;
          border-top: 1px dashed var(--rule);
          font-family: var(--mono);
          font-size: 0.7rem;
          color: var(--fg-faint);
          line-height: 1.5;
        }

        @media (max-width: 820px) {
          .rc-top,
          .rc-main,
          .rc-graph-panel {
            grid-template-columns: 1fr;
          }
          .rc-truth-label {
            justify-self: start;
          }
          .rc-card-grid {
            grid-template-columns: 1fr;
          }
          .rc-mini-graph {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rc-pill,
          .rc-column,
          .rc-card,
          .rc-node,
          .rc-edge,
          .rc-detail {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
