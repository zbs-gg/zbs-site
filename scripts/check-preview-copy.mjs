import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const page = [
  readFileSync(join(root, "app/preview/page.tsx"), "utf8"),
  readFileSync(join(root, "components/copy-button.tsx"), "utf8"),
].join("\n");
const landing = readFileSync(join(root, "app/page.tsx"), "utf8");

function appearsBefore(earlier, later) {
  const a = page.indexOf(earlier);
  const b = page.indexOf(later);
  assert.notEqual(a, -1, `missing ${earlier}`);
  assert.notEqual(b, -1, `missing ${later}`);
  assert.ok(a < b, `${earlier} should appear before ${later}`);
}

// The one-command zero-config path is the primary story: command first.
appearsBefore("claude mcp add pulse", "copy install prompt");
assert.match(page, /claude mcp add pulse -- npx -y @zbs-gg\/pulse@preview mcp/);
// The full engine stays an explicit optional upgrade.
assert.match(page, /npx @zbs-gg\/pulse@preview init claude-code/);

for (const required of [
  "https://github.com/zbs-gg/pulse",
  "AGENTS.md",
  "npm view @zbs-gg/pulse dist-tags",
  "Ask me for confirmation",
  "first_run",
  "pulse_resume",
  "pulse_wipe",
  "rm -rf ~/.pulse/standalone",
  "claude mcp remove pulse",
  "never raw",
  "/pulse-demo.mp4",
]) {
  assert.match(page, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `missing ${required}`);
}

for (const forbidden of [
  /Claude never forgets/i,
  /production ready/i,
  /Pulse Cloud ready/i,
  /ChatGPT Store ready/i,
  /\bDetected\b/,
  /\bImported\b/,
  // The lite store has no retrieval-engine bench claims to make.
  /R@3|LongMemEval|LoCoMo/,
]) {
  assert.doesNotMatch(page, forbidden, `forbidden claim ${forbidden}`);
}

// Landing page: no feature claims without a backing surface, no forbidden claims.
for (const forbidden of [
  /hosted Elle/i,
  /Claude never forgets/i,
  /production ready/i,
  /Pulse Cloud ready/i,
  /ChatGPT Store ready/i,
]) {
  assert.doesNotMatch(landing, forbidden, `forbidden landing claim ${forbidden}`);
}
assert.match(landing, /simulated memory corpus/, "MemoryTimeline must be labeled simulated");

console.log("preview copy checks passed");
