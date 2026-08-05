# Changelog — المكتبة الجامعة

## [Unreleased] / 2026-08-05 — Favorites system

### Added
- **نظام المفضلة (Favorites)**
  - ملف: `assets/js/favorites.js`
  - تخزين محلي عبر `localStorage` فقط (لا سيرفر)
  - API: `window.ILFavorites.toggle / isFavorite / get / addRecent / getRecent / clear`
- **آخر ما قرأت (Recent)** — يُسجَّل عند فتح رابط الشاملة
- **صفحة** `favorites.html` (تبويبات: كتب | فتاوى | أخيرًا)
- أزرار قلب على بطاقات الكتب في `books-all.html`
- روابط المفضلة في الهيدر والقائمة

### Fixed
- CI: `books-all.html: duplicate HTML id`
  - السبب: validator regex `\\bid=` يلتقط `data-id=` و`data-book-id=` بالخطأ
  - الحل: بناء بطاقات الكتب بـ DOM APIs + `data-itemkey` / `data-bookkey` بدل attributes داخل template strings

### Notes for next contributors
1. المفضلة للفتاوى جاهزة في الـ API وغير مربوطة بواجهة الفتاوى بعد.
2. الشاملة لا تسمح بـ iframe لعرض الكتاب داخل الموقع.
3. شغّل `npm run validate` قبل أي commit.
4. لا تُولّد فتاوى/كتب بكميات كبيرة بدون تحقق من المصادر.
