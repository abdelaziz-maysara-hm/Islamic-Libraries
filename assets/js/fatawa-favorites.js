/* =============================================================
   مفضلة الفتاوى — يُحمَّل بعد fatawa-data.js و favorites.js
   يضيف أزرار ♡ على الفتاوى الديناميكية + يحدّث الهيدر
   ============================================================= */
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function injectNavLink() {
    var nav = document.querySelector('.nav-links');
    if (nav && !nav.querySelector('a[href="favorites.html"]')) {
      var a = document.createElement('a');
      a.href = 'favorites.html';
      a.textContent = 'المفضلة';
      nav.appendChild(a);
    }
    var mobile = document.getElementById('mobileMenu');
    if (mobile && !mobile.querySelector('a[href="favorites.html"]')) {
      var m = document.createElement('a');
      m.href = 'favorites.html';
      m.textContent = 'المفضلة';
      mobile.appendChild(m);
    }
    var footer = document.querySelector('.footer-links');
    if (footer && !footer.querySelector('a[href="favorites.html"]')) {
      var f = document.createElement('a');
      f.href = 'favorites.html';
      f.textContent = 'المفضلة';
      footer.appendChild(f);
    }
  }

  function styleBtn(btn, isFav) {
    btn.textContent = isFav ? '♥' : '♡';
    btn.setAttribute('aria-label', isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة');
    btn.title = isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة';
    btn.style.cssText =
      'flex-shrink:0;background:var(--card);border:1px solid var(--line);border-radius:50%;' +
      'width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;' +
      'cursor:pointer;font-size:14px;line-height:1;margin-left:8px;';
    if (isFav) {
      btn.style.background = 'var(--gold-soft, #f5e6c8)';
      btn.style.borderColor = 'var(--gold, #c9a227)';
    }
  }

  function enhanceDynamicFatwas() {
    if (!window.ILFavorites || !window.FATAWA_DATA) return;
    var container = document.getElementById('fatwaContainer');
    if (!container) return;

    var byQ = {};
    (window.FATAWA_DATA || []).forEach(function (f) {
      byQ[f.q] = f;
    });

    container.querySelectorAll('.faq-item').forEach(function (item) {
      if (item.querySelector('.fav-fatwa-btn')) return;
      var qEl = item.querySelector('.faq-q span');
      if (!qEl) return;
      var qText = qEl.textContent.trim();
      var meta = byQ[qText] || byQ[item.dataset.q] || null;
      var fid = meta ? meta.id : ('q-' + qText.slice(0, 40));
      var title = meta ? meta.q : qText;
      var category = meta ? meta.category : (item.dataset.cat || '');

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fav-fatwa-btn';
      btn.setAttribute('data-itemkey', String(fid));
      btn.setAttribute('data-title', title);
      btn.setAttribute('data-category', category);
      var isFav = window.ILFavorites.isFavorite('fatwa', fid);
      styleBtn(btn, isFav);

      var qRow = item.querySelector('.faq-q');
      if (qRow) {
        // ضع الزر قبل علامة +
        var plus = qRow.querySelector('.plus');
        if (plus) qRow.insertBefore(btn, plus);
        else qRow.appendChild(btn);
      }

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var added = window.ILFavorites.toggle('fatwa', btn.getAttribute('data-itemkey'), {
          title: btn.getAttribute('data-title'),
          category: btn.getAttribute('data-category')
        });
        styleBtn(btn, added);
      });
    });
  }

  function enhanceStaticFatwas() {
    if (!window.ILFavorites) return;
    var staticSec = document.getElementById('fatwaStaticSection');
    if (!staticSec) return;

    staticSec.querySelectorAll('.faq-item').forEach(function (item, idx) {
      if (item.querySelector('.fav-fatwa-btn')) return;
      var qEl = item.querySelector('.faq-q span');
      if (!qEl) return;
      var title = qEl.textContent.trim();
      var fid = 'static-' + idx + '-' + title.slice(0, 24);
      var catEl = item.closest('.fatwa-cat');
      var category = catEl && catEl.querySelector('h3') ? catEl.querySelector('h3').textContent.trim() : '';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fav-fatwa-btn';
      btn.setAttribute('data-itemkey', fid);
      btn.setAttribute('data-title', title);
      btn.setAttribute('data-category', category);
      styleBtn(btn, window.ILFavorites.isFavorite('fatwa', fid));

      var qRow = item.querySelector('.faq-q');
      if (qRow) {
        var plus = qRow.querySelector('.plus');
        if (plus) qRow.insertBefore(btn, plus);
        else qRow.appendChild(btn);
      }

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var added = window.ILFavorites.toggle('fatwa', btn.getAttribute('data-itemkey'), {
          title: btn.getAttribute('data-title'),
          category: btn.getAttribute('data-category')
        });
        styleBtn(btn, added);
      });
    });
  }

  function trackRecentOnOpen() {
    if (!window.ILFavorites) return;
    var container = document.getElementById('fatwaContainer');
    if (!container) return;
    container.addEventListener('click', function (e) {
      var q = e.target.closest('.faq-q');
      if (!q || e.target.closest('.fav-fatwa-btn')) return;
      var item = q.closest('.faq-item');
      if (!item) return;
      var btn = item.querySelector('.fav-fatwa-btn');
      if (!btn) return;
      window.ILFavorites.addRecent('fatwa', btn.getAttribute('data-itemkey'), {
        title: btn.getAttribute('data-title'),
        category: btn.getAttribute('data-category')
      });
    });
  }

  ready(function () {
    injectNavLink();
    // انتظر قليلاً حتى ينتهي رندر الصفحة الأصلي
    setTimeout(function () {
      enhanceDynamicFatwas();
      enhanceStaticFatwas();
      trackRecentOnOpen();
    }, 50);
  });
})();
