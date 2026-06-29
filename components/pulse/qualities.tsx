/**
 * TwoQualities — the "two qualities, nothing else" section of /pulse.
 *
 * The core frame of the Pulse landing page: a good memory layer is invisible.
 * You only ever feel two things — (a) one endless conversation that never
 * resets (continuity), and (b) it actually knows what you're talking about
 * right now (state-aware surfacing). What's under the hood (memory engine,
 * graph, notes, whatever) explicitly does NOT matter — only these two
 * qualities do.
 *
 * Renders the full `<section id="qualities">` including its header, so the
 * page integrator can drop it in as one self-contained block. Pure copy with
 * no interactivity of its own; it is a server component. It imports the
 * existing `ScrambleText` client component for the section header (server
 * components may render client components), and composes only existing
 * globals.css classes (`.evidence`, `.section-label`, `.install-lede`,
 * `.install-cols`, `.ev-note`) plus minimal inline spacing — globals.css is
 * never touched here.
 *
 * Honesty canon (AGENTS.md): no bench numbers, no "ready"/"production"
 * claims, no Safe Mode mention. "Show, don't sell."
 *
 * Export: `TwoQualities`
 * Props: none.
 */

import { ScrambleText } from "@/components/scramble-text";

export function TwoQualities() {
  return (
    <section className="evidence" id="qualities">
      <h2 className="section-label">
        <ScrambleText text="// two qualities, nothing else" />
      </h2>

      <p className="install-lede">
        Forget how it&rsquo;s built. A good memory layer is invisible &mdash;
        you only feel two things.
      </p>

      <div className="install-cols">
        <article>
          <h3>one endless conversation</h3>
          <ul>
            <li>
              the agent picks up where you left off &mdash; new chat, new day,
              new machine
            </li>
            <li>no re-explaining the project every morning</li>
            <li>
              no &ldquo;remind me what we decided&rdquo; &mdash; it already
              carries the thread
            </li>
            <li>
              the identity stays the same across model upgrades and harness
              switches
            </li>
          </ul>
        </article>

        <article>
          <h3>it knows what you&rsquo;re talking about</h3>
          <ul>
            <li>
              it surfaces the <em>right</em> past moment for what you&rsquo;re
              asking now &mdash; not the closest keyword
            </li>
            <li>
              the same question gets a different, better answer depending on
              where you are
            </li>
            <li>
              it brings back the decision that matters, not the noise around it
            </li>
            <li>
              and it can show you <em>why</em> it surfaced that &mdash; every
              time
            </li>
          </ul>
        </article>
      </div>

      <p className="ev-note">
        Under the hood it&rsquo;s a state-aware memory engine. You&rsquo;ll
        never have to care. If those two qualities hold, it&rsquo;s working.
      </p>
    </section>
  );
}
