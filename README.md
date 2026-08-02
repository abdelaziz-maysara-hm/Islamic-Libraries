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

The validation command checks JavaScript syntax, CSS structure, essential HTML and SEO contracts, PWA files, and local links. Pull requests that change public pages or assets also run Lighthouse against representative home, Quran, and book-library routes; performance and best-practice regressions are reported while accessibility and SEO minimums are enforced.

## Deployment

GitHub Pages is the canonical deployment target. Cloudflare compatibility is preserved, but Netlify configuration is intentionally not maintained. Do not rename public files or folders because their paths are indexed URLs.

The site includes a web app manifest and a root service worker. Visitors can install it from a supported browser, and core pages remain available after a successful first visit when the connection is interrupted. The shared application script resolves repository-relative paths, so the same PWA files work on a custom domain and under a GitHub Pages project path.

## Quality goals

- Lighthouse category scores above 95 where third-party services permit.
- WCAG 2.2 AA accessibility.
- Stable canonical URLs and complete structured metadata.
- Safe DOM rendering and restrictive hosting headers where compatible.
- Fast Arabic and English-aware search with lazy-loaded large datasets.

## Contributions and AI-assisted work

Read `AGENTS.md` and `AI_RULES.md` before making changes. Work in small phases, preserve content and architecture, record significant decisions in `docs/adr/`, and run `npm run validate` before every commit.
