# ADR 0001: Generate the sitemap from canonical pages and the search catalog

## Status

Accepted — 2026-11-19

## Context

The sitemap was maintained manually, contained stale modification dates, and exposed only the generic `book.html` shell rather than the 204 stable `book.html?book=ID` routes used by visitors and search.

The static site has two URL families:

- canonical HTML pages declared in each document;
- data-backed book detail routes generated from `assets/js/search-catalog.js`.

Fatwa deep links are not included yet because they currently share the collection canonical URL. Adding them before per-fatwa canonical metadata exists would send conflicting indexing signals.

## Decision

- Generate `sitemap.xml` with `npm run generate:sitemap`.
- Include every indexable static HTML canonical except the generic book shell.
- Include each catalogued `book.html?book=ID` URL.
- Omit guessed or inaccurate `lastmod` values.
- Make `npm run validate` fail when the committed sitemap differs from generated output.
- Validate that sitemap entries are either known static canonicals or known book catalog entries.

## Consequences

Adding or removing an indexable page or book requires regenerating the sitemap. Individual fatwa URLs can be added later after their runtime title, description, and canonical URL are unique.
