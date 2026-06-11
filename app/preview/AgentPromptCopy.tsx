"use client";

import { useState } from "react";

type AgentPromptCopyProps = {
  prompt: string;
};

export function AgentPromptCopy({ prompt }: AgentPromptCopyProps) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="pulse-preview-agent-card" aria-label="Install with your AI agent">
      <div>
        <p className="pulse-preview-card-label">Install with your AI agent</p>
        <h2>Let your agent audit Pulse before it installs anything.</h2>
        <p>
          Copy this into Claude Code, Codex, or Cursor. The agent should read the repo,
          show the plan, ask confirmation, install, prove one memory, then show wipe.
        </p>
      </div>
      <textarea readOnly value={prompt} aria-label="Pulse agent install prompt" />
      <button type="button" onClick={copyPrompt}>
        {copied ? "Prompt copied" : "Copy install prompt"}
      </button>
    </div>
  );
}

