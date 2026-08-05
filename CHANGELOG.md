# Changelog — المكتبة الجامعة

## 2026-08-05 — Favorites system

### Added
- **نظام المفضلة (Favorites)**
  - `assets/js/favorites.js` — localStorage فقط
  - API: `window.ILFavorites.toggle / isFavorite / get / addRecent / getRecent / clear`
- **آخر ما قرأت (Recent)** عند فتح روابط الشاملة / فتح فتوى
- **صفحة** `favorites.html` (كتب | فتاوى | أخيرًا)
- أزرار قلب على بطاقات الكتب في `books-all.html`
- أزرار قلب على الفتاوى (ديناميكية + ثابتة) عبر:
  - `assets/js/fatawa-favorites.js`
  - تحميل تلقائي من `main.js` على صفحات `fatawa*`
- روابط المفضلة في الهيدر (تُحقَن على صفحة الفتاوى)

### Fixed
- CI: `books-all.html: duplicate HTML id`
  - السبب: validator regex `\\bid=` يلتقط `data-id=` بالخطأ
  - الحل: بناء بطاقات الكتب بـ DOM APIs + `data-itemkey`

### Notes for next contributors
1. الشاملة لا تسمح بـ iframe لعرض الكتاب داخل الموقع.
2. شغّل `npm run validate` قبل أي commit.
3. لا تُولّد فتاوى/كتب بكميات كبيرة بدون تحقق من المصادر.
4. الخطوة المقترحة التالية: تحسين أدوات (حاسبة الزكاة) أو صفحات تفاصيل كتب.
