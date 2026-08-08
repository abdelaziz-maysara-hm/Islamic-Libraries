// ============ Progressive web app bootstrap ============
(function initializeProgressiveWebApp() {
  const root = window.SITE_ROOT || '';

  if (!document.querySelector('link[rel="manifest"]')) {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = `${root}manifest.webmanifest`;
    document.head.appendChild(manifestLink);
  }

  if (!document.querySelector('meta[name="theme-color"]')) {
    const themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#0E3B36';
    document.head.appendChild(themeColor);
  }

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${root}sw.js`, { updateViaCache: 'none' }).catch(() => {});
    }, { once: true });
  }
})();
// ============ Dark mode toggle ============
(function() {
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  toggleBtn.setAttribute('aria-label', 'تبديل الوضع الليلي');

  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    toggleBtn.textContent = dark ? '☀️' : '🌙';
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch(e){}
  }

  let saved = '';
  try { saved = localStorage.getItem('theme'); } catch(e){}
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);

  toggleBtn.addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
  });

  function injectToggle() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const menuBtn = nav.querySelector('.menu-btn');
    if (menuBtn) nav.insertBefore(toggleBtn, menuBtn);
    else nav.appendChild(toggleBtn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggle);
  } else {
    injectToggle();
  }
})();

// ============ Main init after DOM ready ============
document.addEventListener('DOMContentLoaded', () => {

  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      menuBtn.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
    });
  }

  const ROOT = window.SITE_ROOT || "";

  function normalizeSearchText(value) {
    return String(value || '')
      .normalize('NFKD')
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      .replace(/[إأآٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ـ/g, '')
      .toLocaleLowerCase('ar')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function scoreSearchValue(value, query, weights) {
    const normalized = normalizeSearchText(value);
    if (!normalized) return 0;
    if (normalized === query) return weights.exact;
    if (normalized.startsWith(query)) return weights.starts;
    if (normalized.includes(query)) return weights.includes;
    const queryTokens = query.split(' ').filter(Boolean);
    const valueTokens = normalized.split(' ');
    const matchedTokens = queryTokens.filter(token =>
      valueTokens.some(valueToken => valueToken === token || valueToken.startsWith(token))
    ).length;
    return matchedTokens === queryTokens.length ? weights.tokens : 0;
  }

  function scoreSearchItem(item, query) {
    let score = scoreSearchValue(item.title, query, { exact: 120, starts: 90, includes: 70, tokens: 50 });
    (item.tags || []).forEach(tag => {
      score = Math.max(score, scoreSearchValue(tag, query, { exact: 55, starts: 40, includes: 30, tokens: 20 }));
    });
    score += scoreSearchValue(item.type, query, { exact: 16, starts: 12, includes: 8, tokens: 6 });
    return score;
  }

  function findBestTopic(rawQuery) {
    const query = normalizeSearchText(rawQuery);
    if (!query) return null;
    const ranked = (window.TOPIC_INDEX || []).map(topic => {
      let score = scoreSearchValue(topic.title, query, { exact: 120, starts: 90, includes: 70, tokens: 50 });
      (topic.keywords || []).forEach(keyword => {
        score = Math.max(score, scoreSearchValue(keyword, query, { exact: 60, starts: 45, includes: 30, tokens: 20 }));
      });
      return { topic, score };
    }).sort((a, b) => b.score - a.score);
    return ranked[0] && ranked[0].score > 0 ? ranked[0].topic : null;
  }

  function renderTopicCard(topic) {
    const booksHtml = topic.books.slice(0, 3).map(b =>
      `<a href="${b.url}" target="_blank" rel="noopener noreferrer" style="display:block; padding:6px 0; font-size:12.5px;">
        ⬇ ${b.name} <span style="color:var(--muted);">— ${b.author}</span> ${b.verified ? '✅' : ''}
      </a>`
    ).join('');
    return `
      <div style="padding:16px; border-bottom:2px solid var(--teal-soft);">
        <span class="sr-tag">📝 إجابة سريعة: ${topic.title}</span>
        <p style="font-size:13px; color:var(--text); line-height:1.8; margin:8px 0 10px;">${topic.summary}</p>
        ${booksHtml ? `<div style="margin-bottom:8px;"><strong style="font-size:12px;">أفضل الكتب المتاحة:</strong>${booksHtml}</div>` : ''}
        <a href="${ROOT}${topic.url}" style="font-size:12.5px; font-weight:800; color:var(--teal);">عرض التفاصيل الكاملة ←</a>
      </div>`;
  }

  document.querySelectorAll('[data-search-input]').forEach(input => {
    const resultsBox = input.closest('.search-box').querySelector('.search-results');
    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (!q) { resultsBox.classList.remove('show'); resultsBox.innerHTML = ''; return; }
      const normalizedQuery = normalizeSearchText(q);
      const topic = findBestTopic(normalizedQuery);
      const matches = (window.SITE_INDEX || [])
        .map((item, index) => ({ item, index, score: scoreSearchItem(item, normalizedQuery) }))
        .filter(entry => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .slice(0, 6)
        .map(entry => entry.item);
      let html = '';
      if (topic) html += renderTopicCard(topic);
      if (matches.length === 0 && !topic) html = '<div class="search-empty">لا توجد نتائج مطابقة</div>';
      else if (matches.length > 0) html += matches.map(m => `<a href="${ROOT}${m.url}"><span class="sr-tag">${m.type}</span>${m.title}</a>`).join('');
      resultsBox.innerHTML = html;
      resultsBox.classList.add('show');
    });
    document.addEventListener('click', (e) => {
      if (!input.closest('.search-box').contains(e.target)) resultsBox.classList.remove('show');
    });
  });

  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      item.closest('.fatwa-cat') && item.closest('.fatwa-cat').querySelectorAll('.faq-item.open').forEach(open => {
        if (open !== item) open.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  });

});

// ============ Accessibility hardening ============
(function initializeAccessibility() {
  function init() {
    const main = document.querySelector('main');
    if (main) {
      if (!main.id) main.id = 'main-content';
      main.setAttribute('tabindex', '-1');
      const skipLink = document.createElement('a');
      skipLink.className = 'skip-link';
      skipLink.href = `#${main.id}`;
      skipLink.textContent = 'تخطَّ إلى المحتوى';
      document.body.prepend(skipLink);
    }
    function secureExternalLink(link) {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', Array.from(rel).join(' '));
    }
    document.querySelectorAll('a[target="_blank"]').forEach(secureExternalLink);
    document.addEventListener('click', event => {
      const externalLink = event.target.closest('a[target="_blank"]');
      if (externalLink) secureExternalLink(externalLink);
    }, { capture: true });

    const menuButton = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuButton && mobileMenu) {
      menuButton.type = 'button';
      menuButton.setAttribute('aria-controls', mobileMenu.id);
      menuButton.setAttribute('aria-expanded', String(mobileMenu.classList.contains('open')));
      menuButton.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', String(mobileMenu.classList.contains('open')));
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// ============ Favorites bootstrap on fatawa pages ============
(function loadFatawaFavorites() {
  const path = (location.pathname || '').toLowerCase();
  if (!path.includes('fatawa')) return;
  const root = window.SITE_ROOT || '';
  function load(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject();
      document.body.appendChild(s);
    });
  }
  const run = () => {
    load(root + 'assets/js/favorites.js')
      .then(() => load(root + 'assets/js/fatawa-favorites.js'))
      .catch(() => {});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

// ============ Global favorites link in nav/footer ============
(function injectFavoritesNav() {
  function addLink(container) {
    if (!container) return;
    if (container.querySelector('a[href="favorites.html"], a[href$="/favorites.html"]')) return;
    const a = document.createElement('a');
    a.href = (window.SITE_ROOT || '') + 'favorites.html';
    a.textContent = 'المفضلة';
    container.appendChild(a);
  }
  function run() {
    addLink(document.querySelector('.nav-links'));
    addLink(document.getElementById('mobileMenu'));
    addLink(document.querySelector('.footer-links'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
