/* Language switch: English by default; remembers the visitor's choice.
   All words live in lang/en.json, lang/ja.json and lang/ko.json. */
(function () {
  var LANGS = ['en', 'ja', 'ko'];
  var KEY = 'yuchun-lang';
  var root = document.documentElement;
  var cache = {};

  function saved() {
    try { var l = localStorage.getItem(KEY); return LANGS.indexOf(l) >= 0 ? l : 'en'; } catch (e) { return 'en'; }
  }
  function remember(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  function load(l) {
    if (cache[l]) return Promise.resolve(cache[l]);
    return fetch('lang/' + l + '.json').then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (d) { cache[l] = d; return d; });
  }

  // Noto Sans JP / KR are large, so load them only when that language is chosen
  var FONTS = { ja: 'Noto+Sans+JP', ko: 'Noto+Sans+KR' };
  function loadFont(l) {
    if (!FONTS[l] || document.getElementById('font-' + l)) return;
    var link = document.createElement('link');
    link.id = 'font-' + l;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + FONTS[l] + ':wght@400;700&display=swap';
    document.head.appendChild(link);
  }

  function apply(l) {
    loadFont(l);
    return Promise.all([load('en'), load(l)]).then(function (res) {
      var en = res[0], dict = res[1];
      var t = function (k) { var v = get(dict, k); return v == null ? get(en, k) : v; };
      root.lang = l;
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var v = t(el.getAttribute('data-i18n'));
        if (typeof v === 'string') el.textContent = v;
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        var v = t(el.getAttribute('data-i18n-aria'));
        if (typeof v === 'string') el.setAttribute('aria-label', v);
      });
      document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
        var v = t(el.getAttribute('data-i18n-title'));
        if (typeof v === 'string') el.setAttribute('title', v);
      });
      document.querySelectorAll('.lang-switch button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l));
      });
      window.YC = { lang: l, t: t };
      document.dispatchEvent(new CustomEvent('yc:lang', { detail: { lang: l, t: t } }));
    }).catch(function () {
      window.YC = window.YC || { lang: 'en', t: function () { return null; } };
    }).then(function () { root.classList.remove('i18n-pending'); });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.lang-switch button');
    if (!b) return;
    var l = b.getAttribute('data-lang');
    remember(l);
    apply(l);
  });

  // Never leave text hidden if something goes wrong
  setTimeout(function () { root.classList.remove('i18n-pending'); }, 2500);
  apply(saved());
})();
