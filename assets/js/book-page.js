/* =============================================================
   صفحة تفاصيل الكتاب — book.html?id=N
   ============================================================= */
(function () {
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
    const id = qs('id');
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

    document.title = book.title + ' — ' + book.author + ' | المكتبة الجامعة';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', book.title + ' لـ ' + book.author + ' — قراءة عبر المكتبة الشاملة من المكتبة الجامعة');

    const isFav = window.ILFavorites && window.ILFavorites.isFavorite('book', book.id);
    const related = books
      .filter(function (b) { return b.category === book.category && b.id !== book.id; })
      .slice(0, 6);

    if (window.ILFavorites) {
      window.ILFavorites.addRecent('book', book.id, {
        title: book.title,
        author: book.author,
        category: book.category,
        shamela: book.shamela
      });
    }

    let relatedHtml = '';
    if (related.length) {
      relatedHtml = '<div class="section-head" style="margin-top:36px"><span class="eyebrow">من نفس القسم</span><h2>كتب ذات صلة</h2></div>' +
        '<div class="books-grid">' +
        related.map(function (b) {
          return '<a class="book-card-item" href="book.html?id=' + b.id + '" style="text-decoration:none">' +
            '<span class="book-cat-badge">' + catLabel(b.category) + '</span>' +
            '<span class="book-title">' + b.title + '</span>' +
            '<span class="book-author">✍️ ' + b.author + '</span>' +
            '</a>';
        }).join('') +
        '</div>';
    }

    root.innerHTML =
      '<section class="hero" style="padding-bottom:10px">' +
      '<div class="wrap">' +
      '<span class="crumb"><a href="books.html">الكتب</a> ← <a href="books-all.html">الكل</a> ← ' + book.title + '</span>' +
      '<span class="eyebrow">' + catLabel(book.category) + '</span>' +
      '<h1>' + book.title + '</h1>' +
      '<p style="font-size:16px">✍️ ' + book.author + '</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;align-items:center">' +
      '<a class="btn-calc" style="text-decoration:none;display:inline-block" href="https://shamela.ws/book/' + book.shamela + '" target="_blank" rel="noopener noreferrer">📖 اقرأ في المكتبة الشاملة</a>' +
      '<button type="button" class="fav-btn-page' + (isFav ? ' is-fav' : '') + '" id="bookFavBtn" style="padding:12px 18px;border-radius:10px;border:1px solid var(--line);background:var(--card);cursor:pointer;font-family:Cairo,sans-serif;font-weight:700">' +
      (isFav ? '♥ في المفضلة' : '♡ أضف للمفضلة') +
      '</button>' +
      '</div>' +
      '<p style="margin-top:16px;font-size:13px;color:var(--muted);line-height:1.8">النص الكامل يُعرض عبر <strong>المكتبة الشاملة</strong> (مصدر موثوق). لا يمكن تضمين صفحات الشاملة داخل الموقع بسبب حماية المصدر.</p>' +
      '</div></section>' +
      '<section style="padding-top:10px"><div class="wrap">' + relatedHtml + '</div></section>';

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
