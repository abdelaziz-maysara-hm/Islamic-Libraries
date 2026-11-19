/* =============================================================
   صفحة الفتاوى — فلتر + بحث + pagination
   يعتمد على window.FATAWA_DATA و window.FATAWA_CATEGORIES
   ============================================================= */
(function () {
  var PER_PAGE = 15;
  var state = { category: 'all', query: '', page: 1, requestedFatwaId: null };
  var filterBuilt = false;

  function readUrlState() {
    try {
      var params = new URLSearchParams(location.search);
      state.category = params.get('category') || 'all';
      state.query = params.get('q') || '';
      state.page = Math.max(1, parseInt(params.get('page'), 10) || 1);
      state.requestedFatwaId = params.get('fatwa');
    } catch (e) {}
  }

  function syncUrl() {
    try {
      var params = new URLSearchParams(location.search);
      if (state.query.trim()) params.set('q', state.query.trim());
      else params.delete('q');
      if (state.category !== 'all') params.set('category', state.category);
      else params.delete('category');
      if (state.page > 1) params.set('page', String(state.page));
      else params.delete('page');
      var query = params.toString();
      history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);
    } catch (e) {}
  }

  function clearDeepLink() {
    state.requestedFatwaId = null;
    try {
      var params = new URLSearchParams(location.search);
      params.delete('fatwa');
      var query = params.toString();
      history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);
    } catch (e) {}
  }

  function normalizeArabic(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      .replace(/ـ/g, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
    var q = normalizeArabic(state.query);
    return getData().filter(function (f) {
      if (state.category !== 'all' && f.category !== state.category) return false;
      if (!q) return true;
      return normalizeArabic(f.q).indexOf(q) !== -1 ||
        normalizeArabic(f.a).indexOf(q) !== -1 ||
        normalizeArabic(f.source).indexOf(q) !== -1;
    });
  }

  function updateFilterButtons() {
    var filterEl = document.getElementById('fatwaCatFilter');
    if (!filterEl) return;
    filterEl.querySelectorAll('button[data-cat]').forEach(function (btn) {
      var active = btn.dataset.cat === state.category;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.style.background = active ? 'var(--teal-deep)' : 'var(--card)';
      btn.style.color = active ? '#fff' : 'var(--muted)';
      btn.style.borderColor = active ? 'var(--teal-deep)' : 'var(--line)';
    });
  }

  /* Recompute chip counts from the current dataset. Extra fatwa batches are
     loaded asynchronously by main.js after the chips are first built, so the
     counts must be refreshed when ILFatawaPage.refresh() runs. */
  function refreshFilterCounts() {
    var filterEl = document.getElementById('fatwaCatFilter');
    if (!filterEl) return;
    var data = getData();
    var counts = {};
    data.forEach(function (f) { counts[f.category] = (counts[f.category] || 0) + 1; });
    filterEl.querySelectorAll('button[data-cat]').forEach(function (btn) {
      var n = btn.dataset.cat === 'all' ? data.length : (counts[btn.dataset.cat] || 0);
      btn.textContent = (btn.dataset.label || '') + ' (' + n + ')';
    });
  }

  function buildFilters() {
    var filterEl = document.getElementById('fatwaCatFilter');
    if (!filterEl || filterBuilt) return;
    var cats = getCats();
    if (!cats.length) return;
    var counts = {};
    getData().forEach(function (f) {
      counts[f.category] = (counts[f.category] || 0) + 1;
    });

    function mkBtn(cat, label, count) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat-chip';
      btn.style.cssText = 'padding:7px 16px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--muted);font-family:Cairo,sans-serif;font-weight:700;font-size:12.5px;cursor:pointer;transition:background .2s,color .2s;';
      btn.dataset.cat = cat;
      btn.dataset.label = label;
      btn.textContent = label + ' (' + count + ')';
      return btn;
    }

    filterEl.innerHTML = '';
    filterEl.setAttribute('aria-label', 'تصفية الفتاوى حسب القسم');
    filterEl.appendChild(mkBtn('all', 'الكل', getData().length));
    cats.forEach(function (c) {
      filterEl.appendChild(mkBtn(c.id, (c.icon || '') + ' ' + c.label, counts[c.id] || 0));
    });
    filterEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-cat]');
      if (!btn) return;
      clearDeepLink();
      state.category = btn.dataset.cat;
      state.page = 1;
      render();
    });
    filterBuilt = true;
    updateFilterButtons();
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
    box.setAttribute('aria-label', 'صفحات نتائج الفتاوى');
    var html = '';
    html += '<button type="button" class="page-btn" data-page="prev"' + (state.page <= 1 ? ' disabled' : '') + '>السابق</button>';
    var start = Math.max(1, state.page - 2);
    var end = Math.min(totalPages, state.page + 2);
    if (start > 1) {
      html += '<button type="button" class="page-btn" data-page="1">1</button>';
      if (start > 2) html += '<span class="page-info">…</span>';
    }
    for (var i = start; i <= end; i++) {
      html += '<button type="button" class="page-btn' + (i === state.page ? ' active' : '') + '" data-page="' + i + '"' + (i === state.page ? ' aria-current="page"' : '') + '>' + i + '</button>';
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
        clearDeepLink();
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
    var sourceLink = f.source
      ? '<p class="source" style="font-size:12px;color:var(--muted);margin-top:8px;">المصدر: ' + escapeHtml(f.source) + '</p>'
      : '';
    return (
      '<div class="faq-item" id="fatwa-' + escapeHtml(f.id) + '" data-fatwa-id="' + escapeHtml(f.id) + '" data-cat="' + escapeHtml(f.category) + '">' +
      '<div class="faq-q" role="button" tabindex="0" aria-expanded="false"><span>' + escapeHtml(f.q) + '</span>' +
      '<small style="font-size:11px;color:var(--muted);font-weight:400;margin-right:6px;">' + catIcon(f.category) + '</small>' +
      '<span class="plus" aria-hidden="true">+</span></div>' +
      '<div class="faq-a"><p>' + escapeHtml(f.a) + '</p>' + sourceLink + '</div></div>'
    );
  }

  function setItemOpen(item, open) {
    item.classList.toggle('open', open);
    var question = item.querySelector('.faq-q');
    if (question) question.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function render() {
    var container = document.getElementById('fatwaContainer');
    var countEl = document.getElementById('fatwaCount');
    var staticSec = document.getElementById('fatwaStaticSection');
    if (!container) return;

    buildFilters();
    var validCategories = getCats().map(function (c) { return c.id; });
    if (state.category !== 'all' && validCategories.indexOf(state.category) === -1) state.category = 'all';
    updateFilterButtons();

    var list = filtered();
    var total = list.length;
    var totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    var requestedIndex = state.requestedFatwaId == null ? -1 : list.findIndex(function (f) {
      return String(f.id) === String(state.requestedFatwaId);
    });
    if (requestedIndex >= 0) state.page = Math.floor(requestedIndex / PER_PAGE) + 1;
    if (state.page > totalPages) state.page = totalPages;

    if (staticSec) staticSec.style.display = getData().length ? 'none' : '';

    if (!getData().length) {
      container.innerHTML = '<div class="empty-state" style="text-align:center;padding:40px;color:var(--muted)"><p>جاري تحميل الفتاوى...</p></div>';
      if (countEl) countEl.textContent = '';
      renderPagination(1);
      return;
    }

    syncUrl();

    if (!total) {
      container.innerHTML = '<div class="empty-state" style="text-align:center;padding:40px;color:var(--muted)"><p>لا توجد نتائج مطابقة. جرّب كلمة أخرى أو غيّر القسم.</p></div>';
      if (countEl) countEl.textContent = '0 نتائج';
      renderPagination(1);
      return;
    }

    var start = (state.page - 1) * PER_PAGE;
    var pageItems = list.slice(start, start + PER_PAGE);
    container.innerHTML = pageItems.map(renderItem).join('');

    if (requestedIndex >= 0) {
      var requestedItem = document.getElementById('fatwa-' + state.requestedFatwaId);
      if (requestedItem) {
        setItemOpen(requestedItem, true);
        requestedItem.setAttribute('tabindex', '-1');
        requestedItem.focus({ preventScroll: true });
        try { requestedItem.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
        state.requestedFatwaId = null;
      }
    }

    if (countEl) {
      countEl.textContent = state.query || state.category !== 'all'
        ? ('عرض ' + total + ' فتوى — صفحة ' + state.page + '/' + totalPages)
        : (getData().length + ' فتوى في الفهرس — صفحة ' + state.page + '/' + totalPages);
    }

    var h1 = document.querySelector('.hero h1');
    if (h1 && !state.query && state.category === 'all') {
      h1.textContent = getData().length + ' فتوى مصنفة ومنسوبة إلى مصادرها';
    }

    renderPagination(totalPages);
  }

  function bindSearch() {
    var searchEl = document.getElementById('fatwaSearch');
    if (!searchEl || searchEl.dataset.bound === '1') return;
    searchEl.dataset.bound = '1';
    searchEl.value = state.query;
    var timer = null;
    searchEl.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        clearDeepLink();
        state.query = searchEl.value || '';
        state.page = 1;
        render();
      }, 180);
    });
  }

  function bindReset() {
    var reset = document.getElementById('fatwaReset');
    if (!reset || reset.dataset.bound === '1') return;
    reset.dataset.bound = '1';
    reset.addEventListener('click', function () {
      clearDeepLink();
      state.category = 'all';
      state.query = '';
      state.page = 1;
      var searchEl = document.getElementById('fatwaSearch');
      if (searchEl) {
        searchEl.value = '';
        searchEl.focus();
      }
      render();
    });
  }

  function bindAccordion() {
    var container = document.getElementById('fatwaContainer');
    if (!container || container.dataset.bound === '1') return;
    container.dataset.bound = '1';

    function toggleQuestion(q) {
      var item = q.closest('.faq-item');
      if (!item) return;
      container.querySelectorAll('.faq-item.open').forEach(function (open) {
        if (open !== item) setItemOpen(open, false);
      });
      setItemOpen(item, !item.classList.contains('open'));
    }

    container.addEventListener('click', function (e) {
      var q = e.target.closest('.faq-q');
      if (q) toggleQuestion(q);
    });
    container.addEventListener('keydown', function (e) {
      var q = e.target.closest('.faq-q');
      if (!q || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      toggleQuestion(q);
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
    if (tries < 50) setTimeout(function () { waitAndRender(tries + 1); }, 200);
  }

  function init() {
    readUrlState();
    bindSearch();
    bindReset();
    bindAccordion();
    window.addEventListener('popstate', function () {
      readUrlState();
      var searchEl = document.getElementById('fatwaSearch');
      if (searchEl) searchEl.value = state.query;
      render();
    });
    waitAndRender(0);
  }

  window.ILFatawaPage = {
    refresh: function () {
      state.page = 1;
      refreshFilterCounts();
      render();
    },
    render: render
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
