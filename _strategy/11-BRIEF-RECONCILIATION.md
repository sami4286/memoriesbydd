# Brief vs Strategy — Reconciliation Required

**Trigger:** the client's *Project Brief — Webflow Website + Typeform Integration + Automation Build*
("Forest Green & Ivory Edition", **11 August 2026**) was supplied on 24 August, after Phase 1 and
after the homepage design was approved.

It conflicts with the strategy documents in this repo in **eleven** places, several of them
load-bearing. The brief is written as a contract — *"read as a complete specification"*, with an
acceptance checklist and *"any proposed change… requires the Client's written approval."*

**Nothing in `_strategy/06`–`10` should be executed until the conflicts marked 🔴 are resolved.**

---

## Timeline — which document is newer matters

| Date | Artefact |
|---|---|
| **11 Aug 2026** | Client project brief (this document's subject) |
| 18 Aug 2026 | Site audit + Phase 1 strategy (`01`–`05`) |
| **19 Aug 2026** | Homepage design produced **and approved by the client** |
| 24 Aug 2026 | Phase 2 strategy (`06`–`10`); brief surfaced |

**The brief predates the approved design by eight days.** So either the client approved a design that
departs from their own brief — in which case the approval is the later and stronger signal — or the
brief still governs and the design needs changes. That single question decides several rows below.

---

## Live-site verification

Checked against the live REST API on 24 Aug 2026, not the archive:

- **13 published pages — unchanged since the 18 Aug archive.** No new pages.
- **No blog.** The single "post" is a MetaSlider slide (`/slide/`).
- **No Order page.** The Fillout form is embedded mid-homepage only.
- Post types present: `page`, `post`, `avada_portfolio` (40 designs), `avada_faq`.

### The brief's page list vs what exists

| Brief requires | Live | Note |
|---|---|---|
| Home | `home` | ✅ |
| Price List | `price-list` | ✅ |
| Gallery / Catalogue | `catalogue` | ✅ |
| Partners | `partners` | ✅ |
| Contact Us | `contact-us-2` | ✅ |
| Hymns & Resources | `hymns-poems` + `poems-prayers` | ✅ but **two** pages, brief implies one |
| Tributes / In Loving Memory | `tributes-2` | ✅ **live title is "THE STORY"** |
| **Our Products** | — | 🔴 does not exist |
| **How It Works** | — | 🔴 does not exist |
| **Order Now** | — | 🔴 does not exist |
| **Blog** | — | 🔴 does not exist |
| **Reception Hall Directory** | — | 🔴 does not exist |

Live but **absent from the brief's list**: `faqs`, `funeral-arrangements`, `privacy-policy`,
`support-2`.
Live but **explicitly forbidden**: `about-us` — *"not required and must not be included."*

### 🔴 C1 — The brief contradicts itself on architecture

It requires the architecture to *"match the existing site exactly"* with no pages added or removed
without written approval, **and** lists five pages that do not exist.

Both cannot hold. **Written confirmation needed** — the brief's own clause requires it.

**Recommended reading:** "match exactly" means *do not silently drop or rename the existing pages*;
the five new ones are approved additions inherent to the brief. But that is an interpretation, and it
must be confirmed in writing rather than assumed.

**Useful consequence:** `tributes-2` is already titled **"THE STORY"**. So Ashley's founder story can
live on "Tributes / In Loving Memory" and the no-About-Us rule is satisfied without losing the single
strongest brand asset on the site. The approved homepage's *"More About Us"* link should point there.

---

## 🔴 C2 — Turnaround: the approved homepage may be making a false promise

| Source | Claim |
|---|---|
| **Brief** | Standard booklets **5 working days** (Mon–Fri, excl. UK bank holidays); premium wire-bound **7–10 working days** |
| Live design pages (verified `/menu/jamaica/`) | "4-5 Day Turnaround" |
| **Approved homepage** (`_deploy/index.html`) | **"ready in 24–48 hours"** — hero lead, trust strip, and process step 03 |

The **only** 24-hour figure anywhere in the brief is the digital obituary announcement: *"We will
produce this within 24hrs."* That is a different product.

The brief and the live site agree on ~5 days. The approved homepage does not. **The homepage is the
outlier and is most likely wrong.**

This is the highest-severity item in this document. It is a promise made to families working to a
funeral date; if it is wrong, someone has no booklets on the day.

**Action:** confirm with Ashley, then make it consistent across every page. Most likely correct
framing: *proof within 24–48 hours, delivered in 5 working days* — which reconciles all three
sources, but must be confirmed, not assumed.

## 🔴 C3 — Express surcharge is missing entirely

The brief requires a **50% surcharge** when the funeral date falls inside the turnaround window, and
its own quick-wins list requires *"clear express-order language and the 50% surcharge rule before
form submission."*

Neither the approved homepage, nor `02-HOMEPAGE.md`, nor `08-PAGE-BLUEPRINTS.md` mentions it.
Undisclosed surcharges on a bereavement purchase are also a consumer-protection risk, not merely a
content gap.

## 🔴 C4 — Pricing model is structurally different

| | Brief | Our plan |
|---|---|---|
| Model | **Quote generated per order** | Three fixed packages |
| Page count | Calculated: 1 hymn / 1 tribute / 1 reading = 1 page each; cover + running order always included | Fixed page counts per package |
| Galleries | 1–20 photos = 1 page included; **every extra 20 photos = +£35** | Not represented |
| Base price | Looked up from a client-supplied matrix | The published 2024 price list |
| Express | +50% | Absent |

The approved homepage shows £310 / £515 / £898 as fixed, all-in tiers. Under the brief those are
indicative at best. **Publishing fixed prices against a quote-based model risks quoting a family one
number and charging another.**

**Recommendation:** keep the tiers as *"from"* anchors with the page-count rules stated plainly, and
let the Typeform produce the binding quote. Needs client sign-off.

## 🔴 C5 — Positioning: the niche is absent from the brief

`04-SEO.md` and `07-SEO-AND-KEYWORDS.md` build the entire Tier 2 strategy on leading with **UK
Caribbean & African families**. `05-CLIENT-ACTIONS.md` item 8 asked for sign-off on exactly this and
**that sign-off is still outstanding.**

The brief says only *"families across the UK"*, never mentions the niche, and structures product
selection by **colour palette** (Typeform screen 18) mapped to Canva templates — not by heritage.

The approved homepage leads with "Caribbean & African" as the first range card and dedicates the
spotlight slider's opening panel to it.

This is the strategic fork in the whole project. It also reframes the design-page question: if
customers choose a palette that maps to a Canva template, the 40 named designs are probably a
**gallery**, not 40 indexable URLs.

**Not a conflict to resolve on our own.** Ashley decides.

---

## Amber conflicts

### C6 — Form platform: Typeform, not Fillout
`03-FUNNEL.md` specifies rebuilding the existing Fillout form. The brief mandates **Typeform**, 20
screens, with *"question wording, capitalisation, punctuation, emphasis, helper text and field
types"* reproduced verbatim. The brief's spec is more detailed and more recent in intent — **adopt
it**, and rewrite the `/order/` blueprint in `08-PAGE-BLUEPRINTS.md` around those 20 screens.

Our form recommendations that survive and should be raised as improvements:
- Capture name/phone/date **before** the photo upload (brief puts name first — compatible)
- Save-and-return (brief requires it — "editable order / change flow")
- WhatsApp offered as an explicit alternative at the upload step (**not** in the brief; recommend adding)

### C7 — Brand colours
Brief: standardise on **Forest Green / Ivory / Champagne Gold**. The approved design uses
`--cream #faf8f5`, `--ink #2a2a2a`, `--brand #ca9e67` — ivory and champagne gold are effectively
present, **forest green is absent entirely**. The brief document itself is forest green.

The design is approved and postdates the brief. **Assume the design wins**, but confirm — and if
green is required, it can enter as a deep accent without reopening the layout.

### C8 — Products missing from our plan
The brief names **premium wire-bound booklets** (a whole second tier, 7–10 day turnaround) and
**ninth night announcements**. Neither appears in the 2024 price list, the audit, or any strategy
doc. `/prices/` and "Our Products" both need them.

*Note:* the brief confirming Ninth Night as a **product line** strengthens the
`/help/nine-night/` recommendation in `09-AEO-GEO.md` — it is now commercial, not just editorial.

### C9 — Reception Hall Directory is a new revenue product
CMS-managed Webflow directory, mirrored in Airtable, venues paying annual listing fees, surfaced
inside the form journey by UK region. This is a **B2B product**, not a page, and it appears nowhere in
our IA, SEO plan or blueprints. It needs its own content and SEO treatment (regional landing pages
are the obvious opportunity).

### C10 — Scope is much larger than "website + content"
The brief covers Typeform, Make/Zapier, Airtable, Canva API, Avaza, Gmail, mockup generation via
Placeit/Adobe Express, and an optional HeyGen/Synthesia AI guide. Our docs cover the website and
content only. Not a conflict — but the automation layer is the larger half of the project and is
currently unplanned here.

### C11 — Hymn list conflict
The brief pre-loads a **21-option** hymn dropdown "in order of frequency". The site already has a
**28,905-word** hymn library. These should be reconciled: the 21 become the dropdown, the library
becomes `Hymns & Resources`, and the two should agree.

---

## What survives unchanged

Worth stating, because most of the analysis holds:

- **Every audit finding.** All 23 are defects in the live site regardless of architecture.
- **The conversion diagnosis.** No `tel:`, no WhatsApp link, price list a dead end, form on one page.
  The brief's own quick-wins list independently reaches the same conclusions.
- **All of `10-PERFORMANCE.md`.** Brief requires "mobile-first and fast loading" and lists Core Web
  Vitals in its audit scope. Our measurements and fixes apply directly.
- **Most of `09-AEO-GEO.md`.** Schema, AEO structure and the AI-crawler decision are unaffected.
- **Tier 1 and Tier 3 SEO.** Head terms and the ~46,400 words of orphaned content are untouched by
  the brief. Tier 3 maps cleanly onto "Hymns & Resources" and "Blog".
- **The fabricated-review blocker.** Independent of everything here, and still a blocker.
- **`_archive/data/designs.json`** — rebuilt 24 Aug from the live API; 40 records, all with
  descriptions, specs and Vimeo IDs.

---

## Decisions needed from the client

In priority order. The first three block content writing.

| # | Question | Blocks |
|---|---|---|
| 1 | **Turnaround.** Booklets 5 working days, premium 7–10? Does 24–48 hours apply to the proof, or only to the obituary? | All page copy + the approved homepage |
| 2 | **Architecture.** Confirm in writing that Our Products, How It Works, Order Now, Blog and Reception Hall Directory are approved additions, and that `faqs`, `funeral-arrangements`, `privacy-policy` and `support-2` are retained | The sitemap |
| 3 | **Positioning.** Lead with Caribbean & African, or stay general UK? (`05-CLIENT-ACTIONS.md` item 8, still unanswered) | SEO strategy + homepage emphasis |
| 4 | **Pricing.** Are £310/£515/£898 fixed, or "from" anchors above a quote? | `/prices/`, homepage |
| 5 | **Express surcharge.** Confirm the 50% rule and where it must be disclosed | Order flow, `/prices/` |
| 6 | **Brand colours.** Does the approved cream/ink/gold design supersede Forest Green / Ivory / Champagne Gold? | All remaining design |
| 7 | **Premium booklets.** Specs, pricing, and how they differ from standard | `/prices/`, Our Products |
| 8 | **Does the 11 Aug brief still stand** where it conflicts with the 19 Aug approved design? | Everything above |

Question 8 is the one to ask first. It collapses several of the others.
