import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
const page = readFileSync(join(root, "app/preview/page.tsx"), "utf8");
const landing = readFileSync(join(root, "app/page.tsx"), "utf8");
const bench = readFileSync(join(root, "app/bench/page.tsx"), "utf8");
const asciiBg = readFileSync(join(root, "components/ascii-bg.tsx"), "utf8");

function appearsBefore(earlier, later) {
  const a = page.indexOf(earlier);
  const b = page.indexOf(later);
  assert.notEqual(a, -1, `missing ${earlier}`);
  assert.notEqual(b, -1, `missing ${later}`);
  assert.ok(a < b, `${earlier} should appear before ${later}`);
}

// The product path is Pulse Local Preview; Safe Mode is the fallback, below it.
appearsBefore("npx @zbs-gg/pulse@preview init claude-code", "claude mcp add pulse");

for (const required of [
  "https://github.com/zbs-gg/pulse",
  "npm view @zbs-gg/pulse dist-tags",
  "0.6.4",
  "pulse doctor",
  "pulse demo",
  "pulse demo --clean",
  "SIMULATED corpus",
  "drained, restored, angry",
  "state x1.15",
  "fallback, not the product",
  "Ask me for confirmation",
  "claude mcp remove pulse",
  "rm -rf ~/.pulse/standalone",
  "raw transcript capture is off by default",
  "/pulse-demo.mp4",
]) {
  assert.match(page, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `missing ${required}`);
}

for (const forbidden of [
  /Claude never forgets/i,
  /production ready/i,
  /Pulse Cloud ready/i,
  /ChatGPT Store ready/i,
  /Lite Pulse/i,
  /\bDetected\b/,
  /\bImported\b/,
  // No bench numbers on the install page — they live on /bench, full engine only.
  /R@3|LongMemEval|LoCoMo/,
  // The fallback must never be sold as the whole product.
  /install — the whole thing/i,
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
  /Lite Pulse/i,
]) {
  assert.doesNotMatch(landing, forbidden, `forbidden landing claim ${forbidden}`);
}
assert.match(landing, /simulated memory corpus/, "MemoryTimeline must be labeled simulated");
assert.doesNotMatch(gitignore, /public\/elle-\*\.mp4/, "Elle background videos must be committed public assets");
assert.doesNotMatch(asciiBg, /localHosts|preferFallback/, "Elle video must be the primary public background, fallback only handles load errors");
assert.doesNotMatch(
  landing,
  /<span className="proj-name"><ScrambleText text="Emo\.Bench" \/><\/span>[\s\S]*<a href="https:\/\/github\.com\/zbs-gg\/emo-bench"/,
  "landing must not nest the Emo.Bench GitHub link inside the /bench link",
);

for (const [name, source] of [
  ["landing", landing],
  ["preview", page],
  ["bench", bench],
]) {
  assert.match(
    source,
    /src="\/elle-[12]\.mp4"[\s\S]*fallbackSrc="\/pulse-demo\.mp4"/,
    `${name} Elle background must have deployed pulse-demo fallback`,
  );
}

for (const required of [
  "Pulse Factual Bench",
  "38 gold probes",
  "8 host-extracted docs",
  "21.1%",
  "23.7%",
  "no significant difference",
]) {
  assert.match(landing, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `missing landing FFB result ${required}`);
}

console.log("preview copy checks passed");
