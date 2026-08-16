/* =============================================================
   صفحة الفتاوى — فلتر + بحث + pagination
   يعتمد على window.FATAWA_DATA و window.FATAWA_CATEGORIES
   ============================================================= */
(function () {
  var PER_PAGE = 15;
  var state = { category: 'all', query: '', page: 1 };
  var filterBuilt = false;

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  function getData() {
    return Array.isArray(window.FATAWA_DATA) ? window.FATAWA_DATA : [];
  }

  function getCats() {
    return Array.isArray(window.FATAWA_CATEGORIES) ? window.FATAWA_CATEGORIES : [];
  }

  function catIcon(id) {
    var c = getCats().find(function (x) { return x.id === id; });
    return c ? c.icon : '';
  }

  function filtered() {
    var q = state.query.trim();
    return getData().filter(function (f) {
      if (state.category !== 'all' && f.category !== state.category) return false;
      if (!q) return true;
      return String(f.q || '').indexOf(q) !== -1 || String(f.a || '').indexOf(q) !== -1;
    });
  }

  function buildFilters() {
    var filterEl = document.getElementById('fatwaCatFilter');
    if (!filterEl || filterBuilt) return;
    var cats = getCats();
    if (!cats.length) return;

    function mkBtn(cat, label, active) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat-chip' + (active ? ' active' : '');
      btn.style.cssText = 'padding:7px 16px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--muted);font-family:Cairo,sans-serif;font-weight:700;font-size:12.5px;cursor:pointer;transition:background .2s,color .2s;';
      btn.dataset.cat = cat;
      btn.textContent = label;
      if (active) {
        btn.style.background = 'var(--teal-deep)';
        btn.style.color = '#fff';
        btn.style.borderColor = 'var(--teal-deep)';
      }
      return btn;
    }

    filterEl.innerHTML = '';
    filterEl.appendChild(mkBtn('all', 'الكل', true));
    cats.forEach(function (c) {
      filterEl.appendChild(mkBtn(c.id, (c.icon || '') + ' ' + c.label, false));
    });
    filterEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-cat]');
      if (!btn) return;
      filterEl.querySelectorAll('button[data-cat]').forEach(function (b) {
        b.style.background = 'var(--card)';
        b.style.color = 'var(--muted)';
        b.style.borderColor = 'var(--line)';
      });
      btn.style.background = 'var(--teal-deep)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--teal-deep)';
      state.category = btn.dataset.cat || 'all';
      state.page = 1;
      render();
    });
    filterBuilt = true;
  }

  function renderPagination(totalPages) {
    var box = document.getElementById('fatwaPagination');
    if (!box) return;
    if (totalPages <= 1) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    box.hidden = false;
    var html = '';
    html += '<button type="button" class="page-btn" data-page="prev"' + (state.page <= 1 ? ' disabled' : '') + '>السابق</button>';
    var start = Math.max(1, state.page - 2);
    var end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    if (start > 1) {
      html += '<button type="button" class="page-btn" data-page="1">1</button>';
      if (start > 2) html += '<span class="page-info">…</span>';
    }
    for (var i = start; i <= end; i++) {
      html += '<button type="button" class="page-btn' + (i === state.page ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    if (end < totalPages) {
      if (end < totalPages - 1) html += '<span class="page-info">…</span>';
      html += '<button type="button" class="page-btn" data-page="' + totalPages + '">' + totalPages + '</button>';
    }
    html += '<button type="button" class="page-btn" data-page="next"' + (state.page >= totalPages ? ' disabled' : '') + '>التالي</button>';
    html += '<span class="page-info">صفحة ' + state.page + ' من ' + totalPages + '</span>';
    box.innerHTML = html;
    box.querySelectorAll('.page-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-page');
        if (val === 'prev') state.page = Math.max(1, state.page - 1);
        else if (val === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = parseInt(val, 10) || 1;
        render();
        try {
          document.getElementById('fatwaDynamicSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) {}
      });
    });
  }

  function renderItem(f) {
    var sourceLink = f.sourceUrl
      ? '<p><a href="' + escapeHtml(f.sourceUrl) + '" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:var(--gold-text);text-decoration:none;font-weight:700;">📚 المصدر: ' + escapeHtml(f.source || 'المصدر') + ' ←</a></p>'
      : (f.source ? '<p class="source">المصدر: ' + escapeHtml(f.source) + '</p>' : '');
    return (
      '<div class="faq-item" data-cat="' + escapeHtml(f.category) + '">' +
      '<div class="faq-q"><span>' + escapeHtml(f.q) + '</span>' +
      '<small style="font-size:11px;color:var(--muted);font-weight:400;margin-right:6px;">' + catIcon(f.category) + '</small>' +
      '<span class="plus">+</span></div>' +
      '<div class="faq-a"><p>' + escapeHtml(f.a) + '</p>' + sourceLink + '</div></div>'
    );
  }

  function render() {
    var container = document.getElementById('fatwaContainer');
    var countEl = document.getElementById('fatwaCount');
    var staticSec = document.getElementById('fatwaStaticSection');
    if (!container) return;

    buildFilters();
    var list = filtered();
    var total = list.length;
    var totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;

    if (staticSec) {
      staticSec.style.display = getData().length ? 'none' : '';
    }

    if (!getData().length) {
      container.innerHTML = '<div class="empty-state" style="text-align:center;padding:40px;color:var(--muted)"><p>جاري تحميل الفتاوى...</p></div>';
      if (countEl) countEl.textContent = '';
      renderPagination(1);
      return;
    }

    if (!total) {
      container.innerHTML = '<div class="empty-state" style="text-align:center;padding:40px;color:var(--muted)"><p>مفيش نتائج مطابقة. جرّب كلمة تانية أو غيّر القسم.</p></div>';
      if (countEl) countEl.textContent = '0 نتائج';
      renderPagination(1);
      return;
    }

    var start = (state.page - 1) * PER_PAGE;
    var pageItems = list.slice(start, start + PER_PAGE);
    container.innerHTML = pageItems.map(renderItem).join('');

    if (countEl) {
      countEl.textContent = state.query || state.category !== 'all'
        ? ('عرض ' + total + ' فتوى — صفحة ' + state.page + '/' + totalPages)
        : (getData().length + ' فتوى موثقة — صفحة ' + state.page + '/' + totalPages);
    }

    var h1 = document.querySelector('.hero h1');
    if (h1 && !state.query && state.category === 'all') {
      h1.textContent = getData().length + ' فتوى إسلامية موثقة بمصادرها';
    }

    renderPagination(totalPages);
  }

  function bindSearch() {
    var searchEl = document.getElementById('fatwaSearch');
    if (!searchEl || searchEl.dataset.bound === '1') return;
    searchEl.dataset.bound = '1';
    var timer = null;
    searchEl.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        state.query = searchEl.value || '';
        state.page = 1;
        render();
      }, 180);
    });
  }

  function bindAccordion() {
    var container = document.getElementById('fatwaContainer');
    if (!container || container.dataset.bound === '1') return;
    container.dataset.bound = '1';
    container.addEventListener('click', function (e) {
      var q = e.target.closest('.faq-q');
      if (!q) return;
      var item = q.closest('.faq-item');
      if (!item) return;
      container.querySelectorAll('.faq-item.open').forEach(function (open) {
        if (open !== item) open.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  }

  var lastCount = -1;
  function waitAndRender(tries) {
    tries = tries || 0;
    var n = getData().length;
    if (n !== lastCount) {
      lastCount = n;
      render();
    }
    if (tries < 50) {
      setTimeout(function () { waitAndRender(tries + 1); }, 200);
    }
  }

  function init() {
    bindSearch();
    bindAccordion();
    waitAndRender(0);
  }

  window.ILFatawaPage = {
    refresh: function () {
      state.page = 1;
      render();
    },
    render: render
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
