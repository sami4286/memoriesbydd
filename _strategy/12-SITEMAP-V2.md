# Sitemap v2 — Brief-Governed

**Governing decision (24 Aug 2026):** the client project brief takes precedence. The site is built
**only** from the pages the brief lists. Copy, content and layout all follow this structure.

**This supersedes `01-SITEMAP.md` and `08-PAGE-BLUEPRINTS.md`.** Both are retained for the reasoning
they contain, but neither should be built from.

---

## The page set

Twelve pages from the brief, plus one legally required exception.

```
/                              Home
/our-products/                 Our Products              ← NEW
/gallery/                      Gallery / Catalogue
   └ /gallery/{design}/        40 design items (CMS)
/how-it-works/                 How It Works              ← NEW
/price-list/                   Price List
/order/                        Order Now                 ← NEW
/hymns-and-resources/          Hymns & Resources
/tributes/                     Tributes / In Loving Memory
/blog/                         Blog                      ← NEW
   └ /blog/{post}/
/reception-halls/              Reception Hall Directory  ← NEW
/partners/                     Partners
/contact/                      Contact Us
/privacy-policy/               Privacy Policy            ← see exception
```

**No About Us page.** The brief is explicit: *"not required and must not be included."*

### ⚠️ The one addition I am not treating as optional

**`/privacy-policy/`** is not in the brief's list, but it exists on the live site (2,572 words) and
the new site will collect personal data through Typeform, store it in Airtable, and run GA4. Removing
it is a UK GDPR problem, not a content decision.

**Recommendation:** keep it, footer-only, out of the nav. Flag to the client as a compliance
retention rather than a scope addition. It also needs updating for Typeform, Airtable and the
after-sales email sequence.

---

## Nothing is orphaned — where every existing page goes

The brief's list omits five live pages holding **≈46,000 words**. None of it is deleted.

| Live page | Words | Destination |
|---|---|---|
| `home` | 410 | `/` |
| `catalogue` | 298 | `/gallery/` |
| `price-list` | 451 | `/price-list/` |
| `partners` | 207 | `/partners/` |
| `contact-us-2` | — | `/contact/` |
| `tributes-2` *(titled "THE STORY")* | 286 | `/tributes/` |
| **`about-us`** | 223 | **→ `/tributes/`** — satisfies the no-About-Us rule without losing the founder story |
| **`hymns-poems`** | **28,929** | **→ `/hymns-and-resources/`** |
| **`poems-prayers`** | **12,586** | **→ `/hymns-and-resources/`** |
| **`funeral-arrangements`** | **3,853** | **→ `/hymns-and-resources/`** (the "Resources" half) |
| **`faqs`** | 1,151 | **→ distributed** as FAQ blocks on `/how-it-works/`, `/price-list/`, `/our-products/` + Blog articles |
| `support-2` | 40 | **Retired.** Empty shell; its nav slot is taken by Hymns & Resources |
| `privacy-policy` | 2,572 | `/privacy-policy/` |

**Two things this resolves:**

`tributes-2` is already titled **"THE STORY"** on the live site. So "Tributes / In Loving Memory" is
where Ashley's story belongs — the brief's strongest constraint and our strongest brand asset stop
fighting each other.

The **nine FAQ topics currently rendering as literal broken markup** on `/faqs/` (audit C4) are
rescued and distributed rather than given a page the brief does not include. Better for AEO anyway —
FAQ blocks next to the relevant content beat a single buried FAQ page. See `09-AEO-GEO.md`.

---

## 🔴 Two structural questions the brief does not settle

### 1. Slugs — clean, or literal preservation?

The brief says the architecture must *"match the existing site exactly."* Read literally that keeps
`/contact-us-2/`, `/tributes-2/` and `/support-2/`.

Those `-2` suffixes are **WordPress duplicate-slug artefacts**, not intentional architecture — they
mean someone created a second page with the same title. Carrying them into a premium rebuild would
look like a mistake and hurt every URL-based signal.

**Recommendation:** preserve the page *set* exactly, clean the *slugs*, 301 everything. Flag as a
deviation requiring written approval, per the brief's own clause. The alternative — shipping
`/contact-us-2/` on a new site — is worse, but it is the client's call.

### 2. The 40 design pages

The brief lists "Gallery / Catalogue" as a page and never mentions the 40 `/menu/{slug}` design
pages. But they exist today, so **removing them needs written approval** just as much as adding does.

Relevant measurements from `_archive/data/designs.json` (rebuilt 24 Aug from the live API):

- 40 designs; descriptions average **40 words** (min 29, max 56)
- **Five share duplicated copy**: Classic One / Classic Two / Rose & Sleek, and Black Beauty / Gemini Orange
- **Four have dead hero images**: Nigeria, Dominica, Snow Flake, Rasta Theme
- Gemini Orange has no category and duplicates Black Beauty entirely

Forty pages carrying 40 words each is thin content at scale. And the brief's Typeform picks a product
by **colour palette** mapped to a Canva template — not by design name — which suggests the 40 named
designs are a browsing gallery, not the ordering taxonomy.

**Recommendation — retain all 40 URLs, tier the investment:**

| Tier | Designs | Treatment |
|---|---|---|
| **Full pages** | 9 Caribbean & African + 6 football | 150–250 words unique, cultural/club context, specs, own CTA |
| **Gallery items** | 22 Standard + 3 Classic | Real page, but image-led: hero, gallery, specs, CTA, short description |
| **Retire** | Gemini Orange | 301 → Black Beauty. Duplicate copy, duplicate hero, no category |

That keeps every existing URL resolvable (no removals to approve) while spending content effort only
where search demand is specific. **Gated on the positioning decision** — if the client stays general
UK rather than leading with the niche, the 15 "full pages" collapse to a flat gallery treatment.

---

## Navigation

Twelve pages will not fit a nav bar, and the brief does not specify one.

**Primary nav (6):** `Our Products · Gallery · How It Works · Price List · Resources · Contact`
**Persistent:** `Order Now` button + tap-to-call `0800 023 6263`
**Mobile sticky bar:** `Call · WhatsApp · Order`
**Footer only:** Tributes / In Loving Memory · Blog · Reception Halls · Partners · Privacy Policy

Every brief page is reachable; none is in the nav twice. `Resources` is the nav label for
`/hymns-and-resources/`.

---

## Page structure

Sections in order, so layout follows content. Copy is written against this.
**⛔ = wording blocked on a client answer** (see `11-BRIEF-RECONCILIATION.md`).

### `/` Home — *approved and built*
Existing order stands: Hero → Story → Ranges → Spotlight → Featured designs → How It Works →
Packages → Add-ons → Reviews → Trade band → Footer CTA.

Required changes:
- ⛔ **Turnaround** — currently claims 24–48 hours in three places; the brief says 5 working days
- ⛔ **Pricing** — £310/£515/£898 shown as fixed; may need to become "from"
- **"More About Us"** → repoint to `/tributes/`
- **Add express-order language** — the 50% surcharge rule
- Real testimonials, or remove the section

### `/our-products/` — NEW
The page that finally makes the product range visible. Absorbs what `08-PAGE-BLUEPRINTS.md` had as
separate add-on pages.

1. `h1` + intro
2. **Standard order of service booklets** — 4/8/12/16/20pp, from £122
3. ⛔ **Premium wire-bound booklets** — specs and pricing needed from Ashley
4. **Obituary announcements** — the 24hr WhatsApp product
5. **Ninth Night announcements**
6. **Motion Gallery**
7. **Pull-up banners** — £125 / £170
8. **Bookmarks** — £85 / £105 / £150
9. ⛔ Standard vs premium comparison table + turnaround per product
10. FAQ block · CTA

### `/gallery/` — Gallery / Catalogue
1. `h1` + short intro
2. Category filter — ⛔ heritage-led or colour-led depends on positioning
3. Grid, all 40, lazy-loaded thumbnails, paginated past ~24
4. "Not sure which?" → `/how-it-works/` + call/WhatsApp
5. Price anchor → `/price-list/` · CTA

### `/gallery/{design}/` ×40
Breadcrumb · `h1` *{Design} Funeral Order of Service Booklet* · gallery · unique description ·
spec table (size / photo allowance / suitability / ⛔ turnaround) · **primary CTA
`Order this design` → `/order/?design={slug}`** · related designs.

### `/how-it-works/` — NEW
The highest-anxiety page.
1. `h1` + the 4 steps
2. ⛔ **Timeline** — hour 0 → proof → print → delivery, against the funeral date
3. What we need from you
4. Proof and revisions — nothing printed without a yes
5. Delivery options
6. ⛔ **"What if the funeral is in three days?"** — express, and the 50% surcharge, stated plainly
7. FAQ block · CTA

### `/price-list/`
1. `h1` + one line
2. ⛔ Three tiers, each with its own CTA
3. Full matrix — £122–£699
4. ⛔ **How page count works** — 1 hymn = 1 page, 1 tribute = 1 page, gallery 1–20 photos included, **+£35 per extra 20**
5. Add-on pricing
6. ⛔ **Express surcharge** — the 50% rule, disclosed before ordering
7. What's always included · FAQ block · CTA

### `/order/` — NEW ★
The Typeform, 20 screens, wording **verbatim** from the brief. `noindex, follow`.
1. `h1` *Start Your Booklet*
2. **Call and WhatsApp offered first** — most families want a human
3. The form
4. Alongside: what happens next, ⛔ turnaround, ⛔ express rule
5. `?design={slug}` pre-selects · `?ref={partner}` captures referral

### `/hymns-and-resources/`
Hub for ~45,000 words currently orphaned.
1. Hub page — cards per section, one soft CTA
2. **Hymns** — 28,929 words, split into a browsable hub + themed children
3. **Poems, prayers & readings** — 12,586 words, same treatment
4. **Bereavement benefits guide** — 3,853 words. **Must carry a visible "last checked" date and cite gov.uk**
5. Reconcile with the brief's 21-hymn Typeform dropdown so the two agree

### `/tributes/` — Tributes / In Loving Memory
1. `h1`
2. **Ashley's story** — from `about-us` + `tributes-2`. ⛔ confirm Sharon's full name before publishing
3. Real tributes / customer stories — **real only**
4. `@memoriestributes` Instagram
5. CTA

### `/blog/` — NEW
1. Index
2. Seed articles from content that already exists: *What to write in a funeral programme* (from the
   rescued FAQ block), *Nine Night explained* — now a **product line**, so commercial as well as
   editorial — *Choosing hymns*, *Bereavement benefits explained*

### `/reception-halls/` — NEW
B2B revenue product. CMS collection, mirrored in Airtable.
1. `h1` + how it works for families
2. **Regional filter**, all UK regions
3. Listings — name, location, capacity, contact, website
4. **"List your venue"** — the paid B2B route
5. Surfaced inside the form journey when a reception is confirmed

*SEO opportunity nobody has costed: regional landing pages (`/reception-halls/london/`). Flagged, not
assumed — it adds URLs, which needs approval.*

### `/partners/` — Partners
Reframed from three name-drops into a stated trade offer: trade pricing, white-label proofs,
⛔ turnaround, dedicated freephone, referral pack. Keep the per-partner attribution:

| Partner | Freephone | Referral URL |
|---|---|---|
| Al-tayo's | 0800 023 5991 | `/order/?ref=altayos` |
| Joel Grant | 0800 023 5448 | `/order/?ref=joelgrant` |
| Calo's | 0800 023 5797 | `/order/?ref=calos` |

### `/contact/`
Full NAP, ⛔ **opening hours**, `tel:`, WhatsApp, `mailto:`, map, **and a contact form** — the current
page has none. Never dump 41 thumbnails.

### `/privacy-policy/`
Carry over, update for Typeform, Airtable, GA4 and the after-sales sequence.

---

## Redirects

| From | To |
|---|---|
| `/menu/{slug}` ×40 | `/gallery/{slug}/` |
| `/menu/gemini-orange/` | `/gallery/black-beauty/` |
| `/catalogue/` | `/gallery/` |
| `/contact-us-2/` | `/contact/` |
| `/tributes-2/`, `/about-us/` | `/tributes/` |
| `/hymns-poems/`, `/poems-prayers/`, `/funeral-arrangements/`, `/support-2/` | `/hymns-and-resources/` (+ deep links) |
| `/faqs/` | `/how-it-works/` |
| `/slide/`, `/slide-page/*` ×3, `/category/uncategorized/` | `/` |

**~57 redirects.** The original `redirects.csv` is not in this repo; it can be regenerated from
`_archive/data/designs.json` (40 slugs) plus this table.

---

## Count

| | |
|---|---|
| Brief pages | 12 |
| Privacy Policy (compliance) | 1 |
| Design items | 40 |
| Hymns & Resources children | TBD after the library split |
| Blog articles | 4 at launch |
| **Indexable** | **~57 + children** |
| `noindex` | `/order/`, filter states |

Versus 54 today — with no orphans, no dead ends, and every page in the brief.

---

## Build order

| # | Template | Gated on |
|---|---|---|
| 1 | `/order/` | Nothing — Typeform wording is given verbatim |
| 2 | `/our-products/` | ⛔ premium booklet specs |
| 3 | Design item ×40 | ⛔ positioning (tiering) |
| 4 | `/gallery/` | ⛔ positioning (filter axis) |
| 5 | `/price-list/` | ⛔ pricing model, express rule |
| 6 | `/how-it-works/` | ⛔ turnaround |
| 7 | `/hymns-and-resources/` | Nothing — content exists |
| 8 | `/tributes/` | ⛔ Sharon's name confirmation |
| 9 | `/reception-halls/` | Client seed data |
| 10 | `/partners/` | ⛔ trade terms |
| 11 | `/blog/`, `/contact/`, `/privacy-policy/` | ⛔ opening hours |

**Templates 1 and 7 are fully unblocked.** Everything else waits on at least one answer from
`11-BRIEF-RECONCILIATION.md`.
