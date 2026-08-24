> ## ⛔ SUPERSEDED — do not build from this
>
> Written before the client project brief was available. The brief was confirmed as governing on
> 24 Aug 2026. **Build from [`12-SITEMAP-V2.md`](12-SITEMAP-V2.md).**
>
> Materially wrong below: the 61-URL structure, `/about/`, `/reviews/`, the `/help/*` cluster and the
> two separate add-on pages are not in the brief; `/order/` is specified here as a Fillout rebuild
> rather than the brief's 20-screen Typeform; and it is missing Our Products, Blog and the Reception
> Hall Directory entirely.
>
> Still useful and carried into v2: the global frame, the reusable-component mapping from the approved
> homepage, and the per-template schema inventory.

# Page Blueprints — The Rigid Structure

Every URL, its one job, its sections in order, its schema and its conversion action. This is the
spec the remaining page designs get built against, in the approved design language from
`_design/DESIGN-NOTES.md`.

**Structure inherited from `01-SITEMAP.md`. Keyword ownership from `07-SEO-AND-KEYWORDS.md`.**
Nothing here re-opens a settled decision.

---

## Global frame — on every page

Fixed, so no page has to reinvent it.

| Element | Spec |
|---|---|
| **Nav** | Logo · `Booklets · Prices · How It Works · Help · About · Contact` · phone icon button · "Start" icon button |
| **Mobile bar** | `Call · WhatsApp · Start` — sticky, all pages, all breakpoints below 900px |
| **Footer** | Full NAP **incl. phone and opening hours**, `tel:`, `mailto:`, WhatsApp, 4 link columns, `/help/*` links |
| **Breadcrumbs** | Every page except `/` — visible, and `BreadcrumbList` schema |
| **Conversion floor** | Every page carries **at least one** of form / call / WhatsApp above the fold and again at the end |

Nav is six items. `/order/`, `/reviews/`, `/motion-obituary/`,
`/banners-and-bookmarkers/` and `/funeral-directors/` are reached from in-page CTAs and the footer.

### Reusable components (already built and approved)

Build the new pages out of these rather than inventing more:

| Component | From homepage | Reuse for |
|---|---|---|
| `.plate` | Range cards | Design cards, category grids, featured designs |
| `.pcard` | How-it-works steps | Any numbered process, add-on cards |
| `.pkg` | Package tiers | `/prices/` tiers |
| `.spot` | Range spotlight slider | Design galleries, per-design image carousel |
| `.tsplit` / `.tquote` | Reviews rotator | `/reviews/` |
| `.dlink` | Dot-and-line link | Every secondary CTA |
| `.promise` dark band | Dark section | Trade offer, final CTA blocks |
| `.foot_lines` | Contact rows | `/contact/` |

---

## 1. `/` — Home

**Job:** answer *can they help me, how fast, what will it cost, what happens if I get in touch.*
**Status:** approved and built. **Four sections still to add** — see `06-HOMEPAGE-AUDIT.md`.

Final section order:

1. Hero — `h1`, lead, **5** trust signals, video card
2. Story — Ashley + Sharon → `/about/`
3. Ranges — 4 category plates → the 4 category pages
4. Range spotlight — slider, 4 ranges
5. **Featured designs — 6–8 individual designs → `/booklets/{slug}/`** ← ADD
6. How it works — 4 steps → `/how-it-works/`
7. Packages — 3 tiers, each CTA → `/order/`
8. **Add-ons — 4 items → `/motion-obituary/`, `/banners-and-bookmarkers/`** ← ADD
9. Reviews — **real quotes only** → `/reviews/`
10. **Funeral-director band → `/funeral-directors/`** ← ADD
11. Final CTA — form, call, WhatsApp
12. Footer

**Title:** `Funeral Order of Service Booklets | Designed & Printed in 24–48 Hours | Memories`
**H1:** `Funeral Booklets with a Touch of Class` *(approved — brand-led by design)*
**Schema:** `LocalBusiness` + `WebSite` + `Organization`
**Primary CTA:** `/order/`

---

## 2. `/funeral-order-of-service-booklets/` — Catalogue

**Job:** own the Tier 1 head term and route to all 40 designs.

1. `h1` **exact match** + 150-word intro (what these are, how the service works)
2. Category strip — 4 plates, **Caribbean & African first**
3. Filterable grid — all 40, `.plate` cards. Filters are **client-side only**, no indexable URLs
4. "Not sure which?" — link to `/how-it-works/` + call/WhatsApp
5. Price anchor — "from £122 for 50" → `/prices/`
6. CTA block

**Title:** `Funeral Order of Service Booklets | 40 Designs, Printed in 24–48 Hours`
**H1:** `Funeral Order of Service Booklets`
**Schema:** `CollectionPage` + `ItemList` (40 items) + `BreadcrumbList`
**Excludes:** Gemini Orange until `05-CLIENT-ACTIONS.md` item 4 is decided

---

## 3. Category pages ×4

`/caribbean-african/` · `/classic/` · `/standard/` · `/football/`

**Job:** own the collective term. `/caribbean-african/` is **the highest-value page on the site.**

1. `h1` + 200–400 word intro with **genuine cultural substance**, not filler
2. Design grid for that category
3. **Editorial block** — for `/caribbean-african/`: what a diaspora send-off involves, Nine Night,
   repatriation, why heritage colours matter. This is the section that makes the page rank and the
   section no competitor has
4. Cross-links to relevant `/help/` articles
5. CTA block

| Page | Title | Designs |
|---|---|---|
| `/caribbean-african/` | `Caribbean & African Funeral Order of Service Booklets \| Memories` | 9 |
| `/classic/` | `Classic Funeral Order of Service Booklets \| Memories` | 3 |
| `/standard/` | `Funeral Order of Service Booklet Designs \| 22 Styles \| Memories` | 22 |
| `/football/` | `Football Funeral Order of Service Booklets \| Memories` | 6 |

**Schema:** `CollectionPage` + `ItemList` + `BreadcrumbList`
⚠️ `/football/` is gated on the trademark question in `07-SEO-AND-KEYWORDS.md`.

---

## 4. `/booklets/{slug}/` ×40 — Design pages

**Job:** convert the moment of highest intent. Today these are the site's biggest wasted asset —
40 pages whose only CTA pushes visitors to a price grid.

1. Breadcrumb → category
2. `h1` = `{Design} Funeral Order of Service Booklet`
3. **Gallery** — hero + full image set (`.spot` slider). Vimeo previews when the 403 is resolved
4. Description — **unique per design**, 150–250 words
5. **Spec table** — Size · Photo allowance · Suitability · Turnaround · Delivery
6. **Primary CTA: `Start with this design` → `/order/?design={slug}`** + call + WhatsApp
7. Price anchor → `/prices/`
8. Related designs — 3–4 from the same category
9. For culture designs: cultural context block + link to `/caribbean-african/`

**Title:** `{Design} Funeral Order of Service Booklet | Memories`
**Schema:** `Product` + `Offer` (`priceCurrency: GBP`, `lowPrice: 122`) + `BreadcrumbList`
**Never** `AggregateRating` until reviews are real and design-specific.

> **The single highest-impact change on the whole site** (`03-FUNNEL.md`): `Start with this design`
> deep-linking to `/order/?design={slug}` with the design pre-selected, so the customer never
> re-explains what they want.

**Blocked designs — do not publish or link until fixed:** Nigeria, Dominica, Snow Flake, Rasta Theme
(dead heroes); Classic One/Two/Three, Rose & Sleek, Black Beauty, Gemini Orange, Rose Petals,
Victorian Colours, Golden Ocean, Ghana (duplicate copy); Godfather, Acrylic Splashes, Rasta Theme
(missing specs).

---

## 5. `/prices/` — Packages & full matrix

**Job:** stop being a dead end. The old page had 19 `h2`s and **zero** CTAs.

1. `h1` + one line ("everything, one price, nothing printed until you approve it")
2. **Three anchored tiers** — £310 / £515 / £898, each with **its own CTA**
3. Full matrix — 5 page-counts × 5 quantities, £122–£699
4. Add-ons pricing — Motion Obituary, Motion Gallery, banners, bookmarkers
5. **"What affects the price"** — page count, quantity, add-ons. Removes the main hesitation
6. What is always included — design, revisions, free proof, delivery
7. FAQ block — `FAQPage` schema
8. CTA block — all three doors

**Title:** `Funeral Order of Service Prices | From £122 for 50 Booklets | Memories`
**Schema:** `FAQPage` + `BreadcrumbList` + `Offer` per tier
**Rule:** a CTA inside **every** tier and after the matrix. No screen without an action.

---

## 6. `/order/` ★ — The brief

**Job:** the single most valuable structural change in the project. A URL Ashley can say out loud,
text, WhatsApp, or print with a QR code in a referral pack.

**`noindex, follow`** — a form page has no search job.

Form spec is in `03-FUNNEL.md`; the page around it:

1. `h1` `Start Your Booklet` + one reassuring line
2. **"You do not have to do this now"** — call and WhatsApp offered *first*, prominently. Most
   families want a human. Never trap them in a form
3. The form — **step 1 = name, phone, service date only.** Photos come later
4. Alongside: what happens next, when they will see a proof, turnaround
5. `?design={slug}` pre-selects the design; `?ref={partner}` captures referral source

**Rules:** no fixed-height iframe · save-and-return · WhatsApp offered explicitly at the upload step ·
photo allowance pulled per design so it says exactly how many photos to send · honest confirmation
screen.

---

## 7. `/how-it-works/` — the anxiety page

**Job:** answer *what actually happens if I get in touch.* The highest-hesitation moment.

1. `h1` + the 4 steps expanded (`.pcard`)
2. **Timeline** — what happens at hour 0, 24, 48, day 5, against the funeral date
3. What we need from you — photos, hymns, order of service, and what to do if you do not have them yet
4. The proof process — revisions until right, nothing printed without a yes
5. Delivery — next-day UK, same-day local, to home / church / director
6. **"What if the funeral is in three days?"** — the real question. Answer it directly
7. FAQ + CTA

**Schema:** `HowTo` + `FAQPage` + `BreadcrumbList`. Strong AEO page — see `09-AEO-GEO.md`.

---

## 8. Add-on pages ×2

`/motion-obituary/` (incl. Motion Gallery) · `/banners-and-bookmarkers/`

**Job:** make invisible high-margin products visible. Audit D5.

1. `h1` + **what it actually is**, in one sentence a grieving person understands
2. **A real example** — for Motion Obituary this must be video. Gated on the Vimeo 403
3. Where it is used — WhatsApp announcement, reception screen, service
4. Pricing — £50/£75 and £50/£100/£130
5. "Add this to your booklet order" → `/order/`

**Title:** `Motion Obituary | Animated Funeral Announcement to Share | Memories`
**Schema:** `Product` + `Offer` + `VideoObject` (once embeddable) + `FAQPage`

---

## 9. `/help/` hub + 5 articles

**Job:** surface ~46,400 words currently orphaned behind an 8-word page, and own Tier 3.

**Hub:** `h1` `Help & Guidance`, card per article, one soft CTA. **In the main nav.**

| URL | Content | Status |
|---|---|---|
| `/help/faqs/` | The nine rescued FAQ topics | **Trapped as broken raw HTML** — rescue first |
| `/help/funeral-hymns/` | Hymn library → hub + themed children | 28,905 words exist |
| `/help/funeral-poems-and-prayers/` | Poem & prayer library → hub + children | 12,560 words exist |
| `/help/what-to-write-in-a-funeral-programme/` | Wording, biography, eulogy | From the FAQ block |
| `/help/uk-bereavement-benefits/` | DWP, BB1, allowances | 3,815 words exist |
| `/help/nine-night/` | Nine Night explained | **Write** — nobody in UK print owns this |

**Article template:** `h1` · last-updated date · author box · **40–60 word direct answer up top** ·
`h2` sections as questions · one soft contextual CTA · related articles · related designs.

**Schema:** `Article` + `FAQPage` where applicable + `BreadcrumbList` + `author`.
`/help/uk-bereavement-benefits/` **must** carry a visible "last checked" date and cite gov.uk.

---

## 10. `/funeral-directors/` — the trade offer

**Job:** the growth engine. Three partners today and the current page does no selling.

1. `h1` + the offer in one line
2. **The stated offer** — trade pricing, white-label proofs, 24–48hr turnaround, dedicated freephone
3. How it works for a director — different flow from a family
4. Existing partners (with permission) — Al-tayo's, Joel Grant, Calo's
5. **Referral pack** — samples, dedicated number, referral URL, printed QR card
6. Separate trade enquiry route + dedicated number

Keep the per-partner freephone attribution and pair each with `?ref=` landing URLs:

| Partner | Freephone | Referral URL |
|---|---|---|
| Al-tayo's | 0800 023 5991 | `/order/?ref=altayos` |
| Joel Grant | 0800 023 5448 | `/order/?ref=joelgrant` |
| Calo's | 0800 023 5797 | `/order/?ref=calos` |
| Main | 0800 023 6263 | `/order/` |

**Schema:** `Service` + `BreadcrumbList`

---

## 11. Remaining pages

| URL | Job | Notes |
|---|---|---|
| `/about/` | Ashley's story in full | Merges `/about-us/` + `/tributes-2/`. **Confirm Sharon's full name with Ashley before publishing** |
| `/reviews/` | Social proof | **Real reviews only.** Route to GBP too. `Review` schema once genuine |
| `/contact/` | Every route to a human | NAP, map, hours, `tel:`, WhatsApp, `mailto:`, form. **A contact form** — the old page had none. Never dump 41 thumbnails |
| `/privacy-policy/` | Compliance | Carry over, update for the new form and GA4 |

---

## Retired, with 301s

| Old | New |
|---|---|
| `/menu/{slug}` ×40 | `/booklets/{slug}/` |
| `/catalogue/` | `/funeral-order-of-service-booklets/` |
| `/price-list/` | `/prices/` |
| `/support-2/` | `/help/` |
| `/contact-us-2/` | `/contact/` |
| `/tributes-2/`, `/about-us/` | `/about/` |
| `/hymns-poems/` | `/help/funeral-hymns/` |
| `/poems-prayers/` | `/help/funeral-poems-and-prayers/` |
| `/funeral-arrangements/` | `/help/uk-bereavement-benefits/` |
| `/faqs/` | `/help/faqs/` |
| `/partners/` | `/funeral-directors/` |
| `/slide/`, `/slide-page/*` ×3, `/category/uncategorized/` | `/` |

**57 redirects total.** The machine-readable map is not in this repo and needs rebuilding — the 40
slugs are recoverable from `_archive/pages/markdown/catalogue.md` plus the live XML sitemap.

---

## URL count

| Type | Count |
|---|---|
| Static pages | 17 |
| Category pages | 4 |
| Design pages | 40 |
| `/help/` children (hymn/poem sub-pages) | TBD after the library split |
| **Indexable total** | **61+** |
| `noindex` | `/order/`, filter states |

Versus 54 today — but with **zero orphans and zero dead ends**, which was the whole problem.

---

## Build order

Designs can be produced in this order; each is unblocked by the one before.

| # | Template | Why this order |
|---|---|---|
| 1 | **`/order/`** | Every CTA on every page points here. Nothing converts until it exists |
| 2 | **Design page** | ×40 — highest intent, biggest current waste |
| 3 | **Category page** | ×4 — `/caribbean-african/` is the strategic bet |
| 4 | Catalogue | Routes to both of the above |
| 5 | `/prices/` | High traffic, currently a dead end |
| 6 | `/how-it-works/` | Removes the biggest hesitation |
| 7 | `/help/` hub + article | Unlocks 46,400 words |
| 8 | `/funeral-directors/` | Growth engine |
| 9 | Add-on pages | Margin |
| 10 | `/about/`, `/reviews/`, `/contact/` | Supporting |

Templates 2 and 4 are the same components at different densities, so they should be designed
together. Same for 3 and 4.
