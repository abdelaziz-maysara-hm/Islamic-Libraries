# ADR 0001: Preserve the static Vanilla JavaScript architecture

- Status: Accepted
- Date: 2026-08-02

## Context

Islamic Libraries is a mature content site deployed from static files. Its public URLs, search visibility, and compatibility with multiple static hosts are production constraints.

## Decision

The project will remain a static, framework-free site using HTML, CSS, and Vanilla JavaScript. Hardening work will be incremental. Existing URLs, content, SEO signals, and deployment targets remain stable.

Large scripts may be split into compatible modules only after their public globals, load order, and page dependencies are covered by validation.

## Consequences

- Improvements can ship without a migration or runtime server.
- GitHub Pages, Cloudflare, and Netlify remain valid deployment targets.
- New tooling may validate the source, but the published site must not require a build step.
- Architecture-affecting changes require a new ADR and explicit approval.
