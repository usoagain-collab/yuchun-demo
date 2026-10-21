# Yu Chun Korean Restaurant: demo website

A **demo concept** website for Yu Chun Korean Restaurant (유천 칡냉면 · ユッチャン・コリアン・レストラン), 1159 Kapiolani Blvd, Honolulu.
It is **not the official website**. It says so in the footer in three languages, and it tells search engines not to list it (`noindex`).

- Plain HTML, CSS and a little JavaScript. No build step, nothing to install.
- English by default, with a **EN | 日本語 | 한국어** switch on every page. The visitor's choice is remembered.
- Lighthouse (mobile): Performance 100, Accessibility 100, Best Practices 100. SEO shows ~60 **on purpose**: its only failing check is "page is blocked from indexing," which is the `noindex` tag.

## What's where

| File | What it is |
| --- | --- |
| `index.html`, `menu.html`, `visit.html`, `gallery.html`, `reviews.html` | The five pages |
| `content/menu.json` | **The menu: every name and price** |
| `lang/en.json`, `lang/ja.json`, `lang/ko.json` | **All the words on the site**, one file per language |
| `content/gallery.json` | **The photo list** for the Gallery page |
| `assets/css/style.css` | Colors, fonts, layout |
| `assets/img/` | Images (hero illustration, favicon; put new photos here) |
| `content/TODO.md` | What still needs confirming with the owner |
| `content/research-notes.md` | What was found online, with sources |
| `content/menu-photo.jpg` | Photo of the printed menu (the source of truth for prices) |

## How to edit things

You can edit any file directly on GitHub: open the file, click the ✏️ pencil, make the change, then click **Commit changes**. GitHub Pages republishes the site in about a minute.

### Change a price or dish name
Open `content/menu.json` and find the dish. Each one looks like this:

```json
{
  "no": 15, "price": "38.95",
  "ko": "갈비", "en": "Kalbi", "ja": "カルビ",
  "desc": { "en": "Marinated beef short ribs.", "ja": "味付けした牛カルビです。", "ko": "양념 소갈비." }
}
```

- `price`: type it **without** the `$`, exactly as you want it shown (`"38.95"`, `"7.00"`, `"6"`).
- `no`: the number printed on the paper menu (leave it out for specials).
- Add `"signature": true` for the ★ badge, `"spicy": true` for the 🌶 badge.
- Keep the quotes and commas. One missing comma breaks the menu. If the menu page shows "The menu couldn't load," paste the file into https://jsonlint.com to find the typo.
- Set A / Set B are under `"sets"`, drinks under `"drinks"`.

### Change hours, address notes, or any text
Open `lang/en.json` (and the matching line in `ja.json` and `ko.json`). For example, to change the hours, edit `"hoursText"` under `"visit"` (currently `"11:00 AM – 9:00 PM, every day"`) in each language file.

To remove the yellow **"To confirm"** badge once a fact is confirmed: open `visit.html`, find the card (search for `visit.payment`), delete `is-placeholder` from its `class="..."` and delete the `<span class="placeholder" ...>` tag next to the heading.

The phone number and address appear directly in the HTML pages and footer. Search and replace them in all five `.html` files if they ever change.

### Add real photos
1. Upload the photo to `assets/img/` (GitHub: open the folder → **Add file → Upload files**). Use a JPG about 1200 px wide.
2. Open `content/gallery.json` and set that entry's `"src"` to the file path, for example `"assets/img/kalbi.jpg"`, and `"credit"` to the photographer (e.g., `"Unsplash / Jane Doe"`). Credits appear automatically in the footer.
3. To replace the **hero illustration** on the home page, upload the photo and change `assets/img/hero-naengmyeon.svg` to its path in `index.html` (it appears twice).

Only use photos you own, that the restaurant gives you, or that are royalty-free (Unsplash, Pexels). **Don't** copy photos from Google, Yelp or Tripadvisor.

### Add the real logo
Upload it as `assets/img/logo.png` (a square image works best), then in each `.html` file replace

```html
<span class="brand-mark" aria-hidden="true">유천</span>
```

with

```html
<span class="brand-mark"><img src="assets/img/logo.png" alt=""></span>
```

### Change colors
At the top of `assets/css/style.css`, `--red: #a3161f;` is the accent color. Change it once and it updates everywhere.

## Previewing on your own computer

Because the pages load their menu and words from JSON files, double-clicking `index.html` won't fully work (browsers block that). Either use the live GitHub Pages link, or in a terminal inside this folder run:

```
python3 -m http.server 8000
```

and open http://localhost:8000.

## Credits
- Bowl illustration: original artwork made for this demo.
- Fonts: Inter, Noto Sans JP, Noto Sans KR (Google Fonts).
- Map: Google Maps embed.
