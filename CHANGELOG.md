# Changelog — المكتبة الجامعة

## [Unreleased] — feature/favorites-and-ux (2026-08-05)

### Added
- **نظام المفضلة (Favorites)**
  - ملف جديد: `assets/js/favorites.js`
  - تخزين محلي عبر `localStorage` (لا يُرسل أي بيانات لسيرفر)
  - دعم نوعين: `books` و `fatwas`
  - API عام: `window.ILFavorites.toggle / isFavorite / get / addRecent / getRecent / clear`

- **آخر ما قرأت (Recent)**
  - يُسجَّل تلقائيًا عند فتح رابط «اقرأ في الشاملة»
  - يحتفظ بآخر 20 عنصرًا

- **صفحة المفضلة**: `favorites.html`
  - تبويبات: الكتب المفضلة | الفتاوى المفضلة | آخر ما تصفحت
  - إمكانية إزالة العناصر من المفضلة
  - `noindex` (صفحة شخصية)

- أزرار قلب (♡ / ♥) على بطاقات الكتب في `books-all.html`
- روابط «المفضلة» في الهيدر والقائمة الموبايل وصفحة الكتب

### Fixed
- خطأ CI: `books-all.html: duplicate HTML id`
  - السبب: الـ validator يستخدم `\bid=` فيلتقط `data-id=` بالخطأ
  - الحل: استبدال `data-id` بـ `data-itemid` في القوالب

### Notes for next contributors
1. المفضلة للفتاوى جاهزة في الـ API لكنها غير مربوطة بواجهة الفتاوى بعد — الخطوة التالية المقترحة.
2. الشاملة لا تسمح بـ iframe؛ عرض الكتاب داخل الموقع يحتاج مصدر نصوص مفتوح أو قارئ مخصص لاحقًا.
3. أي صفحة HTML جديدة يجب أن تمر على `npm run validate` (canonical + sitemap + JSON-LD + لا تكرار ids حقيقية).
4. لا تُولِّد فتاوى/كتب بكميات كبيرة بدون تحقق يدوي من المصادر.

### Files touched
- `assets/js/favorites.js` (new)
- `favorites.html` (new)
- `books-all.html` (favorite buttons + recent tracking)
- `sitemap.xml` (added favorites.html)
- `CHANGELOG.md` (this file)
