"use client";

import { useEffect, useState } from "react";
import { ScrambleText } from "./scramble-text";

const LINE1 = "memory that knows";

const TAILS = [
  "what tuesday cost you.",
  "what woke you up at 3am.",
  "the message you haven’t sent.",
  "who you’ve been ghosting.",
  "the email you re-read seven times.",
  "you didn’t sleep.",
  "when to shut up.",
];

const FIRST_DELAY_MS = 4500;
const CYCLE_MS = 4500;
const SCRAMBLE_SPEED = 35;

export function HeroCycle() {
  const [i, setI] = useState(0);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const startId = setTimeout(() => {
      setI((v) => (v + 1) % TAILS.length);
      intervalId = setInterval(
        () => setI((v) => (v + 1) % TAILS.length),
        CYCLE_MS,
      );
    }, FIRST_DELAY_MS);
    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <h1 className="hero-title">
      <ScrambleText text={LINE1} autoplay speed={SCRAMBLE_SPEED} />
      <br />
      <span className="hero-title-faded">
        <ScrambleText text={TAILS[i]} autoplay speed={SCRAMBLE_SPEED} />
      </span>
    </h1>
  );
}
