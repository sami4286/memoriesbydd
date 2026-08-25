# Copy Decks — for proofreading

One document per page. **These are the source of truth for wording.** The HTML prototypes in
`_deploy/` and the eventual Webflow build both follow these; if a document and a page disagree, the
document is right and the page needs fixing.

Structure comes from [`../_strategy/12-SITEMAP-V2.md`](../_strategy/12-SITEMAP-V2.md), which is
governed by the client brief.

---

## How to read these

| Marker | Meaning |
|---|---|
| **H1 / H2 / H3** | Heading, at that level. Only ever one H1 per page |
| **Body** | Paragraph copy |
| **CTA** | Button or link label. The arrow shows where it goes |
| **Label** | The small serif line above a heading (`Our Story`, `Packages`) |
| ⛔ | **Blocked** — needs an answer from Ashley before it can be finalised |
| ⚠️ | **Written, but flagged** — a decision was made that he should confirm |
| `[PLACEHOLDER]` | Not real copy. Must not go live |

Script words (the `Italianno` word in each heading) are marked *italic* — one per heading, per
`../_design/DESIGN-NOTES.md`.

## House style

- **British English.** *Programme* not program, *colour* not color, *personalised* not personalized.
- **Warm, calm, never clinical.** The brief's own words. No sales language, no exclamation marks.
- **Say "your loved one", not "the deceased".** Never "the body", "the product", "the deceased".
- **Second person.** *You send the photos, we do the rest.* Not *customers send photos*.
- **Plain numbers.** "24–48 hours", "£122 for 50", "12 photos" — not "fast", "affordable", "plenty".
- **En dashes** for ranges (24–48), em dashes for asides (—). Non-breaking `&pound;` before prices.
- **No fabricated anything.** No invented reviews, no guessed opening hours, no invented turnaround.

## Working assumptions

Copy is **written through** rather than left blank where an answer is outstanding. These four
assumptions were applied throughout so the decks are proofreadable now. Each is marked at the point
of use and listed at the foot of every document.

| Assumption | Applied as | If wrong |
|---|---|---|
| **Turnaround** | 24–48 hours, **for the proof only** — never delivery | Every page changes |
| **Production time** | 5 working days standard, 7–10 premium *(from the brief)* | Timeline tables change |
| **Pricing** | Tiers are **"from"** anchors above a calculated quote | Price List + Home change |
| **Positioning** | Lead with Caribbean & African | Gallery, design items, Home emphasis change |

## Status — all 14 written

| # | Page | Doc | Blockers |
|---|---|---|---|
| 1 | Home | [01-home.md](01-home.md) | 🔴 fabricated reviews · pricing · express |
| 2 | Order Now | [02-order-now.md](02-order-now.md) | 🔴 payment terms · express wording |
| 3 | How It Works | [03-how-it-works.md](03-how-it-works.md) | 🔴 production time |
| 4 | Hymns & Resources | [04-hymns-and-resources.md](04-hymns-and-resources.md) | 🔴 benefit figures out of date |
| 5 | Our Products | [05-our-products.md](05-our-products.md) | 🔴 premium + ninth night specs/prices |
| 6 | Gallery / Catalogue | [06-gallery.md](06-gallery.md) | ⛔ positioning · 4 dead heroes |
| 7 | Price List | [07-price-list.md](07-price-list.md) | 🔴 payment terms · surcharge contradiction |
| 8 | Design items ×40 | [08-design-items.md](08-design-items.md) | 🔴 football trademark · cultural review |
| 9 | Tributes | [09-tributes.md](09-tributes.md) | 🔴 real tributes · Sharon's name · story gap |
| 10 | Blog | [10-blog.md](10-blog.md) | 🔴 Nine Night needs cultural review |
| 11 | Reception Halls | [11-reception-halls.md](11-reception-halls.md) | 🔴 no venue data · no listing fee |
| 12 | Partners | [12-partners.md](12-partners.md) | 🔴 trade terms · partner consent |
| 13 | Contact Us | [13-contact.md](13-contact.md) | 🔴 opening hours |
| 14 | Privacy Policy | [14-privacy-policy.md](14-privacy-policy.md) | 🔴 legal review — deliberately a brief, not copy |

**Two documents are deliberately not finished copy.** `08` holds back the six football designs
pending a trademark view, and `14` is a compliance brief rather than a policy — writing either on my
own authority would be the wrong call.

## The three things blocking the most pages

1. **Turnaround** — directed as 24–48 hours, still unreconciled with the brief's 5 working days.
   Written throughout as the *design and proof* time, never as delivery. Needs written sign-off.
   See [`../_strategy/11-BRIEF-RECONCILIATION.md`](../_strategy/11-BRIEF-RECONCILIATION.md) C2.
2. **Pricing model** — the homepage shows £310/£515/£898 as fixed, all-in. The brief describes a
   calculated quote. These cannot both be true on the same site.
3. **Positioning** — lead with Caribbean & African, or stay general UK? Outstanding since
   `05-CLIENT-ACTIONS.md` item 8. It changes the Gallery, all 40 design items, and homepage emphasis.
