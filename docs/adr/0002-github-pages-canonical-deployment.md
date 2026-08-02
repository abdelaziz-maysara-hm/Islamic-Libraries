# ADR 0002: Use GitHub Pages as the canonical deployment

- Status: Accepted
- Date: 2026-08-02

## Context

The repository had configuration for multiple hosting providers. The project owner selected GitHub Pages as the only maintained production deployment target.

## Decision

GitHub Pages from the `main` branch and repository root is the canonical deployment. The custom domain and HTTPS configuration remain managed through GitHub Pages.

The Netlify configuration is removed. Static-source compatibility with Cloudflare is preserved because it is an existing project constraint, but repository-owned production documentation and validation target GitHub Pages.

## Consequences

- Deployment guidance has one source of truth.
- Netlify-specific behavior and headers are no longer maintained.
- HTTP response headers unavailable on GitHub Pages must not be simulated with incompatible deployment configuration.
- Security improvements must use browser-compatible markup and JavaScript or a future explicitly approved edge layer.