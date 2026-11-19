# ADR 0004: Async data readiness events and native MP4 export

Date: 2026-11-19 · Status: Accepted

## Context
- `book.html` rendered before the pinned base catalog (jsDelivr) and `books-extra.js` finished loading, so most book IDs showed «الكتاب غير موجود».
- Fatwa category chips were counted once from the 25 base fatwas, before `main.js` loaded the extra batches (259 total).
- Al Quran Cloud's `quran-uthmani` text merges the basmala into ayah 1 of every surah except Al-Fatiha and At-Tawbah.
- The reel maker's "MP4" button relied on ffmpeg.wasm, which needs `crossOriginIsolated` (not available on GitHub Pages), so it silently downloaded WebM.

## Decision
- `books-data.js` sets `window.BOOKS_READY` and dispatches a `books:ready` event on `document` once base + extras have loaded (or failed). `book-page.js` renders on that event (15 s safety timeout).
- `ILFatawaPage.refresh()` recomputes chip counts from the current `FATAWA_DATA`.
- Strip the basmala from ayah 1 (surahs ≠ 1, ≠ 9) in `quran.js` and `quran-video.html`; `quran.js` shows it as a separate header.
- The reel maker records H.264 MP4 directly with `MediaRecorder` when the browser supports it (Chrome 126+, Safari); otherwise it labels the button «تحميل فيديو (WebM)». Canvas text is scaled to the export size and centred in the ayah box.
- Changed scripts get a `?v=` query to bypass stale caches.

## Consequences
No build step or new dependency; architecture unchanged.
