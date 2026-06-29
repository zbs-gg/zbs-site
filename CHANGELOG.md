# Changelog

All notable changes to the zbs.gg site.

## 2026-06-29

### Added
- **/pulse** — interactive Pulse explainer page, framed around the two qualities
  (one endless conversation + it understands you): the problem, an honest
  comparison vs claude-mem / Mem0 (no bench numbers), the interactive
  MemoryTimeline + a keyword-vs-state-aware RetrievalContrast, the product demo,
  and one-touch install (primary Claude Code deep-link = full engine; Cursor /
  VS Code / Codex labeled Safe Mode keyword recall; copy fallbacks). Sticky
  install bar across the scroll.
- **/eye** — ZBS Eye section (the macOS eternal-memory app): ASCII eye hero,
  what-it-is, why-it-matters, and an honest install (not in the Mac App Store +
  why; build-from-source / ask-your-agent; no fake download). Social share.
- Site-wide **easter eggs / ASCII memes** (Konami code + secret triggers),
  accessible (role=status, dismissible, reduced-motion safe, never modal).
- Eye added to the home nav, project list, and sitemap.

### Changed
- Home nav `pulse` link and the Pulse project card now point to **/pulse**
  (were GitHub); project-card license corrected MIT → AGPL-3.0.
- Renamed the internal-named background asset `elle-*.mp4` → `hero-bg-*.mp4`
  across the whole site (home, /bench, /preview, /dev); `check-preview-copy`
  invariant updated in lockstep. No visual change.
- Added an `npm run verify` script (tsc + check-preview-copy + next build).
