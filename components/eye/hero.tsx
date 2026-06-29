"use client";

/**
 * EyeHero — hero block for the ZBS Eye section (/eye).
 *
 * Props: none. Self-contained client component (needs a tiny bit of state for
 * the graceful image fallback below).
 *
 * Renders, top → bottom:
 *  - The Eye itself: `/eye-hero.gif` (holo eye loop the integrator copies into
 *    /public). If that asset is missing or fails to load, it gracefully falls
 *    back to the canonical ASCII eye (verbatim from eye/docs/eye.txt) in a
 *    decorative `<pre aria-hidden>` — the component never breaks without the asset.
 *  - Title: "eternal memory for your Mac." (ScrambleText, .hero-line)
 *  - An honest one-line subtitle (.install-lede): what Eye is, plus that it runs
 *    entirely on your machine — no cloud / account / subscription / telemetry.
 *  - The verbatim slogan, mono, with exactly ONE .holo accent span.
 *  - A status line: shipped & notarized · Developer ID · macOS 15+ · Apple
 *    Silicon · 100% local · not in the Mac App Store (by design).
 *
 * Style: vanilla-CSS site classes only (`hero install-hero`, `hero-line`,
 * `install-lede`, `status-line`, `holo`, `live`) + inline style props for the
 * eye visual. No globals.css edits, no Tailwind. Honest / canon-compliant:
 * Eye is a build-from-source / ask-your-agent product, not an App Store app,
 * and carries no benchmark numbers (it's a product, not a paper).
 *
 * The section uses `hero install-hero` (not plain `hero`) on purpose: plain
 * `.hero` blends with mix-blend-mode: difference, which turns this small text
 * to mush over the dense ASCII background. `.install-hero` flips blending to
 * normal and the install-* text classes carry text-shadow backplates.
 */

import { useState } from "react";
import { ScrambleText } from "@/components/scramble-text";

// Canonical ASCII eye — verbatim from eye/docs/eye.txt. No backticks / ${} so
// it is safe inside this template literal. Used as the graceful fallback when
// /eye-hero.gif is unavailable.
const EYE_ART = `                                  -==++=::.
                                   :=##%###+=:
                                     .:+#@%%%#=:
                    :-==++++++=---===:..:-#@@%%*:
                 :+*#*+++++===+*####*++=:.:-#@##*:
               -*#+=====------==++*#%%***=:.:=%*+=
             .*#=-==---::.. .:--===++*@%++:   :*=--
            .*#--+::-.          :=--+++%%-.    .- .
            +%=-+:--              -=:*=+@*  :
            ##:+=:=                =:=*-%%:
            ##:+-.=                =:=*-%#.  .
         .  +@=-+:=-              --:+==%+
            .#%==+:-=.          .--:==-##.  .
             .*%+-==----:.  .::----=-+#*.
               -*#+====--------====+#*- .
                 :+***+++====+++*##+:
                    :-==++**++==-:`;

export function EyeHero() {
  // The gif is the primary visual; if the integrator hasn't copied the asset
  // yet (or it 404s), we drop to the ASCII eye instead of a broken image.
  const [gifFailed, setGifFailed] = useState(false);

  return (
    <section className="hero install-hero" id="hero">
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "0 0 1.4rem",
        }}
      >
        {gifFailed ? (
          <pre
            aria-hidden="true"
            style={{
              margin: 0,
              fontFamily: "var(--mono)",
              color: "var(--fg-dim)",
              lineHeight: 1.05,
              fontSize: "clamp(.5rem, 1.1vw, .8rem)",
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            {EYE_ART}
          </pre>
        ) : (
          <img
            src="/eye-hero.gif"
            alt=""
            aria-hidden="true"
            onError={() => setGifFailed(true)}
            style={{
              display: "block",
              width: "100%",
              maxWidth: "min(440px, 78vw)",
              height: "auto",
              borderRadius: 4,
            }}
          />
        )}
      </div>

      <h1 className="hero-line">
        <ScrambleText text="eternal memory for your Mac." />
      </h1>

      <p className="install-lede">
        ZBS Eye is a macOS app that continuously records everything you see and
        hear — your screen and your audio — and lets you find any moment in
        seconds. It runs <em>entirely on your machine</em>: no cloud, no
        account, no subscription, no telemetry.
      </p>

      <p
        style={{
          fontFamily: "var(--mono)",
          fontSize: "0.95rem",
          letterSpacing: "0.02em",
          lineHeight: 1.6,
          color: "var(--fg-dim)",
          margin: "0 0 1.2rem",
          textShadow:
            "0 0 14px var(--bg), 0 0 8px var(--bg), 0 0 3px var(--bg), 0 0 2px var(--bg)",
        }}
      >
        it sees everything. <span className="holo">it remembers everything.</span>{" "}
        and it all stays with you.
      </p>

      <p className="status-line">
        <span className="live">● shipped &amp; notarized</span> · Developer ID
        build · macOS 15+ · Apple Silicon · 100% local · not in the Mac App
        Store (by design)
      </p>
    </section>
  );
}
