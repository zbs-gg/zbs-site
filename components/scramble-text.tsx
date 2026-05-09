"use client";

import { useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS =
  "!<>-_\\/[]{}=+*^?#$%&@▓▒░·∙•◌◍◐◑◒◓◔◕◉∇∆∂∫√≈≠≤≥αβγδεζηθλμπρστφχψωабвгдежиклмноп";

type Props = {
  text: string;
  /** how many frames to spend before settling each char */
  speed?: number;
  /** auto-run on mount */
  autoplay?: boolean;
  /** className passed through */
  className?: string;
};

export function ScrambleText({ text, speed = 30, autoplay = false, className }: Props) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);
  const queueRef = useRef<{ from: string; to: string; start: number; end: number; char?: string }[]>([]);
  const frameRef = useRef(0);

  // Re-sync display if `text` prop changes externally
  useEffect(() => setDisplay(text), [text]);

  const stop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const update = () => {
    let output = "";
    let complete = 0;
    const queue = queueRef.current;
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (frameRef.current >= item.end) {
        complete++;
        output += item.to;
      } else if (frameRef.current >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        output += item.char;
      } else {
        output += item.from;
      }
    }
    setDisplay(output);
    if (complete < queue.length) {
      frameRef.current++;
      rafRef.current = requestAnimationFrame(update);
    } else {
      rafRef.current = null;
    }
  };

  const scramble = () => {
    stop();
    const oldText = display;
    const newText = text;
    const length = Math.max(oldText.length, newText.length);
    const queue: typeof queueRef.current = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] ?? " ";
      const to = newText[i] ?? "";
      const start = Math.floor(Math.random() * speed);
      const end = start + speed + Math.floor(Math.random() * speed);
      queue.push({ from, to, start, end });
    }
    queueRef.current = queue;
    frameRef.current = 0;
    rafRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (autoplay) scramble();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      className={className}
      onPointerEnter={scramble}
      onFocus={scramble}
      style={{ display: "inline-block" }}
    >
      {display}
    </span>
  );
}
