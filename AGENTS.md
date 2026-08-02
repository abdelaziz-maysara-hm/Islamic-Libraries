# Islamic Libraries contribution guardrails

These rules apply to the entire repository.

- Preserve the current Vanilla JavaScript architecture.
- Never rename existing folders, routes, or public URLs.
- Preserve existing content, metadata, canonical URLs, and structured data.
- Preserve GitHub Pages deployment and Cloudflare compatibility.
- Prefer small, backward-compatible improvements over rewrites.
- Do not introduce a frontend framework or a build requirement for the public site.
- Treat Arabic text as UTF-8 and verify it after every content edit.
- Do not remove content or datasets without explicit owner approval.
- Keep external links safe and sanitize untrusted data before DOM insertion.
- Maintain keyboard access, visible focus, semantic HTML, and WCAG AA contrast.
- Run `npm run validate` before every commit.
- Record architecture-affecting decisions in `docs/adr/`.
