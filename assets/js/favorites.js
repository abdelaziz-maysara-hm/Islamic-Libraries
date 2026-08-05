/* =============================================================
   نظام المفضلة وآخر ما قرأت — localStorage
   ============================================================= */
(function () {
  const STORAGE_KEY = 'il_favorites_v1';
  const RECENT_KEY  = 'il_recent_v1';
  const MAX_RECENT  = 20;

  function safeParse(raw, fallback) {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function loadFavorites() {
    return safeParse(localStorage.getItem(STORAGE_KEY), { books: [], fatwas: [] });
  }

  function saveFavorites(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function loadRecent() {
    return safeParse(localStorage.getItem(RECENT_KEY), []);
  }

  function saveRecent(list) {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
    } catch (e) {}
  }

  /**
   * type: 'book' | 'fatwa'
   * id: number | string
   * meta: { title, author?, category? }
   */
  function toggleFavorite(type, id, meta) {
    const data = loadFavorites();
    const key = type === 'book' ? 'books' : 'fatwas';
    const list = data[key] || [];
    const idx = list.findIndex(item => String(item.id) === String(id));

    if (idx >= 0) {
      list.splice(idx, 1);
      data[key] = list;
      saveFavorites(data);
      return false; // removed
    }

    list.unshift({
      id: id,
      title: meta.title || '',
      author: meta.author || '',
      category: meta.category || '',
      addedAt: Date.now()
    });
    data[key] = list;
    saveFavorites(data);
    return true; // added
  }

  function isFavorite(type, id) {
    const data = loadFavorites();
    const key = type === 'book' ? 'books' : 'fatwas';
    return (data[key] || []).some(item => String(item.id) === String(id));
  }

  function getFavorites(type) {
    const data = loadFavorites();
    if (type === 'book') return data.books || [];
    if (type === 'fatwa') return data.fatwas || [];
    return data;
  }

  function addRecent(type, id, meta) {
    let list = loadRecent().filter(item =>
      !(item.type === type && String(item.id) === String(id))
    );
    list.unshift({
      type: type,
      id: id,
      title: meta.title || '',
      author: meta.author || '',
      category: meta.category || '',
      viewedAt: Date.now()
    });
    saveRecent(list);
  }

  function getRecent() {
    return loadRecent();
  }

  function clearFavorites(type) {
    const data = loadFavorites();
    if (type === 'book') data.books = [];
    else if (type === 'fatwa') data.fatwas = [];
    else {
      data.books = [];
      data.fatwas = [];
    }
    saveFavorites(data);
  }

  // Public API
  window.ILFavorites = {
    toggle: toggleFavorite,
    isFavorite: isFavorite,
    get: getFavorites,
    addRecent: addRecent,
    getRecent: getRecent,
    clear: clearFavorites
  };
})();
