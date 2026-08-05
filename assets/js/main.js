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
// ============ Dark mode toggle (injected via JS — no need to edit all HTML files) ============
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

  // ---- Mobile menu ----
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      menuBtn.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
    });
  }

  // ---- Site-wide search ----
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
    let score = scoreSearchValue(item.title, query, {
      exact: 120, starts: 90, includes: 70, tokens: 50,
    });
    (item.tags || []).forEach(tag => {
      score = Math.max(score, scoreSearchValue(tag, query, {
        exact: 55, starts: 40, includes: 30, tokens: 20,
      }));
    });
    score += scoreSearchValue(item.type, query, {
      exact: 16, starts: 12, includes: 8, tokens: 6,
    });
    return score;
  }

  function findBestTopic(rawQuery) {
    const query = normalizeSearchText(rawQuery);
    if (!query) return null;
    const ranked = (window.TOPIC_INDEX || []).map(topic => {
      let score = scoreSearchValue(topic.title, query, {
        exact: 120, starts: 90, includes: 70, tokens: 50,
      });
      (topic.keywords || []).forEach(keyword => {
        score = Math.max(score, scoreSearchValue(keyword, query, {
          exact: 60, starts: 45, includes: 30, tokens: 20,
        }));
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

  const inputs = document.querySelectorAll('[data-search-input]');
  inputs.forEach(input => {
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

      if (matches.length === 0 && !topic) {
        html = '<div class="search-empty">لا توجد نتائج مطابقة</div>';
      } else if (matches.length > 0) {
        html += matches.map(m =>
          `<a href="${ROOT}${m.url}"><span class="sr-tag">${m.type}</span>${m.title}</a>`
        ).join('');
      }
      resultsBox.innerHTML = html;
      resultsBox.classList.add('show');
    });
    document.addEventListener('click', (e) => {
      if (!input.closest('.search-box').contains(e.target)) resultsBox.classList.remove('show');
    });
  });

  // ---- Fatwa accordion ----
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      item.closest('.fatwa-cat') && item.closest('.fatwa-cat').querySelectorAll('.faq-item.open').forEach(open => {
        if (open !== item) open.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  });

  // ---- TOC sidebar (auto-generated from page headings) ----
  (function buildTOC() {
    const headings = document.querySelectorAll('section h2[id], section h3[id], section h2:not([id]), section h3:not([id])');
    const eligible = Array.from(headings).filter(h => {
      const text = h.textContent.trim();
      return text.length > 2 && text.length < 60;
    });
    if (eligible.length < 3) return;

    eligible.forEach((h, i) => {
      if (!h.id) h.id = 'toc-' + i;
    });

    const toc = document.createElement('div');
    toc.className = 'toc-sidebar';
    toc.innerHTML = '<h4>📋 محتويات الصفحة</h4>';

    eligible.forEach(h => {
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.replace(/^[\u{1F300}-\u{1FFFF}\u{2600}-\u{27FF}🕌🌙🕋💰🏛️🍽️👗⚖️🚫🤝📚🎬📝💡📿🔔💬📖]/gu, '').trim();
      if (h.tagName === 'H3') a.classList.add('toc-h3');
      toc.appendChild(a);
    });

    document.body.appendChild(toc);
    toc.style.display = 'block';

    const tocLinks = toc.querySelectorAll('a');
    function highlightActive() {
      let current = eligible[0] && eligible[0].id;
      eligible.forEach(h => {
        if (window.scrollY + 140 >= h.offsetTop) current = h.id;
      });
      tocLinks.forEach(a => {
        a.classList.toggle('toc-active', a.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', highlightActive, { passive: true });
    highlightActive();
  })();

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
      skipLink.textContent = '\u062a\u062e\u0637\u0651\u064e \u0625\u0644\u0649 \u0627\u0644\u0645\u062d\u062a\u0648\u0649';
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

    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.type = 'button';
      themeToggle.setAttribute('aria-label', '\u062a\u0628\u062f\u064a\u0644 \u0646\u0645\u0637 \u0627\u0644\u0623\u0644\u0648\u0627\u0646');
      const syncThemeState = () => themeToggle.setAttribute(
        'aria-pressed',
        String(document.documentElement.getAttribute('data-theme') === 'dark'),
      );
      syncThemeState();
      new MutationObserver(syncThemeState).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    }

    const menuButton = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuButton && mobileMenu) {
      menuButton.type = 'button';
      menuButton.setAttribute('aria-controls', mobileMenu.id);
      menuButton.setAttribute('aria-expanded', String(mobileMenu.classList.contains('open')));
      menuButton.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', String(mobileMenu.classList.contains('open')));
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          menuButton.setAttribute('aria-expanded', 'false');
          menuButton.textContent = '\u2630';
          menuButton.focus();
        }
      });
    }

    document.querySelectorAll('[data-search-input]').forEach((input, index) => {
      const searchBox = input.closest('.search-box');
      const results = searchBox && searchBox.querySelector('.search-results');
      if (!results) return;
      if (!results.id) results.id = `search-results-${index + 1}`;
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-controls', results.id);
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-expanded', String(results.classList.contains('show')));
      results.setAttribute('role', 'region');
      results.setAttribute('aria-live', 'polite');
      results.setAttribute('aria-label', '\u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0628\u062d\u062b');

      input.addEventListener('input', () => {
        input.setAttribute('aria-expanded', String(results.classList.contains('show')));
      });
      input.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          results.classList.remove('show');
          input.setAttribute('aria-expanded', 'false');
        }
      });
      document.addEventListener('click', event => {
        if (!searchBox.contains(event.target)) input.setAttribute('aria-expanded', 'false');
      });
    });

    function prepareFaqControl(control) {
      const item = control.closest('.faq-item');
      const answer = item && item.querySelector('.faq-a');
      control.setAttribute('role', 'button');
      control.setAttribute('tabindex', '0');
      control.setAttribute('aria-expanded', String(Boolean(item && item.classList.contains('open'))));
      if (answer) {
        if (!answer.id) answer.id = `faq-answer-${Math.random().toString(36).slice(2, 9)}`;
        control.setAttribute('aria-controls', answer.id);
      }
    }

    document.querySelectorAll('.faq-q').forEach(prepareFaqControl);
    const faqContainer = document.getElementById('fatwaContainer');
    if (faqContainer) {
      new MutationObserver(() => {
        faqContainer.querySelectorAll('.faq-q:not([role="button"])').forEach(prepareFaqControl);
      }).observe(faqContainer, { childList: true, subtree: true });
    }
    document.addEventListener('click', event => {
      const control = event.target.closest('.faq-q');
      if (!control) return;
      const item = control.closest('.faq-item');
      queueMicrotask(() => control.setAttribute('aria-expanded', String(item.classList.contains('open'))));
    });
    document.addEventListener('keydown', event => {
      const control = event.target.closest('.faq-q');
      if (!control || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      control.click();
    });
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
