# Gallery / Catalogue — copy

**URL:** `/gallery/` · **~520 words** · Replaces `/catalogue/`

**The job:** own the head term *funeral order of service booklets* and route to all forty designs.
`../_strategy/07-SEO-AND-KEYWORDS.md` makes this — not the homepage — the Tier 1 page, because the
approved homepage `<h1>` is brand copy. This page carries the exact-match heading instead.

**What the current page does wrong:** four `<h1>`s, all 41 thumbnails loaded eagerly, design names
rendered as `<h4>` reading "VIEW ROSE PETALS", 911 KB of HTML.

---

## Meta

| Field | Copy |
|---|---|
| **Title** | Funeral Order of Service Booklets \| 40 Designs \| Memories |
| **Meta description** | Forty funeral order of service booklet designs — Caribbean and African heritage, football club, classic and floral. Designed by hand, your proof in 24–48 hours. |

**Schema:** `CollectionPage` + `ItemList` (40) + `BreadcrumbList`

---

## 1. Header

**Label** — The Catalogue
**H1** — Funeral Order of Service *Booklets*

**Body** — Forty designs to choose from, and none of them a template. Whichever you pick, we design
the booklet around your loved one by hand — their photographs, their story, their hymns — and send
you a proof to approve in 24–48 hours.

**Body** — If nothing here feels right, tell us what you have in mind and we will draw something for
you. That costs no more.

**Trust line** — Free proof before we print · From £122 for 50 · Next-day UK delivery

> The `<h1>` is an exact match on the head term. That is the whole reason this page exists rather
> than the homepage carrying it. Do not soften it into brand copy.

---

## 2. Browse by range

**H2** — Browse by *Range*

| Card | Body |
|---|---|
| **Caribbean & African** · 9 designs | Flags and colours of home — Jamaica, Trinidad, Grenada, Barbados, St Lucia, Antigua, Dominica, Nigeria and Ghana, with a Rasta theme alongside. |
| **Classic** · 3 designs | Understated and formal. Clean type, generous space, nothing competing with the photograph. |
| **Football** · 6 designs | Club colours and crest, done with restraint. Arsenal, Chelsea, Tottenham, Liverpool, Manchester United and Manchester City. |
| **Standard** · 22 designs | Our widest choice — florals, feathers, satins and skies, in several colourways each. |

> ⛔ **Card order assumes the positioning decision goes to leading with Caribbean & African.** If the
> client stays general UK, Standard leads and this becomes an alphabetical or colour-led filter
> instead. Outstanding since `05-CLIENT-ACTIONS.md` item 8.

---

## 3. The grid

**H2** — All Forty *Designs*

**Filter labels** — All · Caribbean & African · Classic · Football · Standard

**Secondary filter** — By colour: Gold · Blue · Green · Purple · Red · Black & white · Pastel

**Card content per design** — cover image · design name (`h3`) · range · *"View design"*

**Empty state** — Nothing matches those filters. Clear them, or call us on 0800 023 6263 and describe
what you are looking for.

> **Filters must be client-side only, with no indexable URLs.** `../_strategy/07-SEO-AND-KEYWORDS.md`
> sets one intent per URL; filter permutations would cannibalise both this page and the range pages.
>
> **The colour filter is a hedge worth building.** The brief's Typeform picks a product by *colour
> palette* mapped to a Canva template, so colour is how the client already thinks about the range. If
> positioning goes general-UK, colour becomes the primary axis and heritage the secondary.
>
> **Performance:** 40 thumbnails, max 400px wide, all `loading="lazy"`, paginate past 24. The current
> page renders 41 full-size images eagerly. See `../_strategy/10-PERFORMANCE.md`.

---

## 4. Not sure which?

**H2** — Not Sure Which to *Choose*?

**Body** — Most families arrive with no idea and leave with something they love. It usually comes
down to one thing you knew about them — where they were from, what team they followed, a colour they
always wore.

**Body** — Call us and describe them. We do this every day, and we will narrow forty down to three in
about five minutes.

**CTAs** — `0800 023 6263` · `WhatsApp us` · `How it works` → `/how-it-works/`

---

## 5. Price anchor

**H2** — What It *Costs*

**Body** — Booklets start at **£122** for 50 four-page booklets, including the design work and UK
delivery. Packages that add an announcement, a motion gallery and a banner start at **£310**.

**Body** — The price depends on how many pages you need and how many copies. Pages are worked out
from what goes in — the hymns, the tributes, the readings and the photographs.

**CTA** — `See the full price list` → `/price-list/`

> ⛔ Wording assumes tiers are **"from"** anchors above a calculated quote. If prices are genuinely
> fixed, the second paragraph changes. See `../_strategy/11-BRIEF-RECONCILIATION.md` C4.

---

## 6. Closing CTA

**H2** — Ready When You *Are*

**Body** — Pick a design, or let us suggest one. Either way, nothing is printed until you have seen
it and said yes.

**CTAs** — `Start Your Booklet` → `/order/` · `0800 023 6263`

---

## Working assumptions

| Assumption | Basis |
|---|---|
| Lead with Caribbean & African | Approved homepage + strategy; **not yet signed off** |
| All 40 designs retained, tiered content | `../_strategy/12-SITEMAP-V2.md` |
| Gemini Orange excluded (301 → Black Beauty) | Duplicate copy, duplicate hero, no category |
| Colour filter built alongside range filter | Matches the brief's palette-led ordering |

## What blocks this page

| # | Item | Type |
|---|---|---|
| 1 | **Positioning** — heritage-led or colour-led ordering | ⛔ Changes sections 2 and 3 |
| 2 | Fixed vs "from" pricing | ⛔ Changes section 5 |
| 3 | Four designs still have dead hero images | ⛔ Nigeria, Dominica, Snow Flake, Rasta Theme |
| 4 | Cover images need consistent crops | ⚠️ All 40 sit on a grey studio backdrop |
