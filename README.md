# Islamic Libraries

Islamic Libraries is a production static website for Islamic books, Quran reading and recitation, fatwas, educational videos, reference content, and practical tools. The public site uses HTML, CSS, and Vanilla JavaScript and is designed to remain compatible with static hosting.

## Project structure

- `assets/css/` — shared presentation styles.
- `assets/js/` — shared behavior and curated data.
- `adhkar/`, `aqeedah/`, `fatawa/`, `fiqh/`, `hadith/`, `seerah/`, `tafsir/` — topic pages.
- Root HTML files — primary navigation and product pages.
- `scripts/` — repository validation tooling; not required by the published site.
- `docs/adr/` — architectural decision records.

## Development

The public site does not require a build step. Serve the repository root with any static HTTP server and open `index.html` through that server.

Use Node.js 20 or newer for validation:

```sh
npm ci
npm run validate
```

The validation command checks JavaScript syntax, essential HTML and SEO contracts, and local links.

## Deployment

GitHub Pages is the canonical deployment target. Cloudflare compatibility is preserved, but Netlify configuration is intentionally not maintained. Do not rename public files or folders because their paths are indexed URLs.

## Quality goals

- Lighthouse category scores above 95 where third-party services permit.
- WCAG 2.2 AA accessibility.
- Stable canonical URLs and complete structured metadata.
- Safe DOM rendering and restrictive hosting headers where compatible.
- Fast Arabic and English-aware search with lazy-loaded large datasets.

## Contributions and AI-assisted work

Read `AGENTS.md` and `AI_RULES.md` before making changes. Work in small phases, preserve content and architecture, record significant decisions in `docs/adr/`, and run `npm run validate` before every commit.
