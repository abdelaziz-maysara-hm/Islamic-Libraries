# ADR 0003: Progressive web app support without a build step

## Status

Accepted

## Context

The public site must remain static, framework-free, compatible with GitHub Pages and Cloudflare, and usable on mobile connections that may be slow or intermittent.

## Decision

Provide a root web app manifest and service worker. The existing shared `main.js` discovers the correct repository-relative root from `window.SITE_ROOT`, exposes the manifest to every public page, and registers the root service worker after page load. Navigations, scripts and styles use a network-first strategy so deployments remain fresh; images and fonts use cache-first delivery. A small set of core pages and assets is pre-cached for offline fallback.

## Consequences

- No build step or route change is introduced.
- GitHub Pages project paths and custom-domain roots both remain supported.
- New deployments are not hidden behind a stale script or stylesheet cache.
- The service-worker cache name must change if the pre-cache contract itself changes incompatibly.