# AI contribution rules

## Architecture

- Keep the site static and framework-free.
- Extend existing modules before creating parallel implementations.
- Split a large script only when the change preserves load order and globals used by existing pages.
- Never change routing, filenames, deployment configuration, or public APIs without explicit approval.

## Code quality

- Use small functions with one responsibility.
- Avoid duplicated logic, implicit globals, and unsafe HTML construction.
- Keep changes narrowly scoped and document non-obvious decisions.
- Do not add placeholders, TODO-only implementations, generated filler, or secrets.

## Performance

- Avoid adding blocking resources to page heads.
- Lazy-load non-critical data and media when backward compatibility permits.
- Prevent layout shifts by preserving media dimensions and stable containers.
- Measure before making broad CSS or JavaScript changes.

## SEO and content

- Preserve titles, descriptions, canonical URLs, sitemap entries, and existing content.
- Add structured data only when the visible page content supports it.
- Do not mass-generate thin pages or unverified religious content.

## Accessibility

- Preserve semantic landmarks and heading order.
- All interactive controls must be keyboard accessible and visibly focused.
- Provide accessible names and maintain WCAG AA color contrast.

## Security

- Treat URL parameters, API responses, and user input as untrusted.
- Prefer `textContent` and DOM construction over `innerHTML` for untrusted values.
- Add `noopener noreferrer` to external links opened in a new tab.
- Never commit credentials, tokens, private keys, or environment files.

## Deployment and validation

- Preserve GitHub Pages deployment and Cloudflare compatibility.
- Run `npm run validate` before committing.
- Submit each hardening phase as a separate, reviewable pull request.
