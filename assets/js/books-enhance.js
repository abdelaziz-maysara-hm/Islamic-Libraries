/* يضيف رابط «صفحة الكتاب» لكل بطاقة في books-all بعد الرندر */
(function () {
  function run() {
    var grid = document.getElementById('booksGrid');
    if (!grid) return;
    var books = window.ALL_BOOKS || [];
    var byTitle = {};
    books.forEach(function (b) { byTitle[b.title] = b; });

    grid.querySelectorAll('.book-card-item').forEach(function (card) {
      if (card.querySelector('.book-detail-link')) return;
      var titleEl = card.querySelector('.book-title');
      if (!titleEl) return;
      var title = titleEl.textContent.trim();
      var meta = byTitle[title];
      if (!meta) return;

      var a = document.createElement('a');
      a.className = 'book-link book-detail-link';
      a.href = 'book.html?book=' + meta.id;
      a.textContent = '📄 صفحة الكتاب';
      a.style.color = 'var(--teal)';

      var shamelaLink = card.querySelector('.book-link');
      if (shamelaLink) card.insertBefore(a, shamelaLink);
      else card.appendChild(a);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 80); });
  } else {
    setTimeout(run, 80);
  }
})();
