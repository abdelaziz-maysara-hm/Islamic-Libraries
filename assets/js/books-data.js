/* Bootstrap: load verified base book list then extras */
(function () {
  var base = 'https://cdn.jsdelivr.net/gh/abdelaziz-maysara-hm/Islamic-Libraries@1536150ec2b14c2b6d3184b8362ffc1a55803781/assets/js/books-data.js';
  var s = document.createElement('script');
  s.src = base;
  s.onload = function () {
    var e = document.createElement('script');
    e.src = (window.SITE_ROOT || '') + 'assets/js/books-extra.js';
    document.body.appendChild(e);
  };
  s.onerror = function () {
    console.error('Failed to load books-data base');
  };
  document.head.appendChild(s);
})();
