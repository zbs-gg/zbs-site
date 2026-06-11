"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
  label: string;
  doneLabel?: string;
};

export function CopyButton({ text, label, doneLabel = "copied" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <button
      type="button"
      className={copied ? "btn-ascii is-done" : "btn-ascii"}
      onClick={copy}
    >
      {copied ? doneLabel : label}
    </button>
  );
}
