"use client";

import { useEffect, useState } from "react";
import { ScrambleText } from "./scramble-text";

const VARIANTS = [
  { line1: "memory that knows", line2: "what matters." },
  { line1: "memory that knows", line2: "your emotions." },
  { line1: "memory that knows", line2: "what tuesday cost you." },
  { line1: "memory that knows", line2: "you didn’t sleep." },
  { line1: "memory that knows", line2: "your therapist’s name." },
  { line1: "memory that knows", line2: "when to shut up." },
  { line1: "memory that knows", line2: "better than you do." },
];

const FIRST_DELAY_MS = 10000;
const CYCLE_MS = 5200;

export function HeroCycle() {
  const [i, setI] = useState(0);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const startId = setTimeout(() => {
      setI((v) => (v + 1) % VARIANTS.length);
      intervalId = setInterval(
        () => setI((v) => (v + 1) % VARIANTS.length),
        CYCLE_MS,
      );
    }, FIRST_DELAY_MS);
    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const v = VARIANTS[i];

  return (
    <>
      <h1 className="hero-title">
        <ScrambleText text={v.line1} autoplay speed={45} />
        <br />
        <span className="hero-title-faded">
          <ScrambleText text={v.line2} autoplay speed={50} />
        </span>
      </h1>
      <div className="hero-cycle-hint" aria-live="polite">
        <span className="hc-key holo">↻</span>
        <span className="hc-count">
          {String(i + 1).padStart(2, "0")} / {String(VARIANTS.length).padStart(2, "0")}
        </span>
        <span className="hc-bar">
          <span className="hc-fill" key={i} />
        </span>
      </div>
    </>
  );
}
