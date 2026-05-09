# zbs.gg landing

Next.js 15 + React 19 + Three.js + `postprocessing` ASCII shader, with the
Efecto fragment-shader as the visual layer over a video texture of Elle.

The site is the corporate face of **ZBS GG Consulting** — independent
research lab behind **Garden** (Pulse engine, Hearth chat, public bench).
Built to support grant applications and serve as a stable home for the
project family.

---

## Stack

- **Next.js 15** App Router (TS, React 19)
- **Three.js** + **@react-three/fiber** + **@react-three/postprocessing**
- **postprocessing** v6 with a custom Efecto-port `AsciiEffect`
- One client `<canvas>` rendering a fullscreen `VideoTexture` with
  cover-fit shader, all post-processed through the ASCII fragment shader
- Vanilla CSS (no Tailwind)

---

## Quickstart

```bash
npm install
npm run dev          # http://localhost:3000
```

- `/` — landing (hero, manifesto, projects, contact)
- `/dev` — live debug panel (sliders for every postfx uniform; `Copy JSON`
  exports the current preset)

---

## File map

```
zbs-site/
├── app/
│   ├── layout.tsx          html shell + metadata
│   ├── page.tsx            landing content (hero / manifesto / projects / contact)
│   ├── dev/page.tsx        /dev — live tweak panel
│   └── globals.css         theme + layout (mono / sans, mix-blend-mode: difference)
├── components/
│   ├── ascii-effect.tsx    Efecto-port ASCII shader as `postprocessing.Effect`
│   ├── video-scene.tsx     Canvas + VideoQuad (cover-fit) + EffectComposer
│   ├── client-bg.tsx       client wrapper for SSR-disabled VideoScene
│   └── scramble-text.tsx   text-scramble effect on hover (ASCII menu)
└── public/
    ├── elle-1.mp4          primary video (10s loop, 4k @ 24fps)
    └── elle-2.mp4          alternate
```

---

## ASCII shader — what's controllable

All exposed via `<VideoScene>` props or in `/dev`:

| Group     | Props                                                      |
|-----------|------------------------------------------------------------|
| source    | `src`, `style` (standard / dense / minimal / blocks)       |
| cell      | `cellSize`, `invert`, `colorMode`                          |
| image     | `contrastAdjust`, `brightnessAdjust`                       |
| halo      | `mouseGlowEnabled / Radius / Intensity`                    |
| vignette  | `vignetteIntensity / Radius`                               |
| CRT       | `scanlineIntensity / Count`, `aberrationStrength`          |
| noise     | `noiseIntensity / Scale / Speed`                           |
| wave      | `waveAmplitude / Frequency / Speed`                        |
| glitch    | `glitchIntensity / Frequency`                              |
| jitter    | `jitterIntensity / Speed`                                  |
| distort   | `curvature`                                                |
| frame     | `targetFPS` (0 = unlocked)                                 |
| palette   | `colorPalette` (original / green / amber / cyan / blue)    |

Default landing wiring lives in `app/page.tsx`. Any preset exported via
`/dev → Copy JSON` can be pasted directly as the `postfx` prop.

---

## Deploy

**Cloudflare Pages** (free tier, zero-config for Next.js 15):

```bash
npx wrangler pages deploy .next --project-name=zbs-gg
```

Or via the dashboard: Connect Git → framework preset Next.js → build `npm
run build` → output `.next`. Custom domain `zbs.gg` via DNS CNAME to the
pages.dev target.

**Vercel**:

```bash
npx vercel
```

Auto-detected. Custom domain `zbs.gg` → A/AAAA records to Vercel.

---

## License

MIT for code. Video assets (`public/elle-*.mp4`) are not licensed for
redistribution — replace with your own before publishing the repo.
