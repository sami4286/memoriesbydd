# SEO & Keyword Strategy

## Starting position

The site is effectively invisible to search, for reasons that are all fixable:

- The homepage `<title>` is a pasted **wp-admin URL** — that is the brand's search result
- **No meta description** on 12 of 13 pages
- Homepage has **no `<h1>`**; the catalogue has four
- 40 product pages sit on meaningless `/menu/` URLs with titles reading **"VIEW JAMAICA"**
- The three best content assets (hymns, poems, bereavement guide) are **orphaned from the nav**
- The FAQ page renders **raw HTML as broken visible text**
- Pages weigh **0.9–1.2 MB** with 111 JS files — a guaranteed Core Web Vitals failure
- `og:locale` is `en_US` for a UK business

Almost everything needed to rank already exists as content. It is mis-tagged, hidden, or broken —
not missing.

---

## Competitive reality — and why the niche is the strategy

| Competitor | Model | Entry price |
|---|---|---|
| [Devine Funeral Stationery](https://devinefuneralstationery.uk/) | Self-serve upload/design | ~£55 / 50 copies |
| [Funeral Stationery 4U](https://funeralstationery4u.co.uk/) | Templates, free next-day UK | Low |
| [Utterly Printable](https://www.utterlyprintable.com/) | Templates + instant PDF download | Low |
| [instantprint](https://www.instantprint.co.uk/orders-of-service) | Volume trade printer | Low |
| **Memories** | **Done-for-you design by a human, 24–48 hrs** | **£122 / 50 (4pg)** |

Memories is **2–3× the price** of the template shops. On the generic head terms
("funeral order of service printing") he is competing against cheaper, better-optimised, higher-authority
sites on their strongest ground. He will lose that fight, and winning it would mean attracting
price-shoppers who are the wrong customers anyway.

**The moat is cultural specificity, craft, speed and a human on the phone.** Nine of his forty designs
are Caribbean or African, six are football clubs, and each already has bespoke copy about the flag's
symbolism. No UK competitor is seriously serving the Nine Night, repatriation and diaspora send-off
context — a few sell a "Jamaican template" as a one-off SKU, but nobody owns the category.

So: compete on the head terms for credibility, but **win on the niche.**

---

## Tier 1 — Core commercial (credibility)

**Pages:** `/` · `/funeral-order-of-service-booklets/` · `/prices/`

| Keyword | Notes |
|---|---|
| funeral order of service booklets | Primary head term |
| funeral booklet printing UK | High intent |
| order of service printing | Head term |
| funeral programme printing | Head term |
| funeral order of service UK | Head term |
| celebration of life booklets | Softer, on-brand phrasing he already uses |

Realistic expectation: page 2–3 initially. Win here on **service depth, reviews, page speed and
schema**, not on out-publishing volume printers.

---

## Tier 2 — Niche commercial (the real opportunity)

**Pages:** `/funeral-order-of-service-booklets/caribbean-african/` + the 9 World design pages + the 6
football design pages.

| Keyword | Target page |
|---|---|
| Jamaican funeral order of service | `/booklets/jamaica/` |
| Caribbean funeral programme UK | `/caribbean-african/` |
| African funeral order of service UK | `/caribbean-african/` |
| Nigerian funeral booklet / programme | `/booklets/nigeria/` |
| Ghanaian funeral order of service | `/booklets/ghana/` |
| Trinidadian / Grenadian / Bajan / St Lucian / Antiguan / Dominican funeral order of service | respective design pages |
| Rasta / Rastafarian funeral order of service | `/booklets/rasta-theme/` |
| [Arsenal / Chelsea / Liverpool / Tottenham / Man Utd / Man City] funeral order of service | respective design pages |

**Low competition, high intent, and he already has the product.** These pages need:

1. **Genuine cultural context**, extending the flag symbolism already written — heritage, what the
   send-off traditionally involves, Nine Night timing, repatriation considerations
2. **Unique copy per design.** Eight designs currently share duplicated text (see audit D1) —
   `classic-one/two/three` + `rose-and-sleek` are word-for-word identical, as are
   `black-beauty`/`gemini-orange`. Duplicate copy cannot rank
3. **Working images.** Nigeria and Dominica — two flagship diaspora designs — currently have broken
   hero images (86% of their imagery is 404). Fix before promoting
4. `Product` schema, real alt text, and the 3 Vimeo previews each design already has

⚠️ **Prerequisite:** the content fixes in `05-CLIENT-ACTIONS.md` must land before this tier can work.

---

## Tier 3 — Informational (top of funnel, cheapest wins)

**Pages:** `/help/*`

He **already owns** this content — roughly **46,000 words** of it. It is just hidden and unstructured:

| Existing page | Words | In nav? |
|---|---|---|
| `/hymns-poems/` | **28,905** | No |
| `/poems-prayers/` | **12,560** | No |
| `/funeral-arrangements/` | **3,815** | No |
| `/faqs/` | 1,124 | No |

For comparison, the homepage is 410 words and `/support-2/` — which *is* in the nav, and is the only
route to all four — is **8 words**.

| Keyword | Target page | Status |
|---|---|---|
| funeral hymns list / hymns for a funeral | `/help/funeral-hymns/` | **Content exists** — large library, orphaned from nav |
| funeral poems and readings | `/help/funeral-poems-and-prayers/` | **Content exists** — orphaned |
| what to write in a funeral programme | `/help/what-to-write-in-a-funeral-programme/` | **Content exists** — trapped as broken HTML on `/faqs/` |
| funeral programme wording / biography / eulogy | same | **Content exists** — same broken block |
| how many pages in an order of service | `/help/faqs/` | Partially exists |
| bereavement benefits UK / bereavement allowance | `/help/uk-bereavement-benefits/` | **Content exists** — orphaned |
| order of service paper size / A5 booklet folding | `/help/faqs/` | Partially exists |
| Nine Night — what to expect | NEW article | Write — nobody in UK print owns this |

The nine topics currently rendering as broken code on `/faqs/` are ready-written H2s covering exactly
these queries. Rescuing that one block is the single cheapest SEO win available.

**This is the referral engine's flywheel too:** someone searching "funeral hymns" is 2–5 days from
needing a booklet.

---

## Technical checklist for the build

**Per page**
- [ ] Unique, written `<title>` (50–60 chars) — no wp-admin URLs
- [ ] Unique meta description (140–160 chars) on all 61 URLs
- [ ] Exactly one `<h1>`; clean `h2`/`h3` descent
- [ ] Descriptive alt text on every image — remove the 40-word comma-spam string everywhere
- [ ] Internal links from `/help/*` articles into relevant designs and `/order/`

**Site-wide**
- [ ] `og:locale` → `en_GB`
- [ ] Remove `maximum-scale=1` from the viewport meta (WCAG)
- [ ] Clean slugs; apply all 57 301s from `_archive/data/redirects.csv`
- [ ] XML sitemap excludes redirecting URLs (the 3 `/slide-page/*` entries today)
- [ ] Target **< 1 MB** per page; WebP; lazy-load below the fold
- [ ] Schema: `LocalBusiness` (Stanmore NAP + 0800 number), `Product` per design, `FAQPage` on
      `/help/faqs/`, `BreadcrumbList`
- [ ] `en-GB` spelling throughout (fix "WHITE LILLIES" → "White Lilies")

**Off-site / local**
- [ ] **Google Business Profile** for Stanmore Place, HA7 1BT — currently the biggest missing local
      signal. Unlocks the map pack for "funeral printing near me" / "order of service printing London"
- [ ] Consistent NAP across GBP, site footer and schema
- [ ] Review generation — he already collects reviews but they are unstructured and buried on
      `/about-us/`. Route them to GBP and `/reviews/`
- [ ] Links from the three partner funeral directors' sites (easiest relevant links available)
- [ ] Instagram `@memoriestributes` linked and consistent

---

## Sequencing

| Phase | Work | Why first |
|---|---|---|
| **1** | Fix titles/descriptions/H1s, rescue the FAQ block, un-orphan `/help/*`, apply 301s, GBP setup | Cheapest, fastest, no new content needed |
| **2** | Rewrite the 8 duplicate design descriptions; replace broken Nigeria/Dominica/Snow Flake/Rasta imagery | Unblocks Tier 2 |
| **3** | Build `/caribbean-african/` cluster + per-design cultural context | The differentiated bet |
| **4** | Publish `/help/` articles incl. Nine Night; add-on pages | Top-of-funnel volume |
| **5** | Reviews, GBP posts, partner links, then consider Google Ads on niche terms | Compounding |

**Measurement:** GA4 conversions must be configured *before* phase 1 ships (see `03-FUNNEL.md`) —
otherwise none of this is attributable.
