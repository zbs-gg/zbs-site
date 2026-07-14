# zbs.gg brandbook v2.7

**Rule:** port what the site already ships. Do not invent parallel explainers.

## Open

```bash
open artifacts/brandbook/brandbook.html
```

`?theme=light` · `?theme=dark`

## Site canon ports

| Brandbook | Source on site |
|-----------|----------------|
| B&W scramble nav | `app/page.tsx` + `components/scramble-text.tsx` + `.ascii-nav` |
| Memory timeline (line + segments) | `components/memory-timeline.tsx` + `.mt-*` in `globals.css` |
| Hero ASCII thrash | `components/ascii-bg.tsx` mouse glow grammar |
| Lab product story | `public/lab.html` — open that file; do not re-sketch in brandbook |

## Removed on purpose

- Story lab (Alex zoom absolute cards) — wrong grammar  
- Brandbook “context explainer” — poor lab clone  
- Constellation / plotter / floor / bloom / glitch-nav  
- Depth video showcase / hypercube  

## Effects lab (kept)

ASCII field · line draw (grey→holo) · signal glow rings · scramble · holo edge · spotlight · ASCII mask+glitch  

Ambient GSAP planes (no video section).

## Plans

`docs/plans/2026-07-14-00{1,2,3,4}-*.md`
