"use client";

import { CopyButton } from "@/components/copy-button";

type ShareProps = {
  text: string; // honest pre-filled post text
  url: string; // canonical URL to share
  label?: string; // optional caption, e.g. "share the eye"
};

export function Share({ text, url, label }: ShareProps) {
  // twitter.com/intent/tweet still resolves and redirects to x.com — it's the
  // stable intent endpoint, so we keep it.
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text,
  )}&url=${encodeURIComponent(url)}`;

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
        fontFamily: "var(--mono)",
      }}
    >
      {label ? <span className="cmd-note">{label}</span> : null}
      <a
        className="btn-ascii"
        target="_blank"
        rel="noopener"
        href={intentUrl}
      >
        share on X
      </a>
      <CopyButton text={url} label="copy link" doneLabel="link copied" />
    </div>
  );
}
