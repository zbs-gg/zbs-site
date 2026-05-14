"use client";

import { useState } from "react";
import { ScrambleText } from "./scramble-text";

const BRAND_GLOSS = [
  {
    word: "zbs",
    ipa: "/zəˈbʲisʲ/",
    reg: "Russian, vernacular",
    etym: "abbr. of заебись",
    def: "genuinely excellent; first-rate; unironically good. used flat, without quotation marks — the speaker means it.",
  },
  {
    word: "gg",
    ipa: "/dʒiː ˈdʒiː/",
    reg: "internet, gaming",
    etym: "good game",
    def: "said at the end of a round to acknowledge it was fair and finished. extends, by usage, to: well done, that’s it, we’re good.",
  },
];

export function Brand() {
  const [open, setOpen] = useState(false);
  const tokens = open
    ? ["zaebis", "good game!", "no reset. no amnesia."]
    : ["zbs", "gg", "no reset. no amnesia."];
  return (
    <div
      className={"brand" + (open ? " brand-open" : "")}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      <div className="brand-kicker">independent research lab</div>
      <div className="brand-row">ZBS GG</div>
      <div className="brand-tag">
        {tokens.map((s, i) => (
          <span key={i + s} className="brand-tag-token">
            {i > 0 && <span className="dot">·</span>}
            <span className={i < 2 ? "brand-tag-glossed" : ""}>
              <ScrambleText text={s} />
            </span>
          </span>
        ))}
      </div>
      <div className="brand-gloss" aria-hidden={!open}>
        <div className="brand-gloss-rule" />
        {BRAND_GLOSS.map((g, i) => (
          <div className="gloss-entry" key={i}>
            <div className="gloss-head">
              <span className="gloss-word">{g.word}</span>
              <span className="gloss-ipa">{g.ipa}</span>
              <span className="gloss-reg">{g.reg}</span>
            </div>
            <div className="gloss-etym">⟵ {g.etym}</div>
            <div className="gloss-def">{g.def}</div>
          </div>
        ))}
        <div className="gloss-foot">∴ <em>no reset. no amnesia.</em></div>
      </div>
    </div>
  );
}
