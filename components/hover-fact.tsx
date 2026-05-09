"use client";

import { useState, ReactNode } from "react";

export function HoverFact({
  children,
  label,
  body,
  side = "top",
}: {
  children: ReactNode;
  label?: string;
  body: ReactNode;
  side?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={`hf hf-${side}${open ? " hf-open" : ""}`}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      <span className="hf-anchor">{children}</span>
      <span className="hf-card" role="tooltip" aria-hidden={!open}>
        {label && <span className="hf-label">{label}</span>}
        <span className="hf-body">{body}</span>
      </span>
    </span>
  );
}
