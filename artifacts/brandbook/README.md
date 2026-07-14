# zbs.gg brandbook v2.5

Bayside nav · cursor-reactive ASCII · scroll theme wipe · dual theme · bento parts.

## Open

```bash
open artifacts/brandbook/brandbook.html
```

`file://` works. Local GSAP: `assets/gsap.min.js`. Google Fonts need network once.

Force theme:

```text
brandbook.html?theme=light
brandbook.html?theme=dark
```

Theme also stores in `sessionStorage` key `bb-theme` after a wipe.

## Motion grammar (v2.5)

| Feature | Behavior |
|---------|----------|
| **Nav** | B&W mono + `// ` prefix · scramble on hover (landing lock) |
| **Hero ASCII** | Pointer thrash: glyphs densify / reseed in radius |
| **Scroll spine** | Fixed left line: grey track + holo progress |
| **Theme gate** | Mid-page beat · circle expand · dark ↔ light |
| **Dual theme** | `data-theme="dark\|light"` token maps (not invert-only) |

## Layout

| path | role |
|------|------|
| `brandbook.html` | specimen |
| `type-specimen.html` | type A/B/C |
| `assets/icons/*.svg` | mono stroke icons |
| `assets/mood/*.png` | Higgsfield stills |
| `assets/gsap.min.js` | 3D card |
| `*.v1-freeze.html` | pre-v2 snapshot |

## Plans

- `docs/plans/2026-07-14-001-feat-brandbook-v2-illustrative-plan.md`
- `docs/plans/2026-07-14-002-feat-brandbook-motion-theme-plan.md`

## Out of scope

- Port to live `app/page.tsx` (follow-up)
- Particle / matrix / mono marquee
