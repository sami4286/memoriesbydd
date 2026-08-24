# Memories by DD — Website Revamp

Working repository for the revamp of **[memoriesbydd.com](https://memoriesbydd.com/)** — Memories
Funeral Booklets, a UK business (Ashley Whittick) that designs and prints personalised funeral
order-of-service booklets plus digital and physical add-ons.

**Phase 1 (this repo): archive the existing site, audit it, and set the content strategy.**
Design and the Webflow build follow.

---

## Project decisions

| Decision | Choice |
|---|---|
| Platform | **Webflow** — clean rebuild |
| Order model | **Enquiry-first** — Fillout brief + tap-to-call + WhatsApp. No checkout |
| Positioning | **Lead with the cultural niche** — UK Caribbean & African families |
| Pricing | **Keep public**, restructured around packages, with CTAs |

---

## Start here

| Read | For |
|---|---|
| **[_archive/audit/AUDIT.md](_archive/audit/AUDIT.md)** | What is wrong with the current site — 23 findings, severity-ranked |
| **[_strategy/01-SITEMAP.md](_strategy/01-SITEMAP.md)** | Proposed information architecture + redirect plan |
| **[_strategy/02-HOMEPAGE.md](_strategy/02-HOMEPAGE.md)** | Homepage content strategy, section by section |
| **[_strategy/03-FUNNEL.md](_strategy/03-FUNNEL.md)** | Conversion paths, form placement, referral tracking |
| **[_strategy/04-SEO.md](_strategy/04-SEO.md)** | Keyword strategy in three tiers + technical checklist |
| **[_strategy/05-CLIENT-ACTIONS.md](_strategy/05-CLIENT-ACTIONS.md)** | **What we need from Ashley** — blocking items |

---

## The three headline findings

1. **There is not one tap-to-call or WhatsApp link on the entire website.** Both numbers are plain
   text. Most referral traffic is mobile and most funerals are arranged within 48 hours.
2. **The funnel dead-ends.** All 40 design pages say *"call us to place your order"* and link to
   `/price-list/` — a page with no button, no form and no phone link. The order form exists on the
   homepage only, in an unlabelled grey box.
3. **The niche is already in the catalogue but nowhere in the branding.** Nine designs are Caribbean
   or African, six are football clubs. UK competitors sell generic templates at ~£55/50 copies; he
   charges £122+ for done-for-you design. Culture and service are the moat, not price.

And one more worth its own line: **≈46,000 words of useful content — a 28,905-word hymn library, a
12,560-word poem library and a UK bereavement-benefits guide — sit orphaned behind an 8-word page.**
Every commercial page in the navigation averages under 350 words.

---

## Repository layout

```
_archive/                  Snapshot of the live site, 18 Aug 2026
  pages/html/              54 pages, rendered HTML as served (46 MB)
  pages/markdown/          13 pages, cleaned readable text
  designs/                 40 design pages as structured markdown
  media/                   547 assets, 329 MB, original folder structure
  data/                    machine-readable extracts (see below)
  raw/                     untouched REST API JSON + XML sitemaps
  audit/AUDIT.md           the full audit

_strategy/                 Phase 1 deliverables (01–05 above)
_tools/                    the scripts used to build the archive
```

### Key data files

| File | Contents |
|---|---|
| `_archive/data/designs.json` | **Import-ready.** 40 designs: name, category, description, specs, hero, full image list, dead-image list, Vimeo IDs |
| `_archive/data/design-qa.csv` | Per-design issue list — the source of `05-CLIENT-ACTIONS.md` |
| `_archive/data/pages.json` | 13 pages: title, URL, word count, images |
| `_archive/data/media.json` | Media library metadata incl. alt text |
| `_archive/data/redirects.csv` | **57 × 301 redirects** — every current URL mapped |
| `_archive/data/media-404.txt` | 26 assets that are dead on the live site |
| `_archive/data/broken-images.csv` | 96 broken image references mapped to 39 pages |
| `_archive/data/missing-from-library.txt` | 31 live assets absent from the WP media library |

---

## What the current site is

| | |
|---|---|
| Stack | WordPress on Apache, **PHP 7.4** (end-of-life), Avada + Fusion Builder, Yoast 28.2 |
| Plugins | Contact Form 7, MetaSlider, Click-to-Chat-for-WhatsApp, MonsterInsights, WooCommerce (**unused**) |
| Analytics | GA4 `G-LXY7DY8737` — **no conversion events configured** |
| Order form | Fillout `35E7XCNpsmus` — homepage only |
| Pages | 13 + 40 design pages + 4 categories |
| Designs | 40 — Standard 21, **Caribbean/African 9**, Football 6, Classic 3, 1 uncategorised |
| Imagery | 301 product images (**280 live, 21 dead**) + **119 Vimeo videos** |
| Page weight | 0.9–1.2 MB HTML per page, 36 CSS + 111 JS files |

**Contact:** 0800 023 6263 · WhatsApp 07552 91 6060 · info@memoriesbydd.com
Stanmore Place, Stanmore Innovation Centre, Howard Rd, London HA7 1BT

**Partner freephone numbers** (existing referral attribution — keep these):
Al-tayo's 0800 023 5991 · Joel Grant 0800 023 5448 · Calo's 0800 023 5797

---

## How the archive was built

All public sources — no credentials used. The WordPress REST API is open on this site.

```bash
# 1. Raw JSON + sitemaps
curl .../wp-json/wp/v2/pages?per_page=100
curl .../wp-json/wp/v2/avada_portfolio?per_page=100
curl .../wp-json/wp/v2/media?per_page=100&page=1..6

# 2. Rendered HTML for all 54 URLs
curl --parallel -K _archive/data/curl-pages.cfg

# 3. Structure the content
powershell _tools/extract.ps1          # pages, designs, media, redirects
powershell _tools/enrich-images.ps1    # complete image sets incl. lazy-loaded CSS backgrounds

# 4. Media (union of library + everything referenced in HTML)
curl --parallel -K _archive/data/curl-media.cfg
```

**Two things worth knowing about the extraction:**

- The REST media library returns 542 items, but **31 assets referenced on live pages are not in it** —
  including all 10 photos of Ashley's mother Sharon, the logo, and several product images. The
  download list is the **union** of the library and everything referenced in the HTML, so nothing was
  lost. 26 of those 31 turned out to be dead on the server (`media-404.txt`).
- Gallery images are lazy-loaded **CSS backgrounds** (`data-bg` / `data-bg-url`), not `<img src>`.
  A `src`-only scrape misses roughly two-thirds of the product imagery. `enrich-images.ps1` handles this.

### Archive integrity

Verified: 547 files, all with valid image/video magic bytes, **zero** HTML error pages saved as
assets, zero zero-byte files. The 26 missing files are confirmed 404 at origin, not download failures.

---

## Not in Phase 1

Visual design and branding · the Webflow build · the Fillout form rebuild (Phase 2) · Google Business
Profile setup · any change to the live site.

> The live site has not been modified. This repository is read-only with respect to production.
