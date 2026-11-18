/* =============================================================
   صفحة تفاصيل الكتاب — book.html?book=N  (أو ?id=N)
   ============================================================= */
(function () {
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function qs(name) {
    try {
      return new URLSearchParams(location.search).get(name);
    } catch (e) {
      return null;
    }
  }

  function catLabel(id) {
    const cats = window.BOOKS_CATEGORIES || [];
    const c = cats.find(function (x) { return x.id === id; });
    return c ? (c.icon + ' ' + c.label) : id;
  }

  function render() {
    const root = document.getElementById('bookPage');
    if (!root) return;

    const books = window.ALL_BOOKS || [];
    const id = qs('book') || qs('id');
    const book = books.find(function (b) { return String(b.id) === String(id); });

    if (!book) {
      root.innerHTML =
        '<div class="wrap" style="padding:40px 20px;text-align:center">' +
        '<h1>الكتاب غير موجود</h1>' +
        '<p style="color:var(--muted)">تأكد من الرابط أو ارجع لقائمة الكتب.</p>' +
        '<p style="margin-top:16px"><a href="books-all.html" style="color:var(--teal);font-weight:700">تصفح كل الكتب ←</a></p>' +
        '</div>';
      return;
    }

    const safeTitle = escapeHtml(book.title);
    const safeAuthor = escapeHtml(book.author);
    const safeCategory = escapeHtml(catLabel(book.category));
    const shamelaId = String(book.shamela || '').trim();
    const safeShamela = encodeURIComponent(shamelaId);
    const hasShamela = Boolean(shamelaId);
    const sourceUrl = hasShamela ? 'https://shamela.ws/book/' + safeShamela : '';
    const pageUrl = location.origin + location.pathname + '?book=' + encodeURIComponent(String(book.id));
    const pageDescription = book.title + ' لـ ' + book.author + ' — بيانات الكتاب والمصدر وكتب ذات صلة في المكتبة الجامعة.';

    document.title = book.title + ' — ' + book.author + ' | المكتبة الجامعة';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', pageDescription);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', pageUrl);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', pageUrl);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', book.title + ' — المكتبة الجامعة');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', pageDescription);

    const structured = document.createElement('script');
    structured.type = 'application/ld+json';
    structured.id = 'bookStructuredData';
    structured.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: { '@type': 'Person', name: book.author },
      genre: catLabel(book.category),
      url: pageUrl,
      inLanguage: 'ar',
      sameAs: sourceUrl || undefined,
      isPartOf: { '@type': 'CollectionPage', url: 'https://islamiclibraries.com/books.html' }
    });
    document.head.appendChild(structured);

    const isFav = window.ILFavorites && window.ILFavorites.isFavorite('book', book.id);
    const byAuthor = books
      .filter(function (b) { return b.author === book.author && b.id !== book.id; })
      .slice(0, 6);
    const related = books
      .filter(function (b) { return b.category === book.category && b.id !== book.id && b.author !== book.author; })
      .slice(0, 6);

    if (window.ILFavorites) {
      window.ILFavorites.addRecent('book', book.id, {
        title: book.title,
        author: book.author,
        category: book.category,
        shamela: book.shamela
      });
    }

    let byAuthorHtml = '';
    if (byAuthor.length) {
      byAuthorHtml = '<div class="section-head"><span class="eyebrow">لنفس المؤلف</span><h2>كتب أخرى لـ' + safeAuthor + '</h2></div>' +
        '<div class="books-grid">' +
        byAuthor.map(function (b) {
          return '<a class="book-card-item" href="book.html?book=' + encodeURIComponent(String(b.id)) + '" style="text-decoration:none">' +
            '<span class="book-cat-badge">' + escapeHtml(catLabel(b.category)) + '</span>' +
            '<span class="book-title">' + escapeHtml(b.title) + '</span>' +
            '<span class="book-author">✍️ ' + escapeHtml(b.author) + '</span>' +
            '</a>';
        }).join('') +
        '</div>';
    }

    let relatedHtml = '';
    if (related.length) {
      relatedHtml = '<div class="section-head" style="margin-top:36px"><span class="eyebrow">من نفس القسم</span><h2>كتب ذات صلة</h2></div>' +
        '<div class="books-grid">' +
        related.map(function (b) {
          return '<a class="book-card-item" href="book.html?book=' + encodeURIComponent(String(b.id)) + '" style="text-decoration:none">' +
            '<span class="book-cat-badge">' + escapeHtml(catLabel(b.category)) + '</span>' +
            '<span class="book-title">' + escapeHtml(b.title) + '</span>' +
            '<span class="book-author">✍️ ' + escapeHtml(b.author) + '</span>' +
            '</a>';
        }).join('') +
        '</div>';
    }

    root.innerHTML =
      '<section class="hero" style="padding-bottom:10px">' +
      '<div class="wrap">' +
      '<span class="crumb"><a href="books.html">الكتب</a> ← <a href="books-all.html">الكل</a> ← ' + safeTitle + '</span>' +
      '<span class="eyebrow">' + safeCategory + '</span>' +
      '<h1>' + safeTitle + '</h1>' +
      '<p style="font-size:16px">✍️ ' + safeAuthor + '</p>' +
      '<div class="book-actions">' +
      (hasShamela ? '<a class="btn-calc" style="text-decoration:none;display:inline-block" href="' + sourceUrl + '" target="_blank" rel="noopener noreferrer">📖 اقرأ في المكتبة الشاملة</a>' : '') +
      '<button type="button" class="fav-btn-page book-secondary-btn' + (isFav ? ' is-fav' : '') + '" id="bookFavBtn">' +
      (isFav ? '♥ في المفضلة' : '♡ أضف للمفضلة') +
      '</button>' +
      '<button type="button" class="book-secondary-btn" id="bookShareBtn">↗ مشاركة الكتاب</button>' +
      '</div>' +
      '<div class="book-source-panel" aria-label="بيانات مصدر الكتاب">' +
      '<div class="book-source-grid">' +
      '<div class="book-source-item"><span>مصدر القراءة</span><strong>' + (hasShamela ? 'المكتبة الشاملة' : 'غير متاح حاليًا') + '</strong></div>' +
      '<div class="book-source-item"><span>حالة الرابط</span><strong>' + (hasShamela ? 'مدرج — بانتظار التحقق اليدوي' : 'لا يوجد رابط قراءة') + '</strong></div>' +
      '<div class="book-source-item"><span>القراءة داخل الموقع</span><strong>قيد التنسيق مع المصدر</strong></div>' +
      '</div></div>' +
      '<p class="book-reader-note"><strong>لماذا يفتح المصدر خارجيًا الآن؟</strong> نعمل على إتاحة قارئ داخل المكتبة الجامعة بعد الحصول على إذن مكتوب وطريقة تكامل معتمدة من المكتبة الشاملة، مع الحفاظ على حقوق الكتب ونسبة النصوص إلى مصادرها.</p>' +
      '</div></section>' +
      '<section style="padding-top:10px"><div class="wrap">' + byAuthorHtml + relatedHtml + '</div></section>';

    const shareBtn = document.getElementById('bookShareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        const shareData = { title: book.title + ' — المكتبة الجامعة', text: book.title + ' لـ ' + book.author, url: pageUrl };
        if (navigator.share) {
          navigator.share(shareData).catch(function () {});
          return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(pageUrl).then(function () {
            shareBtn.textContent = '✓ تم نسخ الرابط';
            setTimeout(function () { shareBtn.textContent = '↗ مشاركة الكتاب'; }, 1800);
          }).catch(function () {});
        }
      });
    }

    const favBtn = document.getElementById('bookFavBtn');
    if (favBtn && window.ILFavorites) {
      favBtn.addEventListener('click', function () {
        const added = window.ILFavorites.toggle('book', book.id, {
          title: book.title,
          author: book.author,
          category: book.category,
          shamela: book.shamela
        });
        favBtn.textContent = added ? '♥ في المفضلة' : '♡ أضف للمفضلة';
        favBtn.classList.toggle('is-fav', added);
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
