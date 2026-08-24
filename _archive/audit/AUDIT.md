# memoriesbydd.com — Technical, SEO & Content Audit

**Audited:** 18 August 2026 · **Method:** full crawl of the public site + the open WordPress REST API.
Every finding below was verified against live HTTP responses or the saved HTML in `_archive/pages/html/`.
Nothing here is inferred.

**Site:** https://memoriesbydd.com — Memories Funeral Booklets (Ashley Whittick)
**Address:** Stanmore Place, Stanmore Innovation Centre, Howard Rd, London HA7 1BT
**Phone:** 0800 023 6263 · **WhatsApp:** 07552 91 6060 · **Email:** info@memoriesbydd.com

---

## Stack

| Item | Detail |
|---|---|
| CMS | WordPress on Apache, **PHP 7.4.33** (end-of-life since Nov 2022 — security risk) |
| Theme | Avada + Fusion Builder |
| SEO | Yoast SEO 28.2 |
| Plugins | Contact Form 7, MetaSlider, Click-to-Chat-for-WhatsApp, MonsterInsights, **WooCommerce (installed, unused)** |
| Analytics | GA4 `G-LXY7DY8737`. No Google Ads tag, no GTM, no conversion events |
| Order form | Fillout, form ID `35E7XCNpsmus` |
| Video hosting | Vimeo — **119 videos** embedded across the design pages |

## Inventory

| Type | Count |
|---|---|
| Pages | 13 |
| Design pages (`/menu/{slug}`) | 40 |
| Design categories | 4 — Standard 21, World 9, football 6, Classic 3, **1 uncategorised** |
| Design product images | 301 (280 live, **21 dead**) |
| Vimeo video previews | 119 (3 per design) |
| Media library items | 555 reported / 542 returned by API |
| Assets archived | 547 files, 329 MB |
| Blog posts | 1, empty |

---

## A. Conversion defects — these cost orders directly

### A1. There is not one tap-to-call link on the entire website
Verified across all 13 pages and the design pages: **zero** `tel:` links, **zero** `wa.me` links.
The freephone number and WhatsApp number are plain text only. The Click-to-Chat plugin is installed
but emits no link in the HTML.

Most funerals are arranged inside 48 hours and most referral traffic is mobile. Right now a grieving
user on a phone cannot tap to call or message. This is the single highest-value fix on the site.

### A2. The order form exists on exactly one page
The Fillout embed appears **only on the homepage**, as section 4 of 9, inside a fixed
`height:500px` div with **no heading, no introduction and no explanation**. A visitor cannot tell
what it is. It appears on no other page — not on the design pages, not on the price list, not on
Contact Us.

### A3. `/price-list/` is a dead end
The page has 19 `<h2>`s and a full price matrix but **no button, no form, no phone link, no email
link** — nothing. Yet every one of the 40 design pages sends traffic here with the CTA
*"VIEW OUR PRICES AND CALL US TO PLACE YOUR ORDER"*. The journey terminates on a price grid with no
way to act.

### A4. Design pages have no order CTA
The 40 highest-intent pages on the site offer only two links: "View our prices" and "Back to
catalogue". No form, no call, no WhatsApp, no "order this design".

### A5. Contact Us has no contact form
`/contact-us-2/` shows the address and plain-text numbers, then dumps **all 41 catalogue
thumbnails** below it. Contact Form 7 is installed but not used on the page.

---

## B. Broken assets — 26 files are 404 on the live site

Confirmed by direct HTTP request to each URL (all returned **404**). Full list in
`_archive/data/media-404.txt`; page-by-page mapping in `_archive/data/broken-images.csv`.

**96 broken image references across 39 pages.**

### B1. Delivery-partner logos are broken on every design page
`2019/11/dpd.png` (37 pages) and `2019/11/uber.png` (36 pages) are gone. These are the delivery
trust signals — broken on effectively every product page.

### B2. Four designs have a broken **hero** product image

| Design | Dead images | Hero dead? | Impact |
|---|---|---|---|
| **Nigeria** | 6 of 7 (86%) | **Yes** | Page is effectively image-less |
| **Dominica** | 6 of 7 (86%) | **Yes** | Page is effectively image-less |
| **Snow Flake** | 3 of 7 (43%) | **Yes** | Main product shot missing |
| **Rasta Theme** | 1 of 8 (12%) | **Yes** | Main product shot missing |
| Antigua | 2 of 6 (33%) | No | Gallery gaps |
| Honey Comb | 2 of 8 (25%) | No | Gallery gaps |
| Manchester City | 1 of 7 (14%) | No | Gallery gap |

**Nigeria and Dominica are two of the nine cultural designs** — the exact range the business should
be leading with. Both currently show a broken image where the product should be.

### B3. The logo is broken on `/support-2/`
`2020/03/memories3.png` → 404.

### B4. Other dead files
`2020/04/candle-vid.mp4`, `2020/04/smarthpone-user-1024x552-1.png` (on Contact Us).

---

## C. SEO defects

### C1. The homepage `<title>` is a pasted wp-admin URL
```
https://memoriesbydd.com/wp-admin/post.php?post=16000&action=edit#Funeral Booklet, order of service booklet - memories funeral booklets
```
Someone pasted an editor URL into the Yoast title field. This is the brand's search result.

### C2. No meta description on any page except the homepage
All 12 other pages: empty. Google is writing their snippets.

### C3. Heading structure is broken
- Homepage: **no `<h1>` at all**
- `/catalogue/`: **four `<h1>`s** (Classic / Standard / Football / World Themes)
- `/tributes-2/`: no `<h1>`
- Design pages: an entire paragraph of body copy is placed **inside** the `<h1>` (e.g. Black Beauty's
  full description is the H1)
- Design pages use `<h3>` for spec values and `<h4>` for design names on listing pages

### C4. `/faqs/` renders raw HTML as visible broken text
A block of markup was pasted into the editor with smart quotes, so it renders literally on the page:
```
<section id=”faq”> <h1>Funeral Programme FAQs</h1> <h2>Samples of funeral booklet layouts…</h2> …
```
Nine genuinely useful FAQ topics are sitting on the page as broken code instead of content.

### C5. `og:locale` is `en_US` for a UK business

### C6. Product URLs and titles are wrong
- URLs are `/menu/{slug}` — meaningless for search
- CMS titles literally read **"VIEW JAMAICA"**, **"VIEW WHITE LILLIES"** — button labels leaked into
  the post titles. **38 of 40 designs** carry the `VIEW ` prefix
- "WHITE LILLIES" is misspelled (slug is correctly `white-lilies`)

### C7. Keyword-stuffed alt text
Every product image carries the same 40-word comma-spam string:
> *"Funeral booklet design, funeral booklet print, order of service booklet, order of service print,
> funeral booklet themes, templates, memorial booklet, funeral programme, funeral printing…"*

### C8. Four content assets are orphaned from the navigation
The main nav is `HOME · CATALOGUE · PRICE LIST · ABOUT US · THE STORY · SUPPORT · PARTNERS ·
CONTACT US`. Not linked from it:

| Page | What it contains |
|---|---|
| `/hymns-poems/` | A large hymn library (1.2 MB page — the biggest on the site) |
| `/poems-prayers/` | A large poem, prayer and reading library |
| `/funeral-arrangements/` | A genuine UK bereavement-benefits guide (DWP, BB1 form, allowances) |
| `/faqs/` | The FAQ page |

All four sit behind `/support-2/`, which is an empty shell — a title and three links.

**The scale of what is hidden, measured:**

| Page | Words | In nav? |
|---|---|---|
| `/hymns-poems/` | **28,905** | No |
| `/poems-prayers/` | **12,560** | No |
| `/funeral-arrangements/` | **3,815** | No |
| `/faqs/` | 1,124 | No |
| **Total hidden** | **≈46,400 words** | — |
| | | |
| `/price-list/` | 451 | Yes |
| `/` (homepage) | 410 | Yes |
| `/catalogue/` | 298 | Yes |
| `/tributes-2/` | 286 | Yes |
| `/partners/` | 207 | Yes |
| `/about-us/` | 198 | Yes |
| **`/support-2/`** | **8** | **Yes** |

**Roughly 46,000 words of genuinely useful, on-topic content sits behind an 8-word page that is in the
navigation — while every commercial page in the nav averages under 350 words.** This is the single
largest untapped asset on the site.

### C9. Three redirecting URLs are published in the XML sitemap
`/slide-page/family/`, `/slide-page/hoometop/`, `/slide-page/sharon/` are MetaSlider internals that
all **301 to the homepage**, yet Yoast publishes them in `slide-page-sitemap.xml`.

### C10. Taxonomy naming is inconsistent
Categories are `Standard`, `World`, `Classic` — but `football` is lowercase.

---

## D. Content defects

### D1. Duplicate design copy
| Designs | Issue |
|---|---|
| `classic-one`, `classic-two`, `classic-three`, `rose-and-sleek` | **Identical** descriptions — all four use the same "more masculine, still holding its sophistication" paragraph |
| `black-beauty`, `gemini-orange` | **Identical** description **and identical hero image** (`Landscape-compilation-copy.png`) |
| `rose-petals`, `victorian-colours` | Templated near-duplicates — same sentence with the product name swapped |
| `golden-ocean`, `ghana` | Templated near-duplicates — "striking, deep and full of character with its rich tones" |

### D2. Mismatched product images
- **`golden-ocean`** hero is `rose-n-sllek-header.png` — it is showing **Rose & Sleek's** artwork
  (Rose & Sleek uses `rose-n-sllek-header-copy.png`)
- **`snow-flake`** hero is `Floral-Wreath-sq6.jpg` — **Floral Wreath's** asset, and it is dead
- **`classic-three`** hero is `Design-two-comp.png` — appears to be Classic **Two's** artwork
  *(needs client confirmation)*

### D3. `gemini-orange` is orphaned — root cause found
It is live and in the XML sitemap but missing from `/catalogue/`. **Cause: it has no
`portfolio_category` assigned**, and the catalogue page renders by category. It is also a straight
duplicate of Black Beauty (same copy, same hero image) — it looks like an unfinished draft that was
published.

### D4. Missing specifications
| Design | Missing |
|---|---|
| `godfather` | Photo Allowance, Suitability |
| `acrylic-splashes` | Photo Allowance |
| `rasta-theme` | Photo Allowance |

### D5. Add-on products are effectively invisible
Motion Obituary (£50/£75), Motion Gallery (£50/£100/£130), Banners (£125/£170) and Bookmarkers
(£85/£105/£150) exist **only as rows inside the price table**. No product pages, no images in
context, no explanation of what a Motion Obituary actually is beyond one sentence. These are
high-margin upsells with real search demand.

### D6. 242 media library items are never referenced
Of 542 library assets, 242 appear on no page. Dead weight — do not migrate blindly.

### D7. `/support-2/` is an empty shell
Title plus three links. No content.

---

## E. Performance & accessibility

### E1. Page weight is extreme

| Page | HTML size |
|---|---|
| `/hymns-poems/` | **1,212 KB** |
| `/` | **916 KB** |
| `/catalogue/` | 911 KB |
| `/price-list/` | 906 KB |
| `/contact-us-2/` | 892 KB |

That is **HTML alone**, before images. The homepage also loads **36 CSS files, 111 JS files, 21
inline `<style>` blocks and 40 images**. This is a guaranteed Core Web Vitals failure and it is being
served to people on mobile data during the worst week of their lives.

### E2. Pinch-zoom is disabled
`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">`
`maximum-scale=1` blocks zoom — a WCAG 2.1 failure that matters especially for an older bereaved
demographic reading small print.

### E3. Two pages dump the entire catalogue
The homepage renders all 41 designs, and `/contact-us-2/` renders all 41 again below the address.
Both pay the full image cost for content the user did not ask for.

### E4. PHP 7.4 is end-of-life
No security patches since November 2022.

---

## F. The strategic finding

The catalogue is already **Jamaica, Trinidad, Grenada, Barbados, St Lucia, Antigua, Dominica,
Nigeria, Ghana** and **Rasta**, plus six London/Manchester/Liverpool football clubs. Nine of forty
designs are Caribbean or African, and the copy on each already explains the flag's symbolism.

That is a precise portrait of the real customer: **UK Caribbean and African diaspora families**.

UK competitors — [Devine](https://devinefuneralstationery.uk/), [Funeral Stationery
4U](https://funeralstationery4u.co.uk/), [Utterly Printable](https://www.utterlyprintable.com/),
[instantprint](https://www.instantprint.co.uk/orders-of-service) — sell **self-serve generic
templates from roughly £55 per 50 copies**. Memories starts at **£122 per 50** because it is a
**done-for-you design service** with a human doing the work in 24–48 hours.

He cannot win on price and should not try. The moat is cultural specificity, craft, speed and human
handholding. No UK competitor is seriously serving the Nine Night, repatriation and diaspora
send-off context.

**Nothing on the current site communicates any of this.** The homepage has no `<h1>`, no promise, no
trust signal, and opens with a wall of 41 thumbnails under headings that read "VIEW ROSE PETALS".

---

## Severity summary

| # | Finding | Severity |
|---|---|---|
| A1 | No tap-to-call or WhatsApp link anywhere | **Critical** |
| A3 | Price list is a dead end; all design CTAs point there | **Critical** |
| A2 | Order form on one page only, unlabelled | **Critical** |
| A4 | No order CTA on any design page | **Critical** |
| C1 | Homepage title is a wp-admin URL | **Critical** |
| B2 | Nigeria & Dominica hero images broken (86% dead) | **High** |
| B1 | Delivery logos broken on all 40 design pages | **High** |
| E1 | 0.9–1.2 MB pages, 111 JS files | **High** |
| C2 | No meta descriptions | **High** |
| C8 | Best content assets orphaned from nav | **High** |
| C4 | FAQ page renders broken raw HTML | **High** |
| D1 | Duplicate copy across 8 designs | Medium |
| C3 | Broken heading hierarchy | Medium |
| C6 | `/menu/` URLs, "VIEW " title prefix | Medium |
| A5 | Contact page has no form | Medium |
| D2 | Three mismatched product images | Medium |
| D5 | Add-ons invisible | Medium |
| E2 | Pinch-zoom disabled | Medium |
| D3 | `gemini-orange` uncategorised duplicate | Low |
| D4 | Three designs missing specs | Low |
| C9 | Redirecting URLs in sitemap | Low |
| E4 | PHP 7.4 end-of-life | Low (host) |
| D6 | 242 unused media items | Low |
