"use client";

/**
 * EyeInstall — the honest distribution CTA for the ZBS Eye section (/eye).
 *
 * Props: none. Self-contained client component (holds the `agentPrompt`
 * const and renders `CopyButton`s, which require client interactivity).
 *
 * Canon (pulse/AGENTS.md — show, don't sell; never overclaim): ZBS Eye is
 * NOT in the Mac App Store (cross-app Accessibility + a "record everything"
 * profile don't fit the App Sandbox the store requires) and there is NO fake
 * "Download" button. Installing means building the notarized app from source
 * (`bash scripts/build-notarized.sh`) OR asking your own agent to read the
 * source and install. Distribution status stays "shipped / notarized" — not
 * "production-ready for everyone". The repo (github.com/zbs-gg/eye) is public,
 * so the source link and agent-install prompt are real.
 *
 * Renders inside the /eye page after EyeAbout. Reuses existing globals.css
 * classes only (no globals.css edits): evidence, section-label, install-lede,
 * install-cols, prompt-card, hero-prompt, rc-label, cmd-note, mini-cmds,
 * cmd-block, cmd-label, cmd-row, status-line (+ .live), ev-note, quiet-line.
 */

import { ScrambleText } from "@/components/scramble-text";
import { CopyButton } from "@/components/copy-button";

const repoUrl = "https://github.com/zbs-gg/eye";
const buildCommand = "bash scripts/build-notarized.sh";

const agentPrompt = `Hi. I want to install ZBS Eye on this Mac. Please verify it's safe first:
https://github.com/zbs-gg/eye

ZBS Eye is a local-first "eternal memory" for macOS: it continuously records
screen + audio on-device, makes them searchable, and never goes to a cloud
(the server listens only on 127.0.0.1, behind a Bearer token).

1. Read README.md, docs/ABOUT.md, AGENTS.md and BUILD.md (written for you).
2. Confirm the trust boundary: zero egress, no account, no subscription, no
   telemetry; Hardened Runtime; everything stays on this machine.
3. Explain in plain words what it captures, where it stores it, and how to
   pause it, delete a time range, or wipe it.
4. Requirements: macOS 15+, Apple Silicon, Xcode toolchain. For a notarized
   build: a Developer ID certificate + a notarytool profile (docs/NOTARIZE.md).
   No paid account? A self-signed dev build works (scripts/make-signing-cert.sh).
5. Ask me for confirmation.
6. After confirmation, build the notarized app:
   bash scripts/build-notarized.sh
   then unzip dist/ZBSEye-notarized-*.zip into /Applications and launch it
   with a double-click.
7. Walk me through granting Screen Recording + Accessibility (and optionally
   Microphone) once.

Important: it is NOT in the Mac App Store by design (cross-app Accessibility
+ record-everything don't fit the App Sandbox). Stop and explain if anything
looks unsafe.`;

const buildSteps = [
  "unzip dist/ZBSEye-notarized-*.zip into /Applications",
  "double-click to launch — Gatekeeper passes it, even offline (the ticket is stapled)",
  "grant Screen Recording + Accessibility once (optionally Microphone)",
  "the signature is stable: rebuilds do NOT reset permissions",
];

export function EyeInstall() {
  return (
    <section className="evidence" id="install">
      <h2 className="section-label">
        <ScrambleText text="// install — the honest version" />
      </h2>

      <p className="install-lede">
        ZBS Eye is{" "}
        <em>not in the Mac App Store — and can&apos;t be.</em> Reading other
        apps&apos; screens (cross-app Accessibility) and a
        &quot;record everything&quot; profile don&apos;t fit the App Sandbox
        the App Store requires. So you install it the way you&apos;d install
        any tool you actually trust: read the source, then build it.
      </p>

      <div className="install-cols">
        <article>
          <h3>ask your agent to install it</h3>
          <div className="prompt-card hero-prompt" aria-label="agent install prompt">
            <p className="rc-label">
              for your agent — paste this, it reads the source and does the rest
            </p>
            <textarea
              readOnly
              value={agentPrompt}
              aria-label="ZBS Eye agent install prompt"
            />
            <div className="hero-prompt-actions">
              <CopyButton
                text={agentPrompt}
                label="copy install prompt"
                doneLabel="prompt copied"
              />
              <span className="cmd-note">read the source first · nothing is hidden</span>
            </div>
          </div>
        </article>

        <article>
          <h3>or build it yourself</h3>
          <div className="mini-cmds">
            <div className="cmd-block" aria-label="build the notarized ZBS Eye app">
              <span className="cmd-label">
                build the notarized app (one-time cert setup in docs/NOTARIZE.md)
              </span>
              <div className="cmd-row">
                <code>{buildCommand}</code>
                <CopyButton text={buildCommand} label="copy" />
              </div>
            </div>
          </div>
          <ul>
            {buildSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>
      </div>

      <p className="status-line">
        <span className="live">● notarized Developer ID</span> · macOS 15+ ·
        Apple Silicon · Xcode toolchain · source:{" "}
        <a href={repoUrl} target="_blank" rel="noopener">
          github.com/zbs-gg/eye
        </a>
      </p>

      <p className="ev-note">
        the notarized build double-clicks to launch; a self-signed dev build
        prompts &ldquo;Open Anyway&rdquo; once — either way it&apos;s outside the
        App Store, not malware. want certainty? the source is right there; have
        your own agent do the security review before it builds anything.
      </p>

      <p className="quiet-line">your memory. your machine. nothing leaves.</p>
    </section>
  );
}
