# Homepage Audit — Approved Design vs the Brief

**Audited:** 24 August 2026 · **File:** `_deploy/index.html` (970 lines, 58 KB)
**Measured against:** `02-HOMEPAGE.md` (the 12-section content spec) and `03-FUNNEL.md`
(the conversion non-negotiables).

Everything below was checked against the file, not assumed. The design is approved and this audit
does **not** propose changing its look — every gap is content or markup that sits inside the
existing design language.

---

## Verdict

The design delivers **8 of the 12 specified sections**, and it is strong on the things the old site
failed at completely: it has one `<h1>`, three real `tel:` links, two `wa.me` links, a mobile
sticky bar, and a conversion prompt at every scroll depth.

**Four gaps matter commercially, and one is a launch blocker.**

| | Gap | Severity |
|---|---|---|
| 1 | **No order form, and no `/order/` page to send anyone to** | **Critical** |
| 2 | **No route from the homepage to any individual design page** | **Critical** |
| 3 | Add-ons are invisible again — the exact defect audit D5 raised | High |
| 4 | No funeral-director path (the growth engine) | High |
| 5 | **Fabricated testimonials with 5-star ratings** | **Blocker — legal** |
| 6 | Zero structured data | High (see `09-AEO-GEO.md`) |
| 7 | 23 placeholder `href="#"` links | Expected at concept stage |

---

## Section-by-section

| # | `02-HOMEPAGE.md` spec | Built | Where |
|---|---|---|---|
| 1 | Hero — h1, promise, 2 CTAs, trust strip | ◐ | `#top` — see "Hero" below |
| 2 | Reassurance paragraph | ◐ | Folded into hero lead + `#promise` body |
| 3 | How it works — 4 steps | ✅ | `#promise` — Choose / Send / Approve / Delivered |
| 4 | Browse by heritage — 4 cards | ✅ | `#ranges` — Caribbean & African first, correct counts |
| 5 | **Featured designs — 6–8 individual designs** | ❌ | **Missing entirely** |
| 6 | Packages — 3 anchored tiers | ✅ | `#prices` — £310 / £515 / £898, each with its own CTA |
| 7 | **Add-ons — images + one line each** | ❌ | **Only as bullets inside package lists** |
| 8 | Ashley's story + Sharon's photo | ✅ | `#story` |
| 9 | Reviews & tributes | ◐ | `#voices` — rotator works, content is invented |
| 10 | **Funeral directors — one line + link** | ❌ | Footer column link only |
| 11 | Final CTA block — all three doors | ✅ | `#order` — tel, WhatsApp, form link |
| 12 | Footer — full NAP, hours, help links | ◐ | No opening hours, no phone in the address block |

Eight delivered, three missing, and the hero/reassurance/reviews/footer partially delivered.

---

## The two critical gaps

### 1. There is no form, and nothing to link to

Confirmed: **no `<form>` and no Fillout embed anywhere in the file.** Every "start" action on the
page — the nav book icon, the Promise CTA, all three package CTAs, the mobile bar "Start", and the
footer's own "Start your booklet" row — resolves to `#order`, which is the **footer contact block**.

So the page has 6+ prompts to start a booklet and **no booklet-starting mechanism**. The footer row
labelled "Start your booklet / The order form" is itself `href="#"`.

`03-FUNNEL.md` calls `/order/` *"the single most valuable structural change"* — a URL Ashley can
text, WhatsApp, print on a card and put in a referral pack. Right now it does not exist.

**Fix:** build `/order/` as a real page and point every one of those CTAs at it. On the homepage,
either embed the form in a labelled section or keep `#order` as the contact block and send the
primary CTAs to `/order/`. Do not repeat the old site's mistake of an unlabelled embed.

### 2. You cannot reach a single design from the homepage

The `#ranges` plates link to the four **category** pages. The `#spotlight` slider describes the same
four ranges. There is no card, link or thumbnail anywhere on the page that reaches
`/booklets/jamaica/` or any other individual design.

Spec section 5 asked for **6–8 featured designs, each linking to its own page**. Those 40 design
pages are the highest-intent pages on the site and the whole Tier 2 SEO bet
(`04-SEO.md`) — and the homepage currently sends them no internal link equity and no traffic.

**Fix:** add the featured-designs section between `#spotlight` and `#promise`, as a row of product
plates reusing the existing `.plate` component. Use designs with complete live imagery — per audit
B2, **exclude Nigeria, Dominica, Snow Flake and Rasta Theme** until their hero images are replaced.

---

## The launch blocker

### The testimonials are invented

`#voices` ships three reviews. The name field honestly reads `Placeholder — client to supply`, but
the **quote text, the locations and the ★★★★★ ratings are all fabricated**:

> *"We sent the photos over on WhatsApp on the Sunday and had the proof back Monday evening. I could
> not believe how quickly it came together — and it was exactly what she deserved."*
> ★★★★★ · *Family, North London*

On a private noindexed preview this is a legitimate placeholder. **On a live site it is a fake
review**, and in the UK that is now a specific prohibition — the Digital Markets, Competition and
Consumers Act 2024 bans publishing consumer reviews that do not come from real customers, with
enforcement sitting directly with the CMA. It is also the last thing this particular brand can
afford to be caught doing.

**Fix, before anything is indexed:** real quotes with permission (`05-CLIENT-ACTIONS.md` item 9), or
remove the section. Do not launch with placeholder star ratings. If real reviews are slow to arrive,
ship the section empty rather than invented — and note that `Review`/`AggregateRating` schema must
not be added until the reviews are genuine either.

---

## The two high-severity gaps

### 3. Add-ons are invisible — again

Audit **D5** found Motion Obituary, Motion Gallery, banners and bookmarkers existed *"only as rows
inside the price table."* On the new homepage they exist only as **bullets inside package lists**,
plus one line of small print (`Bookmarkers from £85, extra copies £5.50 each`).

A Motion Obituary is genuinely unusual and needs explaining — the hero video card gestures at it but
links out to Vimeo. These are the highest-margin items on the price list and
`01-SITEMAP.md` gives them their own pages. The homepage should sell them, not list them.

**Fix:** an add-ons section after `#prices` — four items, one image and one sentence each, linking to
`/motion-obituary/` and `/banners-and-bookmarkers/`.

### 4. No funeral-director path

`03-FUNNEL.md` calls `/funeral-directors/` *"his growth engine"* — three referral partners today,
and the current page does no selling. The approved homepage gives it a single footer-column link
labelled "For funeral directors".

**Fix:** the one-line band from spec section 10, between `#voices` and the footer:
*"Are you a funeral director? Trade pricing, white-label proofs and a dedicated line."*
It costs one row and addresses the highest-value visitor type on the site.

---

## Smaller content gaps

**Hero trust strip** — spec listed five signals; three shipped (`Free proof`,
`Next-day UK delivery`, `WhatsApp your photos`). Missing: **24–48 hour design** (currently only in
the lead paragraph) and **same-day local delivery** (only in step 04). Both are differentiators
against £55 template shops and belong where they are scannable.

**Hero has one CTA, not two** — the spec wanted `Start Your Booklet` **and** a visible
`Call 0800 023 6263`. Built, both are 46px icon buttons in the nav with hover-revealed labels. That
is a deliberate, defensible design decision from `DESIGN-NOTES.md`, but it means **the freephone
number is not visible anywhere in the first viewport on desktop** — only on hover. For an audience
that is older, bereaved and in a hurry, consider making the nav phone button show the number at
desktop widths. Mobile is fine: the sticky bar covers it.

**Footer NAP is incomplete** — address and email are there; **no phone number in the address block
and no opening hours**. Both are needed for complete `LocalBusiness` schema and for NAP consistency
with the Google Business Profile that `04-SEO.md` flags as the biggest missing local signal.

**Nav "About" points to `#story`, "Reviews" to `#voices`** — correct for a one-pager, but these
become real URLs. Noted for the build, not a defect.

---

## Technical state

| Check | Result |
|---|---|
| `lang="en-GB"` | ✅ Correct — old site was `en_US` |
| Pinch-zoom | ✅ No `maximum-scale` lock — audit E2 fixed |
| Exactly one `<h1>` | ✅ |
| Heading descent | ✅ `h1 → h2 → h3`, no body copy inside headings |
| `tel:` links | ✅ 3 |
| `wa.me` links | ✅ 2 |
| Title + meta description | ✅ Both written and unique |
| `prefers-reduced-motion` | ✅ Fully honoured |
| **Structured data** | ❌ **Zero. No JSON-LD of any kind** |
| **Placeholder links** | ❌ **23 × `href="#"`** |
| **Image `loading="lazy"`** | ❌ **0 of 20** |
| **Image `width`/`height`** | ❌ **0 of 20 — guaranteed CLS** |
| **Total image weight** | ❌ **2.36 MB, all eager** — target is < 1 MB |
| Analytics / conversion events | ❌ None wired |

Structured data and performance are covered in `09-AEO-GEO.md` and `10-PERFORMANCE.md`.

### The `<h1>` is brand-led, not keyword-led

Built: **"Funeral Booklets with a Touch of Class"**
Spec: *"Funeral Order of Service Booklets, Designed by Hand in 24–48 Hours"*

The approved line is better brand copy and it matches the tagline in the footer. But the primary
head term — *order of service* — appears only in the hero **lead paragraph**, not the `<h1>`.

This is a real trade-off, not an error, and the design is approved. The resolution is to keep the
`<h1>` and carry the keyword in the `<title>` (which already does: the meta description leads with
*"Funeral order of service booklets designed by hand in 24–48 hours"*), then let
`/funeral-order-of-service-booklets/` be the page that targets the head term with an exact-match
`<h1>`. See `07-SEO-AND-KEYWORDS.md` — the homepage is deliberately **not** the Tier 1 head-term
page under that plan, which makes this a non-issue.

### The hero video links out

The card links to `https://vimeo.com/448057229`, which returns **200** — the Vimeo *page* is public.
Per `DESIGN-NOTES.md`, it is the **embed** that returns 403 across all 119 previews.

So the card works, but it sends a warm visitor off-site to Vimeo at the top of the funnel. Resolve
the Vimeo allowlist issue (`05-CLIENT-ACTIONS.md`) and play it inline; failing that, at minimum it
should not open in a new tab away from every CTA on the page.

---

## What to change, in order

| # | Change | Blocks |
|---|---|---|
| 1 | **Replace or remove the fabricated reviews** | Launch — legal |
| 2 | **Build `/order/` and repoint all 6+ "start" CTAs** | The entire funnel |
| 3 | **Add featured designs — 6–8, live imagery only** | Tier 2 SEO + design-page traffic |
| 4 | Add the add-ons section | Margin |
| 5 | Add the funeral-director band | Growth |
| 6 | Add JSON-LD: `LocalBusiness` + `Product` + `BreadcrumbList` | AEO/GEO |
| 7 | `loading="lazy"`, `width`/`height`, WebP conversion | Core Web Vitals |
| 8 | Complete the footer NAP — phone + opening hours | Local SEO |
| 9 | Two missing trust-strip items | Conversion |
| 10 | Wire the 23 placeholder links | Build |

Items 3, 4 and 5 are new sections built from components that already exist in the approved design
(`.plate`, `.pcard`, the dark band). **None of them requires a new design decision** — which is why
this audit does not go back to the client.
