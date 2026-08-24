# Sitemap & Information Architecture

**Platform:** Webflow · **Order model:** enquiry-first (no checkout) · **Positioning:** UK Caribbean
& African families first · **Pricing:** public, package-led

Design principles: flat and shallow (nothing more than two clicks from home), every URL a real
keyword, and a conversion action reachable from every page.

---

## Proposed structure

```
/                                          Home
│
├── /funeral-order-of-service-booklets/     Catalogue — all 40, filterable
│   ├── /caribbean-african/                 World themes (9)   ← primary SEO cluster
│   ├── /classic/                           Classic (3)
│   ├── /standard/                          Standard (22)
│   └── /football/                          Football (6)
│
├── /booklets/{design-slug}/                40 design pages   (was /menu/{slug})
│
├── /prices/                                Packages + full price matrix
├── /order/                              ★  The Fillout brief — its own page
├── /how-it-works/                          NEW — the 4-step process
│
├── /motion-obituary/                       NEW — Motion Obituary + Motion Gallery
├── /banners-and-bookmarkers/               NEW — physical add-ons
│
├── /about/                                 About + Ashley's story (merged)
├── /reviews/                               NEW — testimonials + tributes
├── /funeral-directors/                     Trade offer (was /partners/)
│
├── /help/                                  Support hub — real content
│   ├── /help/faqs/
│   ├── /help/funeral-hymns/
│   ├── /help/funeral-poems-and-prayers/
│   ├── /help/what-to-write-in-a-funeral-programme/    NEW
│   └── /help/uk-bereavement-benefits/
│
├── /contact/
└── /privacy-policy/
```

**Total: 17 static pages + 4 category pages + 40 design pages = 61 URLs** (vs 54 today, but with
zero orphans and zero dead ends).

---

## Navigation

**Primary nav:** `Booklets · Prices · How It Works · Help · About · Contact`
**Persistent header:** "Start Your Booklet" button + tap-to-call `0800 023 6263`
**Mobile:** sticky bottom bar — `Call · WhatsApp · Start`

`/order/`, `/reviews/`, `/motion-obituary/`, `/banners-and-bookmarkers/` and `/funeral-directors/`
are reached from in-page CTAs and the footer rather than the top nav, to keep it to six items.

---

## Why each change

### `/order/` becomes a real page — the single most valuable structural change
Today the form is buried mid-homepage with no label. Giving it a URL means Ashley can text it,
WhatsApp it, print it on a card and put it in a funeral director's referral pack. For a
referral-driven business, a memorable order URL is the whole game.

### `/menu/` → `/booklets/`
`/menu/` means nothing to a user or to Google. All 40 URLs get 301s — see
`_archive/data/redirects.csv`.

### Catalogue gets a real keyword URL and filterable categories
`/catalogue/` → `/funeral-order-of-service-booklets/`, with the four categories as **indexable
sub-pages**, not just filters. `/caribbean-african/` is the highest-value page on the new site: it
targets a cluster with real search demand and almost no UK competition.

Rename the category to something human — **"Caribbean & African"** rather than "World Themes" — and
fix the lowercase `football` taxonomy inconsistency.

### Merge `/about-us/` + `/tributes-2/` into `/about/`
Ashley's story is the strongest brand asset on the site and it is currently hidden behind a nav item
called "THE STORY" that gives no clue what it is. He lost his mother at seven months, and was driven
by watching families "pull out all the bells and whistles for a wedding and then send their loved
ones off with cheap black and white photocopied paper." That belongs on `/about/` and in an excerpt
on the homepage — it is the reason to choose him over a £55 template shop.

### Promote the hidden libraries into `/help/`
The hymn library, poem/prayer library and UK bereavement-benefits guide are the best organic assets
on the site and are currently unreachable from the nav. `/help/` becomes a real hub with real
content, in the main navigation.

Add `/help/what-to-write-in-a-funeral-programme/` — built from the nine FAQ topics currently trapped
as broken raw HTML on `/faqs/` (see audit C4). The content is already written; it just needs
rescuing.

### Split out the add-ons
Motion Obituary, Motion Gallery, banners and bookmarkers exist only as rows in a price table today.
They get their own pages with imagery, explanation and pricing. These are high-margin upsells and
"motion obituary" / "funeral banner UK" have genuine search demand.

### `/partners/` → `/funeral-directors/`
Reframe from three name-drops into a **trade offer**: dedicated freephone number, negotiated trade
pricing, white-label proofs, 24–48hr turnaround. The FAQ already confirms he offers funeral-director
rates. This page is his growth engine and currently does no selling.

### Retire
| Retire | Why | Goes to |
|---|---|---|
| `/support-2/` | Empty shell, 3 links | `/help/` |
| `/contact-us-2/` | Dumps 41 thumbnails, no form | `/contact/` |
| `/tributes-2/` | Merged | `/about/` |
| `/slide/` + `/category/uncategorized/` | Empty blog scaffolding | `/` |
| `/slide-page/*` (3) | MetaSlider internals that 301 to home but sit in the sitemap | `/` |

---

## Redirect map

Complete machine-readable map: **`_archive/data/redirects.csv`** — 57 rows (40 design pages + 17
page-level redirects), all 301.

Every current indexed URL is accounted for. Nothing is left to 404.

---

## Technical notes for the Webflow build

- **CMS Collections:** `Designs` (40 items), `Design Categories` (4), optionally `Reviews`
- **Design Collection fields:** name, slug, category (ref), description, hero image, gallery (multi-image),
  Vimeo IDs (3 per design), size, photo allowance, suitability, SEO title, SEO description
- Source data is ready in **`_archive/data/designs.json`** — import-ready, one record per design
- **Strip the `VIEW ` prefix** from all 38 affected design names on import (already done in
  `designs.json` → `name` field; `wp_title` preserves the original)
- Publish `/help/*` and category pages as real pages, not filter states, so they can rank
- Set locale `en_GB`; do **not** carry over `maximum-scale=1`
- Schema: `LocalBusiness` (Stanmore NAP), `Product` per design, `FAQPage` on `/help/faqs/`
- Do not migrate the 242 unreferenced media items (see audit D6)
