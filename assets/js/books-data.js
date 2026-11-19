/* Bootstrap: load verified base book list then extras.
   Sets window.BOOKS_READY and dispatches a "books:ready" event on document
   once the full catalog (base + extras) is available, so pages that render
   from window.ALL_BOOKS (e.g. book.html) don't render before the data exists. */
(function () {
  function done(ok) {
    window.BOOKS_READY = true;
    window.BOOKS_LOAD_OK = !!ok;
    try {
      document.dispatchEvent(new CustomEvent('books:ready', { detail: { ok: !!ok } }));
    } catch (err) {
      var ev = document.createEvent('Event');
      ev.initEvent('books:ready', true, true);
      document.dispatchEvent(ev);
    }
  }
  var base = 'https://cdn.jsdelivr.net/gh/abdelaziz-maysara-hm/Islamic-Libraries@1536150ec2b14c2b6d3184b8362ffc1a55803781/assets/js/books-data.js';
  var s = document.createElement('script');
  s.src = base;
  s.onload = function () {
    var e = document.createElement('script');
    e.src = (window.SITE_ROOT || '') + 'assets/js/books-extra.js';
    e.onload = function () { done(true); };
    e.onerror = function () {
      console.error('Failed to load books-extra');
      done(Array.isArray(window.ALL_BOOKS) && window.ALL_BOOKS.length > 0);
    };
    document.body.appendChild(e);
  };
  s.onerror = function () {
    console.error('Failed to load books-data base');
    done(false);
  };
  document.head.appendChild(s);
})();
