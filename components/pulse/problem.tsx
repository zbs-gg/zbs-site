/**
 * TheProblem — §2 "where it breaks today" section for the /pulse landing page.
 *
 * Renders the full Problem section:
 *   - section header (// where it breaks today)
 *   - intro lede
 *   - sub-block A: why continuity breaks (key/value rows)
 *   - sub-block B: the cottage-industry fixes + why each one breaks (3-up grid)
 *   - closing note ("you become the memory engine")
 *
 * Pure copy. No interactivity of its own, so this is a server component — it
 * only imports <ScrambleText/> (a client component) for the animated section
 * header, which server components are free to render.
 *
 * Composes existing globals.css classes only (no new globals, no Tailwind):
 *   .evidence .section-label .install-lede .ev-rows .ev-key .ev-val
 *   .install-cols .ev-note
 *
 * Honesty canon: no Safe Mode framing, no bench numbers, "show, don't sell."
 *
 * Props: none.
 * Export: TheProblem (named).
 */

import { ScrambleText } from "@/components/scramble-text";

export function TheProblem() {
  return (
    <section className="evidence" id="problem">
      <h2 className="section-label">
        <ScrambleText text="// where it breaks today" />
      </h2>

      <p className="install-lede">
        Continuity is the first thing to go on any real project. The longer and
        more serious the work, the harder it breaks.
      </p>

      {/* Sub-block A — why it breaks */}
      <ul className="ev-rows">
        <li>
          <span className="ev-key">long projects</span>
          <span className="ev-val">
            weeks of context, decisions, dead ends. the agent only sees the last
            few thousand tokens of it.
          </span>
        </li>
        <li>
          <span className="ev-key">context limits</span>
          <span className="ev-val">
            every model has a ceiling. cross it and the oldest, often most
            important, context silently falls out.
          </span>
        </li>
        <li>
          <span className="ev-key">new sessions</span>
          <span className="ev-val">
            a fresh chat starts from zero. yesterday&rsquo;s understanding is
            gone; you rebuild it by hand.
          </span>
        </li>
        <li>
          <span className="ev-key">harness &amp; model switches</span>
          <span className="ev-val">
            move from one tool or model to the next and the thread snaps — same
            name, different memory, no shared history.
          </span>
        </li>
      </ul>

      {/* Sub-block B — the cottage-industry fixes and why they break */}
      <div className="install-cols" style={{ marginTop: "1.6rem" }}>
        <article>
          <h3>obsidian notes / a doc</h3>
          <ul>
            <li>you become the memory: writing it down, keeping it current</li>
            <li>the agent can&rsquo;t read it unless you paste the right part</li>
            <li>it goes stale the moment you stop tending it</li>
          </ul>
        </article>

        <article>
          <h3>manual paste</h3>
          <ul>
            <li>you re-feed context every session, by hand</li>
            <li>you guess what&rsquo;s relevant — and you guess wrong under load</li>
            <li>
              it burns the context window on things the agent could have fetched
              itself
            </li>
          </ul>
        </article>

        <article>
          <h3>pinned messages / custom instructions</h3>
          <ul>
            <li>a fixed blob, not the right memory for this moment</li>
            <li>it can&rsquo;t grow past a few lines without crowding everything else</li>
            <li>it&rsquo;s the same for every question — so it&rsquo;s rarely the answer to yours</li>
          </ul>
        </article>
      </div>

      <p className="ev-note">
        Every one of these makes <em>you</em> the memory engine. That&rsquo;s the
        job Pulse takes back.
      </p>
    </section>
  );
}
