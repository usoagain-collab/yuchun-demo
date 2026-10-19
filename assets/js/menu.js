/* Builds the menu page (and the home page's set cards) from content/menu.json.
   Every item shows all three names so guests and staff can point at it. */
(function () {
  var menuRoot = document.getElementById('menu-root');
  var setsRoot = document.getElementById('sets-root');
  if (!menuRoot && !setsRoot) return;

  var data = null;
  var ORDER = { en: ['en', 'ko', 'ja'], ja: ['ja', 'en', 'ko'], ko: ['ko', 'en', 'ja'] };
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
  var CHILI = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M15.6 3.2c.4-.5 1.2-.4 1.4.2.2.5 0 1-.4 1.3 1.6.6 2.7 2.1 2.6 3.9-.3 6.4-6.7 12.5-14.5 12.2-.9 0-1.1-1.2-.3-1.6 4.6-2.1 6.9-5.6 7.8-9.3.4-1.7 1.8-2.9 3.5-3.1 0-.6-.1-1.1-.3-1.6l.2-2z"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function names(item, lang) {
    var o = ORDER[lang] || ORDER.en;
    return '<span class="name-primary" lang="' + o[0] + '">' + esc(item[o[0]]) + '</span>' +
      '<span class="name-alt" lang="' + o[1] + '">' + esc(item[o[1]]) + '</span>' +
      '<span class="name-alt" lang="' + o[2] + '">' + esc(item[o[2]]) + '</span>';
  }
  function price(item) {
    if (item.prices) {
      return item.prices.map(function (p) { return '<small>' + esc(p.size) + '</small>$' + esc(p.price); }).join('<br>');
    }
    return '$' + esc(item.price);
  }

  function itemHTML(item, lang, t) {
    var tags = '';
    if (item.signature) tags += '<span class="tag tag-sig">' + STAR + esc(t('menu.signature')) + '</span>';
    if (item.spicy) tags += '<span class="tag tag-spicy">' + CHILI + esc(t('menu.spicy')) + '</span>';
    var desc = item.desc && item.desc[lang];
    return '<li class="item card' + (item.signature ? ' is-signature' : '') + '">' +
      '<div class="item-names">' +
      (item.no ? '<span class="item-no">' + esc(t('menu.number')) + ' ' + item.no + '</span>' : '') +
      names(item, lang) + '</div>' +
      '<div class="item-price">' + price(item) + '</div>' +
      (desc ? '<p class="item-desc">' + esc(desc) + '</p>' : '') +
      (tags ? '<div class="item-tags">' + tags + '</div>' : '') +
      '</li>';
  }

  function setsHTML(lang, t) {
    return data.sets.map(function (s) {
      return '<article class="card set-card">' +
        '<div class="set-top"><span class="set-name">' + esc(t('home.setLabel')) + ' <span>' + esc(s.id) + '</span></span>' +
        '<span class="set-price">$' + esc(s.price) + '</span></div>' +
        '<p class="set-desc">' + esc(s.desc[lang]) + '</p></article>';
    }).join('');
  }

  function section(id, inner, t, extraClass) {
    return '<section class="menu-section' + (extraClass ? ' ' + extraClass : '') + '" id="' + id + '" aria-labelledby="h-' + id + '">' +
      '<h2 id="h-' + id + '">' + esc(t('menu.sections.' + id)) + '</h2>' + inner + '</section>';
  }

  function render(lang, t) {
    if (!data) return;
    if (setsRoot) setsRoot.innerHTML = setsHTML(lang, t);
    if (!menuRoot) return;
    var html = '';
    data.sections.forEach(function (s) {
      var list = '<ul class="menu-list">' + s.items.map(function (it) { return itemHTML(it, lang, t); }).join('') + '</ul>';
      html += section(s.id, list, t, s.id === 'extras' ? 'menu-compact' : '');
      if (s.id === 'special') {
        html += section('sets', '<div class="sets">' + setsHTML(lang, t) + '</div><p class="note" style="margin-top:12px">' + esc(t('home.setsNote')) + '</p>', t);
      }
    });
    var drinks = '<div class="drinks">' + data.drinks.map(function (g) {
      var o = ORDER[lang] || ORDER.en;
      return '<div class="card drink-group"><h3>' + esc(t('menu.drinkGroups.' + g.id)) + '</h3><ul>' +
        g.items.map(function (d) {
          var alts = o.slice(1).map(function (k) { return d[k]; }).filter(function (v, i, a) { return v !== d[o[0]] && a.indexOf(v) === i; });
          return '<li><span lang="' + o[0] + '">' + esc(d[o[0]]) + '</span><span class="price">$' + esc(d.price) + '</span>' +
            (alts.length ? '<span class="alt">' + esc(alts.join(' · ')) + '</span>' : '') + '</li>';
        }).join('') + '</ul></div>';
    }).join('') + '</div>';
    html += section('drinks', drinks, t);
    html += '<div class="fine-print"><p>' + esc(t('menu.taxNote')) + '</p><p>' + esc(t('menu.serviceNote')) +
      '</p><p>* ' + esc(t('menu.advisory')) + '</p></div>';
    menuRoot.innerHTML = html;
    menuRoot.removeAttribute('aria-busy');
  }

  var pending = null;
  document.addEventListener('yc:lang', function (e) {
    pending = e.detail;
    render(e.detail.lang, e.detail.t);
  });

  fetch('content/menu.json').then(function (r) { return r.json(); }).then(function (d) {
    data = d;
    var ctx = pending || window.YC;
    if (ctx) render(ctx.lang, ctx.t);
  }).catch(function () {
    if (menuRoot) menuRoot.innerHTML = '<p class="fine-print" data-i18n="menu.error">The menu couldn\'t load. Please call us at (808) 589-0022.</p>';
  });
})();
