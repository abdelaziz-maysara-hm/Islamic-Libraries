(function () {
  var saved = '';
  try { saved = localStorage.getItem('theme') || ''; } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', saved ? (saved === 'dark' ? 'dark' : 'light') : (prefersDark ? 'dark' : 'light'));
})();
