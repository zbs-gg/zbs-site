@AGENTS.md
Claude-специфика: для визуальных правок — скилл `frontend-design`; живую проверку страницы делать через Playwright-плагин (browser_navigate → screenshot), не «на глаз».
После нетривиального коммита — subagent `post-commit-verifier` поверх `npm run verify`.
