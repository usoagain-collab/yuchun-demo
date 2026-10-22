/* Builds the gallery from content/gallery.json.
   An entry with an empty "src" shows a "Photo coming soon" card. */
(function () {
  var rootEl = document.getElementById('gallery-root');
  var creditsEl = document.getElementById('photo-credits');
  var items = null;
  var ICON = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 22h32a16 12 0 0 1-32 0z"/><path d="M14 22c2-6 6-10 10-10s8 4 10 10"/><path d="M18 8l4 10M30 8l-4 10"/></svg>';

  function esc(s) {
    return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function render(lang, t) {
    if (!items) return;
    if (rootEl) {
      rootEl.innerHTML = items.map(function (it) {
        var media = it.src
          ? '<img src="' + esc(it.src) + '" alt="' + esc(it.alt[lang] || it.alt.en) + '" loading="lazy" width="600" height="600">'
          : '<div class="ph-inner">' + ICON + '<span>' + esc(t('gallery.soon')) + '</span></div>';
        // Each name gets its own lang tag so Japanese and Korean use the right font
        var alt = ['en', 'ko', 'ja'].filter(function (k) { return k !== lang; }).map(function (k) {
          return '<span lang="' + k + '">' + esc(it.caption[k]) + '</span>';
        }).join(' · ');
        return '<figure><div class="ph">' + media + '</div><figcaption><strong>' + esc(it.caption[lang] || it.caption.en) +
          '</strong>' + alt + '</figcaption></figure>';
      }).join('');
    }
    if (creditsEl) {
      var credits = items.filter(function (i) { return i.src && i.credit; }).map(function (i) { return esc(i.credit); });
      creditsEl.innerHTML = credits.length ? 'Photos: ' + credits.join(', ') : '';
    }
  }
  var ctx = null;
  document.addEventListener('yc:lang', function (e) { ctx = e.detail; render(ctx.lang, ctx.t); });
  fetch('content/gallery.json').then(function (r) { return r.json(); }).then(function (d) {
    items = d.photos;
    ctx = ctx || window.YC;
    if (ctx) render(ctx.lang, ctx.t);
  }).catch(function () {});
})();
