# zbs-site — agent rules

Лендинг zbs.gg — корпоративное лицо ZBS GG Consulting и семьи Garden (Pulse,
Heart, bench). Next.js 15 + React 19 + Three.js: ASCII-шейдер поверх видео
Элли. Плюс `/preview` — публичная install-страница Pulse (дистрибуция).

## Verify

ОДНА команда — единственный гейт «сделано/не сделано» для любого агент-лупа:

```bash
npm run verify
```

Внутри: `tsc --noEmit` + `node scripts/check-preview-copy.mjs`
(копи-инвариант install-строки `claude mcp add pulse …` на /preview) +
`next build`. Exit 0 = деплоябельно; не-ноль = вывод фейла — дельта-спека
следующей итерации. Прогон пишет JSONL-строку в `~/.claude/verify-log.jsonl`.

## Layout

```text
app/         — App Router: page.tsx (лендинг), preview/ (install Pulse), bench/, dev/
components/  — Three.js canvas + ASCII postprocessing-эффект (порт Efecto)
scripts/     — check-preview-copy.mjs: hard-fail при регрессе публичного install-копи
public/      — статика (видео-текстура Элли и пр.)
archive/     — zip старой версии сайта — не трогать
```

## Canon

Гарден-имена: «Элли» не склоняется, женский род. Pulse / Heart / Atlas /
Garden — с большой буквы, без переводов. Тон публичных поверхностей:
«покажи, не продавай» — живое демо вместо обещаний.
Полный канон: `Garden/docs/canon.md` (создаётся; этот указатель — вперёд).

## Don't

- Публичная поверхность: никаких личных данных, имён клиентов, внутренних путей.
- Install-копи на `/preview` менять только вместе с `check-preview-copy.mjs` (это продуктовый инвариант, не текст).
- ESLint в репо нет — не добавлять «заодно» (additive-правило).
- Никакого auto-merge: PR ждёт человека, даже при зелёном verify.
- Prosha (ChatGPT Pro) — только webchat через `check-with-pro`, API-вызовы Pro не создавать.
